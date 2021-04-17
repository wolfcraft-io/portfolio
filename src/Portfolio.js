import Header from './components/Header';
import Gallery from './components/Gallery';
import ContentProvider from './providers/GalleryContentProvider';
import S3Provider from './providers/s3ContentProvider';
import './Portfolio.css';

function App() {
  const contentProvider = new ContentProvider(new S3Provider());
  return (
    <div className="portfolio">
      <Header />
      <div id="content">
        <Gallery contentProvider={contentProvider} />
      </div>
    </div>
  );
}

export default App;
