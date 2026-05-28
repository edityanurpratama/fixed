import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const SafetyCharts = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/stats/monthly');
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="h-64 flex items-center justify-center text-slate-400">Loading charts...</div>;

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Safety Trend Analysis</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest mt-1">Last 30 Days Activity</p>
                </div>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="gradientHazards" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradientIncidents" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415510" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            minTickGap={30}
                            tickFormatter={(str) => {
                                const date = new Date(str);
                                return date.toLocaleDateString('default', { day: 'numeric', month: 'short' });
                            }}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                border: 'none',
                                borderRadius: '1rem',
                                color: '#fff',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend iconType="circle" />
                        <Area
                            type="monotone"
                            dataKey="hazards"
                            name="Hazards Reported"
                            stroke="#f59e0b"
                            fillOpacity={1}
                            fill="url(#gradientHazards)"
                            strokeWidth={3}
                        />
                        <Area
                            type="monotone"
                            dataKey="incidents"
                            name="Incidents Logged"
                            stroke="#ef4444"
                            fillOpacity={1}
                            fill="url(#gradientIncidents)"
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SafetyCharts;
