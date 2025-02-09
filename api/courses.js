export default function handler(req, res) {
  if (req.method === "POST") {
    try {
      const courses = req.body;
      // Aquí tu lógica para guardar los cursos
      // Por ejemplo, guardar en una base de datos

      res.status(200).json({
        success: true,
        message: "Cursos guardados exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Error al guardar los cursos",
      });
    }
  }
}
