import { auth } from '../firebase.config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  reload,
  onAuthStateChanged,
} from 'firebase/auth';

/* ---------------------------------------------------------------
   Auth-only version — no Firestore, no database. Everything here
   runs on Firebase Authentication alone:

     - Account creation / login / logout / password reset / email
       verification all come straight from Firebase Auth.
     - The display name is stored on the Auth user itself
       (updateProfile), which is why it shows up immediately in the
       Firebase Console's Authentication > Users table.
     - Phone number and "last consultation request" date (used for
       the daily limit) aren't Auth fields, so they're kept in this
       browser's localStorage, keyed by uid. That's local-only and
       resets if the user clears site data or signs in on another
       device — that's the trade-off of not using a database.

   Everything below returns Promises (Firebase Auth is inherently
   async), so callers need to await these or use
   subscribeToAuthChanges for reactive UI.
------------------------------------------------------------------*/

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function friendlyAuthError(err) {
  switch (err.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try logging in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak — please use a stronger one.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return err.message || 'Something went wrong. Please try again.';
  }
}

/* ---------------------------------------------------------------
   Local (device-only) profile bits that Firebase Auth doesn't
   store: phone number, and today's consultation-request flag.
------------------------------------------------------------------*/
function localProfileKey(uid) {
  return `ef_profile_${uid}`;
}

function readLocalProfile(uid) {
  try {
    const raw = localStorage.getItem(localProfileKey(uid));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocalProfile(uid, patch) {
  try {
    const existing = readLocalProfile(uid) || {};
    localStorage.setItem(localProfileKey(uid), JSON.stringify({ ...existing, ...patch }));
  } catch {
    // localStorage unavailable (e.g. private mode) — non-fatal, just
    // means phone/daily-limit won't persist across reloads.
  }
}

function toAppUser(firebaseUser) {
  const local = readLocalProfile(firebaseUser.uid);
  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || '',
    email: firebaseUser.email,
    phone: local?.phone || '',
    emailVerified: firebaseUser.emailVerified,
  };
}

// After clicking the verification link, Firebase shows its own hosted
// confirmation page with a link back here. Signup.jsx's in-page modal
// (and EmailVerify.jsx as a fallback) also poll in the background, so
// most users will already have been bounced to the home page before
// they'd even need to use that link.
const verificationActionSettings = {
  url: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
};

/**
 * Subscribes to Firebase's auth state. Fires immediately with the
 * current user (or null), then again on every sign-in/sign-out.
 * Returns an unsubscribe function — call it in a useEffect cleanup.
 *
 * Usage:
 *   useEffect(() => subscribeToAuthChanges(setCurrentUser), []);
 */
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(firebaseUser ? toAppUser(firebaseUser) : null);
  });
}

/** Best-effort synchronous snapshot — may briefly be null right after page load. */
export function getCurrentUserSync() {
  return auth.currentUser;
}

/**
 * Creates a new account, sets the display name, stashes the phone
 * number locally, and emails a verification link. The account shows
 * up in Firebase Console > Authentication > Users immediately — that
 * list is Firebase Auth's own record, not something this code writes
 * to separately.
 */
export async function registerUser({ name, email, phone, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const { user } = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    await updateProfile(user, { displayName: name.trim() });
    writeLocalProfile(user.uid, { phone: phone.trim() });
    await sendEmailVerification(user, verificationActionSettings);
    return toAppUser(user);
  } catch (err) {
    throw new Error(friendlyAuthError(err));
  }
}

/** Signs an existing user in. */
export async function loginUser({ email, password }) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    return toAppUser(user);
  } catch (err) {
    throw new Error(friendlyAuthError(err));
  }
}

/** Sends a real password-reset email via Firebase. */
export async function requestPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
  } catch (err) {
    throw new Error(friendlyAuthError(err));
  }
}

/** Signs the current user out. */
export function logoutUser() {
  return signOut(auth);
}

/** Re-sends the verification email to whoever is currently signed in. */
export async function resendVerificationEmail() {
  if (!auth.currentUser) throw new Error('You need to be signed in to resend a verification email.');
  try {
    await sendEmailVerification(auth.currentUser, verificationActionSettings);
  } catch (err) {
    throw new Error(friendlyAuthError(err));
  }
}

/**
 * Firebase doesn't push emailVerified changes in real time — the
 * client has to reload the user record to pick up a change made by
 * clicking the link in the email. Returns the fresh true/false.
 * This is Authentication-only — no database call involved.
 */
export async function refreshEmailVerified() {
  if (!auth.currentUser) return false;
  await reload(auth.currentUser);
  return auth.currentUser.emailVerified;
}

/** Has this user already sent a consultation request today? (device-local) */
export function hasRequestedToday(uid) {
  if (!uid) return false;
  const local = readLocalProfile(uid);
  return local?.lastRequestDate === todayKey();
}

/** Marks that this user has used today's request. (device-local) */
export function recordRequestToday(uid) {
  if (!uid) return;
  writeLocalProfile(uid, { lastRequestDate: todayKey() });
}