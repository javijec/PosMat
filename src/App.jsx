import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

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
import AdminDashboard from "./components/AdminDashboard/AdminDashboard.jsx";
import GlobalLoadingBar from "./components/shared/GlobalLoadingBar.jsx";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

/**
 * RootLayout provides the global providers and shared UI structure.
 * It uses <Outlet /> to render the current route's component.
 */
const RootLayout = () => {
  const location = useLocation();

  return (
    <ThemeProvider>
      <AuthProvider>
        <GlobalLoadingBar />
        <Toaster position="top-right" richColors />
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
          <Header />
          <div className="flex flex-1">
            <MainContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </MainContent>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "home/edit",
        element: (
          <ProtectedRoute>
            <HeroEdit />
          </ProtectedRoute>
        ),
      },
      { path: "logout", element: <Logout /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "about", element: <About /> },
      {
        path: "about/edit",
        element: (
          <ProtectedRoute>
            <AboutEdit />
          </ProtectedRoute>
        ),
      },
      { path: "contact", element: <Contact /> },
      {
        path: "contact/edit",
        element: (
          <ProtectedRoute>
            <ContactEdit />
          </ProtectedRoute>
        ),
      },
      { path: "courses", element: <Courses /> },
      {
        path: "courses/edit",
        element: (
          <ProtectedRoute>
            <CursesEdit />
          </ProtectedRoute>
        ),
      },
      { path: "professors", element: <Professors /> },
      {
        path: "professors/edit",
        element: (
          <ProtectedRoute>
            <ProfessorsEdit />
          </ProtectedRoute>
        ),
      },
      { path: "archivos", element: <Archivos /> },
      { path: "tesis", element: <Tesis /> },
      {
        path: "tesis/edit",
        element: (
          <ProtectedRoute>
            <TesisEdit />
          </ProtectedRoute>
        ),
      },
      { path: "faq", element: <FAQ /> },
      {
        path: "faq/edit",
        element: (
          <ProtectedRoute>
            <FAQEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "links/edit",
        element: (
          <ProtectedRoute>
            <LinksEdit />
          </ProtectedRoute>
        ),
      },
      { path: "links", element: <Links /> },
      { path: "students", element: <Students /> },
      {
        path: "students/edit",
        element: (
          <ProtectedRoute>
            <StudentsEdit />
          </ProtectedRoute>
        ),
      },
      { path: "rules", element: <Rules /> },
      {
        path: "rules/edit",
        element: (
          <ProtectedRoute>
            <RulesEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-emails",
        element: (
          <ProtectedRoute>
            <AuthorizedEmails />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
