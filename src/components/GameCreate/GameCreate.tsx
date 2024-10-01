import React, { useState } from 'react';
import './GameCreate.css'; // Importando o CSS específico do componente
import { useNavigate } from 'react-router-dom';

const GameCreate: React.FC = () => {
  const [gameName, setGameName] = useState('');
  const [minParticipants, setMinParticipants] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [firstPlacePoints, setFirstPlacePoints] = useState('');
  const [secondPlacePoints, setSecondPlacePoints] = useState('');
  const [thirdPlacePoints, setThirdPlacePoints] = useState('');
  const [generalPoints, setGeneralPoints] = useState('');
  const [category, setCategory] = useState('Confronto Direto');

  const navigate = useNavigate();

  const handleSave = () => {
    // Lógica para salvar o cadastro do game.
    console.log('Game salvo:', { gameName, minParticipants, maxParticipants, firstPlacePoints, secondPlacePoints, thirdPlacePoints, generalPoints, category });
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="game-create-container">
      <div className="create-game-modal">
        <h1>Cadastro de Prova</h1>
        <form>
          {/* Campo para nome da prova */}
          <input
            type="text"
            placeholder="Nome da Prova"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="game-input-name"
          />

          {/* Campo para participantes */}
          <div className="form-group">
            <label>Participantes:</label>
            <div className="participants-inputs">
              <input
                type="number"
                placeholder="Mín."
                value={minParticipants}
                onChange={(e) => setMinParticipants(e.target.value)}
                className="game-input"
              />
              <input
                type="number"
                placeholder="Máx."
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                className="game-input"
              />
            </div>
          </div>

          {/* Campo para pontuações */}
          <div className="form-group">
            <label>Pontuações:</label>
            <div className="points-inputs">
              <input
                type="number"
                placeholder="1°"
                value={firstPlacePoints}
                onChange={(e) => setFirstPlacePoints(e.target.value)}
                className="game-input"
              />
              <input
                type="number"
                placeholder="2°"
                value={secondPlacePoints}
                onChange={(e) => setSecondPlacePoints(e.target.value)}
                className="game-input"
              />
              <input
                type="number"
                placeholder="3°"
                value={thirdPlacePoints}
                onChange={(e) => setThirdPlacePoints(e.target.value)}
                className="game-input"
              />
              <input
                type="number"
                placeholder="Geral"
                value={generalPoints}
                onChange={(e) => setGeneralPoints(e.target.value)}
                className="game-input"
              />
            </div>
          </div>

          {/* Campo para categoria */}
          <div className="form-group">
            <label>Categoria:</label>
            <div className="category-options">
              <label>
                <input
                  type="radio"
                  name="category"
                  value="Confronto Direto"
                  checked={category === 'Confronto Direto'}
                  onChange={(e) => setCategory(e.target.value)}
                />
                Confronto Direto
              </label>
              <label>
                <input
                  type="radio"
                  name="category"
                  value="Todos Contra Todos"
                  checked={category === 'Todos Contra Todos'}
                  onChange={(e) => setCategory(e.target.value)}
                />
                Todos Contra Todos
              </label>
            </div>
          </div>
        </form>

        {/* Botões de ação */}
        <div className="modal-actions">
          <button className="cancel-button" onClick={handleCancel}>
            Cancelar
          </button>
          <button className="save-button" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCreate;
