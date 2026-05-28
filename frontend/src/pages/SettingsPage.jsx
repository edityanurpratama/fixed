import { useState, useRef } from 'react';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import api from '../api/axios';
import { User, Shield, Moon, Sun, Monitor, Bell, Lock, X, Camera, Check, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

const SettingsPage = () => {
    const { user, updateUser } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // Edit Profile Modal State
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [nama, setNama] = useState(user?.nama || '');
    const [email, setEmail] = useState(user?.email || '');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const fileInputRef = useRef(null);

    // Change Password Modal State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileError('');
        setProfileSuccess('');

        const formData = new FormData();
        formData.append('nama', nama);
        formData.append('email', email);
        if (file) {
            formData.append('foto', file);
        }

        try {
            const res = await api.put('/auth/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            updateUser(res.data.user);
            setProfileSuccess('Profil berhasil diperbarui!');
            setTimeout(() => {
                setShowProfileModal(false);
                setPreview(null);
                setFile(null);
            }, 1000);
        } catch (err) {
            console.error(err);
            setProfileError(err.response?.data?.message || 'Gagal memperbarui profil');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError('Password baru dan konfirmasi password tidak cocok');
            setPasswordLoading(false);
            return;
        }

        try {
            await api.put('/auth/change-password', {
                currentPassword,
                newPassword,
            });
            setPasswordSuccess('Password berhasil diubah!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                setShowPasswordModal(false);
            }, 1000);
        } catch (err) {
            console.error(err);
            setPasswordError(err.response?.data?.message || 'Gagal mengubah password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const openProfileModal = () => {
        setNama(user?.nama || '');
        setEmail(user?.email || '');
        setPreview(null);
        setFile(null);
        setProfileError('');
        setProfileSuccess('');
        setShowProfileModal(true);
    };

    const openPasswordModal = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setPasswordSuccess('');
        setShowPasswordModal(true);
    };

    const avatarUrl = user?.foto ? `/uploads/${user.foto}` : null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your account preferences and system settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-sm">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={user?.nama}
                                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white dark:border-slate-800 shadow-xl"
                            />
                        ) : (
                            <div className="w-24 h-24 bg-blue-600/10 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-slate-800 shadow-xl font-bold text-xl">
                                {user?.nama?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.nama}</h2>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{user?.role}</p>
                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <Button variant="secondary" className="w-full text-xs rounded-2xl py-3" onClick={openProfileModal}>Edit Profile</Button>
                        </div>
                    </div>
                </div>

                {/* Settings Sections */}
                <div className="md:col-span-2 space-y-6">
                    {/* Appearance */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                <Monitor size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Appearance</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">Dark Mode</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Adjust the system's visual theme.</p>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-200'}`}
                                >
                                    <div className={`w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}>
                                        {theme === 'dark' ? <Moon size={14} className="text-blue-600" /> : <Sun size={14} className="text-amber-500" />}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg">
                                <Lock size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Security</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <Shield size={18} className="text-slate-400" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Account Role</span>
                                </div>
                                <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase">{user?.role} Access</span>
                            </div>
                            <Button variant="ghost" className="w-full text-left justify-start px-4 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800" onClick={openPasswordModal}>Change Password</Button>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                                <Bell size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Push notifications and alerts are managed at the system level.</p>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border-t-8 border-blue-600 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Edit Profil</h2>
                            <button onClick={() => setShowProfileModal(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-5">
                            {/* Avatar Picker */}
                            <div className="flex flex-col items-center gap-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/30" />
                                    ) : avatarUrl ? (
                                        <img src={avatarUrl} alt={user?.nama} className="w-24 h-24 rounded-full object-cover border-4 border-slate-200 dark:border-slate-800" />
                                    ) : (
                                        <div className="w-24 h-24 bg-blue-600/10 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center border-4 border-slate-200 dark:border-slate-800 font-bold text-xl">
                                            {user?.nama?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={20} className="text-white" />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                                >
                                    Pilih Foto Profil
                                </button>
                            </div>

                            <Input
                                label="Nama"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                required
                            />

                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            {profileError && (
                                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold rounded-xl">
                                    <AlertCircle size={14} />
                                    <span>{profileError}</span>
                                </div>
                            )}

                            {profileSuccess && (
                                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold rounded-xl">
                                    <Check size={14} />
                                    <span>{profileSuccess}</span>
                                </div>
                            )}

                            <div className="flex gap-4 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setShowProfileModal(false)} className="flex-1 rounded-2xl py-4">Batal</Button>
                                <Button type="submit" className="flex-1 rounded-2xl py-4 shadow-xl shadow-blue-500/20" loading={profileLoading}>
                                    {profileLoading ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border-t-8 border-blue-600 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Ganti Password</h2>
                            <button onClick={() => setShowPasswordModal(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-5">
                            <Input
                                label="Password Saat Ini"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />

                            <Input
                                label="Password Baru"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />

                            <Input
                                label="Konfirmasi Password Baru"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            {passwordError && (
                                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold rounded-xl">
                                    <AlertCircle size={14} />
                                    <span>{passwordError}</span>
                                </div>
                            )}

                            {passwordSuccess && (
                                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold rounded-xl">
                                    <Check size={14} />
                                    <span>{passwordSuccess}</span>
                                </div>
                            )}

                            <div className="flex gap-4 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setShowPasswordModal(false)} className="flex-1 rounded-2xl py-4">Batal</Button>
                                <Button type="submit" className="flex-1 rounded-2xl py-4 shadow-xl shadow-blue-500/20" loading={passwordLoading}>
                                    {passwordLoading ? 'Memproses...' : 'Ubah Password'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
