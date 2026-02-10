import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './SelectInput.scss';

const ArrowIcon = ({ className }) => (
    <svg
        className={className}
        width="14"
        height="9"
        viewBox="0 0 14 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M1 1L7 7L13 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const SelectInput = ({
    id,
    name,
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Wybierz...',
    required = false,
    disabled = false,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOpen = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleSelect = (optionValue) => {
        const fakeEvent = {
            target: {
                name: name,
                value: optionValue
            }
        };
        onChange(fakeEvent);
        setIsOpen(false);
    };

    return (
        <div
            className={`select-input-wrapper ${className} ${disabled ? 'disabled' : ''}`}
            ref={wrapperRef}
        >
            {label && (
                <label htmlFor={id} className="input-label">
                    {label} {required && <span className="required-mark">*</span>}
                </label>
            )}

            <div
                className={`select-trigger ${isOpen ? 'open' : ''}`}
                onClick={toggleOpen}
                id={id}
            >
                <span className={`select-value ${!selectedOption ? 'placeholder' : ''}`}>
                    {displayValue}
                </span>
                <ArrowIcon className={`arrow-icon ${isOpen ? 'rotated' : ''}`} />
            </div>

            {isOpen && (
                <div className="select-options-list">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`select-option ${value === option.value ? 'selected' : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

SelectInput.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })
    ).isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string
};

export default SelectInput;