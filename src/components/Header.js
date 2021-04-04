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
                    <SocialMediaLink href="https://twitter.com/wolfcraft_io">
                        <TwitterLogo />
                    </SocialMediaLink>
                    <SocialMediaLink href="https://instagram.com/wolfcraft.io">
                        <InstagramLogo />
                    </SocialMediaLink>
                </div>
            </div>
        );
    }
}

export default Header;