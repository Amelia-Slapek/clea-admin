import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ResetPassword.scss';
import CleaMenu from '../../styles/components/menu/Menu';
import eyeIcon from "../../assets/EYE.svg";
import successIcon from "../../assets/SUCCESS.svg";

export const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleNavigation = (path) => {
        navigate(path);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prev => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Hasła nie są identyczne.');
            return;
        }

        if (password.length < 8) {
            setStatus('error');
            setMessage('Hasło musi mieć minimum 8 znaków.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setStatus('error');
                setMessage(data.message || 'Wystąpił błąd.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Błąd połączenia z serwerem.');
        }
    };

    return (
        <div className="admin">
            <div className="admin-page">
                <CleaMenu onNavigate={handleNavigation} currentPath="/reset-password" />

                <main className="reset-password">
                    <div className="reset-password__container">
                        <section className="reset-password__card">
                            <header className="reset-password__header">
                                <h1 className="reset-password__title">Ustaw nowe hasło</h1>
                                <p className="reset-password__subtitle">Wprowadź i potwierdź nowe hasło dla swojego konta.</p>
                            </header>

                            {status === 'success' ? (
                                <div className="reset-password__success-content">
                                    <img
                                        src={successIcon}
                                        alt="Sukces"
                                        className="reset-password__success-icon"
                                    />
                                    <h3 className="reset-password__success-title">Hasło zmienione!</h3>
                                    <p className="reset-password__success-text">{message}</p>
                                    <p className="reset-password__success-subtext">Za chwilę zostaniesz przekierowany do logowania...</p>
                                    <Link to="/login" className="reset-password__submit-btn reset-password__submit-btn--link">
                                        Zaloguj się teraz
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="reset-password__form">
                                    {status === 'error' && (
                                        <div className="reset-password__message reset-password__message--error" role="alert">
                                            {message}
                                        </div>
                                    )}

                                    <div className="reset-password__group">
                                        <label className="reset-password__label" htmlFor="new-password">Nowe hasło</label>
                                        <div className="reset-password__password-wrapper">
                                            <input
                                                className="reset-password__input"
                                                type={showPassword ? "text" : "password"}
                                                id="new-password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                placeholder="Min. 8 znaków"
                                            />
                                            <button
                                                type="button"
                                                className="reset-password__password-toggle"
                                                onClick={togglePasswordVisibility}
                                                aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                                            >
                                                <img
                                                    src={eyeIcon}
                                                    alt=""
                                                    style={{ opacity: showPassword ? 1 : 0.5 }}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="reset-password__group">
                                        <label className="reset-password__label" htmlFor="confirm-password">Potwierdź hasło</label>
                                        <div className="reset-password__password-wrapper">
                                            <input
                                                className="reset-password__input"
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="confirm-password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                placeholder="Powtórz hasło"
                                            />
                                            <button
                                                type="button"
                                                className="reset-password__password-toggle"
                                                onClick={toggleConfirmPasswordVisibility}
                                                aria-label={showConfirmPassword ? "Ukryj hasło" : "Pokaż hasło"}
                                            >
                                                <img
                                                    src={eyeIcon}
                                                    alt=""
                                                    style={{ opacity: showConfirmPassword ? 1 : 0.5 }}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="reset-password__submit-btn"
                                        disabled={status === 'loading'}
                                    >
                                        {status === 'loading' ? 'Zapisywanie...' : 'Zmień hasło'}
                                    </button>
                                </form>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};