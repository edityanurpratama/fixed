import { useState } from 'react';
import { Trophy, Star, Zap, Award, Gift, TrendingUp, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../store/AuthContext';

const LEADERBOARD = [
    { rank: 1, name: 'Ahmad Fauzi', dept: 'Produksi', points: 1240, reports: 32, badge: 'Safety Champion' },
    { rank: 2, name: 'Dewi Rahayu', dept: 'Warehouse', points: 980, reports: 26, badge: 'Hazard Hunter' },
    { rank: 3, name: 'Budi Santoso', dept: 'Maintenance', points: 810, reports: 21, badge: 'Risk Ranger' },
    { rank: 4, name: 'Siti Aminah', dept: 'QC', points: 650, reports: 17, badge: '' },
    { rank: 5, name: 'Eko Prasetyo', dept: 'Engineering', points: 520, reports: 13, badge: '' },
];

const REWARDS = [
    { id: 1, title: 'Voucer Makan Siang', points: 200, icon: '🍱', available: true },
    { id: 2, title: 'Voucer Belanja Rp50K', points: 500, icon: '🛒', available: true },
    { id: 3, title: 'Hari Libur Tambahan', points: 1000, icon: '🏖️', available: false },
    { id: 4, title: 'Merchandise K3 Premium', points: 750, icon: '🎁', available: true },
];

const RANK_STYLES = {
    1: { border: 'border-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/10', icon: '🥇', nameColor: 'text-amber-600 dark:text-amber-400' },
    2: { border: 'border-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/30', icon: '🥈', nameColor: 'text-slate-600 dark:text-slate-300' },
    3: { border: 'border-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/10', icon: '🥉', nameColor: 'text-orange-600 dark:text-orange-400' },
};

const GamificationPage = () => {
    const { user } = useAuth();
    const [showRewards, setShowRewards] = useState(false);
    const myPoints = 520; // Simulated

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                        <Trophy size={28} className="text-amber-500" /> Safety Rewards
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Peroleh poin dari setiap laporan bahaya valid. Tukarkan dengan rewards eksklusif!</p>
                </div>
                <Button
                    className="rounded-2xl py-5 px-8 shadow-xl shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 w-full sm:w-auto"
                    onClick={() => setShowRewards(true)}
                >
                    <Gift size={18} className="mr-2" /> Tukar Poin
                </Button>
            </div>

            {/* My Points Card */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-500/20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-1">Total Poin Anda</p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-7xl font-black">{myPoints.toLocaleString()}</span>
                            <Star size={32} className="text-amber-400 fill-amber-400" />
                        </div>
                        <p className="text-blue-200 text-sm mt-2">Anda berada di <strong className="text-white">Posisi #5</strong> bulan ini</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        {[
                            { label: 'Laporan Valid', value: '13', icon: <CheckCircle size={20} /> },
                            { label: 'Poin Bulan Ini', value: '+180', icon: <TrendingUp size={20} /> },
                            { label: 'Badge Diraih', value: '2', icon: <Award size={20} /> },
                            { label: 'Rewards Ditukar', value: '1', icon: <Gift size={20} /> },
                        ].map(s => (
                            <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                                <div className="text-blue-200 mb-1">{s.icon}</div>
                                <p className="text-2xl font-black">{s.value}</p>
                                <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                        <Trophy size={22} className="text-amber-500" /> Leaderboard Bulanan
                    </h2>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {LEADERBOARD.map((person) => {
                        const style = RANK_STYLES[person.rank] || {};
                        const isMe = person.name === user?.nama;
                        return (
                            <div
                                key={person.rank}
                                className={`flex items-center gap-5 px-8 py-5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30 ${isMe ? 'bg-blue-50 dark:bg-blue-900/10' : ''} ${style.border ? `border-l-4 ${style.border}` : ''}`}
                            >
                                <div className="text-2xl w-8 text-center">{style.icon || `#${person.rank}`}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className={`font-black text-sm ${style.nameColor || 'text-slate-900 dark:text-white'}`}>{person.name}</p>
                                        {isMe && <span className="text-[9px] font-black text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">ANDA</span>}
                                        {person.badge && (
                                            <span className="text-[9px] font-black text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Award size={8} /> {person.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">{person.dept} · {person.reports} laporan valid</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-slate-900 dark:text-white">{person.points.toLocaleString()}</p>
                                    <p className="text-[10px] text-amber-500 font-black uppercase">Poin</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Rewards Modal */}
            {showRewards && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-2">
                                <Gift size={22} className="text-amber-500" /> Tukar Poin
                            </h2>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-xl">
                                <Star size={14} className="text-amber-500 fill-amber-500" />
                                <span className="font-black text-amber-600 text-sm">{myPoints} Poin</span>
                            </div>
                        </div>
                        <div className="space-y-3 mb-6">
                            {REWARDS.map(r => (
                                <div key={r.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${r.available && myPoints >= r.points ? 'border-slate-200 dark:border-slate-700 hover:border-amber-400 cursor-pointer' : 'border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed'}`}>
                                    <div className="text-3xl">{r.icon}</div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{r.title}</p>
                                        <p className="text-[10px] text-amber-600 font-black">{r.points} Poin</p>
                                    </div>
                                    {myPoints >= r.points && r.available
                                        ? <Button className="text-xs rounded-xl py-2 px-3">Tukar</Button>
                                        : <span className="text-[10px] text-slate-400 font-bold">{myPoints < r.points ? 'Poin kurang' : 'Habis'}</span>
                                    }
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full rounded-2xl" onClick={() => setShowRewards(false)}>Tutup</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GamificationPage;
