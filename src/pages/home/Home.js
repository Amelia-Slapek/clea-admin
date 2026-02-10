import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import CleaMenu from '../../styles/components/menu/Menu';
import "./Home.scss";

export const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const adminModules = [
        {
            title: "Artykuły",
            description: "Twórz, edytuj i publikuj treści na bloga. Zarządzaj zdjęciami i kategoriami wpisów.",
            path: "/articles-management",
            actionText: "Zarządzaj artykułami"
        },
        {
            title: "Produkty",
            description: "Przeglądaj i edytuj bazę produktów kosmetycznych dostępnych w aplikacji.",
            path: "/productsManagement",
            actionText: "Zarządzaj produktami"
        },
        {
            title: "Składniki",
            description: "Aktualizuj bazę składników INCI, dodawaj opisy i określaj ich funkcje.",
            path: "/ingredientsManagement",
            actionText: "Zarządzaj składnikami"
        },
        {
            title: "Konflikty Tagów",
            description: "Dodawaj konflikty pomiędzy tagami i określaj ich poziom bezpieczeństwa.",
            path: "/tagConflictsManagement",
            actionText: "Zarządzaj konfliktami"
        }
    ];

    return (
        <div className="admin">
            <div className="admin-page">
                <CleaMenu
                    onNavigate={handleNavigation}
                    currentPath={location.pathname}
                />

                <main className="dashboard">
                    <div className="dashboard__container">
                        <header className="dashboard__header">
                            <h1 className="dashboard__title">Panel Administracyjny Clea</h1>
                            <p className="dashboard__subtitle">
                                Witaj w centrum zarządzania treścią. Wybierz moduł, aby rozpocząć pracę nad bazą danych.
                            </p>
                        </header>

                        <section className="dashboard__grid">
                            {adminModules.map((module, index) => (
                                <div key={index} className="dashboard-card" onClick={() => handleNavigation(module.path)}>
                                    <div className="dashboard-card__content">
                                        <h2 className="dashboard-card__title">{module.title}</h2>
                                        <p className="dashboard-card__description">{module.description}</p>
                                    </div>
                                    <div className="dashboard-card__footer">
                                        <button
                                            className="dashboard-card__button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNavigation(module.path);
                                            }}
                                        >
                                            {module.actionText}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};