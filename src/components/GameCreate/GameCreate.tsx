import React, { useState, useEffect } from 'react';
import './GameCreate.css';
import { Game, GamePayload } from '../../models/Game';
import { useSnackbar } from '../../context/SnackbarContext';

interface GameCreateProps {
  onClose: () => void;
  onSave: (game: GamePayload) => void | Promise<void>;
  initialGame?: Game;
}

const GameCreate: React.FC<GameCreateProps> = ({ onClose, onSave, initialGame }) => { 
  const [name, setName] = useState<string>(initialGame?.name || '');
  const [minParticipant, setMinParticipant] = useState<number | ''>(initialGame?.min_participant || '');
  const [maxParticipant, setMaxParticipant] = useState<number | ''>(initialGame?.max_participant || '');
  const [firstScore, setFirstScore] = useState<number | ''>(initialGame?.first_score || '');
  const [secondScore, setSecondScore] = useState<number | ''>(initialGame?.second_score || '');
  const [thirdScore, setThirdScore] = useState<number | ''>(initialGame?.third_score || '');
  const [generalScore, setGeneralScore] = useState<number | ''>(initialGame?.general_score || '');
  const [category, setCategory] = useState<number>(initialGame?.category || 0);
  const [isEditing, setIsEditing] = useState<boolean>(!!initialGame);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (initialGame) {
      setName(initialGame.name || '');
      setMinParticipant(initialGame.min_participant || '');
      setMaxParticipant(initialGame.max_participant || '');
      setFirstScore(initialGame.first_score || '');
      setSecondScore(initialGame.second_score || '');
      setThirdScore(initialGame.third_score || '');
      setGeneralScore(initialGame.general_score || '');
      setCategory(initialGame.category || 0);
      setIsEditing(true);
    } else {
      setName('');
      setMinParticipant('');
      setMaxParticipant('');
      setFirstScore('');
      setSecondScore('');
      setThirdScore('');
      setGeneralScore('');
      setCategory(0);
      setIsEditing(false);
    }
  }, [initialGame]);

  const validateFields = () => {
    if (!name) {
      showSnackbar('Nome da prova é obrigatório.', 'error');
      return false;
    }
    if (minParticipant === '') {
      showSnackbar('Mínimo de participantes é obrigatório.', 'error');
      return false;
    }
    if (maxParticipant === '') {
      showSnackbar('Máximo de participantes é obrigatório.', 'error');
      return false;
    }
    if (firstScore === '') {
      showSnackbar('Pontuação do primeiro lugar é obrigatória.', 'error');
      return false;
    }
    if (secondScore === '') {
      showSnackbar('Pontuação do segundo lugar é obrigatória.', 'error');
      return false;
    }
    if (thirdScore === '') {
      showSnackbar('Pontuação do terceiro lugar é obrigatória.', 'error');
      return false;
    }
    if (generalScore === '') {
      showSnackbar('Pontuação geral é obrigatória.', 'error');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateFields()) return;

    const newGame: GamePayload = {
      name,
      min_participant: minParticipant as number,
      max_participant: maxParticipant as number,
      first_score: firstScore as number,
      second_score: secondScore as number,
      third_score: thirdScore as number,
      general_score: generalScore as number,
      category,
    };

    onSave(newGame);
  };

  return (
    <div className="game-create-container">
      <div className="create-game-modal">
        <h2>{isEditing ? 'Editar Prova' : 'Cadastro de Prova'}</h2>
        <form>
          <input
            type="text"
            placeholder="Nome da Prova"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="game-input"
          />

          <div className="form-group">
            <label>Participantes:</label>
            <div className="participants-inputs">
              <input
                type="number"
                placeholder="Mín."
                value={minParticipant}
                onChange={(e) => setMinParticipant(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="game-input"
              />
              <input
                type="number"
                placeholder="Máx."
                value={maxParticipant}
                onChange={(e) => setMaxParticipant(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="game-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Pontuações:</label>
            <div className="points-inputs">
              <input
                type="number"
                placeholder="1°"
                value={firstScore}
                onChange={(e) => setFirstScore(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="game-input"
              />
              <input
                type="number"
                placeholder="2°"
                value={secondScore}
                onChange={(e) => setSecondScore(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="game-input"
              />
              <input
                type="number"
                placeholder="3°"
                value={thirdScore}
                onChange={(e) => setThirdScore(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="game-input"
              />
              <input
                type="number"
                placeholder="Geral"
                value={generalScore}
                onChange={(e) => setGeneralScore(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="game-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Categoria:</label>
            <div className="category-options">
              <div className="category-option-radio">
                <label htmlFor="confronto-direto">
                  <input
                    type="radio"
                    id="confronto-direto"
                    name="category"
                    value="1"
                    checked={category === 0}
                    onChange={() => setCategory(0)}
                  />
                  Confronto Direto
                </label>
              </div>
              <div className="category-option-radio">
                <label htmlFor="todos-contra-todos">
                  <input
                    type="radio"
                    id="todos-contra-todos"
                    name="category"
                    value="2"
                    checked={category === 1}
                    onChange={() => setCategory(1)}
                  />
                  Todos Contra Todos
                </label>
              </div>
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
