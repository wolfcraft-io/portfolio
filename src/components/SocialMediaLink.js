import React, { Component } from 'react';

class SocialMediaLink extends Component {
    render() {
        return (
            <a href={this.props.href} target="_blank" rel="noreferrer" className="social-media-link">
                { this.props.children }
            </a>
        );
    }
}

export default SocialMediaLink;