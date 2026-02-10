import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import './Registration.scss';
import CleaMenu from '../../styles/components/menu/Menu';
import eyeIcon from "../../assets/EYE.svg";

export const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isVerificationSent, setIsVerificationSent] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [resendingEmail, setResendingEmail] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { register } = useAuth();

    const handleNavigation = (path) => navigate(path);
    const togglePasswordVisibility = () => setShowPassword(prev => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
        if (needsVerification) setNeedsVerification(false);
    };
    const handleResendVerification = async () => {
        setResendingEmail(true);
        setError('');
        try {
            const response = await fetch('https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Email weryfikacyjny został wysłany ponownie.');
                setNeedsVerification(false);
                setIsVerificationSent(true);
            } else {
                setError(data.message || 'Nie udało się wysłać emaila ponownie');
            }
        } catch (err) {
            setError('Błąd połączenia z serwerem');
        } finally {
            setResendingEmail(false);
        }
    };

    const validateForm = () => {
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setError('Imię i nazwisko są wymagane');
            return false;
        }
        if (!formData.email) {
            setError('Email jest wymagany');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Hasło musi mieć co najmniej 8 znaków');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Hasła nie są identyczne');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setError('');
        setNeedsVerification(false);

        try {
            const result = await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });

            if (result.success) {
                setIsVerificationSent(true);
                window.scrollTo(0, 0);
            } else {
                if (result.requiresVerification) {
                    setNeedsVerification(true);
                    setError(result.message);
                } else {
                    setError(result.message || 'Błąd podczas rejestracji');
                }
            }
        } catch (err) {
            setError('Błąd połączenia z serwerem');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="registration-page">
            <div className="registration-page__wrapper">
                <CleaMenu onNavigate={handleNavigation} currentPath={location.pathname} />

                <main className="registration-container">
                    <section className="registration-card">
                        {isVerificationSent ? (
                            <div className="registration-success">
                                <header className="registration-card__header">
                                    <div className="registration-success__icon">
                                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                    </div>
                                    <h1 className="registration-card__title">Sprawdź swoją skrzynkę</h1>
                                </header>
                                <div className="registration-success__content">
                                    <p>Link aktywacyjny został wysłany na adres: <br /><strong>{formData.email}</strong></p>
                                    <p className="registration-success__info">Kliknij w link zawarty w wiadomości...</p>
                                    <Link to="/login" className="registration-form__submit registration-success__button">Przejdź do logowania</Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <header className="registration-card__header">
                                    <h1 className="registration-card__title">Utwórz konto</h1>
                                    <p className="registration-card__subtitle">Dołącz do zespołu Content Creatorów Clea</p>
                                </header>

                                <form onSubmit={handleSubmit} className="registration-form">
                                    {error && (
                                        <div className="registration-form__message registration-form__message--error" role="alert">
                                            {error}
                                        </div>
                                    )}
                                    {needsVerification && (
                                        <div className="registration-form__message">
                                            <p className="registration-form__message--paragraph">Nie otrzymałeś linku?</p>
                                            <button className="registration-form__message--button"
                                                type="button"
                                                onClick={handleResendVerification}
                                                disabled={resendingEmail}
                                            >
                                                {resendingEmail ? 'Wysyłanie...' : 'Wyślij link ponownie'}
                                            </button>
                                        </div>
                                    )}
                                    <div className="registration-form__row">
                                        <div className="registration-form__group">
                                            <label className="registration-form__label" htmlFor="firstName">Imię</label>
                                            <input className="registration-form__input" type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="Jan" />
                                        </div>
                                        <div className="registration-form__group">
                                            <label className="registration-form__label" htmlFor="lastName">Nazwisko</label>
                                            <input className="registration-form__input" type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Kowalski" />
                                        </div>
                                    </div>

                                    <div className="registration-form__group">
                                        <label className="registration-form__label" htmlFor="email">Email</label>
                                        <input className="registration-form__input" type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="twoj@email.com" />
                                    </div>

                                    <div className="registration-form__group">
                                        <label className="registration-form__label" htmlFor="password">Hasło</label>
                                        <div className="registration-form__password-wrapper">
                                            <input className="registration-form__input registration-form__input--password" type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleInputChange} required placeholder="Min. 8 znaków" />
                                            <button type="button" className="registration-form__password-toggle" onClick={togglePasswordVisibility}>
                                                <img src={eyeIcon} alt="" style={{ opacity: showPassword ? 1 : 0.5 }} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="registration-form__group">
                                        <label className="registration-form__label" htmlFor="confirmPassword">Potwierdź hasło</label>
                                        <div className="registration-form__password-wrapper">
                                            <input className="registration-form__input registration-form__input--password" type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required placeholder="Powtórz hasło" />
                                            <button type="button" className="registration-form__password-toggle" onClick={toggleConfirmPasswordVisibility}>
                                                <img src={eyeIcon} alt="" style={{ opacity: showConfirmPassword ? 1 : 0.5 }} />
                                            </button>
                                        </div>
                                    </div>

                                    <button type="submit" className="registration-form__submit" disabled={isLoading}>
                                        {isLoading ? 'Tworzenie konta...' : 'Zarejestruj się'}
                                    </button>
                                </form>

                                <footer className="registration-card__footer">
                                    <p className="registration-card__footer-text">
                                        Masz już konto? <Link to="/login" className="registration-card__footer-link">Zaloguj się</Link>
                                    </p>
                                </footer>
                            </>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};