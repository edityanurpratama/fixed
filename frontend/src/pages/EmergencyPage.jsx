import { useState, useEffect } from 'react';
import api from '../api/axios';
import EmergencyControls from '../components/EmergencyControls';
import { Zap, AlertTriangle, Shield, MapPin, Clock, Users, Bell } from 'lucide-react';


const EmergencyPage = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEmergencies();
    }, []);

    const fetchEmergencies = async () => {
        try {
            const res = await api.get('/emergency');
            setEmergencies(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEmergency = async (type) => {
        if (!window.confirm(`THIS WILL TRIGGER A SYSTEM-WIDE EMERGENCY ALERT FOR: ${type.toUpperCase()}. Proceed?`)) return;

        setLoading(true);
        try {
            await api.post('/emergency', {
                jenis_kejadian: type,
                lokasi: 'Main Production Zone (Auto-detected)'
            });
            fetchEmergencies();
            alert('Emergency Alert Broadcasted!');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
                    <Zap size={32} className="text-amber-500 fill-amber-500" />
                    Emergency Response System
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Trigger immediate assistance and dispatch certified responders based on incident type.</p>
            </div>


            <EmergencyControls onTriggered={fetchEmergencies} />


            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm transition-colors duration-300">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="font-bold text-xl flex items-center gap-2 text-slate-900 dark:text-white">
                        <Shield size={24} className="text-blue-600 dark:text-blue-500" /> Active Emergency Log
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-[0.2em]">Live Monitoring</span>
                    </div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {emergencies.map((e) => (
                        <div key={e.id_emergency} className="p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-5">
                                <div className={`p-4 rounded-2x ${e.status === 'Triggered' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'}`}>
                                    <Zap size={24} className={e.status === 'Triggered' ? 'animate-pulse' : ''} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{e.jenis_kejadian} Emergency</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        <span className="flex items-center gap-1.5 font-medium"><MapPin size={14} className="text-slate-400" /> {e.lokasi}</span>
                                        <span className="flex items-center gap-1.5 font-medium"><Clock size={14} className="text-slate-400" /> {new Date(e.waktu_kejadian).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${e.status === 'Triggered' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-blue-600 text-white'
                                    }`}>
                                    {e.status}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Responder: <span className="text-slate-700 dark:text-slate-300">{e.responder?.nama || 'Awaiting Dispatch'}</span></span>
                            </div>
                        </div>
                    ))}
                    {emergencies.length === 0 && (
                        <div className="p-24 text-center">
                            <Shield size={64} className="mx-auto mb-4 text-slate-100 dark:text-slate-800" />
                            <p className="text-slate-400 dark:text-slate-500 font-medium italic">Status: All clear. No active emergencies reported.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default EmergencyPage;
