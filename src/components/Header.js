import React, { Component } from 'react';
import Name from '../asset-components/WolfcraftName';
import Logo from '../asset-components/WolfcraftLogoLight';
import InstagramLogo from '../asset-components/InstagramLogo';
import SocialMediaLink from './SocialMediaLink';
import MailIcon from '../asset-components/MailIcon';

const contact = { email: process.env.REACT_APP_CONTACT_EMAIL };
const socialMedia = {
    instagram: process.env.REACT_APP_SM_INSTAGRAM,
};


class Header extends Component {
    render() {
        return (
            <div id="header-frame">
                <div id="header">
                    <a href="https://wolfcraft.io" className="wolfcraft-io">
                        <Logo />
                        <Name /> 
                    </a>
                    {this.renderInstagramLink()}
                    {this.renderContact()}
                </div>
            </div>
        );
    }

    renderContact() {
        if (!contact.email)
            return null;
        
        return (
            <a className="social-media-link"
                href={`mailto:${contact.email}`}>
                <MailIcon />
            </a>
        );
    }

    renderInstagramLink() {
        if (!socialMedia.instagram)
            return;

        return (
            <SocialMediaLink href={`https://www.instagram.com/${socialMedia.instagram}`}>
                <InstagramLogo />
            </SocialMediaLink>
        );
    }
}

export default Header;