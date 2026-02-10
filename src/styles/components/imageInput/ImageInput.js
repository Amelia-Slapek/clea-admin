import React from 'react';
import PropTypes from 'prop-types';
import './ImageInput.scss';

const ImageInput = ({
    id,
    label,
    preview,
    onChange,
    onRemove,
    required = false,
    className = ''
}) => {
    return (
        <div className={`image-input-wrapper ${className}`}>
            {label && (
                <label className="input-label" htmlFor={!preview ? id : undefined}>
                    {label} {required && <span className="required-mark">*</span>}
                </label>
            )}

            <div className="image-container">
                {!preview ? (
                    <div className="upload-area">
                        <input
                            type="file"
                            id={id}
                            accept="image/*"
                            onChange={onChange}
                            className="file-input"
                            required={required}
                        />
                        <label htmlFor={id} className="file-label">
                            <span>Kliknij aby dodać zdjęcie</span>
                        </label>
                    </div>
                ) : (
                    <div className="preview-container">
                        <img
                            src={preview}
                            alt="Podgląd"
                            className="preview-image"
                        />
                        <button
                            type="button"
                            onClick={onRemove}
                            className="remove-btn"
                            aria-label="Usuń zdjęcie"
                        >
                            ✕ Usuń zdjęcie
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

ImageInput.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    preview: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    required: PropTypes.bool,
    className: PropTypes.string
};

export default ImageInput;