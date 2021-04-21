import { Component } from "react";
import Header from './components/Header';
import Gallery from './components/Gallery';
import ContentProvider from './providers/GalleryContentProvider';
import S3Provider from './providers/s3ContentProvider';
import './Portfolio.css';
import WolfcraftApplicationLogo from './asset-components/WolfcraftLogoApplication';

const sourceUrl = process.env.REACT_APP_APPLICATION_SOURCE;

class App extends Component {
  constructor() {
    super();
    this.contentProvider = new ContentProvider(new S3Provider());
    this.state = { galleryLoaded: false };
  }

  render () {
    return (
        <div className="portfolio">
        <Header />
        <div id="content">
          <Gallery
            contentProvider={this.contentProvider}
            onContentLoaded={() => this.setState({ galleryLoaded: true })} />
        </div>
        {this.renderFooter()}
      </div>
    );
  }

  renderFooter() {
    if (!this.state.galleryLoaded)
      return null;

    return (
      <div id="footer" className="fade-in">
         {this.renderApplicationLogo()}
      </div>
    );
  }

  renderApplicationLogo() {
    if (!sourceUrl)
      return <WolfcraftApplicationLogo />

    return (
      <div id="footer" className="fade-in">
        <a
          href={sourceUrl}
          rel="noreferrer"
          target="_blank"
          className="application-source">
          <WolfcraftApplicationLogo/>
        </a>
      </div>
    );
  }
}

export default App;
