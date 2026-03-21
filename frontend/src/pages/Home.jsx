import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      {/* 1. BANNER */}
      <section id="banner">
        <div className="content">
          <header>
            <h2>F1 Akadémia</h2>
            <p>Ahol a sebesség, a szenvedély<br />
            és a történelem találkozik.</p>
          </header>
        </div>
        <a href="#one" className="goto-next scrolly">Tovább</a>
      </section>

      {/* 2. SPOTLIGHT 1 */}
      <section id="one" className="spotlight style1 bottom">
        <span className="image fit main">
          <img src="https://cparici.com/wp-content/uploads/2025/08/cparici-2025-08-01T205416.688.jpg" alt="F1 History" />
        </span>
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-4 col-12-medium">
                <header>
                  <h2>A Formula–1 Aranykora</h2>
                  <p>1950 - 2006</p>
                </header>
              </div>
              <div className="col-4 col-12-medium">
                <p>Oldalunk célja, hogy elhozzuk neked a Formula–1 aranykorának minden pillanatát. Merülj el a sportág gyökereiben, és fedezd fel, hogyan vált a benzingőzös álmokból a világ legizgalmasabb versenysorozata!</p>
              </div>
              <div className="col-4 col-12-medium">
                <p>Ismerd meg a legendás pilótákat, akik örökre beírták nevüket a történelembe – Fangio, Lauda, Senna, Prost, Schumacher és sokan mások. Fedezd fel a csapatokat és konstrukciókat.</p>
              </div>
            </div>
          </div>
        </div>
        <a href="#two" className="goto-next scrolly">Tovább</a>
      </section>

      {/* 2. SPOTLIGHT 2 */}
      <section id="two" className="spotlight style2 right">
        <span className="image fit main">
          <img src="https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000000/content/dam/fom-website/manual/Misc/Verstappenbacktobacktitles/verstappen-hero.webp" alt="Verstappen" />
        </span>
        <div className="content">
          <header>
            <h2>Legendák nyomában</h2>
            <p>Sennától Verstappenig</p>
          </header>
          <p>A hősöd Ayrton Senna, Michael Schumacher vagy Max Verstappen? Tanulj róluk nálunk – nézd meg, hogyan emelkedtek fel, hogyan győztek, és mi tette őket legendává. Csatlakozz az F1 Akadémiához!</p>
          <ul className="actions">
            <li><Link to="/register" className="button">Regisztráció</Link></li>
          </ul>
        </div>
        <a href="#three" className="goto-next scrolly">Tovább</a>
      </section>

      {/* 3. FEATURES */}
      <section id="three" className="wrapper style1 special fade-up">
        <div className="container">
          <header className="major">
            <h2>Funkciók</h2>
            <p>Fedezd fel az adatbázist</p>
          </header>
          
          <div className="row gtr-uniform features-row">
            <section className="col-4 col-6-medium col-12-xsmall">
              <div className="feature-box">
                <span className="icon solid alt major fa-users"></span>
                <h3>Pilóták</h3>
                <p>Részletes adatbázis a jelenlegi és múltbéli versenyzőkről.</p>
                <Link to="/pilots" className="button small">Böngészés</Link>
              </div>
            </section>
            
            <section className="col-4 col-6-medium col-12-xsmall">
              <div className="feature-box">
                <span className="icon solid alt major fa-chart-area"></span>
                <h3>Diagramok</h3>
                <p>Látványos grafikonok és DNF statisztikák.</p>
                <Link to="/diagrams" className="button small">Megtekintés</Link>
              </div>
            </section>
            
            <section className="col-4 col-6-medium col-12-xsmall">
              <div className="feature-box">
                <span className="icon solid alt major fa-database"></span>
                <h3>CRUD Műveletek</h3>
                <p>Adatok kezelése, új pilóták felvétele.</p>
                <Link to="/pilots" className="button small">Kezelés</Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;