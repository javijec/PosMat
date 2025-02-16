import { getDocs, collection } from "firebase/firestore";
import { db } from "./dbConnection";

const getStudents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "students"));
    const studentsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    studentsData.sort((a, b) => a.lastName.localeCompare(b.lastName));
    return studentsData;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};

const getTesis = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "tesis"));
    const tesisData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    tesisData.sort((a, b) => {
      // Ordenar por año
      if (a.year !== b.year) {
        return a.year - b.year;
      }

      // Si el año es el mismo, ordenar por tipo (doctorado primero)
      if (a.tipo === "Doctorado" && b.tipo !== "Doctorado") {
        return -1; // a debe ir antes
      } else if (a.tipo !== "Doctorado" && b.tipo === "Doctorado") {
        return 1; // b debe ir antes
      }

      // Si el tipo es el mismo, ordenar por nombre
      return a.name.localeCompare(b.name);
    });
    console.log(tesisData);
    return tesisData;
  } catch (error) {
    console.error("Error fetching tesis:", error);
  }
};

const getCourses = async () => {
  try {
    const data = await getDocs(collection(db, "courses"));
    const coursesData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    coursesData.sort((a, b) => parseInt(b.año) - parseInt(a.año));
    return coursesData;
  } catch (error) {
    console.error("Error fetching courses:", error);

    return [];
  }
};

export { getStudents, getTesis, getCourses };
