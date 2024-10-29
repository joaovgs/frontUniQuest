import React, { useState, useEffect, useRef } from 'react';
import './CompetitionCreate.css';
import { CompetitionPayload, CompetitionGame } from '../../models/Competition';
import { Game } from '../../models/Game'; 
import { GameService } from '../../services/Game';
import { createPortal } from 'react-dom';
import Spinner from '../Spinner/Spinner';

interface CompetitionCreateProps {
  onClose: () => void;
  onSave: (competition: CompetitionPayload) => void | Promise<void>;
  initialCompetition?: CompetitionPayload | null;
}

const CompetitionCreate: React.FC<CompetitionCreateProps> = ({ onClose, onSave, initialCompetition }) => {
  const [title, setTitle] = useState<string>(initialCompetition?.title || '');
  const [dateEvent, setDateEvent] = useState<Date | undefined>(initialCompetition?.date_event ? new Date(initialCompetition.date_event) : undefined);
  const [startRegistration, setStartRegistration] = useState<Date | undefined>(initialCompetition?.start_registration ? new Date(initialCompetition.start_registration) : undefined);
  const [endRegistration, setEndRegistration] = useState<Date | undefined>(initialCompetition?.end_registration ? new Date(initialCompetition.end_registration) : undefined);
  const [minParticipant, setMinParticipant] = useState<string>(''); 
  const [maxParticipant, setMaxParticipant] = useState<string>(''); 
  const [local, setLocal] = useState<string>(initialCompetition?.local || '');
  const [description, setDescription] = useState<string>(initialCompetition?.description || '');
  const [competitionGames, setCompetitionGames] = useState<CompetitionGame[]>(initialCompetition?.CompetitionGames || [{ local: '', date_game: undefined, game_id: 0, game_name: '' }]); 
  const [image, setImage] = useState<string | null>(null);
  const [regulation, setRegulation] = useState<string | null>(null);
  const [availableGames, setAvailableGames] = useState<Game[]>([]); 
  const [isEditing] = useState<boolean>(!!initialCompetition);
  const [imageName, setImageName] = useState<string | null>(initialCompetition?.image_name || null);
  const [regulationName, setRegulationName] = useState<string | null>(initialCompetition?.regulation_name || null);
  const [loadingGames, setLoadingGames] = useState<boolean>(true);

  useEffect(() => {
    if (initialCompetition) {
      setTitle(initialCompetition.title || '');
      setDateEvent(initialCompetition.date_event ? new Date(initialCompetition.date_event) : undefined);
      setStartRegistration(initialCompetition.start_registration ? new Date(initialCompetition.start_registration) : undefined);
      setEndRegistration(initialCompetition.end_registration ? new Date(initialCompetition.end_registration) : undefined);
      setMinParticipant(initialCompetition.min_participant ? initialCompetition.min_participant.toString() : '0'); 
      setMaxParticipant(initialCompetition.max_participant ? initialCompetition.max_participant.toString() : '0');
      setLocal(initialCompetition.local || '');
      setDescription(initialCompetition.description || '');
      setCompetitionGames(initialCompetition.CompetitionGames && initialCompetition.CompetitionGames.length > 0 
        ? initialCompetition.CompetitionGames.map(game => ({
            local: game.local,
            date_game: game.date_game ? new Date(game.date_game) : undefined,
            game_id: game.game_id,
            game_name: game.game_name 
          })) 
        : [{ local: '', date_game: undefined, game_id: 0, game_name: '' }]); 
      setImage(initialCompetition.image || null);
      setRegulation(initialCompetition.regulation || null);
      setImageName(initialCompetition.image_name || null);
      setRegulationName(initialCompetition.regulation_name || null);
    }
  }, [initialCompetition]);

  useEffect(() => {
    const fetchGames = async () => {
      setLoadingGames(true); 
      try {
        const response = await GameService.getGames('');
        setAvailableGames(response.games);
      } catch (error) {
        console.error('Erro ao buscar as provas:', error);
      } finally {
        setLoadingGames(false); 
      }
    };

    fetchGames();
  }, []);

  const gamesContainerRef = useRef<HTMLDivElement>(null);

  const handleAddGame = () => {
    const newGames = [...competitionGames, { local: '', date_game: undefined, game_id: 0, game_name: '' }];
    setCompetitionGames(newGames);

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
    setCompetitionGames(competitionGames.filter((_, i) => i !== index));
  };

  const handleFileToBase64 = (file: File | null, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        setter(reader.result as string);
      }
    };
    reader.onerror = (error) => {
      console.error('Erro ao converter o arquivo para Base64:', error);
    };
  };

  const handleSave = () => {
    const newCompetition: CompetitionPayload = {
      title,
      date_event: dateEvent || new Date(),
      start_registration: startRegistration || new Date(),
      end_registration: endRegistration || new Date(), 
      min_participant: minParticipant ? parseInt(minParticipant) : 0, 
      max_participant: maxParticipant ? parseInt(maxParticipant) : 0, 
      local,
      description,
      image, 
      regulation,
      image_name: imageName, 
      regulation_name: regulationName, 
      CompetitionGames: competitionGames.map((game) => ({
        ...game,
        date_game: game.date_game || new Date(),
      })), 
    };

    if (image === null) {
      delete newCompetition.image;
    } else {
      newCompetition.image = image;
    }
  
    if (regulation === null) {
      delete newCompetition.regulation;
    } else {
      newCompetition.regulation = regulation;
    }
    
    console.log(newCompetition)
    onSave(newCompetition);
  };

  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<Date | undefined>>, event: React.ChangeEvent<HTMLInputElement>) => {
    const localDate = event.target.value ? new Date(event.target.value + 'Z') : undefined;
    setter(localDate);
  };

  return createPortal(
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
                placeholder="Mín. Participantes por Equipe"
                value={minParticipant} 
                onChange={(e) => setMinParticipant(e.target.value)}
              />
              <input
                type="number"
                placeholder="Máx. Participantes por Equipe"
                value={maxParticipant} 
                onChange={(e) => setMaxParticipant(e.target.value)} 
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
              {loadingGames ? (
                <Spinner /> 
              ) : (
                <div className="games-container" ref={gamesContainerRef}>
                  {competitionGames.map((game, index) => ( 
                    <div key={index} className="competition-game-item">
                      <select
                        value={game.game_id || ''} 
                        onChange={(e) => {
                          const selectedValue = Number(e.target.value);
                          const updatedGames = [...competitionGames]; 
                          updatedGames[index] = {
                            ...updatedGames[index],
                            game_id: selectedValue, 
                          };
                          setCompetitionGames(updatedGames); 
                        }}
                      >
                        <option value="" disabled>Selecione uma prova</option>
                        {availableGames.map((availableGame) => (
                          <option key={availableGame.id} value={availableGame.id}>
                            {availableGame.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="datetime-local"
                        value={game.date_game instanceof Date ? game.date_game.toISOString().substring(0, 16) : ""}
                        onChange={(e) => {
                          const localDate = e.target.value ? new Date(e.target.value + 'Z') : undefined; 
                          const updatedGames = [...competitionGames]; 
                          updatedGames[index] = {
                            ...updatedGames[index],
                            date_game: localDate, 
                          };
                          setCompetitionGames(updatedGames); 
                        }}
                      />

                      <input
                        type="text"
                        placeholder="Local da Prova"
                        value={game.local}
                        onChange={(e) => {
                          const updatedGames = [...competitionGames]; 
                          updatedGames[index] = {
                            ...updatedGames[index],
                            local: e.target.value, 
                          };
                          setCompetitionGames(updatedGames); 
                        }}
                      />
                      <button type="button" onClick={() => handleRemoveGame(index)}>🗑</button>
                    </div>
                  ))}
                </div>
              )}
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
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImageName(file ? file.name : null);
                        handleFileToBase64(file, setImage);
                      }}
                      accept="image/*"
                    />
                    <label htmlFor="image-upload" className="file-input-label">
                      <span>{imageName || "Selecione uma imagem ou arraste o arquivo"}</span>
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
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setRegulationName(file ? file.name : null);
                        handleFileToBase64(file, setRegulation);
                      }}
                      accept=".pdf,.doc,.docx"
                    />
                    <label htmlFor="regulation-upload" className="file-input-label">
                      <span>{regulationName || "Selecione um arquivo ou arraste o arquivo"}</span>
                      <span className="file-input-icon">⬆️</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-actions-buttons">
          <button className="cancel-button" onClick={onClose}>Cancelar</button>
          <button className="save-button" onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CompetitionCreate;
