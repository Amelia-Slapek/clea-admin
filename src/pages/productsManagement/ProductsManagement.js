import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CleaMenu from '../../styles/components/menu/Menu';
import AutocompleteInput from '../../styles/components/autocompleteInput/AutocompleteInput';
import SelectInput from '../../styles/components/selectInput/SelectInput';
import TextAreaInput from '../../styles/components/textAreaInput/TextAreaInput';
import MultiValueInput from '../../styles/components/multiValueInput/MultiValueInput';
import ImageInput from '../../styles/components/imageInput/ImageInput';
import FormActions from '../../styles/components/formActions/FormActions';
import TableActions from '../../styles/components/tableActions/TableActions';
import './ProductsManagement.scss';
import Swal from 'sweetalert2';

export const ProductsManagementPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const KATEGORIE_PODKATEGORIE = {
        'Pielęgnacja twarzy': ['Krem do twarzy', 'Serum', 'Oczyszczanie', 'Tonizacja twarzy', 'Maska', 'Peeling', 'Krem pod oczy', 'Esencja', 'Olejek do twarzy'],
        'Makijaż': ['Podkład', 'Baza pod makijaż', 'Róż', 'Bronzer', 'Puder', 'Korektor', 'Cień do powiek', 'Tusz do rzęs', 'Pomadka'],
        'Ciało': ['Balsam do ciała', 'Peeling do ciała', 'Żel pod prysznic', 'Olejek do ciała', 'Mydło', 'Mleczko do ciała', 'Masło do ciała'],
        'Dłonie': ['Krem do rąk', 'Serum do rąk', 'Peeling do rąk', 'Maska do rąk', 'Odżywka do paznokci'],
        'Stopy': ['Krem do stóp', 'Peeling do stóp', 'Maska do stóp', 'Dezodorant do stóp', 'Serum do stóp'],
        'Włosy': ['Szampon', 'Odżywka do włosów', 'Maska do włosów', 'Serum do włosów', 'Olejek do włosów', 'Peeling skóry głowy', 'Tonik do włosów', 'Lakier do włosów', 'Pianka do włosów']
    };

    const typySkory = ['normalna', 'sucha', 'tłusta', 'mieszana', 'wrażliwa', 'dojrzała', 'problematyczna'];

    const [products, setProducts] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        subcategory: '',
        skinType: [],
        purpose: '',
        description: '',
        imageBase64: '',
        ingredients: []
    });

    const [imagePreview, setImagePreview] = useState('');
    const [currentIngredientInput, setCurrentIngredientInput] = useState('');
    const [availableSubcategories, setAvailableSubcategories] = useState([]);

    const kategorieOptions = Object.keys(KATEGORIE_PODKATEGORIE).map(kat => ({ value: kat, label: kat }));
    const przeznaczenieOptions = [
        { value: 'na dzień', label: 'na dzień' },
        { value: 'na noc', label: 'na noc' },
        { value: 'cały dzień', label: 'cały dzień' }
    ];

    const handleNavigation = (path) => navigate(path);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/products');
            const data = await response.json();
            if (response.ok) {
                setProducts(data);
            } else {
                setError('Błąd podczas pobierania produktów');
            }
        } catch (error) {
            setError('Błąd połączenia z serwerem');
        } finally {
            setLoading(false);
        }
    };

    const fetchIngredients = async () => {
        try {
            const response = await fetch('https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/ingredients');
            const data = await response.json();
            if (response.ok) {
                setAllIngredients(data);
            }
        } catch (error) {
            console.error('Błąd pobierania składników:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchIngredients();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
            setFormData(prev => ({ ...prev, [name]: value, subcategory: '' }));
            setAvailableSubcategories(KATEGORIE_PODKATEGORIE[value] || []);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTypSkoryChange = (typ, checked) => {
        setFormData(prev => ({
            ...prev,
            skinType: checked
                ? [...prev.skinType, typ]
                : prev.skinType.filter(t => t !== typ)
        }));
    };

    const addIngredient = () => {
        if (!currentIngredientInput.trim()) return;

        const cleanInput = currentIngredientInput.trim().toLowerCase();

        const existingIngredient = allIngredients.find(ing =>
            ing.name.toLowerCase() === cleanInput
        );

        if (!existingIngredient) {
            alert('Błąd: Możesz dodać tylko składnik, który istnieje w bazie danych składników.');
            return;
        }

        const alreadyAdded = formData.ingredients.some(ing => ing._id === existingIngredient._id);
        if (alreadyAdded) {
            setCurrentIngredientInput('');
            return;
        }

        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { _id: existingIngredient._id, name: existingIngredient.name }]
        }));
        setCurrentIngredientInput('');
    };

    const removeIngredient = (nameToRemove) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter(i => i.name !== nameToRemove)
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            setImagePreview(base64);
            setFormData(prev => ({ ...prev, imageBase64: base64 }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImagePreview('');
        setFormData(prev => ({ ...prev, imageBase64: '' }));
    };

    const resetForm = () => {
        setFormData({
            name: '', brand: '', category: '', subcategory: '',
            skinType: [], purpose: '', description: '',
            imageBase64: '', ingredients: []
        });
        setEditingProduct(null);
        setAvailableSubcategories([]);
        setImagePreview('');
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setSuccess('');
        if (!formData.name) return setError('Nazwa produktu jest wymagana.');
        if (!formData.brand) return setError('Marka jest wymagana.');
        if (!formData.category) return setError('Kategoria jest wymagana.');
        if (!formData.subcategory) return setError('Podkategoria jest wymagana.');
        if (!formData.purpose) return setError('Przeznaczenie jest wymagane.');

        if (formData.ingredients.length < 2) {
            return setError('Produkt musi zawierać co najmniej dwa składniki.');
        }

        try {
            setLoading(true);
            const dataToSend = {
                ...formData,
                ingredients: formData.ingredients.map(ing => ing._id)
            };

            const url = editingProduct
                ? `https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/products/${editingProduct._id}`
                : 'https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/products';

            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                setSuccess(editingProduct ? 'Produkt zaktualizowany pomyślnie' : 'Produkt dodany pomyślnie');
                resetForm();
                fetchProducts();
            } else {
                const data = await response.json();
                setError(data.message || 'Błąd zapisu');
            }
        } catch (error) {
            setError('Błąd połączenia z serwerem');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name || '',
            brand: product.brand || '',
            category: product.category || '',
            subcategory: product.subcategory || '',
            skinType: product.skinType || [],
            purpose: product.purpose || '',
            description: product.description || '',
            imageBase64: product.imageData || '',
            ingredients: product.ingredients ? product.ingredients.map(i => ({ _id: i._id, name: i.name })) : []
        });
        setImagePreview(product.imageData || '');
        setAvailableSubcategories(KATEGORIE_PODKATEGORIE[product.category] || []);
        setEditingProduct(product);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Czy na pewno?',
            text: "Czy na pewno chcesz usunąć ten produkt?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#CE0A0A',
            cancelButtonColor: '#4B4B4B',
            confirmButtonText: 'Tak',
            cancelButtonText: 'Anuluj'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/products/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    Swal.fire('Usunięto!', 'Produkt usunięty pomyślnie', 'success');
                    fetchProducts();
                } else {
                    setError('Błąd podczas usuwania');
                }
            } catch (error) {
                setError('Błąd podczas usuwania produktu');
            }
        }
    };

    return (
        <div className="admin">
            <div className="admin-page">
                <CleaMenu onNavigate={handleNavigation} currentPath={location.pathname} />

                <main className="products">
                    <div className="products__container">
                        <header className="products__header">
                            <h1 className="products__title">Zarządzanie produktami</h1>
                            <p className="products__subtitle">
                                Dodawaj, edytuj i usuwaj produkty (baza zaktualizowana do j. angielskiego)
                            </p>
                        </header>

                        {error && (
                            <div className="products__message products__message--error" role="alert">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="products__message products__message--success" role="status">
                                {success}
                            </div>
                        )}

                        <section className="products__form-section">
                            <h2 className="products__section-title">
                                {editingProduct ? 'Edytuj produkt' : 'Dodaj nowy produkt'}
                            </h2>
                            <form onSubmit={handleSubmit} className="products__form">
                                <div className="products__form-row">
                                    <AutocompleteInput
                                        id="name"
                                        name="name"
                                        label="Nazwa produktu"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="np. Serum rozjaśniające"
                                        required
                                    />
                                    <AutocompleteInput
                                        id="brand"
                                        name="brand"
                                        label="Marka"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        placeholder="np. SkinX"
                                        required
                                    />
                                </div>

                                <div className="products__form-row">
                                    <SelectInput
                                        id="category"
                                        name="category"
                                        label="Kategoria"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        options={kategorieOptions}
                                        required
                                        placeholder="Wybierz kategorię"
                                    />
                                    <SelectInput
                                        id="subcategory"
                                        name="subcategory"
                                        label="Podkategoria"
                                        value={formData.subcategory}
                                        onChange={handleInputChange}
                                        options={availableSubcategories.map(pod => ({ value: pod, label: pod }))}
                                        placeholder="Najpierw wybierz kategorię"
                                        disabled={!formData.category}
                                        required
                                    />
                                    <SelectInput
                                        id="purpose"
                                        name="purpose"
                                        label="Przeznaczenie"
                                        value={formData.purpose}
                                        onChange={handleInputChange}
                                        options={przeznaczenieOptions}
                                        placeholder="Wybierz przeznaczenie"
                                        required
                                    />
                                </div>

                                <TextAreaInput
                                    id="description"
                                    name="description"
                                    label="Opis produktu"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Opisz działanie produktu..."
                                    rows={4}
                                />

                                <ImageInput
                                    id="zdjecie"
                                    label="Zdjęcie produktu"
                                    preview={imagePreview}
                                    onChange={handleImageChange}
                                    onRemove={handleRemoveImage}
                                />

                                <fieldset className="products__skin-type-group">
                                    <legend className="products__skin-type-legend">Typy skóry</legend>
                                    <div className="products__checkbox-grid">
                                        {typySkory.map(typ => (
                                            <label key={typ} className="products__checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.skinType.includes(typ)}
                                                    onChange={(e) => handleTypSkoryChange(typ, e.target.checked)}
                                                    className="products__checkbox"
                                                />
                                                <span className="products__checkbox-text">{typ}</span>
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>

                                <MultiValueInput
                                    id="ingredients"
                                    label="Składniki (musi istnieć w bazie, min. 2)"
                                    values={formData.ingredients.map(s => s.name)}
                                    tempValue={currentIngredientInput}
                                    onTempChange={setCurrentIngredientInput}
                                    onAdd={addIngredient}
                                    onRemove={removeIngredient}
                                    placeholder="Wpisz nazwę i Enter"
                                />

                                <FormActions
                                    loading={loading}
                                    isEditing={!!editingProduct}
                                    onCancel={editingProduct ? resetForm : null}
                                    label={editingProduct ? 'Zaktualizuj produkt' : 'Dodaj produkt'}
                                    loadingLabel={editingProduct ? 'Aktualizuję...' : 'Dodaję...'}
                                    cancelLabel="Anuluj"
                                />
                            </form>
                        </section>

                        <section className="products__list-section">
                            <h2 className="products__section-title">
                                Lista produktów ({products.length})
                            </h2>

                            {loading && (
                                <div className="products__loading" aria-live="polite">
                                    Ładowanie produktów...
                                </div>
                            )}

                            {!loading && products.length === 0 && (
                                <div className="products__empty">
                                    Brak produktów w bazie danych
                                </div>
                            )}

                            {!loading && products.length > 0 && (
                                <div className="products__grid">
                                    {products.map((product) => (
                                        <article key={product._id} className="products__card">
                                            {product.imageData && (
                                                <div className="products__card-image">
                                                    <img
                                                        src={product.imageData}
                                                        alt={product.name}
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                </div>
                                            )}

                                            <div className="products__card-content">
                                                <h3 className="products__card-name">{product.name}</h3>

                                                {product.brand && (
                                                    <p className="products__card-detail">
                                                        <strong>Marka:</strong> {product.brand}
                                                    </p>
                                                )}

                                                {product.category && (
                                                    <p className="products__card-detail">
                                                        <strong>Kategoria:</strong> {product.category}
                                                    </p>
                                                )}

                                                {product.subcategory && (
                                                    <p className="products__card-detail">
                                                        <strong>Podkategoria:</strong> {product.subcategory}
                                                    </p>
                                                )}

                                                {product.purpose && (
                                                    <p className="products__card-detail">
                                                        <strong>Przeznaczenie:</strong> {product.purpose}
                                                    </p>
                                                )}

                                                {product.description && (
                                                    <div className="products__card-description">
                                                        <strong>Opis:</strong>
                                                        <p>
                                                            {product.description.length > 150
                                                                ? `${product.description.substring(0, 150)}...`
                                                                : product.description}
                                                        </p>
                                                    </div>
                                                )}

                                                {product.skinType && product.skinType.length > 0 && (
                                                    <div className="products__card-skin-types">
                                                        <strong>Typy skóry:</strong>
                                                        <div className="products__skin-tags">
                                                            {product.skinType.map((typ, index) => (
                                                                <span key={index} className="products__skin-tag">
                                                                    {typ}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {product.ingredients && product.ingredients.length > 0 && (
                                                    <div className="products__card-ingredients">
                                                        <strong>Składniki ({product.ingredients.length}):</strong>
                                                        <div className="products__ingredient-list">
                                                            {product.ingredients.slice(0, 5).map((skladnik, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="products__ingredient-item products__ingredient-item--verified"
                                                                >
                                                                    {skladnik.name}
                                                                </span>
                                                            ))}
                                                            {product.ingredients.length > 5 && (
                                                                <span className="products__more-ingredients">
                                                                    +{product.ingredients.length - 5} więcej
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {product.rating !== undefined && (
                                                    <div className="products__card-rating">
                                                        <strong>Ocena:</strong> {product.rating || 0}/5
                                                    </div>
                                                )}
                                            </div>

                                            <div className="products__card-actions">
                                                <TableActions
                                                    onEdit={() => handleEdit(product)}
                                                    onDelete={() => handleDelete(product._id)}
                                                    itemLabel={product.name}
                                                    loading={loading}
                                                    editLabel="Edytuj"
                                                    deleteLabel="Usuń"
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