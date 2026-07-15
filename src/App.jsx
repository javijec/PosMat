import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

import Header from "./components/Header/Header.jsx";
import MainContent from "./components/MainContent.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import GlobalLoadingBar from "./components/shared/GlobalLoadingBar.jsx";
import LoadingState from "./components/shared/LoadingState.jsx";
import { Toaster } from "sonner";

const Home = lazy(() => import("./components/Home/Home.jsx"));
const About = lazy(() => import("./components/About/About.jsx"));
const AboutEdit = lazy(() => import("./components/AboutEdit/AboutEdit.jsx"));
const Contact = lazy(() => import("./components/Contact/Contact.jsx"));
const ContactEdit = lazy(() => import("./components/ContactEdit/ContactEdit.jsx"));
const Courses = lazy(() => import("./components/Courses/Courses.jsx"));
const CoursesEdit = lazy(() => import("./components/CoursesEdit/CoursesEdit.jsx"));
const Professors = lazy(() => import("./components/Professors/Professors.jsx"));
const ProfessorsEdit = lazy(() => import("./components/ProfessorsEdit/ProfessorsEdit.jsx"));
const Archivos = lazy(() => import("./components/Archivos/Archivos.jsx"));
const FAQ = lazy(() => import("./components/FAQ/FAQ.jsx"));
const FAQEdit = lazy(() => import("./components/FAQ/FAQEdit.jsx"));
const Tesis = lazy(() => import("./components/Tesis/Tesis.jsx"));
const TesisEdit = lazy(() => import("./components/TesisEdit/TesisEdit.jsx"));
const Links = lazy(() => import("./components/Links/Links.jsx"));
const Students = lazy(() => import("./components/Students/Students.jsx"));
const StudentsEdit = lazy(() => import("./components/StudentsEdit/StudentsEdit.jsx"));
const Rules = lazy(() => import("./components/Rules/Rules.jsx"));
const RulesEdit = lazy(() => import("./components/RulesEdit/RulesEdit.jsx"));
const Login = lazy(() => import("./components/login/login.jsx"));
const Logout = lazy(() => import("./components/Logout/Logout"));
const AuthorizedEmails = lazy(() => import("./components/AutorizedEmails/AutorizedEmails.jsx"));
const Register = lazy(() => import("./components/Register/Register.jsx"));
const LinksEdit = lazy(() => import("./components/LinksEdit/LinksEdit.jsx"));
const HeroEdit = lazy(() => import("./components/Home/components/HeroEdit.jsx"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard/AdminDashboard.jsx"));
const NewsPage = lazy(() => import("./components/News/NewsPage.jsx"));
const NewsEdit = lazy(() => import("./components/NewsEdit/NewsEdit.jsx"));

const withSuspense = (element) => (
  <Suspense fallback={<LoadingState label="Cargando página…" />}>
    {element}
  </Suspense>
);

/**
 * RootLayout provides the global providers and shared UI structure.
 * It uses <Outlet /> to render the current route's component.
 */
const RootLayout = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GlobalLoadingBar />
        <Toaster position="top-right" richColors />
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
          <Header />
          <div className="flex flex-1">
            <MainContent>
              <Outlet />
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
      { index: true, element: withSuspense(<Home />) },
      {
        path: "admin",
        element: withSuspense(
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "home/edit",
        element: withSuspense(
          <ProtectedRoute>
            <HeroEdit />
          </ProtectedRoute>
        ),
      },
      { path: "news", element: withSuspense(<NewsPage />) },
      {
        path: "news/edit",
        element: withSuspense(
          <ProtectedRoute>
            <NewsEdit />
          </ProtectedRoute>
        ),
      },
      { path: "logout", element: withSuspense(<Logout />) },
      { path: "login", element: withSuspense(<Login />) },
      { path: "register", element: withSuspense(<Register />) },
      { path: "about", element: withSuspense(<About />) },
      {
        path: "about/edit",
        element: withSuspense(
          <ProtectedRoute>
            <AboutEdit />
          </ProtectedRoute>
        ),
      },
      { path: "contact", element: withSuspense(<Contact />) },
      {
        path: "contact/edit",
        element: withSuspense(
          <ProtectedRoute>
            <ContactEdit />
          </ProtectedRoute>
        ),
      },
      { path: "courses", element: withSuspense(<Courses />) },
      {
        path: "courses/edit",
        element: withSuspense(
          <ProtectedRoute>
            <CoursesEdit />
          </ProtectedRoute>
        ),
      },
      { path: "professors", element: withSuspense(<Professors />) },
      {
        path: "professors/edit",
        element: withSuspense(
          <ProtectedRoute>
            <ProfessorsEdit />
          </ProtectedRoute>
        ),
      },
      { path: "archivos", element: withSuspense(<Archivos />) },
      { path: "tesis", element: withSuspense(<Tesis />) },
      {
        path: "tesis/edit",
        element: withSuspense(
          <ProtectedRoute>
            <TesisEdit />
          </ProtectedRoute>
        ),
      },
      { path: "faq", element: withSuspense(<FAQ />) },
      {
        path: "faq/edit",
        element: withSuspense(
          <ProtectedRoute>
            <FAQEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "links/edit",
        element: withSuspense(
          <ProtectedRoute>
            <LinksEdit />
          </ProtectedRoute>
        ),
      },
      { path: "links", element: withSuspense(<Links />) },
      { path: "students", element: withSuspense(<Students />) },
      {
        path: "students/edit",
        element: withSuspense(
          <ProtectedRoute>
            <StudentsEdit />
          </ProtectedRoute>
        ),
      },
      { path: "rules", element: withSuspense(<Rules />) },
      {
        path: "rules/edit",
        element: withSuspense(
          <ProtectedRoute>
            <RulesEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-emails",
        element: withSuspense(
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
