import React, { Component } from 'react';

class Gallery extends Component {
    render() {
        return (
            <div className="gallery">
               <div class="debug frame">
                   {window.visualViewport.width}px X {window.visualViewport.height}px
                </div>
            </div>
        );
    }
}

export default Gallery;