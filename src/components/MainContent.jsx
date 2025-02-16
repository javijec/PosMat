/*import { db } from "../firebase/dbConnection"; // Importa tu configuración de Firebase
import { collection, addDoc } from "firebase/firestore";
import archivoJSON from "../files/tesis.json";

const cargarDatosDesdeJSON = async () => {
  console.log("Cargando datos desde JSON...");
  console.log("Datos:", archivoJSON);

  try {
    for (const item of archivoJSON) {
      await addDoc(collection(db, "tesis"), item);
    }

    console.log("Datos cargados correctamente");
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  }
};

<button
onClick={() => cargarDatosDesdeJSON(archivoJSON)}
className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors"
>
Cargar datos desde JSON tesis
</button>*/

const MainContent = ({ children }) => {
  return <div className="flex-1 overflow-y-auto">{children}</div>;
};

export default MainContent;
