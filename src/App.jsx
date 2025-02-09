import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import Home from "./components/Home/Home.jsx";
import About from "./components/About";
import Contact from "./components/Contact";
import Courses from "./components/Courses/Courses.jsx";
import CoursesEdit from "./components/Courses/CoursesEdit.jsx";
import Professors from "./components/Professors";
import Archivos from "./components/Archivos";
import FAQ from "./components/FAQ.jsx";
import Tesis from "./components/Tesis/Tesis.jsx";
import Links from "./components/Links/Links.jsx";
import ScrollToTop from "./components/ScrollToTop";
import Students from "./components/Students/Students";

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
              <Route path="/courses/edit" element={<CoursesEdit />} />
              <Route path="/professors" element={<Professors />} />
              <Route path="/archivos" element={<Archivos />} />
              <Route path="/tesis" element={<Tesis />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/links" element={<Links />} />
              <Route path="/students" element={<Students />} />
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
