import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CleaMenu from '../../styles/components/menu/Menu';
import SelectInput from '../../styles/components/selectInput/SelectInput';
import ImageInput from '../../styles/components/imageInput/ImageInput';
import './ArticleCreator.scss';
import minusIcon from '../../assets/MINUS.svg';

export const ArticleCreatorPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const { user, token } = useAuth();

    const [isEditMode, setIsEditMode] = useState(false);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState('');
    const [blocks, setBlocks] = useState([]);

    const [selectedBlockType, setSelectedBlockType] = useState('');
    const [blockContent, setBlockContent] = useState({
        heading: '',
        paragraph: '',
        listItems: [''],
        imageBase64: '',
        altText: ''
    });
    const [blockImagePreview, setBlockImagePreview] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const categories = ['Analiza', 'Bezpieczeństwo', 'Trendy', 'Recenzje'];

    const categoryOptions = categories.map(cat => ({
        value: cat,
        label: cat
    }));
    const blockTypeOptions = [
        { value: 'heading', label: 'Nagłówek' },
        { value: 'paragraph', label: 'Paragraf' },
        { value: 'list', label: 'Lista' },
        { value: 'image', label: 'Obraz' }
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    useEffect(() => {
        if (!id) return;

        const loadArticleForEdit = async (articleId) => {
            try {
                setLoading(true);
                const response = await fetch(`https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/articles/${articleId}`);
                const data = await response.json();

                if (response.ok) {
                    setTitle(data.title);
                    setCategory(data.category || '');
                    setCoverImage(data.coverImageData);
                    setCoverImagePreview(data.coverImageData);

                    const processedBlocks = data.blocks.map((block, index) => {
                        let content = block.content;
                        if (block.type === 'image' && block.content.imageData) {
                            content = {
                                imageBase64: block.content.imageData,
                                altText: block.content.altText || ''
                            };
                        }
                        return { id: Date.now() + index, type: block.type, content };
                    });

                    setBlocks(processedBlocks);
                } else {
                    setError(data.message || 'Nie udało się załadować artykułu');
                    setTimeout(() => navigate('/articles-management'), 2000);
                }
            } catch (error) {
                console.error('Błąd:', error);
                setError('Błąd połączenia z serwerem');
                setTimeout(() => navigate('/articles-management'), 2000);
            } finally {
                setLoading(false);
            }
        };

        setIsEditMode(true);
        loadArticleForEdit(id);
    }, [id, navigate]);

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleCoverImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Nieprawidłowy format zdjęcia');
            return;
        }

        if (file.size > 1 * 1024 * 1024) {
            setError('Zdjęcie jest zbyt duże (max 1MB)');
            return;
        }

        try {
            const base64 = await convertFileToBase64(file);
            setCoverImage(base64);
            setCoverImagePreview(base64);
            setError('');
        } catch (error) {
            setError('Błąd wczytywania zdjęcia');
        }
    };

    const handleRemoveCoverImage = () => {
        setCoverImage(null);
        setCoverImagePreview('');
    };

    const handleBlockImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Nieprawidłowy format zdjęcia');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError('Zdjęcie jest zbyt duże (max 1MB)');
            return;
        }

        try {
            const base64 = await convertFileToBase64(file);
            setBlockContent(prev => ({
                ...prev,
                imageBase64: base64
            }));
            setBlockImagePreview(base64);
            setError('');
        } catch (error) {
            setError('Błąd wczytywania zdjęcia');
        }
    };

    const addListItem = () => {
        setBlockContent(prev => ({
            ...prev,
            listItems: [...prev.listItems, '']
        }));
    };

    const removeListItem = (index) => {
        setBlockContent(prev => ({
            ...prev,
            listItems: prev.listItems.filter((_, i) => i !== index)
        }));
    };

    const updateListItem = (index, value) => {
        setBlockContent(prev => ({
            ...prev,
            listItems: prev.listItems.map((item, i) => i === index ? value : item)
        }));
    };

    const addBlock = () => {
        if (!selectedBlockType) {
            setError('Wybierz typ elementu');
            return;
        }

        let content = null;

        switch (selectedBlockType) {
            case 'heading':
                if (!blockContent.heading.trim()) {
                    setError('Nagłówek nie może być pusty');
                    return;
                }
                content = blockContent.heading.trim();
                break;

            case 'paragraph':
                if (!blockContent.paragraph.trim()) {
                    setError('Paragraf nie może być pusty');
                    return;
                }
                content = blockContent.paragraph.trim();
                break;

            case 'list':
                const filteredItems = blockContent.listItems.filter(item => item.trim());
                if (filteredItems.length === 0) {
                    setError('Lista musi zawierać co najmniej jeden element');
                    return;
                }
                content = filteredItems;
                break;

            case 'image':
                if (!blockContent.imageBase64) {
                    setError('Dodaj zdjęcie');
                    return;
                }
                content = {
                    imageBase64: blockContent.imageBase64,
                    altText: blockContent.altText.trim()
                };
                break;

            default:
                return;
        }

        const newBlock = {
            id: Date.now(),
            type: selectedBlockType,
            content: content
        };

        setBlocks([...blocks, newBlock]);

        setSelectedBlockType('');
        setBlockContent({
            heading: '',
            paragraph: '',
            listItems: [''],
            imageBase64: '',
            altText: ''
        });
        setBlockImagePreview('');
        setError('');
    };

    const removeBlock = (id) => {
        setBlocks(blocks.filter(block => block.id !== id));
    };

    const moveBlockUp = (index) => {
        if (index === 0) return;
        const newBlocks = [...blocks];
        [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
        setBlocks(newBlocks);
    };

    const moveBlockDown = (index) => {
        if (index === blocks.length - 1) return;
        const newBlocks = [...blocks];
        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        setBlocks(newBlocks);
    };

    const renderBlockContent = (block) => {
        switch (block.type) {
            case 'heading':
                return <h3 className="article-block__content-heading">{block.content}</h3>;
            case 'paragraph':
                return <p className="article-block__content-paragraph">{block.content}</p>;
            case 'list':
                return (
                    <ul>
                        {block.content.map((item, i) => (
                            <li className="article-block__content-list" key={i}>{item}</li>
                        ))}
                    </ul>
                );
            case 'image':
                return (
                    <div className="block-image-preview">
                        <img src={block.content.imageBase64} alt={block.content.altText} />
                        {block.content.altText && <p className="alt-text">{block.content.altText}</p>}
                    </div>
                );
            default:
                return null;
        }
    };

    const handleSaveArticle = async () => {
        if (!user || !token) {
            navigate('/login');
            return;
        }

        if (!title.trim()) {
            setError('Tytuł artykułu jest wymagany');
            return;
        }

        if (!category) {
            setError('Kategoria artykułu jest wymagana');
            return;
        }

        if (!coverImage) {
            setError('Zdjęcie główne artykułu jest wymagane');
            return;
        }

        if (blocks.length === 0) {
            setError('Artykuł musi zawierać co najmniej jeden blok');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const url = isEditMode
                ? `https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/articles/${id}`
                : 'https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/articles';

            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title.trim(),
                    category: category,
                    coverImageBase64: coverImage,
                    blocks: blocks.map(block => ({
                        type: block.type,
                        content: block.content
                    }))
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(isEditMode ? 'Artykuł zaktualizowany pomyślnie!' : 'Artykuł zapisany pomyślnie!');
                setTimeout(() => {
                    navigate('/articles-management');
                }, 2000);
            } else {
                setError(data.message || 'Błąd zapisywania artykułu');
            }
        } catch (error) {
            console.error('Błąd:', error);
            setError('Błąd połączenia z serwerem');
        } finally {
            setLoading(false);
        }
    };

    const blockTypeLabels = {
        'heading': 'Nagłówek',
        'paragraph': 'Paragraf',
        'list': 'Lista',
        'image': 'Obraz'
    };

    if (loading && isEditMode) {
        return (
            <div className="clea">
                <div className="clea-page">
                    <CleaMenu
                        onNavigate={handleNavigation}
                        currentPath={location.pathname}
                    />
                    <main className="article-creator">
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Ładowanie artykułu...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="admin">
            <div className="admin-page">
                <CleaMenu
                    onNavigate={handleNavigation}
                    currentPath={location.pathname}
                />

                <main className="article-creator">
                    <div className="article-creator__container">
                        <section className="article-creator__preview">
                            <h1 className="article-creator__title">
                                {isEditMode ? 'Edytuj Artykuł' : 'Kreator Artykułu'}
                            </h1>

                            <div className="article-creator__header">
                                <input
                                    type="text"
                                    placeholder="Tytuł artykułu *"
                                    className="article-creator__title-input"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />

                                <SelectInput
                                    id="article-category"
                                    name="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    options={categoryOptions}
                                    placeholder="Wybierz kategorię *"
                                    className="article-creator__category-select-wrapper"
                                />

                                <div className="article-creator__cover-upload">
                                    <ImageInput
                                        id="cover-image"
                                        label="Zdjęcie główne artykułu (max 1MB)"
                                        preview={coverImagePreview}
                                        onChange={handleCoverImageChange}
                                        onRemove={handleRemoveCoverImage}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="article-creator__blocks">
                                {blocks.length === 0 ? (
                                    <div className="article-creator__empty">
                                        <p>Dodaj elementy artykułu używając panelu po prawej stronie</p>
                                    </div>
                                ) : (
                                    blocks.map((block, index) => (
                                        <div key={block.id} className="article-block">
                                            <div className="article-block__header">
                                                <span className="article-block__type">
                                                    {blockTypeLabels[block.type]}
                                                </span>
                                                <div className="article-block__controls">
                                                    <button
                                                        onClick={() => moveBlockUp(index)}
                                                        disabled={index === 0}
                                                        className="control-btn"
                                                        title="Przesuń w górę"
                                                    >
                                                        ▲
                                                    </button>
                                                    <button
                                                        onClick={() => moveBlockDown(index)}
                                                        disabled={index === blocks.length - 1}
                                                        className="control-btn"
                                                        title="Przesuń w dół"
                                                    >
                                                        ▼
                                                    </button>
                                                    <button
                                                        onClick={() => removeBlock(block.id)}
                                                        className="control-btn control-btn--delete"
                                                        title="Usuń"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="article-block__content">
                                                {renderBlockContent(block)}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <section className="article-creator__panel">
                            <h2 className="article-creator__panel-title">Dodaj Element</h2>

                            {error && (
                                <div className="message message--error">{error}</div>
                            )}

                            {success && (
                                <div className="message message--success">{success}</div>
                            )}

                            <div className="form-group">
                                <SelectInput
                                    id="block-type-select"
                                    name="blockType"
                                    label="Typ elementu"
                                    value={selectedBlockType}
                                    onChange={(e) => setSelectedBlockType(e.target.value)}
                                    options={blockTypeOptions}
                                    placeholder="Wybierz element artykułu"
                                />
                            </div>

                            {selectedBlockType === 'heading' && (
                                <div className="form-group">
                                    <label>Treść nagłówka</label>
                                    <input
                                        type="text"
                                        placeholder="Wpisz nagłówek"
                                        className="form-input form-input--double"
                                        value={blockContent.heading}
                                        onChange={(e) => setBlockContent(prev => ({
                                            ...prev,
                                            heading: e.target.value
                                        }))}
                                    />
                                </div>
                            )}

                            {selectedBlockType === 'paragraph' && (
                                <div className="form-group">
                                    <label>Treść paragrafu</label>
                                    <textarea
                                        placeholder="Wpisz treść paragrafu"
                                        className="form-textarea"
                                        value={blockContent.paragraph}
                                        onChange={(e) => setBlockContent(prev => ({
                                            ...prev,
                                            paragraph: e.target.value
                                        }))}
                                        rows="8"
                                    />
                                </div>
                            )}

                            {selectedBlockType === 'list' && (
                                <div className="form-group">
                                    <label>Elementy listy</label>
                                    <div className="list-inputs">
                                        {blockContent.listItems.map((item, index) => (
                                            <div key={index} className="list-item-input">
                                                <input
                                                    type="text"
                                                    placeholder={`Pozycja ${index + 1}`}
                                                    className="form-input"
                                                    value={item}
                                                    onChange={(e) => updateListItem(index, e.target.value)}
                                                />
                                                {blockContent.listItems.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeListItem(index)}
                                                        className="icon-btn icon-btn--delete"
                                                    >
                                                        <img src={minusIcon} alt="Usuń" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addListItem}
                                            className="add-list-item-btn"
                                        >
                                            <span>Dodaj pozycję</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedBlockType === 'image' && (
                                <div className="form-group">
                                    <label>Obraz (max 1MB)</label>
                                    {!blockImagePreview ? (
                                        <>
                                            <input
                                                type="file"
                                                id="block-image"
                                                accept="image/*"
                                                onChange={handleBlockImageChange}
                                                className="file-input"
                                            />
                                            <label htmlFor="block-image" className="file-label file-label--small">
                                                <span>Dodaj zdjęcie</span>
                                            </label>
                                        </>
                                    ) : (
                                        <div className="image-preview-small">
                                            <img src={blockImagePreview} alt="Podgląd" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setBlockContent(prev => ({
                                                        ...prev,
                                                        imageBase64: ''
                                                    }));
                                                    setBlockImagePreview('');
                                                }}
                                                className="remove-image-btn-small"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                    <label>Tekst alternatywny</label>
                                    <input
                                        type="text"
                                        placeholder="Opis obrazu (dla czytników ekranowych)"
                                        className="form-input"
                                        value={blockContent.altText}
                                        onChange={(e) => setBlockContent(prev => ({
                                            ...prev,
                                            altText: e.target.value
                                        }))}
                                    />
                                </div>
                            )}

                            {selectedBlockType && (
                                <button
                                    onClick={addBlock}
                                    className="add-block-btn"
                                >
                                    <span>Dodaj element</span>
                                </button>
                            )}
                        </section>
                    </div>

                    <div className="article-creator__actions">
                        <button
                            onClick={handleSaveArticle}
                            className="save-article-btn"
                            disabled={loading || blocks.length === 0 || !coverImage || !title.trim() || !category}
                        >
                            {loading
                                ? 'Zapisywanie...'
                                : isEditMode
                                    ? 'Zapisz zmiany'
                                    : 'Zapisz artykuł'
                            }
                        </button>
                    </div>
                </main>
            </div >
        </div >
    );
};