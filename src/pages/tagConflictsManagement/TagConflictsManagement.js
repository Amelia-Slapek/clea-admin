import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CleaMenu from '../../styles/components/menu/Menu';
import AutocompleteInput from '../../styles/components/autocompleteInput/AutocompleteInput';
import SelectInput from '../../styles/components/selectInput/SelectInput';
import TextAreaInput from '../../styles/components/textAreaInput/TextAreaInput';
import FormActions from '../../styles/components/formActions/FormActions';
import TableActions from '../../styles/components/tableActions/TableActions';
import ConflictLevelBadge from '../../styles/components/conflictLevelBadge/ConflictLevelBadge';
import './TagConflictsManagement.scss';
import Swal from 'sweetalert2';

export const TagConflictsManagementPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [conflicts, setConflicts] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingConflict, setEditingConflict] = useState(null);

    const API_URL = 'https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net';

    const [formData, setFormData] = useState({
        tag1: '',
        tag2: '',
        level: 'lekki konflikt',
        description: ''
    });

    const levelOptions = [
        { value: 'lekki konflikt', label: 'Lekki konflikt' },
        { value: 'silny konflikt', label: 'Silny konflikt' },
        { value: 'zakazany', label: 'Zakazany' }
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    const fetchConflicts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/tag-conflicts`);
            const data = await response.json();

            if (response.ok) {
                setConflicts(data);
            } else {
                setError(data.message || 'Błąd podczas pobierania konfliktów');
            }
        } catch (error) {
            setError('Błąd połączenia z serwerem');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableTags = async () => {
        try {
            const response = await fetch(`${API_URL}/api/ingredients/tags`);
            if (response.ok) {
                const tags = await response.json();
                setAvailableTags(tags);
            }
        } catch (error) {
            console.error('Błąd pobierania tagów:', error);
        }
    };

    const handleDelete = async (conflictId) => {
        const result = await Swal.fire({
            title: 'Czy na pewno?',
            text: "Czy na pewno chcesz usunąć ten konflikt tagów?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#CE0A0A',
            cancelButtonColor: '#4B4B4B',
            confirmButtonText: 'Tak',
            cancelButtonText: 'Anuluj'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_URL}/api/tag-conflicts/${conflictId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    Swal.fire('Usunięto!', 'Konflikt został usunięty pomyślnie.', 'success');
                    fetchConflicts();
                } else {
                    const data = await response.json();
                    setError(data.message || 'Błąd podczas usuwania konfliktu');
                    Swal.fire('Błąd!', 'Nie udało się usunąć konfliktu.', 'error');
                }
            } catch (error) {
                setError('Błąd połączenia z serwerem');
                Swal.fire('Błąd!', 'Błąd połączenia z serwerem.', 'error');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (conflict) => {
        setEditingConflict(conflict);
        setFormData({
            tag1: conflict.tag1,
            tag2: conflict.tag2,
            level: conflict.level,
            description: conflict.description || ''
        });
        setError('');
        setSuccess('');
    };

    const cancelEdit = () => {
        setEditingConflict(null);
        setFormData({
            tag1: '',
            tag2: '',
            level: 'lekki konflikt',
            description: ''
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.tag1.trim() || !formData.tag2.trim()) {
            setError('Oba tagi są wymagane');
            return;
        }

        if (formData.tag1.toLowerCase().trim() === formData.tag2.toLowerCase().trim()) {
            setError('Nie można utworzyć konfliktu między identycznymi tagami');
            return;
        }

        try {
            setLoading(true);
            const url = editingConflict
                ? `${API_URL}/api/tag-conflicts/${editingConflict._id}`
                : `${API_URL}/api/tag-conflicts`;

            const method = editingConflict ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess(editingConflict ? 'Konflikt tagów zaktualizowany pomyślnie' : 'Konflikt tagów dodany pomyślnie');
                cancelEdit();
                fetchConflicts();
            } else {
                const data = await response.json();
                setError(data.message || 'Nie udało się zapisać konfliktu tagów');
            }
        } catch (error) {
            setError('Błąd połączenia z serwerem');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConflicts();
        fetchAvailableTags();
    }, []);

    return (
        <div className="admin">
            <div className="admin-page">
                <CleaMenu onNavigate={handleNavigation} currentPath={location.pathname} />

                <main className="tag-conflicts">
                    <div className="tag-conflicts__container">
                        <header className="tag-conflicts__header">
                            <h1 className="tag-conflicts__title">Zarządzanie konfliktami tagów</h1>
                            <p className="tag-conflicts__subtitle">
                                Strona poświęcona wygodnemu dodawaniu, usuwaniu oraz edycji konfliktów tagów pomiędzy produktami
                            </p>
                        </header>

                        {error && <div className="tag-conflicts__message tag-conflicts__message--error">{error}</div>}
                        {success && <div className="tag-conflicts__message tag-conflicts__message--success">{success}</div>}

                        <section className="tag-conflicts__form-section">
                            <h2 className="tag-conflicts__section-title">
                                {editingConflict ? 'Edytuj konflikt' : 'Dodaj nowy konflikt'}
                            </h2>
                            <form onSubmit={handleSubmit} className="tag-conflicts__form">
                                <div className="tag-conflicts__form-row">
                                    <AutocompleteInput
                                        id="tag1" name="tag1" label="Tag 1"
                                        value={formData.tag1} onChange={handleInputChange}
                                        options={availableTags} placeholder="np. retinoid" required
                                    />
                                    <AutocompleteInput
                                        id="tag2" name="tag2" label="Tag 2"
                                        value={formData.tag2} onChange={handleInputChange}
                                        options={availableTags} placeholder="np. kwas AHA" required
                                    />
                                    <SelectInput
                                        id="level" name="level" label="Poziom konfliktu"
                                        value={formData.level} onChange={handleInputChange}
                                        options={levelOptions} required placeholder="Wybierz poziom"
                                    />
                                </div>
                                <TextAreaInput
                                    id="description" name="description" label="Opis"
                                    value={formData.description} onChange={handleInputChange}
                                    placeholder="Opcjonalny opis konfliktu..." rows={3}
                                />
                                <FormActions
                                    loading={loading}
                                    isEditing={!!editingConflict}
                                    onCancel={editingConflict ? cancelEdit : null}
                                    label={editingConflict ? 'Zaktualizuj konflikt' : 'Dodaj konflikt'}
                                    loadingLabel={editingConflict ? 'Aktualizuję...' : 'Dodaję...'}
                                />
                            </form>
                        </section>

                        <section className="tag-conflicts__list-section">
                            <h2 className="tag-conflicts__section-title">Lista konfliktów ({conflicts.length})</h2>
                            {loading && <div className="tag-conflicts__loading">Ładowanie...</div>}
                            {!loading && conflicts.length === 0 && (
                                <div className="tag-conflicts__empty">Brak zdefiniowanych konfliktów</div>
                            )}
                            {!loading && conflicts.length > 0 && (
                                <div className="tag-conflicts__table">
                                    <div className="tag-conflicts__table-header">
                                        <div>Tag 1</div>
                                        <div>Tag 2</div>
                                        <div>Poziom konfliktu</div>
                                        <div>Opis</div>
                                        <div>Data utworzenia</div>
                                        <div>Akcje</div>
                                    </div>
                                    {conflicts.map((conflict) => (
                                        <article key={conflict._id} className="tag-conflicts__table-row">
                                            <div data-label="Tag 1"><span className="tag-conflicts__tag-badge">{conflict.tag1}</span></div>
                                            <div data-label="Tag 2"><span className="tag-conflicts__tag-badge">{conflict.tag2}</span></div>
                                            <div data-label="Poziom konfliktu">
                                                <ConflictLevelBadge level={conflict.level} />
                                            </div>
                                            <div className="tag-conflicts__col-description-elem" data-label="Opis">
                                                {conflict.description || <span className="tag-conflicts__no-description">Brak opisu</span>}
                                            </div>
                                            <div data-label="Data utworzenia">
                                                <time>{new Date(conflict.createdAt).toLocaleDateString('pl-PL')}</time>
                                            </div>
                                            <div data-label="Akcje">
                                                <TableActions
                                                    onEdit={() => handleEdit(conflict)}
                                                    onDelete={() => handleDelete(conflict._id)}
                                                    itemLabel={`konflikt ${conflict.tag1}/${conflict.tag2}`}
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