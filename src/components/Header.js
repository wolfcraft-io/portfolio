import React, { Component } from 'react';
import Name from '../asset-components/WolfcraftName';
import Logo from '../asset-components/WolfcraftLogoLight';
import TwitterLogo from '../asset-components/TwitterLogo';
import InstagramLogo from '../asset-components/InstagramLogo';
import SocialMediaLink from './SocialMediaLink';


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
        if (!process.env.REACT_APP_TWITTER)
            return;

        return (
            <SocialMediaLink href={`https://twitter.com/${process.env.REACT_APP_TWITTER}`}>
                <TwitterLogo />
            </SocialMediaLink>
        );
    }

    renderInstagramLink() {
        if (!process.env.REACT_APP_INSTAGRAM)
            return;

        return (
            <SocialMediaLink href={`https://www.instagram.com/${process.env.REACT_APP_INSTAGRAM}`}>
                <InstagramLogo />
            </SocialMediaLink>
        );
    }
}

export default Header;