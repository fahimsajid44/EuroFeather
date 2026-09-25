import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import CgpaConverter from './pages/CGPA_Converter';
import RecognizedUniversities from './pages/Recognized_Universities';
import BookConsultation from './pages/Book_Consultation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmailVerify from './pages/Emailverify';
import Course from './pages/Course';
import Destinations from './pages/Destinations';
import AdmissionSupport from './pages/AdmissionSupport';
import VisaProcessing from './pages/VisaProcessing';
import CourseGuidance from './pages/CourseGuidance';
import PreDepartureSupport from './pages/PreDepartureSupport';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/services/admission-support" element={<AdmissionSupport />} />
        <Route path="/services/visa-processing" element={<VisaProcessing />} />
        <Route path="/services/course-guidance" element={<CourseGuidance />} />
        <Route path="/services/pre-departure-support" element={<PreDepartureSupport />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/course" element={<Course />} />
        <Route path="/resources/recognized-universities" element={<RecognizedUniversities />} />
        <Route path="/resources/cgpa-converter" element={<CgpaConverter />} />
        {/* <Route path="/charges" element={<Charges />} /> */}
         <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/consultation" element={<BookConsultation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<EmailVerify />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;