import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import "./Menu.scss";
import logo from "../../../assets/logo.svg";

const MENU_ITEMS = [
    { id: 'home', label: 'Strona Główna', path: '/' },
    { id: 'ingredientsManagement', label: 'Składniki', path: '/ingredientsManagement' },
    { id: 'tagConflictsManagement', label: 'Konflity tagów', path: '/tagConflictsManagement' },
    { id: 'productsManagement', label: 'Produkty', path: '/productsManagement' },
    { id: 'articlesManagement', label: 'Artykuły', path: '/articles-management' },
];

export const CleaMenu = ({ onNavigate, currentPath }) => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        if (onNavigate) onNavigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="clea-menu">
            <div className="clea-menu__container">
                <div className="clea-menu__logo" onClick={() => onNavigate('/')}>
                    <img src={logo} alt="Clea Logo" className="clea-menu__logo-img" />
                    <span className="clea-menu__logo-text">Clea</span>
                </div>
                <button
                    className={`clea-menu__toggle ${isMenuOpen ? 'clea-menu__toggle--active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Otwórz menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <nav className={`clea-menu__nav ${isMenuOpen ? 'clea-menu__nav--open' : ''}`}>
                    <ul className="clea-menu__list">
                        {MENU_ITEMS.map((item) => (
                            <li key={item.id} className="clea-menu__item">
                                <button
                                    className={`clea-menu__link ${currentPath === item.path ? 'clea-menu__link--active' : ''}`}
                                    onClick={() => {
                                        onNavigate(item.path);
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="clea-menu__actions">
                        {user ? (
                            <div className="clea-menu__profile" ref={dropdownRef}>
                                <div className="clea-menu__profile-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <span className="clea-menu__profile-name">
                                        {user.firstName} {user.lastName}
                                    </span>
                                </div>

                                {isDropdownOpen && (
                                    <div className="clea-menu__dropdown">
                                        <button
                                            className="clea-menu__dropdown-item"
                                            onClick={() => {
                                                onNavigate('/account');
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            Profil
                                        </button>
                                        <button className="clea-menu__dropdown-item" onClick={handleLogout}>
                                            Wyloguj się
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className="clea-menu__login-btn" onClick={() => onNavigate('/login')}>
                                Zaloguj
                            </button>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default CleaMenu;