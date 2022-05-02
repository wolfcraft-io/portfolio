import React, { Component } from 'react';
import './Photo.css';

const email = process.env.REACT_APP_CONTACT_EMAIL;

class Photo extends Component {
    constructor() {
        super();
        this.state = { show: false }
        this.descriptionMissing = email ? `Image description missing. You can notify us about this issue at ${email}` : 'Image description missing.';
    }

    componentDidMount() {
       window.addEventListener('scroll', () => this.onViewportUpdated());
       setTimeout(() => this.onViewportUpdated(), 20);
    }

    onViewportUpdated() {
        if(!this.domElement || this.state.show)
            return;

        if (this.domElement.getBoundingClientRect().top <= window.innerHeight) {
            this.setState({ show: true });
            this.props.loadNextPhoto?.();
        }
    }

    render() {
        const {
            id = 'no-id',
            image,
            name,
            hash,
            labels,
            description,
            showDescription,
        } = this.props;

        if (!image)
            return null;

        if (!description)
            console.error(`Missing description for '${name || image}'.`)

        return (
            <div id={hash} tags={labels} className={`photo ${this.state.show ? 'fade-in' : 'pre-load'}`}
                ref={e => this.domElement = e}
                onClick={() => this.props.onClick?.()}>
                <img
                    id={`photo_${id}`}
                    src={image}
                    alt={description || this.descriptionMissing } />
                {description && showDescription ? <div className="description">{description}</div> : null}
            </div>
        );
    }
}

export default Photo;