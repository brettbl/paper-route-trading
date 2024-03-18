import React, { useEffect } from 'react';
import './Components.css';
import { useLocation } from 'react-router-dom';
import { ConnectWallet, lightTheme } from '@thirdweb-dev/react';
import { useAddress } from '@thirdweb-dev/react';
import TabBar from './TabBar';

function MenuBar({ menuItems }: { menuItems: Array<object> }) {
    const [tabVisible, setTabVisible] = React.useState(false);
    const location = useLocation();
    const pageName = location.pathname.split('/')[1];
    const address = useAddress();

    useEffect(() => {
      if (menuItems.some(item => item.route === pageName && item.hasTab)) {
        setTabVisible(true);
      } else {
        setTabVisible(false);
      }
    }, [menuItems, pageName]);

    useEffect(() => {
      const handleScroll = () => {
        let hasBoxShadow;
        if (tabVisible) {
          hasBoxShadow = document.querySelector('.Tab');
        } else {
          hasBoxShadow = document.querySelector('.Menu');
        }
        if (window.scrollY > 0) {
          hasBoxShadow.classList.add('scrolled');
        } else {
          hasBoxShadow.classList.remove('scrolled');
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [tabVisible]);

    return (
      <>
        <div className='Menu'>
            <div className='Menu-Row'>
                <div className='Menu-Logo'>
                    <img className='Logo' src='/logo192.png' alt='logo'/>
                </div>
                <div className='Menu-Title'>
                    <span>{pageName}</span>
                </div>
                <div className="Menu-Wallet">
                    <ConnectWallet
                        welcomeScreen={{
                            title: "Welcome to PERKS",
                            img: {
                            src: '/logo192.png',
                            width: 150,
                            }
                        }}
                        theme={lightTheme({
                            colors: {
                            accentText: "#00000",
                            accentButtonBg: "#00000",
                            accentButtonText: "#00000",
                            primaryButtonBg: "#02b140",
                            primaryButtonText: "#fff",
                            primaryText: "#000",
                            connectedButtonBg: "#02b140",
                            connectedButtonBgHover: "#000",
                            },
                        })}
                        className={address ? 'Wallet-Connect-Active' : 'Wallet-Connect-Inactive'}
                        switchToActiveChain={true}
                    />
            </div>
            </div>
        </div>
        {tabVisible && (
          <TabBar />
          )}
        </>
    );
}

export default MenuBar;