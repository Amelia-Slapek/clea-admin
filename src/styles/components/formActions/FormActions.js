import React from 'react';
import PropTypes from 'prop-types';
import './FormActions.scss';

const FormActions = ({
    label = 'Zapisz',
    loadingLabel = 'Zapisywanie...',
    cancelLabel = 'Anuluj',
    loading = false,
    disabled = false,
    isEditing = false,
    onSubmit,
    onCancel,
    className = '',
    centered = false
}) => {
    const buttonText = loading ? loadingLabel : label;
    const isButtonDisabled = loading || disabled;

    return (
        <div className={`form-actions-wrapper ${centered ? 'centered' : ''} ${className}`}>
            <button
                type={onSubmit ? 'button' : 'submit'}
                onClick={onSubmit}
                className="action-btn submit-btn"
                disabled={isButtonDisabled}
            >
                {buttonText}
            </button>
            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="action-btn cancel-btn"
                    disabled={loading}
                >
                    {isEditing ? 'Anuluj edycję' : cancelLabel}
                </button>
            )}
        </div>
    );
};

FormActions.propTypes = {
    label: PropTypes.string,
    loadingLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    isEditing: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    className: PropTypes.string,
    centered: PropTypes.bool
};

export default FormActions;