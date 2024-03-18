import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useConnectionStatus } from '@thirdweb-dev/react';
import { menuItems } from './Pages';
import './Components.css';
import logo_blk from '../img/logo100_blk.png';
import logo from '../img/logo100.png';
import { ProductContext } from './AppContext';

function NavBar() {
  const [selected, setSelected] = useState(null);
  const [tabs, setTabs] = useState([]);
  const location = useLocation();
  const connectionStatus = useConnectionStatus();
  const { isClaimed, isOwner } = useContext(ProductContext);

  // Set selected state based on current route and query parameters
  useEffect(() => {
    const currentRoute = location.pathname.substring(1);
    const queryParams = new URLSearchParams(location.search);
    const param = queryParams.get('param');
    setSelected(`${currentRoute}${param ? `/${param}` : ''}`);
  }, [location]);

  useEffect(() => {
    setTabs(menuItems
      .filter(item => {
        if (!isClaimed && item.name.toLowerCase() === 'claim') {
          return true; // If isClaimed is true, do not include the "claim" tab
        }
        if (isOwner === false && item.hasGate) {
          return false; // If the user is not the owner and is disconnected, do not include tabs with a gate
        }
        if ((!isClaimed || item.name.toLowerCase() === 'claim') || (isOwner === false && connectionStatus === "disconnected" && item.hasGate)) {
          return false;
        }
        return true;
      }))
  }, [isClaimed, isOwner, connectionStatus]);

  return (
    <div className="Navigation">
      <div className="Nav-Row">
        {tabs && tabs.length > 0 && tabs.map((item) => (
          <Link
            key={item.name}
            className={`Nav-Item ${selected === item.route ? 'selected' : ''}`}
            to={`/${item.route}${location.search}`}
            onClick={() => {
              const queryParams = new URLSearchParams(location.search);
              const param = queryParams.get('param');
              setSelected(`${item.route}${param ? `/${param}` : ''}`);
            }}
          >
            {item.icon === 'logo' ?
              <img src={selected === item.route ? logo : logo_blk} style={{ height: '21px' }} alt="logo" />
              :
              <FontAwesomeIcon
                icon={item.icon}
                size="xl"
                color={selected === item.route ? '#02b140' : '#000'}
              />
            }
            <span
              className={`Nav-Text ${selected === item.route ? 'selected' : ''}`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default NavBar;