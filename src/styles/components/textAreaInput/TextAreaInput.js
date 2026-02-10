import React from 'react';
import PropTypes from 'prop-types';
import './TextAreaInput.scss';

const TextAreaInput = ({
    id,
    name,
    label,
    value,
    onChange,
    placeholder = '',
    rows = 3,
    required = false,
    disabled = false,
    className = ''
}) => {
    return (
        <div className={`textarea-input-wrapper ${className}`}>
            {label && (
                <label htmlFor={id} className="input-label">
                    {label} {required && <span className="required-mark">*</span>}
                </label>
            )}
            <textarea
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                required={required}
                disabled={disabled}
                className="form-control"
            />
        </div>
    );
};

TextAreaInput.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string
};

export default TextAreaInput;