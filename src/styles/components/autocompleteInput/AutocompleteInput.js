import React from 'react';
import PropTypes from 'prop-types';
import './AutocompleteInput.scss';

const AutocompleteInput = ({
    id,
    name,
    label,
    value,
    onChange,
    options = [],
    placeholder = '',
    required = false,
    disabled = false,
    className = ''
}) => {
    const dataListId = `list-${id}`;
    const hasOptions = options && options.length > 0;

    return (
        <div className={`autocomplete-input-wrapper ${className}`}>
            {label && (
                <label htmlFor={id} className="input-label">
                    {label} {required && <span className="required-mark">*</span>}
                </label>
            )}

            <input
                type="text"
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                list={hasOptions ? dataListId : undefined}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                autoComplete="off"
                className="form-control"
            />

            {hasOptions && (
                <datalist id={dataListId}>
                    {options.map((option, index) => (
                        <option key={`${option}-${index}`} value={option} />
                    ))}
                </datalist>
            )}
        </div>
    );
};

AutocompleteInput.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string
};

export default AutocompleteInput;