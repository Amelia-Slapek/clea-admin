import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import './Login.scss';
import CleaMenu from '../../styles/components/menu/Menu';
import eyeIcon from "../../assets/EYE.svg";

export const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState('');
    const [resetError, setResetError] = useState('');
    const [needsVerification, setNeedsVerification] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState('');
    const [resendingEmail, setResendingEmail] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) setError('');
        if (needsVerification) setNeedsVerification(false);
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        if (!resetEmail) return;

        setResetLoading(true);
        setResetError('');
        setResetMessage('');

        try {
            const response = await fetch('https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail })
            });

            const data = await response.json();

            if (response.ok) {
                setResetMessage(data.message);
                setResetEmail('');
            } else {
                setResetError(data.message || 'Wystąpił błąd');
            }
        } catch (err) {
            setResetError('Błąd połączenia z serwerem');
        } finally {
            setResetLoading(false);
        }
    };

    const closeResetModal = () => {
        setShowResetModal(false);
        setResetEmail('');
        setResetMessage('');
        setResetError('');
    };

    const handleResendVerification = async () => {
        setResendingEmail(true);
        setError('');

        try {
            const response = await fetch('https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/auth/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: unverifiedEmail })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Email weryfikacyjny został wysłany ponownie na adres: ${unverifiedEmail}`);
            } else {
                setError(data.message || 'Nie udało się wysłać emaila ponownie');
            }
        } catch (err) {
            setError('Błąd połączenia z serwerem');
        } finally {
            setResendingEmail(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setNeedsVerification(false);

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                const from = location.state?.from || '/';
                navigate(from, { replace: true });
            } else {
                if (result.requiresVerification) {
                    setNeedsVerification(true);
                    setUnverifiedEmail(result.email);
                    setError(result.message);
                } else {
                    setError(result.message || 'Błąd podczas logowania');
                }
            }
        } catch (err) {
            setError('Błąd połączenia z serwerem');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="login-page">
                <div className="login-page__wrapper">
                    <CleaMenu
                        onNavigate={handleNavigation}
                        currentPath={location.pathname}
                    />

                    <main className="login-container">
                        <div className="login-card">
                            <header className="login-card__header">
                                <h1 className="login-card__title">Witaj ponownie</h1>
                                <p className="login-card__subtitle">Zaloguj się do panelu administratora Clea</p>
                            </header>

                            <form onSubmit={handleSubmit} className="login-form">
                                {error && (
                                    <div className="login-form__message login-form__message--error" role="alert">
                                        {error}
                                    </div>
                                )}
                                {needsVerification && (
                                    <div className="login-form__message login-form__message--warning" role="alert">
                                        <p className="login-form__message-paragraph">Konto nie zostało zweryfikowane.</p>
                                        <p className="login-form__message-paragraph">
                                            Link wysłano na: <strong>{unverifiedEmail}</strong>
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleResendVerification}
                                            disabled={resendingEmail}
                                            className="login-form__resend-btn"
                                        >
                                            {resendingEmail ? 'Wysyłanie...' : 'Wyślij link aktywacyjny ponownie'}
                                        </button>
                                    </div>
                                )}

                                <div className="login-form__group">
                                    <label className="login-form__label" htmlFor="email">Email</label>
                                    <input
                                        className="login-form__input"
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Wpisz swój email"
                                    />
                                </div>

                                <div className="login-form__group">
                                    <label className="login-form__label" htmlFor="password">Hasło</label>
                                    <div className="login-form__password-wrapper">
                                        <input
                                            className="login-form__input login-form__input--password"
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Wpisz hasło"
                                        />
                                        <button
                                            type="button"
                                            className="login-form__password-toggle"
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

                                <div className="login-form__actions">
                                    <button
                                        type="button"
                                        className="login-form__forgot-btn"
                                        onClick={() => setShowResetModal(true)}
                                    >
                                        Nie pamiętasz hasła?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="login-form__submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Logowanie...' : 'Zaloguj się'}
                                </button>
                            </form>

                            <footer className="login-card__footer">
                                <p className="login-card__footer-text">
                                    Nie masz konta?{' '}
                                    <Link to="/registration" className="login-card__footer-link">
                                        Zarejestruj się
                                    </Link>
                                </p>
                            </footer>
                        </div>
                    </main>
                    {showResetModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3 className="modal-title">Reset hasła</h3>

                                {!resetMessage ? (
                                    <>
                                        <p className="modal-description">Podaj email powiązany z kontem, aby otrzymać instrukcje.</p>

                                        {resetError && <div className="modal-message modal-message--error">{resetError}</div>}

                                        <form onSubmit={handleResetPasswordSubmit}>
                                            <input
                                                type="email"
                                                className="modal-input"
                                                placeholder="Twój adres email"
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                required
                                            />
                                            <div className="modal-actions">
                                                <button type="submit" className="modal-btn modal-btn--primary" disabled={resetLoading}>
                                                    {resetLoading ? 'Wysyłanie...' : 'Wyślij link'}
                                                </button>
                                                <button type="button" className="modal-btn modal-btn--secondary" onClick={closeResetModal}>
                                                    Anuluj
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <div className="modal-message modal-message--success">
                                            <p>{resetMessage}</p>
                                        </div>
                                        <button type="button" className="modal-btn modal-btn--primary" onClick={closeResetModal}>
                                            Zamknij
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};