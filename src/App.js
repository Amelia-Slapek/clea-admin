import { HomePage, LoginPage, RegistrationPage, IngredientsManagementPage, ProductsManagementPage, TagConflictsManagementPage, ArticlesManagementPage, ArticleCreatorPage, EmailVerificationPage, ResetPasswordPage, AccountPage } from './pages/pages.module';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import "./App.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/verify-email/:token" element={<EmailVerificationPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route
            exact path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ingredientsManagement"
            element={
              <ProtectedRoute>
                <IngredientsManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productsManagement"
            element={
              <ProtectedRoute>
                <ProductsManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tagConflictsManagement"
            element={
              <ProtectedRoute>
                <TagConflictsManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles-management"
            element={
              <ProtectedRoute>
                <ArticlesManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/article-creator"
            element={
              <ProtectedRoute>
                <ArticleCreatorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/article-creator/:id"
            element={
              <ProtectedRoute>
                <ArticleCreatorPage />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;