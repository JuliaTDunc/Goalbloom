import React, { useState } from 'react';
import './SideMenu.css';

const SideMenu = () => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div className={`side-menu ${showMenu ? 'open' : ''}`}>
            <button className="menu-toggle" onClick={toggleMenu}>
                {showMenu ? 'Close' : 'Menu'}
            </button>
            <div className="menu-content">
                <ul>
                    <li><a href="/transactions">Transactions</a></li>
                    <li><a href="/goals">Goals</a></li>
                    <li><a href="/">Budgets</a></li>
                    <li><a href="/">Educational Resources</a></li>

                </ul>
            </div>
        </div>
    );
};

export default SideMenu;