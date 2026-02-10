import React from 'react';
import PropTypes from 'prop-types';
import './TableActions.scss';

const TableActions = ({
    onEdit,
    onDelete,
    itemLabel = '',
    loading = false,
    disabled = false,
    editLabel = 'Edytuj',
    deleteLabel = 'Usuń',

    className = ''
}) => {
    const isInteractionDisabled = loading || disabled;

    return (
        <div className={`table-actions-wrapper ${className}`}>
            <button
                type="button"
                onClick={onEdit}
                className="table-btn edit-btn"
                disabled={isInteractionDisabled}
                aria-label={`Edytuj ${itemLabel}`}
            >
                {editLabel}
            </button>

            <button
                type="button"
                onClick={onDelete}
                className="table-btn delete-btn"
                disabled={isInteractionDisabled}
                aria-label={`Usuń ${itemLabel}`}
            >
                {deleteLabel}
            </button>
        </div>
    );
};

TableActions.propTypes = {
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    itemLabel: PropTypes.string,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    editLabel: PropTypes.string,
    deleteLabel: PropTypes.string,
    className: PropTypes.string
};

export default TableActions;