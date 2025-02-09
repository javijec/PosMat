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
import Resources from "./components/Resources";
import FAQ from "./components/FAQ.jsx";

function App() {
  return (
    <Router>
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
              <Route path="/faq" element={<FAQ />} />
              <Route path="/Resources" element={<Resources />} />
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
