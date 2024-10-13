import React, { useState, useEffect } from 'react';
import './GameCreate.css'; // Importando o CSS específico do componente

interface GameCreateProps {
  onClose: () => void; // Propriedade para fechar o modal
  onSave: (game: Game) => void; // Propriedade para salvar o novo game
  initialGame?: Game; // Propriedade opcional para receber um game já existente para edição
}

interface Game {
  gameName: string;
  minParticipants: string;
  maxParticipants: string;
  firstPlacePoints: string;
  secondPlacePoints: string;
  thirdPlacePoints: string;
  generalPoints: string;
  category: string;
}

const GameCreate: React.FC<GameCreateProps> = ({ onClose, onSave, initialGame }) => {
  const [gameName, setGameName] = useState('');
  const [minParticipants, setMinParticipants] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [firstPlacePoints, setFirstPlacePoints] = useState('');
  const [secondPlacePoints, setSecondPlacePoints] = useState('');
  const [thirdPlacePoints, setThirdPlacePoints] = useState('');
  const [generalPoints, setGeneralPoints] = useState('');
  const [category, setCategory] = useState('Confronto Direto');

  useEffect(() => {
    if (initialGame) {
      // Atualiza todos os campos com as informações do game ao abrir o modal no modo de edição
      setGameName(initialGame.gameName || '');
      setMinParticipants(initialGame.minParticipants || '');
      setMaxParticipants(initialGame.maxParticipants || '');
      setFirstPlacePoints(initialGame.firstPlacePoints || '');
      setSecondPlacePoints(initialGame.secondPlacePoints || '');
      setThirdPlacePoints(initialGame.thirdPlacePoints || '');
      setGeneralPoints(initialGame.generalPoints || '');
      setCategory(initialGame.category || 'Confronto Direto');
    }
  }, [initialGame]);

  const handleSave = () => {
    const newGame: Game = {
      gameName,
      minParticipants,
      maxParticipants,
      firstPlacePoints,
      secondPlacePoints,
      thirdPlacePoints,
      generalPoints,
      category,
    };
    onSave(newGame); // Chama a função onSave com todas as informações do game
  };

  return (
    <div className="game-create-container">
      <div className="create-game-modal">
        <h2>{initialGame ? 'Editar Prova' : 'Cadastro de Prova'}</h2>
        <form>
          <input
            type="text"
            placeholder="Nome da Prova"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="game-input-name"
          />

          <div className="form-group">
            <label>Participantes:</label>
          </div>
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

          <div className="form-group">
            <label>Pontuações:</label>
          </div>
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

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
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
