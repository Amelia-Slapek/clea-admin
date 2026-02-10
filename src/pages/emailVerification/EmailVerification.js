import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './EmailVerification.scss';
import CleaMenu from '../../styles/components/menu/Menu';
import ErrorIcon from '../../assets/ERROR.svg';
import SuccessIcon from '../../assets/SUCCESS.svg';

export const EmailVerificationPage = () => {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === true) return;

        const verifyEmail = async () => {
            try {
                const response = await fetch(`https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/auth/verify-email/${token}`);
                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message);

                    if (data.token && data.user) {
                        localStorage.setItem('token', data.token);
                        const { avatarImageData, ...userStorage } = data.user;
                        localStorage.setItem('user', JSON.stringify(userStorage));

                        setTimeout(() => {
                            navigate('/');
                            window.location.reload();
                        }, 3000);
                    }
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Wystąpił błąd podczas weryfikacji');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Błąd połączenia z serwerem');
                console.error('Verification error:', error);
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setStatus('error');
            setMessage('Brak tokenu weryfikacyjnego');
        }
        return () => {
            effectRan.current = true;
        };
    }, [token, navigate]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="admin">
            <div className="admin-page">
                <CleaMenu
                    onNavigate={handleNavigation}
                    currentPath={window.location.pathname}
                />
                <main className="email-verification">
                    <section className='email-verification__card'>
                        {status === 'loading' && (
                            <div className="email-verification__content">
                                <div className="email-verification__spinner"></div>
                                <h1 className="email-verification__title">
                                    Weryfikacja adresu email...
                                </h1>
                                <p className="email-verification__text">
                                    Proszę czekać, trwa weryfikacja Twojego konta.
                                </p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="email-verification__content">
                                <div className="email-verification__icon email-verification__icon--success">
                                    <img
                                        src={SuccessIcon}
                                        alt="Błąd weryfikacji"
                                        width="80"
                                        height="80"
                                    />
                                </div>
                                <h1 className="email-verification__title">
                                    Email zweryfikowany!
                                </h1>
                                <p className="email-verification__text">
                                    {message}
                                </p>
                                <p className="email-verification__text email-verification__text--secondary">
                                    Za chwilę zostaniesz przekierowany na stronę główną...
                                </p>
                                <div className="email-verification__actions">
                                    <Link to="/" className="email-verification__button">
                                        Przejdź do strony głównej
                                    </Link>
                                </div>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="email-verification__content">
                                <div className="email-verification__icon">
                                    <img
                                        src={ErrorIcon}
                                        alt="Błąd weryfikacji"
                                        width="80"
                                        height="80"
                                    />
                                </div>
                                <h1 className="email-verification__title">
                                    Weryfikacja nieudana
                                </h1>
                                <p className="email-verification__text email-verification__text--error">
                                    {message}
                                </p>
                                <div className="email-verification__actions">
                                    <Link to="/login" className="email-verification__button">
                                        Przejdź do logowania
                                    </Link>
                                </div>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};