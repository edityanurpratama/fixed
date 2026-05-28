import { useState, useEffect } from 'react';
import api from '../api/axios';
import { AlertCircle, FileText, CheckCircle, Clock, Zap, Download, Shield, Trophy, X } from 'lucide-react';
import EmergencyControls from '../components/EmergencyControls';
import SafetyCharts from '../components/SafetyCharts';
import { generateMonthlyReport } from '../utils/reportGenerator';
import Button from '../components/Button';
import { useAuth } from '../store/AuthContext';

const FFD_QUESTIONS = [
    { id: 1, text: 'Apakah Anda tidur cukup (lebih dari 6 jam) semalam?' },
    { id: 2, text: 'Apakah Anda dalam kondisi sehat fisik hari ini?' },
    { id: 3, text: 'Apakah Anda bebas dari pengaruh obat-obatan atau alkohol?' },
];

const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalHazards: 0,
        totalIncidents: 0,
        totalAudits: 0,
        pendingActions: 0,
    });
    const [loading, setLoading] = useState(true);

    // Fit for Duty state — must be before any early returns
    const [ffdState, setFfdState] = useState(() => {
        const savedStatus = localStorage.getItem('ffd_status');
        const savedDate = localStorage.getItem('ffd_date');
        const today = new Date().toDateString();
        if (savedStatus && savedDate === today) {
            return savedStatus;
        }
        return 'pending';
    });
    const [ffdAnswers, setFfdAnswers] = useState({ 1: null, 2: null, 3: null });

    const handleDownloadReport = async () => {
        try {
            const res = await api.get('/stats/report-data');
            generateMonthlyReport(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to generate report');
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/stats');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleFfdAnswer = (questionId, answer) => {
        const updated = { ...ffdAnswers, [questionId]: answer };
        setFfdAnswers(updated);

        // Check if all answered
        const allAnswered = Object.values(updated).every(v => v !== null);
        if (allAnswered) {
            const allYes = Object.values(updated).every(v => v === true);
            const status = allYes ? 'passed' : 'blocked';
            setTimeout(() => {
                setFfdState(status);
                localStorage.setItem('ffd_status', status);
                localStorage.setItem('ffd_date', new Date().toDateString());
            }, 400);
        }
    };

    const statCards = [
        { title: 'Total Insiden', value: stats.totalIncidents, icon: <FileText className="text-red-400" />, trend: 'Reported', color: 'bg-red-500/10' },
        { title: 'Total Bahaya', value: stats.totalHazards, icon: <AlertCircle className="text-amber-400" />, trend: 'Active', color: 'bg-amber-500/10' },
        { title: 'TRIR Index', value: '1.24', icon: <Zap className="text-emerald-400" />, trend: 'Target < 1.5', color: 'bg-emerald-500/10' },
        { title: 'LTI Rate', value: '0.00', icon: <CheckCircle className="text-blue-400" />, trend: '365 Hari Terakhir', color: 'bg-blue-500/10' },
    ];

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* === FIT FOR DUTY CHECK-IN === */}
            {ffdState === 'pending' && (
                <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] text-white shadow-2xl shadow-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-white/20 rounded-3xl backdrop-blur-md shrink-0">
                            <Shield size={40} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Fit For Duty Check-in</h2>
                            <p className="text-blue-100 font-medium mt-1">Pastikan kesiapan fisik & mental Anda sebelum memulai shift hari ini.</p>
                        </div>
                    </div>
                    <button
                        className="w-full md:w-auto px-10 py-5 bg-white text-blue-600 hover:bg-blue-50 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shrink-0 active:scale-95 transition-all duration-200"
                        onClick={() => setFfdState('answering')}
                    >
                        Mulai Check-in
                    </button>
                </div>
            )}

            {ffdState === 'answering' && (
                <div className="bg-white dark:bg-slate-900 border-2 border-blue-500 rounded-[2rem] p-8 shadow-2xl shadow-blue-500/10 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                                <Shield size={24} className="text-blue-600" /> Fit For Duty — Kuisioner Harian
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">Jawab 3 pertanyaan singkat berikut dengan jujur.</p>
                        </div>
                        <button onClick={() => setFfdState('pending')} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="space-y-6">
                        {FFD_QUESTIONS.map((q, i) => (
                            <div key={q.id} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <p className="font-bold text-slate-800 dark:text-slate-200 mb-4">
                                    <span className="text-blue-600 font-black mr-2">{i + 1}.</span>{q.text}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleFfdAnswer(q.id, true)}
                                        className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${ffdAnswers[q.id] === true ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-emerald-400'}`}
                                    >
                                        ✓ Ya
                                    </button>
                                    <button
                                        onClick={() => handleFfdAnswer(q.id, false)}
                                        className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${ffdAnswers[q.id] === false ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-red-400'}`}
                                    >
                                        ✗ Tidak
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {ffdState === 'blocked' && (
                <div className="p-8 bg-gradient-to-br from-red-600 to-rose-700 rounded-[2rem] text-white text-center shadow-2xl shadow-red-500/30 animate-in zoom-in-95 duration-200">
                    <div className="text-6xl mb-4">🚫</div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Tidak Layak Kerja (Not Fit for Duty)</h2>
                    <p className="text-red-100 mt-2 mb-6 font-medium">Anda menjawab "Tidak" pada salah satu pertanyaan. Harap laporkan kondisi Anda ke HSE Officer sebelum memulai aktivitas kerja.</p>
                    <button
                        className="w-full md:w-auto px-8 py-4 bg-white text-red-600 hover:bg-red-50 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all duration-200"
                        onClick={() => {
                            setFfdState('pending');
                            setFfdAnswers({ 1: null, 2: null, 3: null });
                            localStorage.removeItem('ffd_status');
                            localStorage.removeItem('ffd_date');
                        }}
                    >
                        Ulangi Check-in
                    </button>
                </div>
            )}

            {ffdState === 'passed' && (
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="p-2 bg-emerald-500 rounded-xl text-white"><CheckCircle size={20} /></div>
                    <div>
                        <p className="font-black text-emerald-700 dark:text-emerald-400 text-sm uppercase tracking-wider">Fit For Duty — Confirmed</p>
                        <p className="text-xs text-slate-500">Anda dinyatakan layak kerja hari ini. Tetap waspada!</p>
                    </div>
                </div>
            )}

            {/* === HEADER & EMERGENCY CONTROLS === */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Dashboard Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Monitor performa keselamatan kerja perusahaan secara real-time.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button
                        variant="primary"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl py-4 px-6 shadow-xl shadow-blue-500/20 transition-all active:scale-95 text-sm font-black uppercase"
                        onClick={handleDownloadReport}
                    >
                        <Download size={18} /> Unduh Laporan Bulanan (PDF)
                    </Button>

                    {user?.role !== 'Operator' && user?.role !== 'Kontraktor' && (
                        <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-3xl p-4 w-full lg:min-w-[400px]">
                            <div className="flex items-center gap-2 mb-3 px-2">
                                <Zap size={16} className="text-red-500 fill-red-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">Quick Emergency — Tahan 3 Detik</span>
                            </div>
                            <EmergencyControls compact />
                        </div>
                    )}
                </div>
            </div>

            {/* === STAT CARDS === */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="glass-card p-6 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 ${stat.color} rounded-xl group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{stat.trend}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">{stat.title}</h3>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                            <span className="text-xs text-emerald-500 font-bold">+12%</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* === ANALYTICS CHARTS === */}
            <SafetyCharts />

            {/* === SYSTEM HEALTH + CONTRACTOR LEADERBOARD === */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
                    <h3 className="text-lg font-black mb-6 text-slate-900 dark:text-white uppercase tracking-tighter">System Health</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-600 dark:text-emerald-500">
                            <CheckCircle size={18} />
                            <span className="flex-1 font-bold text-sm">Database Sync</span>
                            <span className="text-[10px] font-black uppercase px-2 py-1 bg-emerald-500/20 rounded-lg">Online</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-600 dark:text-blue-500">
                            <Zap size={18} />
                            <span className="flex-1 font-bold text-sm">AI Analytics Engine</span>
                            <span className="text-[10px] font-black uppercase px-2 py-1 bg-blue-500/20 rounded-lg">Ready</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-600 dark:text-amber-500">
                            <Clock size={18} />
                            <span className="flex-1 font-bold text-sm">WhatsApp Notifikasi</span>
                            <span className="text-[10px] font-black uppercase px-2 py-1 bg-amber-500/20 rounded-lg">Configured</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                            <Trophy size={20} className="text-amber-500" /> Contractor Safety Leaderboard
                        </h3>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">Updated Hourly</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                    <th className="pb-4">Rank</th>
                                    <th className="pb-4">Kontraktor</th>
                                    <th className="pb-4">Safety Score</th>
                                    <th className="pb-4">Permit Aktif</th>
                                    <th className="pb-4">Insiden</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-bold">
                                {[
                                    { rank: 1, name: 'PT Petro Kimia', score: 98, permits: 12, incidents: 0 },
                                    { rank: 2, name: 'CV Bangun Jaya', score: 92, permits: 8, incidents: 0 },
                                    { rank: 3, name: 'PT Logistik Abadi', score: 85, permits: 5, incidents: 1 },
                                ].map((c) => (
                                    <tr key={c.rank} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="py-4">
                                            <span className={`text-lg font-black ${c.rank === 1 ? 'text-amber-500' : c.rank === 2 ? 'text-slate-400' : 'text-orange-600'}`}>
                                                #{c.rank}
                                            </span>
                                        </td>
                                        <td className="py-4 text-slate-900 dark:text-slate-200">{c.name}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${c.score > 90 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-orange-500/10 text-orange-600'}`}>
                                                {c.score} / 100
                                            </span>
                                        </td>
                                        <td className="py-4 text-slate-500">{c.permits}</td>
                                        <td className="py-4">
                                            <span className={c.incidents > 0 ? 'text-red-500' : 'text-emerald-500'}>{c.incidents}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
