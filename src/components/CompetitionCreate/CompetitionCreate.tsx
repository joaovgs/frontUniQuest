import React, { useState, useEffect, useRef } from 'react';
import './CompetitionCreate.css';
import { CompetitionPayload } from '../../models/Competition';
import { Game } from '../../models/Game'; 
import { GameService } from '../../services/Game';

interface CompetitionCreateProps {
  onClose: () => void;
  onSave: (competition: CompetitionPayload) => void | Promise<void>;
  initialCompetition?: CompetitionPayload | null;
}

interface CompetitionGame {
  local: string;
  date_game?: Date; 
  game_id: number;
}

const CompetitionCreate: React.FC<CompetitionCreateProps> = ({ onClose, onSave, initialCompetition }) => {
  const [title, setTitle] = useState<string>(initialCompetition?.title || '');
  const [dateEvent, setDateEvent] = useState<Date | undefined>(initialCompetition?.date_event ? new Date(initialCompetition.date_event) : undefined);
  const [startRegistration, setStartRegistration] = useState<Date | undefined>(initialCompetition?.start_registration ? new Date(initialCompetition.start_registration) : undefined);
  const [endRegistration, setEndRegistration] = useState<Date | undefined>(initialCompetition?.end_registration ? new Date(initialCompetition.end_registration) : undefined);
  const [minParticipant, setMinParticipant] = useState<number>(initialCompetition?.min_participant || 0);
  const [maxParticipant, setMaxParticipant] = useState<number>(initialCompetition?.max_participant || 0);
  const [local, setLocal] = useState<string>(initialCompetition?.local || '');
  const [description, setDescription] = useState<string>(initialCompetition?.description || '');
  const [games, setGames] = useState<CompetitionGame[]>(initialCompetition?.games || [{ local: '', date_game: undefined, game_id: 0 }]);
  const [image, setImage] = useState<File | null>(null);
  const [regulation, setRegulation] = useState<File | null>(null);
  const [availableGames, setAvailableGames] = useState<Game[]>([]); 
  const [isEditing, setIsEditing] = useState<boolean>(!!initialCompetition);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await GameService.getGames(''); 
        setAvailableGames(response.games);
      } catch (error) {
        console.error('Erro ao buscar as provas:', error);
      }
    };

    fetchGames();
  }, []);

  const gamesContainerRef = useRef<HTMLDivElement>(null);

  const handleAddGame = () => {
    const newGames = [...games, { local: '', date_game: undefined, game_id: 0 }];
    setGames(newGames);

    setTimeout(() => {
      if (gamesContainerRef.current) {
        const newGameElement = gamesContainerRef.current.lastElementChild;
        if (newGameElement) {
          newGameElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          
          setTimeout(() => {
            gamesContainerRef.current?.scrollTo({
              top: gamesContainerRef.current.scrollHeight,
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    }, 0);
  };

  const handleRemoveGame = (index: number) => {
    setGames(games.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const newCompetition: CompetitionPayload = {
      title,
      date_event: dateEvent || new Date(),
      start_registration: startRegistration || new Date(),
      end_registration: endRegistration || new Date(), 
      min_participant: minParticipant,
      max_participant: maxParticipant,
      local,
      description,
      games: games.map((game) => ({
        ...game,
        date_game: game.date_game || new Date(),
      })),
    };
    onSave(newCompetition);
  };

  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<Date | undefined>>, event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value ? new Date(event.target.value) : undefined);
  };

  return (
    <div className="competition-create-container">
      <div className="create-competition-modal">
        <h2>{isEditing ? 'Editar Gincana' : 'Cadastro de Gincana'}</h2>
        <div className="competition-form">
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
                <label>Data do Evento</label>
                <input
                  type="datetime-local"
                  value={dateEvent ? dateEvent.toISOString().substring(0, 16) : ""}
                  onChange={(e) => handleDateChange(setDateEvent, e)}
                  className="competition-input"
                />
              </div>
              <div className="date-group">
                <label>Início Inscrições</label>
                <input
                  type="datetime-local"
                  value={startRegistration ? startRegistration.toISOString().substring(0, 16) : ""}
                  onChange={(e) => handleDateChange(setStartRegistration, e)}
                  className="competition-input"
                />
              </div>
              <div className="date-group">
                <label>Fim Inscrições</label>
                <input
                  type="datetime-local"
                  value={endRegistration ? endRegistration.toISOString().substring(0, 16) : ""}
                  onChange={(e) => handleDateChange(setEndRegistration, e)}
                  className="competition-input"
                />
              </div>
            </div>

            <div className="form-group participants-inputs">
              <input
                type="number"
                placeholder="Min. Participantes por Equipe"
                value={minParticipant}
                onChange={(e) => setMinParticipant(Number(e.target.value))}
              />
              <input
                type="number"
                placeholder="Máx. Participantes por Equipe"
                value={maxParticipant}
                onChange={(e) => setMaxParticipant(Number(e.target.value))}
              />
            </div>

            <input
              type="text"
              placeholder="Local do Evento"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="competition-input-location"
            />

            <textarea
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="competition-input-description"
            />

            <div className="section-container">
              <label>Provas</label>
              <div className="games-container" ref={gamesContainerRef}>
                {games.map((game, index) => (
                  <div key={index} className="competition-game-item">
                    <select
                      value={game.game_id}
                      onChange={(e) => {
                        const updatedGames = [...games];
                        updatedGames[index].game_id = Number(e.target.value);
                        setGames(updatedGames);
                      }}
                    >
                      <option value={0}>Selecione uma prova</option>
                      {availableGames.map((availableGame) => (
                        <option key={availableGame.id} value={availableGame.id}>
                          {availableGame.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="datetime-local"
                      value={game.date_game ? game.date_game.toISOString().substring(0, 16) : ""}
                      onChange={(e) => {
                        const updatedGames = [...games];
                        updatedGames[index].date_game = e.target.value ? new Date(e.target.value) : undefined;
                        setGames(updatedGames);
                      }}
                    />

                    <input
                      type="text"
                      placeholder="Local da Prova"
                      value={game.local}
                      onChange={(e) => {
                        const updatedGames = [...games];
                        updatedGames[index].local = e.target.value;
                        setGames(updatedGames);
                      }}
                    />
                    <button type="button" onClick={() => handleRemoveGame(index)}>🗑</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={handleAddGame} className="add-game-button">
                Adicionar Prova
              </button>
            </div>

            <div className="section-container">
              <label>Anexos</label>
              <div className="attachments-container">
                <div className="attachment-item">
                  <label className="attachment-label">Imagem</label>
                  <div className="file-input-wrapper">
                    <input
                      id="image-upload"
                      type="file"
                      onChange={(e) => setImage(e.target.files?.[0] || null)}
                      accept="image/*"
                    />
                    <label htmlFor="image-upload" className="file-input-label">
                      <span>Selecione uma imagem ou arraste o arquivo</span>
                      <span className="file-input-icon">⬆️</span>
                    </label>
                  </div>
                </div>
                <div className="attachment-item">
                  <label className="attachment-label">Regulamento</label>
                  <div className="file-input-wrapper">
                    <input
                      id="regulation-upload"
                      type="file"
                      onChange={(e) => setRegulation(e.target.files?.[0] || null)}
                      accept=".pdf,.doc,.docx"
                    />
                    <label htmlFor="regulation-upload" className="file-input-label">
                      <span>Selecione um arquivo ou arraste o arquivo</span>
                      <span className="file-input-icon">⬆️</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>
        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>Cancelar</button>
          <button className="save-button" onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default CompetitionCreate;
