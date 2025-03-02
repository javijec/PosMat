import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

import Header from "./components/Header/Header.jsx";
import MainContent from "./components/MainContent.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./components/Home/Home.jsx";
import About from "./components/About/About.jsx";
import AboutEdit from "./components/AboutEdit/AboutEdit.jsx";
import Contact from "./components/Contact/Contact.jsx";
import ContactEdit from "./components/ContactEdit/ContactEdit.jsx";
import Courses from "./components/Courses/Courses.jsx";
import CursesEdit from "./components/CoursesEdit/CoursesEdit.jsx";
import Professors from "./components/Professors/Professors.jsx";
import ProfessorsEdit from "./components/ProfessorsEdit/ProfessorsEdit.jsx";
import Archivos from "./components/Archivos/Archivos.jsx";
import FAQ from "./components/FAQ/FAQ.jsx";
import FAQEdit from "./components/FAQ/FAQEdit.jsx";
import Tesis from "./components/Tesis/Tesis.jsx";
import TesisEdit from "./components/TesisEdit/TesisEdit.jsx";
import Links from "./components/Links/Links.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Students from "./components/Students/Students.jsx";
import StudentsEdit from "./components/StudentsEdit/StudentsEdit.jsx";
import Rules from "./components/Rules/Rules.jsx";
import RulesEdit from "./components/RulesEdit/RulesEdit.jsx";
import Login from "./components/login/login.jsx";
import Logout from "./components/Logout/Logout";
import AuthorizedEmails from "./components/AutorizedEmails/AutorizedEmails.jsx";
import Register from "./components/Register/Register.jsx";
import LinksEdit from "./components/LinksEdit/LinksEdit.jsx";
import HeroEdit from "./components/Home/components/HeroEdit.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex flex-1">
            <MainContent>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/home/edit"
                  element={
                    <ProtectedRoute>
                      <HeroEdit />
                    </ProtectedRoute>
                  }
                />
                <Route path="/logout" element={<Logout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route
                  path="/about/edit"
                  element={
                    <ProtectedRoute>
                      <AboutEdit />
                    </ProtectedRoute>
                  }
                />
                <Route path="/contact" element={<Contact />} />
                <Route
                  path="/contact/edit"
                  element={
                    <ProtectedRoute>
                      <ContactEdit />
                    </ProtectedRoute>
                  }
                />
                <Route path="/contact" element={<Contact />} />
                <Route path="/courses" element={<Courses />} />
                <Route
                  path="/courses/edit"
                  element={
                    <ProtectedRoute>
                      <CursesEdit />
                    </ProtectedRoute>
                  }
                />
                <Route path="/professors" element={<Professors />} />
                <Route
                  path="/professors/edit"
                  element={
                    <ProtectedRoute>
                      <ProfessorsEdit />
                    </ProtectedRoute>
                  }
                />
                <Route path="/archivos" element={<Archivos />} />
                <Route path="/tesis" element={<Tesis />} />
                <Route
                  path="/tesis/edit"
                  element={
                    <ProtectedRoute>
                      <TesisEdit />
                    </ProtectedRoute>
                  }
                />
                <Route path="/faq" element={<FAQ />} />
                <Route
                  path="/faq/edit"
                  element={
                    <ProtectedRoute>
                      <FAQEdit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/links/edit"
                  element={
                    <ProtectedRoute>
                      <LinksEdit />
                    </ProtectedRoute>
                  }
                />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/links" element={<Links />} />
                <Route path="/students" element={<Students />} />
                <Route
                  path="/students/edit"
                  element={
                    <ProtectedRoute>
                      <StudentsEdit />
                    </ProtectedRoute>
                  }
                />
                <Route path="/rules" element={<Rules />} />
                <Route
                  path="/rules/edit"
                  element={
                    <ProtectedRoute>
                      <RulesEdit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-emails"
                  element={
                    <ProtectedRoute>
                      <AuthorizedEmails />
                    </ProtectedRoute>
                  }
                />
                <Route path="/*" element={<Home />} />
              </Routes>
            </MainContent>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
