import Header from './components/Header';
import Gallery from './components/Gallery';
import './Portfolio.css';

function App() {
  return (
    <div className="portfolio">
      <Header />
      <div id="content">
        <Gallery />
      </div>
    </div>
  );
}

export default App;
