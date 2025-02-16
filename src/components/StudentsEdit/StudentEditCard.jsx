const StudentsEditCard = ({ students, handleEdit, handleDelete }) => {
  return (
    <div className="space-y-4">
      {students.map((student, index) => (
        <div key={index} className="p-4 bg-white rounded shadow flex justify-between items-center">
          <div>
            <p>
              {student.lastName}, {student.firstName}
            </p>
            <p className="text-sm">
              <strong>Director:</strong> {student.director}
            </p>
            <p className="text-sm">
              <strong>Codirector:</strong> {student.codirector || "-"}
            </p>
            <p className="text-sm">
              <strong>Programa:</strong> {student.program === "doctorado" ? "Doctorado" : "Maestría"}
            </p>
            <p className="text-sm">
              <strong>Tema de Tesis:</strong> {student.thesis_topic}
            </p>
          </div>
          <div className="space-x-2">
            <button onClick={() => handleEdit(index)} className="bg-yellow-500 text-white py-1 px-3 rounded">
              Editar
            </button>
            <button onClick={() => handleDelete(index)} className="bg-red-600 text-white py-1 px-3 rounded">
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentsEditCard;
