import React, { Component } from 'react';
import Name from '../asset-components/WolfcraftName';
import Logo from '../asset-components/WolfcraftLogoLight';
import TwitterLogo from '../asset-components/TwitterLogo';
import InstagramLogo from '../asset-components/InstagramLogo';
import SocialMediaLink from './SocialMediaLink';

const socialMedia = {
    twitter: process.env.REACT_APP_SM_TWITTER,
    instagram: process.env.REACT_APP_SM_INSTAGRAM
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
                    {this.renderTwitterLink()}
                    {this.renderInstagramLink()}
                </div>
            </div>
        );
    }

    renderTwitterLink() {
        if (!socialMedia.twitter)
            return;

        return (
            <SocialMediaLink href={`https://twitter.com/${socialMedia.twitter}`}>
                <TwitterLogo />
            </SocialMediaLink>
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