import Header from './components/Header';
import Gallery from './components/Gallery';
import ContentProvider from './providers/GalleryContentProvider'
import './Portfolio.css';

function App() {
  return (
    <div className="portfolio">
      <Header />
      <div id="content">
        <Gallery contentProvider={new ContentProvider()} />
      </div>
    </div>
  );
}

export default App;
