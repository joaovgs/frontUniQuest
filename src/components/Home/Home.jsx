import React from 'react';
import './Home.css';
import { FaUserCircle } from 'react-icons/fa';

function Home() {
  return (
      <div className="home-content">
        <header className="home-header">
          <FaUserCircle className="home-user-icon" />
        </header>

        <main>
          <section className="current-event">
            <h2>Gincana em Andamento</h2>
            <img src="/images/gincanaatual.png" alt="Gincana Atual" className="current-event-image" />
          </section>

          <section className="previous-events">
            <h2>Gincanas Anteriores</h2>
            <div className="previous-events-container">
              <button className="prev-button">&lt;</button>
              <div className="event-images">
                <img src="/images/gincana-anterior1.png" alt="Gincana Anterior 1" />
                <img src="/images/gincana-anterior2.png" alt="Gincana Anterior 2" />
                <img src="/images/gincana-anterior3.png" alt="Gincana Anterior 3" />
              </div>
              <button className="next-button">&gt;</button>
            </div>
          </section>
        </main>
      </div>
  );
}

export default Home;
