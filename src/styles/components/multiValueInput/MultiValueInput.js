import React from 'react';
import PropTypes from 'prop-types';
import './MultiValueInput.scss';

const MultiValueInput = ({
    id,
    label,
    values = [],
    tempValue,
    onTempChange,
    onAdd,
    onRemove,
    placeholder = 'Dodaj nową wartość...',
    className = '',
    disabled = false
}) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onAdd();
        }
    };

    return (
        <div className={`multi-value-input ${className}`}>
            {label && (
                <label htmlFor={id} className="multi-value-input__label">
                    {label}
                </label>
            )}

            <div className="multi-value-input__controls">
                <input
                    id={id}
                    type="text"
                    value={tempValue}
                    onChange={(e) => onTempChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="multi-value-input__field"
                    disabled={disabled}
                />
                <button
                    type="button"
                    onClick={onAdd}
                    className="multi-value-input__add-btn"
                    disabled={disabled || !tempValue.trim()}
                >
                    Dodaj
                </button>
            </div>

            {values.length > 0 && (
                <div className="multi-value-input__list">
                    {values.map((item, index) => (
                        <span key={`${item}-${index}`} className="multi-value-input__chip">
                            {item}
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => onRemove(item)}
                                    className="multi-value-input__remove-btn"
                                    aria-label={`Usuń ${item}`}
                                >
                                    ×
                                </button>
                            )}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

MultiValueInput.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    tempValue: PropTypes.string.isRequired,
    onTempChange: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool
};

export default MultiValueInput;