import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './SideMenu.css';
import { FaBars, FaAngleLeft } from 'react-icons/fa';

const SideMenu = () => {
    const user = useSelector(state => state.session.user);
    const location = useLocation();
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return user ? (
        <div className={`side-menu ${showMenu ? 'open' : ''}`}>
            <button className="menu-toggle" onClick={toggleMenu}>
                {showMenu ? <FaAngleLeft/> : <FaBars />}
            </button>
            <div className="menu-content">
                <ul>
                    {location.pathname !== '/' && <li><a href="/">Dashboard</a></li>}
                    <li><a href="/transactions">Transactions</a></li>
                    <li><a href="/goals">Goals</a></li>
                    <li><a href="/budgets">Budgets</a></li>
                    <li><a href="/articles">Resources</a></li>
                </ul>
            </div>
        </div>
    ) : (null);
};

export default SideMenu;