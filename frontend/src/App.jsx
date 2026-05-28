import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import { ThemeProvider } from './store/ThemeContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HazardPage from './pages/HazardPage';
import IncidentPage from './pages/IncidentPage';
import AuditPage from './pages/AuditPage';
import CorrectiveActionPage from './pages/CorrectiveActionPage';
import CertificationPage from './pages/CertificationPage';
import WorkPermitPage from './pages/WorkPermitPage';
import EmergencyPage from './pages/EmergencyPage';
import DashboardLayout from './layouts/DashboardLayout';


import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import GamificationPage from './pages/GamificationPage';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center transition-colors duration-500">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );
    if (!user) return <Navigate to="/login" />;
    return children;
};


function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>

                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />

                        <Route path="/" element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <DashboardPage />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/hazards" element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <HazardPage />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/incidents" element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <IncidentPage />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/audits" element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <AuditPage />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/corrective-actions" element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <CorrectiveActionPage />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />
                        {/* legacy alias */}
                        <Route path="/actions" element={<Navigate to="/corrective-actions" />} />
                        <Route path="/permits" element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <WorkPermitPage />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/certifications" element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <CertificationPage />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/emergency" element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <EmergencyPage />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <SettingsPage />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/users" element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <UsersPage />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/gamification" element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <GamificationPage />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />
                        {/* Default Route */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
