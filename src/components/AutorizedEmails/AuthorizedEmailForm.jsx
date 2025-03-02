import React from "react";

const AuthorizedEmailForm = ({ email, setEmail, error, handleAddEmail }) => (
  <form onSubmit={handleAddEmail} className="mb-6">
    <div className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="nombre@gmail.com"
        className="flex-1 p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Agregar
      </button>
    </div>
    {error && <p className="text-red-500 mt-2">{error}</p>}
  </form>
);

export default AuthorizedEmailForm;
