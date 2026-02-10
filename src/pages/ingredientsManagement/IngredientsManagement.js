import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CleaMenu from '../../styles/components/menu/Menu';
import AutocompleteInput from '../../styles/components/autocompleteInput/AutocompleteInput';
import SelectInput from '../../styles/components/selectInput/SelectInput';
import TextAreaInput from '../../styles/components/textAreaInput/TextAreaInput';
import FormActions from '../../styles/components/formActions/FormActions';
import TableActions from '../../styles/components/tableActions/TableActions';
import ConflictLevelBadge from '../../styles/components/conflictLevelBadge/ConflictLevelBadge';
import MultiValueInput from '../../styles/components/multiValueInput/MultiValueInput';
import './IngredientsManagement.scss';
import Swal from 'sweetalert2';

export const IngredientsManagementPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState(null);

    const API_URL = 'https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net';

    const [formData, setFormData] = useState({
        name: '',
        safetyLevel: 'bezpieczny',
        origin: 'naturalne',
        description: '',
        tags: []
    });

    const [tempTag, setTempTag] = useState('');

    const safetyOptions = [
        { value: 'bezpieczny', label: 'Bezpieczny' },
        { value: 'akceptowalny', label: 'Akceptowalny' },
        { value: 'lepiej unikać', label: 'Lepiej unikać' },
        { value: 'niebezpieczny', label: 'Niebezpieczny' }
    ];

    const originOptions = [
        { value: 'naturalne', label: 'Naturalne' },
        { value: 'syntetyczne', label: 'Syntetyczne' },
        { value: 'naturalne/syntetyczne', label: 'Naturalne/Syntetyczne' }
    ];

    const handleNavigation = (path) => navigate(path);

    const fetchIngredients = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch(`${API_URL}/api/ingredients`);
            const data = await response.json();

            if (response.ok) {
                setIngredients(data);
            } else {
                setError(data.message || 'Błąd podczas pobierania składników');
            }
        } catch (error) {
            setError('Błąd połączenia z serwerem');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (ingredient) => {
        setEditingId(ingredient._id);
        setFormData({
            name: ingredient.name,
            safetyLevel: ingredient.safetyLevel,
            origin: ingredient.origin,
            description: ingredient.description,
            tags: ingredient.tags || []
        });
        setError('');
        setSuccess('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({
            name: '',
            safetyLevel: 'bezpieczny',
            origin: 'naturalne',
            description: '',
            tags: []
        });
        setError('');
        setSuccess('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddTag = () => {
        const trimmedTag = tempTag.trim().toLowerCase();
        if (trimmedTag && !formData.tags.includes(trimmedTag)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
        }
        setTempTag('');
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setSuccess('');

        const isEditing = !!editingId;
        const url = isEditing ? `${API_URL}/api/ingredients/${editingId}` : `${API_URL}/api/ingredients`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            setLoading(true);
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess(isEditing ? 'Składnik zaktualizowany pomyślnie' : 'Składnik dodany pomyślnie');
                cancelEdit();
                fetchIngredients();
            } else {
                const data = await response.json();
                setError(data.message || 'Błąd zapisu');
            }
        } catch (error) {
            setError('Błąd połączenia');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Czy na pewno?',
            text: "Czy na pewno chcesz usunąć ten składnik?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#CE0A0A',
            cancelButtonColor: '#4B4B4B',
            confirmButtonText: 'Tak',
            cancelButtonText: 'Anuluj'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_URL}/api/ingredients/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    Swal.fire('Usunięto!', 'Składnik usunięty pomyślnie', 'success');
                    fetchIngredients();
                } else {
                    setError('Błąd podczas usuwania');
                }
            } catch (error) {
                setError('Błąd podczas usuwania składnika');
            }
        }
    };

    useEffect(() => {
        fetchIngredients();
    }, []);

    return (
        <div className="admin">
            <div className="admin-page">
                <CleaMenu onNavigate={handleNavigation} currentPath={location.pathname} />

                <main className="ingredients">
                    <div className="ingredients__container">
                        <header className="ingredients__header">
                            <h1 className="ingredients__title">Zarządzanie składnikami</h1>
                            <p className="ingredients__subtitle">
                                Strona poświęcona wygodnemu dodawaniu, usuwaniu oraz edycji składników produktów
                            </p>
                        </header>

                        {error && (
                            <div className="ingredients__message ingredients__message--error" role="alert">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="ingredients__message ingredients__message--success" role="status">
                                {success}
                            </div>
                        )}

                        <section className="ingredients__form-section">
                            <h2 className="ingredients__section-title">
                                {editingId ? 'Edytuj składnik' : 'Dodaj nowy składnik'}
                            </h2>
                            <form onSubmit={handleSubmit} className="ingredients__form">
                                <div className="ingredients__form-row">
                                    <AutocompleteInput
                                        id="name"
                                        name="name"
                                        label="Nazwa składnika"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="np. Kwas salicylowy"
                                        required
                                    />
                                    <SelectInput
                                        id="safetyLevel"
                                        name="safetyLevel"
                                        label="Poziom bezpieczeństwa"
                                        value={formData.safetyLevel}
                                        onChange={handleInputChange}
                                        options={safetyOptions}
                                        required
                                    />
                                    <SelectInput
                                        id="origin"
                                        name="origin"
                                        label="Pochodzenie"
                                        value={formData.origin}
                                        onChange={handleInputChange}
                                        options={originOptions}
                                        required
                                    />
                                </div>

                                <TextAreaInput
                                    id="description"
                                    name="description"
                                    label="Opis"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Opisz działanie..."
                                    required
                                />

                                <MultiValueInput
                                    id="ingredients-tags"
                                    label="Tagi i etykiety"
                                    values={formData.tags}
                                    tempValue={tempTag}
                                    onTempChange={setTempTag}
                                    onAdd={handleAddTag}
                                    onRemove={handleRemoveTag}
                                    placeholder="Wpisz tag i naciśnij Enter..."
                                />

                                <FormActions
                                    loading={loading}
                                    isEditing={!!editingId}
                                    onCancel={editingId ? cancelEdit : null}
                                    label={editingId ? 'Zaktualizuj składnik' : 'Dodaj składnik'}
                                    loadingLabel={editingId ? 'Zapisywanie...' : 'Dodawanie...'}
                                />
                            </form>
                        </section>

                        <section className="ingredients__list-section">
                            <h2 className="ingredients__section-title">
                                Lista składników ({ingredients.length})
                            </h2>

                            {loading && !editingId && (
                                <div className="ingredients__loading" aria-live="polite">
                                    Ładowanie...
                                </div>
                            )}

                            {!loading && ingredients.length === 0 && (
                                <div className="ingredients__empty">
                                    Brak składników w bazie danych
                                </div>
                            )}

                            {ingredients.length > 0 && (
                                <div className="ingredients__table">
                                    <div className="ingredients__table-header">
                                        <div className="ingredients__col-name">Nazwa</div>
                                        <div className="ingredients__col-safety">Bezpieczeństwo</div>
                                        <div className="ingredients__col-origin">Pochodzenie</div>
                                        <div className="ingredients__col-tags">Tagi</div>
                                        <div className="ingredients__col-description">Opis</div>
                                        <div className="ingredients__col-actions">Akcje</div>
                                    </div>

                                    {ingredients.map((ingredient) => (
                                        <article key={ingredient._id} className="ingredients__table-row">
                                            <div className="ingredients__col-name-elem" data-label="Nazwa">
                                                {ingredient.name}
                                            </div>
                                            <div className="ingredients__col-safety" data-label="Bezpieczeństwo">
                                                <ConflictLevelBadge level={ingredient.safetyLevel} />
                                            </div>
                                            <div className="ingredients__col-origin-elem" data-label="Pochodzenie">
                                                {ingredient.origin}
                                            </div>
                                            <div className="ingredients__col-tags" data-label="Tagi">
                                                {ingredient.tags && ingredient.tags.length > 0 ? (
                                                    <div className="ingredients__tags-display">
                                                        {ingredient.tags.map(t => (
                                                            <span key={t} className="ingredients__tag-item">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="ingredients__no-tags">Brak tagów</span>
                                                )}
                                            </div>
                                            <div className="ingredients__col-description-elem" data-label="Opis">
                                                {ingredient.description.length > 60
                                                    ? ingredient.description.substring(0, 60) + '...'
                                                    : ingredient.description}
                                            </div>
                                            <div className="ingredients__col-actions" data-label="Akcje">
                                                <TableActions
                                                    onEdit={() => handleEdit(ingredient)}
                                                    onDelete={() => handleDelete(ingredient._id)}
                                                    itemLabel={ingredient.name}
                                                    loading={loading}
                                                />
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