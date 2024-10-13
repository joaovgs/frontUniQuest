import React, { useState, useEffect } from 'react';
import './CompetitionCreate.css';

interface CompetitionCreateProps {
  onClose: () => void;
  onSave: (newCompetition: any) => void;
  initialCompetition?: any | null;
}

interface Game {
  name: string;
  dateTime: string;
  location: string;
}

const CompetitionCreate: React.FC<CompetitionCreateProps> = ({ onClose, onSave, initialCompetition }) => {
  const [title, setTitle] = useState(initialCompetition?.title || '');
  const [date, setDate] = useState(initialCompetition?.date || '');
  const [startDate, setStartDate] = useState(initialCompetition?.startDate || '');
  const [endDate, setEndDate] = useState(initialCompetition?.endDate || '');
  const [minParticipants, setMinParticipants] = useState(initialCompetition?.minParticipants || '');
  const [maxParticipants, setMaxParticipants] = useState(initialCompetition?.maxParticipants || '');
  const [location, setLocation] = useState(initialCompetition?.location || '');
  const [description, setDescription] = useState(initialCompetition?.description || '');
  const [games, setGames] = useState<Game[]>(initialCompetition?.games || [{ name: '', dateTime: '', location: '' }]);  // Inicia com os jogos existentes ao editar
  const [image, setImage] = useState<File | null>(null);
  const [regulation, setRegulation] = useState<File | null>(null);

  const [availableGames, setAvailableGames] = useState<Game[]>([]);

  useEffect(() => {
    fetch('/api/games') // Simulando a busca de provas da API
      .then((response) => response.json())
      .then((data) => setAvailableGames(data))
      .catch((error) => console.error('Erro ao buscar provas:', error));
  }, []);

  const handleAddGame = () => {
    setGames([...games, { name: '', dateTime: '', location: '' }]);
  };

  const handleRemoveGame = (index: number) => {
    setGames(games.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const newCompetition = {
      title,
      date,
      startDate,
      endDate,
      minParticipants,
      maxParticipants,
      location,
      description,
      games,  // Salvando as provas corretamente
      image,
      regulation,
    };
    onSave(newCompetition);
  };

  return (
    <div className="competition-create-container">
      <div className="create-competition-modal">
        <h2>Cadastro de Gincana</h2>
        <form>
          <input
            type="text"
            placeholder="Título da Gincana"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="competition-input-title"
          />

          <div className="form-group">
            <div className="date-group">
              <label>Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="competition-input"
                max="9999-12-31"
              />
            </div>
            <div className="date-group">
              <label>Início Inscrições</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="competition-input"
                max="9999-12-31"
              />
            </div>
            <div className="date-group">
              <label>Fim Inscrições</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="competition-input"
                max="9999-12-31"
              />
            </div>
          </div>

          <div className="form-group participants-inputs">
            <input
              type="number"
              placeholder="Min integrantes equipe"
              value={minParticipants}
              onChange={(e) => setMinParticipants(e.target.value)}
            />
            <input
              type="number"
              placeholder="Máx integrantes equipe"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
            />
          </div>

          <input
            type="text"
            placeholder="Local"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="competition-input-location"
          />

          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="competition-input-description"
          />

          {/* Provas */}
          <label>Provas</label>
          <div className="form-group provas-container">
            {games.map((game, index) => (
              <div key={index} className="game-item">
                <select
                  value={game.name}
                  onChange={(e) => {
                    const updatedGames = [...games];
                    updatedGames[index].name = e.target.value;
                    setGames(updatedGames);
                  }}
                >
                  <option value="">Selecione uma prova</option>
                  {availableGames.map((availableGame) => (
                    <option key={availableGame.name} value={availableGame.name}>
                      {availableGame.name}
                    </option>
                  ))}
                </select>

                <input
                  type="datetime-local"
                  value={game.dateTime}
                  onChange={(e) => {
                    const updatedGames = [...games];
                    updatedGames[index].dateTime = e.target.value;
                    setGames(updatedGames);
                  }}
                  placeholder="Data e Hora da Prova"
                  max="9999-12-31T23:59"
                />
                <input
                  type="text"
                  placeholder="Local da Prova"
                  value={game.location}
                  onChange={(e) => {
                    const updatedGames = [...games];
                    updatedGames[index].location = e.target.value;
                    setGames(updatedGames);
                  }}
                />
                <button type="button" onClick={() => handleRemoveGame(index)}>🗑</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddGame} className="add-game-button">Adicionar Prova +</button>

          {/* Anexos */}
          <div className="form-group attachment-row">
            <div className="attachment-item">
              <label>Imagem</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </div>
            <div className="attachment-item">
              <label>Regulamento</label>
              <input
                type="file"
                onChange={(e) => setRegulation(e.target.files?.[0] || null)}
              />
            </div>
          </div>

        </form>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>Cancelar</button>
          <button className="save-button" onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default CompetitionCreate;
