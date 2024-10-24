import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './AllAgainstAllMatches.css';

interface Team {
  team_id: number;
  name: string;
  position: number;
  score: number;
}

interface Match {
  id: number;
  competition_id: number;
  game_id: number;
  round: number;
  teams: Team[];
}

const AllAgainstAllMatches: React.FC = () => {
  const [mockMatches, setMockMatches] = useState<Match[]>([
    {
      id: 1,
      competition_id: 2,
      game_id: 2,
      round: 1,
      teams: [
        { team_id: 1, name: 'Equipe 1', position: 1, score: 28 },
        { team_id: 2, name: 'Equipe 2', position: 2, score: 57 },
        { team_id: 3, name: 'Equipe 3', position: 3, score: 57 },
        { team_id: 4, name: 'Equipe 4', position: 4, score: 77 },
        { team_id: 5, name: 'Equipe 5', position: 5, score: 86 },
        { team_id: 6, name: 'Equipe 6', position: 6, score: 69 },
        { team_id: 7, name: 'Equipe 7', position: 7, score: 80 },
        { team_id: 8, name: 'Equipe 8', position: 8, score: 7 }
      ]
    },
    {
      id: 2,
      competition_id: 2,
      game_id: 2,
      round: 2,
      teams: [
        { team_id: 1, name: 'Equipe 1', position: 1, score: 30 },
        { team_id: 2, name: 'Equipe 2', position: 2, score: 60 },
        { team_id: 3, name: 'Equipe 3', position: 3, score: 45 },
        { team_id: 4, name: 'Equipe 4', position: 4, score: 55 },
        { team_id: 5, name: 'Equipe 5', position: 5, score: 75 },
        { team_id: 6, name: 'Equipe 6', position: 6, score: 65 },
        { team_id: 7, name: 'Equipe 7', position: 7, score: 85 },
        { team_id: 8, name: 'Equipe 8', position: 8, score: 25 }
      ]
    },
  ]);

  const [activeTab, setActiveTab] = useState(0);
  const [numMatches, setNumMatches] = useState(2);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newMatches = [...mockMatches];
    const currentRoundTeams = [...newMatches[activeTab].teams];
    const [reorderedItem] = currentRoundTeams.splice(result.source.index, 1);
    currentRoundTeams.splice(result.destination.index, 0, reorderedItem);

    const updatedTeams = currentRoundTeams.map((team, idx) => ({
      ...team,
      position: idx + 1, 
    }));

    newMatches[activeTab].teams = updatedTeams;
    setMockMatches(newMatches);
  };

  const generateMatches = () => {
    console.log(`Generating ${numMatches} matches`);
  };

  return (
    <div className="container">
      <h1>Prova C</h1>

      <div className="generate-matches-container">
        <h3>Todos Contra Todos</h3>
        <input
          type="number"
          value={numMatches}
          onChange={(e) => setNumMatches(Number(e.target.value))}
          min={1}
          max={10}
          className="input-num-matches"
        />
        <button className="generate-matches-button" onClick={generateMatches}>
          Gerar Partidas ⚙️
        </button>
      </div>

      <div className="matches-tabs">
        {mockMatches.map((match, index) => (
          <div key={match.id} className="tab">
            <input
              type="radio"
              id={`tab${index}`}
              name="match-tabs"
              checked={activeTab === index}
              onChange={() => setActiveTab(index)}
            />
            <label htmlFor={`tab${index}`}>{index + 1}ª partida</label>
          </div>
        ))}
      </div>

      <div className="tab-content">
        {mockMatches.length > 0 && activeTab < mockMatches.length && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={`matches-${activeTab}`} type="team">
              {(provided) => (
                <ul
                  className="matches-list"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {mockMatches[activeTab].teams.map((team, idx) => (
                    <Draggable
                      key={team.team_id}
                      draggableId={`team-${team.team_id}-${activeTab}-${idx}`}
                      index={idx}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="draggable-item"
                          style={{ ...provided.draggableProps.style }}
                        >
                          <span className="position">{`${team.position}º`}</span>
                          <span className="name">{team.name}</span>
                          <span className="score">{team.score}</span>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>        
        )}
      </div>
    </div>
  );
};

export default AllAgainstAllMatches;
