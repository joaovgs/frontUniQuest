import React, { useState } from 'react';
import './CreateUser.css'; // Estilos da tela de CreateUser

function CreateUser({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    onClose(); // Fecha o modal após salvar
  };

  return (
      <div className="create-user-modal-overlay">
        <div className="create-user-modal">
          <h2>Cadastro de Usuário</h2>
          <form onSubmit={handleSubmit}>
            <div className="create-user-field">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="create-user-field">
              <label htmlFor="username">Usuário</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="create-user-field">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="create-user-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="save-button">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}

export default CreateUser;
