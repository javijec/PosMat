const TesisEditItem = ({ t, handleEdit, handleDelete }) => {
  return (
    <div key={t.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
      <div>
        <p>
          {t.title} - ({t.year})
        </p>
        <p>{t.name}</p>
        <p>Director: {t.director}</p>
        {t.co_director && <p>Codirector: {t.co_director}</p>}

        <p>Tipo: {t.tag}</p>
      </div>
      <div className="space-x-2">
        <button onClick={() => handleEdit(t)} className="bg-yellow-500 text-white py-1 px-3 rounded">
          Editar
        </button>
        <button onClick={() => handleDelete(t.id)} className="bg-red-600 text-white py-1 px-3 rounded">
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default TesisEditItem;
