import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/Input';
import Button from '../components/Button';
import { Shield, KeySquare, CheckCircle2 } from 'lucide-react';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // In a real app, you'd get the email from a token in the URL. 
    // Here we'll simulate it by checking if it was passed in the state or just asking for it again if needed.
    // For this demo, let's assume we know the email or just let the user type it.
    const [email, setEmail] = useState(location.state?.email || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/auth/reset-password', { email, newPassword: password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 transition-colors duration-500">
                <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="inline-flex p-6 bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 rounded-[2.5rem] mb-2">
                        <CheckCircle2 size={64} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Password Reset!</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Your password has been updated successfully. Redirecting you to login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 transition-colors duration-500">
            <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-blue-600 rounded-3xl text-white shadow-2xl shadow-blue-500/30 mb-6">
                        <Shield size={40} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Set New Password</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Enter your new secure credentials</p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-xl dark:shadow-2xl transition-colors">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-2xl font-bold">
                                {error}
                            </div>
                        )}

                        {!location.state?.email && (
                            <Input
                                label="Confirm Your Email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        )}

                        <Input
                            label="New Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Input
                            label="Confirm New Password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <Button type="submit" className="w-full h-12 flex items-center justify-center gap-2" loading={loading}>
                            <KeySquare size={18} /> {loading ? 'Updating Password...' : 'Reset Password'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
