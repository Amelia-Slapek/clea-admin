import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CleaMenu from '../../styles/components/menu/Menu';
import eyeIcon from '../../assets/EYE.svg';
import heartIcon from '../../assets/LIKE.svg';
import commentIcon from '../../assets/COMMENT.svg';
import './ArticlesManagement.scss';
import Swal from 'sweetalert2';
export const ArticlesManagementPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success] = useState('');

    const handleNavigation = (path) => {
        navigate(path);
    };

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/articles');
            const data = await response.json();

            if (response.ok) {
                setArticles(data);
            } else {
                setError(data.message || 'Błąd podczas pobierania artykułów');
            }
        } catch (error) {
            console.error('Błąd:', error);
            setError('Błąd połączenia z serwerem');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (articleId) => {
        if (!token) {
            navigate('/login');
            return;
        }

        const result = await Swal.fire({
            title: 'Czy na pewno?',
            text: "Czy na pewno chcesz usunąć ten artykuł? Zostaną usunięte także wszystkie powiązane obrazy.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#CE0A0A',
            cancelButtonColor: '#4B4B4B',
            confirmButtonText: 'Tak, usuń',
            cancelButtonText: 'Anuluj'
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                const response = await fetch(`https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/articles/${articleId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    await Swal.fire(
                        'Usunięto!',
                        'Artykuł został pomyślnie usunięty.',
                        'success'
                    );
                    fetchArticles();
                } else {
                    Swal.fire(
                        'Błąd!',
                        data.message || 'Błąd podczas usuwania artykułu',
                        'error'
                    );
                }
            } catch (error) {
                console.error('Błąd:', error);
                Swal.fire(
                    'Błąd połączenia',
                    'Nie udało się połączyć z serwerem.',
                    'error'
                );
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = (articleId) => {
        navigate(`/article-creator/${articleId}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    return (
        <div className="admin">
            <div className="admin-page">
                <CleaMenu
                    onNavigate={handleNavigation}
                    currentPath={location.pathname}
                />

                <main className="articles-management">
                    <div className="articles-management__container">
                        <header className="articles-management__header">
                            <h1 className="articles-management__title">Zarządzanie Artykułami</h1>
                            <p className="articles-management__subtitle">Twórz, edytuj i zarządzaj artykułami na blogu</p>
                        </header>

                        {error && <div className="articles-management__message articles-management__message--error">{error}</div>}
                        {success && <div className="articles-management__message articles-management__message--success">{success}</div>}

                        <section className="articles-management__add-section">
                            <h2 className="articles-management__section-title">Dodaj nowy artykuł</h2>
                            <p className="articles-management__description">
                                Stwórz nowy artykuł używając kreatora. Dodaj tekst, obrazy, listy i nagłówki.
                            </p>
                            <button
                                onClick={() => navigate('/article-creator')}
                                className="articles-management__create-btn"
                            >
                                + Stwórz nowy artykuł
                            </button>
                        </section>

                        <section className="articles-management__list-section">
                            <h2 className="articles-management__section-title">Opublikowane artykuły ({articles.length})</h2>

                            {loading && (
                                <div className="articles-management__loading">
                                    <div className="articles-management__spinner"></div>
                                    <p>Ładowanie artykułów...</p>
                                </div>
                            )}

                            {!loading && articles.length === 0 && (
                                <div className="articles-management__empty">
                                    <h3 className="articles-management__empty-heading">Brak artykułów</h3>
                                    <p className="articles-management__empty-paragraph">Nie masz jeszcze żadnych artykułów. Stwórz pierwszy!</p>
                                    <button
                                        onClick={() => navigate('/article-creator')}
                                        className="articles-management__create-first-btn"
                                    >
                                        Stwórz pierwszy artykuł
                                    </button>
                                </div>
                            )}

                            {!loading && articles.length > 0 && (
                                <div className="articles-management__grid">
                                    {articles.map((article) => (
                                        <article key={article._id} className="article-card">
                                            <figure className="article-card__image-container">
                                                <img
                                                    src={article.coverImageData}
                                                    alt={article.title}
                                                    className="article-card__image"
                                                />
                                            </figure>
                                            <div className="article-card__content">
                                                <header className="article-card__header">
                                                    <h3 className="article-card__title">
                                                        {article.title}
                                                    </h3>
                                                    {article.category && (
                                                        <span className="article-card__category">
                                                            {article.category}
                                                        </span>
                                                    )}
                                                </header>

                                                <div className="article-card__meta">
                                                    <div className="article-card__meta-item">
                                                        <span className="article-card__meta-label">Autor:</span>
                                                        <span className="article-card__meta-value">
                                                            {article.author_id?.firstName} {article.author_id?.lastName}
                                                        </span>
                                                    </div>
                                                    <div className="article-card__meta-item">
                                                        <span className="article-card__meta-label">Data:</span>
                                                        <time className="article-card__meta-value">
                                                            {formatDate(article.createdAt)}
                                                        </time>
                                                    </div>
                                                </div>

                                                <div className="article-card__stats">
                                                    <div className="article-card__stat">
                                                        <img src={eyeIcon} alt="Wyświetlenia" className="admin-icon" />
                                                        <span className="article-card__stat-value">{article.views || 0}</span>
                                                    </div>
                                                    <div className="article-card__stat">
                                                        <img src={heartIcon} alt="Polubienia" className="admin-icon" />
                                                        <span className="article-card__stat-value">{article.likes || 0}</span>
                                                    </div>
                                                    <div className="article-card__stat">
                                                        <img src={commentIcon} alt="Komentarze" className="admin-icon" />
                                                        <span className="article-card__stat-value">{article.comments_count || 0}</span>
                                                    </div>
                                                </div>

                                                <div className="article-card__actions">
                                                    <button
                                                        onClick={() => handleEdit(article._id)}
                                                        className="article-card__action-btn article-card__action-btn--edit"
                                                    >
                                                        Edytuj
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(article._id)}
                                                        className="article-card__action-btn article-card__action-btn--delete"
                                                    >
                                                        Usuń
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};