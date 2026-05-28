import { useState, useEffect } from 'react';
import api from '../api/axios';
import Button from '../components/Button';
import Input from '../components/Input';
import { Plus, Info, Users, MapPin, Camera, ClipboardList, Download } from 'lucide-react';
import { generateIncidentReport } from '../utils/reportGenerator';

const IncidentPage = () => {
    const [incidents, setIncidents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        kategori: 'Near Miss',
        kronologi: '',
        korban: '',
        loss_cost: 0,
        five_whys: { why1: '', why2: '', why3: '', why4: '', why5: '' }
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        try {
            const res = await api.get('/incidents');
            setIncidents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('kategori', formData.kategori);
        data.append('kronologi', formData.kronologi);
        data.append('korban', formData.korban);
        data.append('loss_cost', formData.loss_cost);
        data.append('five_whys', JSON.stringify(formData.five_whys));
        if (file) data.append('foto', file);

        try {
            await api.post('/incidents', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowForm(false);
            setFormData({
                kategori: 'Near Miss', kronologi: '', korban: '', loss_cost: 0,
                five_whys: { why1: '', why2: '', why3: '', why4: '', why5: '' }
            });
            setFile(null);
            fetchIncidents();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Laporan Insiden (Incident Report)</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Investigasi akar masalah dengan metode 5 Whys & Loss Cost tracking.</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 w-full sm:w-auto justify-center rounded-2xl py-6 px-8 shadow-xl shadow-red-500/20" variant="danger">
                    <Plus size={18} /> Laporkan Insiden
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 border-t-8 border-red-600 w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-black mb-6 text-red-600 dark:text-red-500 uppercase tracking-tighter">Investigasi Insiden Digital</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">Kategori Insiden</label>
                                    <select
                                        className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-bold"
                                        value={formData.kategori}
                                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                    >
                                        <option value="Near Miss">Near Miss</option>
                                        <option value="First Aid">First Aid</option>
                                        <option value="Medical Treatment">Medical Treatment</option>
                                        <option value="Lost Time Injury (LTI)">Lost Time Injury (LTI)</option>
                                        <option value="Fatality">Fatality</option>
                                        <option value="Property Damage">Property Damage</option>
                                    </select>
                                </div>
                                <Input
                                    label="Estimasi Kerugian (Loss Cost USD)"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.loss_cost}
                                    onChange={(e) => setFormData({ ...formData, loss_cost: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">Kronologi Kejadian</label>
                                <textarea
                                    className="px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all h-24"
                                    placeholder="Ceritakan urutan kejadian..."
                                    value={formData.kronologi}
                                    onChange={(e) => setFormData({ ...formData, kronologi: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4">
                                <label className="flex items-center gap-2 text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest px-1">
                                    <Info size={14} /> Analisis Akar Masalah (5 Whys)
                                </label>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <div key={num} className="flex gap-4 items-center">
                                        <span className="text-xs font-black text-slate-300 dark:text-slate-600 w-4">{num}.</span>
                                        <input
                                            type="text"
                                            className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-red-500 transition-all"
                                            placeholder={`Kenapa kejadian ini bisa terjadi? (Why ${num})`}
                                            value={formData.five_whys[`why${num}`]}
                                            onChange={(e) => setFormData({ ...formData, five_whys: { ...formData.five_whys, [`why${num}`]: e.target.value } })}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input
                                    label="Daftar Korban / Personel Terlibat"
                                    placeholder="Contoh: Andi, Budi (Pekerja Lapangan)"
                                    value={formData.korban}
                                    onChange={(e) => setFormData({ ...formData, korban: e.target.value })}
                                />
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">Dokumentasi Foto</label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                        <div className="px-4 py-3 bg-white dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-3 text-slate-400 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-all">
                                            <Camera size={18} />
                                            <span className="text-xs font-bold">{file ? file.name : 'Upload Foto Insiden'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="flex-1 rounded-2xl py-4">Kembali</Button>
                                <Button type="submit" variant="danger" className="flex-1 rounded-2xl py-4 shadow-lg shadow-red-500/20" loading={loading}>{loading ? 'Mengirim...' : 'Kirim Investigasi'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Incident List */}
            <div className="space-y-4">
                {incidents.map((incident) => (
                    <div key={incident.id_incident} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-500 rounded-xl">
                            <ClipboardList size={32} />
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{incident.kategori}</h3>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        <span className="flex items-center gap-1"><Users size={12} /> {incident.korban || 'No victims'}</span>
                                        <span className="flex items-center gap-1"><MapPin size={12} /> {new Date(incident.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-500 rounded-full text-[10px] font-bold uppercase tracking-widest">Reported</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{incident.kronologi}</p>
                            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50">
                                <span className="text-xs text-slate-500">Filed by: <span className="text-slate-900 dark:text-slate-400 font-medium">{incident.User?.nama}</span></span>
                                <Button
                                    variant="secondary"
                                    className="text-xs flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800/50 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                                    onClick={() => generateIncidentReport(incident)}
                                >
                                    <Download size={12} /> PDF
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default IncidentPage;
