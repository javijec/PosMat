import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        navigate("/login");
      } catch (error) {
        console.error("Error during logout:", error);
        // En caso de error, redirigir de todos modos al login
        navigate("/login");
      }
    };

    handleLogout();
  }, [logout, navigate]);

  // Puedes mostrar un mensaje mientras se procesa el logout
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl">Cerrando sesión...</p>
    </div>
  );
};

export default Logout;
