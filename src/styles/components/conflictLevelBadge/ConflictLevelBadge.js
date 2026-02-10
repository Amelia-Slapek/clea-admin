import React from 'react';
import PropTypes from 'prop-types';
import './ConflictLevelBadge.scss';

const ConflictLevelBadge = ({ level, className = '' }) => {
    const conflictConfig = {
        'lekki konflikt': {
            label: 'Lekki konflikt',
            color: '#FF9800',
            className: 'badge--light'
        },
        'silny konflikt': {
            label: 'Silny konflikt',
            color: '#FF5722',
            className: 'badge--strong'
        },
        'zakazany': {
            label: 'Zakazany',
            color: '#F44336',
            className: 'badge--forbidden'
        },
        'bezpieczny':
        {
            label: 'Bezpieczny',
            color: '#4CAF50',
            className: 'badge--safe'
        },
        'akceptowalny': {
            label: 'Akceptowalny',
            color: '#8BC34A',
            className: 'badge--acceptable'
        },
        'lepiej unikać': {
            label: 'Lepiej unikać',
            color: '#FF9800',
            className: 'badge--acceptable'
        },
        'niebezpieczny': {
            label: 'Niebezpieczny',
            color: '#F44336',
            className: 'badge--acceptable'
        }
    };

    const currentConfig = conflictConfig[level] || {
        label: level,
        color: '#9E9E9E',
        className: 'badge--default'
    };

    return (
        <span
            className={`conflict-level-badge ${currentConfig.className} ${className}`}
            style={{ backgroundColor: currentConfig.color }}
        >
            {currentConfig.label}
        </span>
    );
};

ConflictLevelBadge.propTypes = {
    level: PropTypes.string.isRequired,
    className: PropTypes.string
};

export default ConflictLevelBadge;