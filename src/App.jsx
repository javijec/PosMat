import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header.jsx";
import MainContent from "./components/MainContent.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./components/Home/Home.jsx";
import About from "./components/About/About.jsx";
import Contact from "./components/Contact/Contact.jsx";
import Courses from "./components/Courses/Courses.jsx";
import CursesEdit from "./components/Courses/CoursesEdit.jsx";
import Professors from "./components/Professors/Professors.jsx";
import Archivos from "./components/Archivos/Archivos.jsx";
import FAQ from "./components/FAQ/FAQ.jsx";
import Tesis from "./components/Tesis/Tesis.jsx";
import Links from "./components/Links/Links.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Students from "./components/Students/Students.jsx";
import Rules from "./components/Rules/Rules.jsx";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <MainContent>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/edit" element={<CursesEdit />} />
              <Route path="/professors" element={<Professors />} />
              <Route path="/archivos" element={<Archivos />} />
              <Route path="/tesis" element={<Tesis />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/links" element={<Links />} />
              <Route path="/students" element={<Students />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/*" element={<Home />} />
            </Routes>
          </MainContent>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
