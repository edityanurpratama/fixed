import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu, Shield } from 'lucide-react';


const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white overflow-hidden transition-colors duration-500">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 h-full flex-shrink-0">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Mobile Sidebar Drawer */}
            <div className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 z-50 transform transition-transform duration-500 ease-in-out lg:hidden ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] pointer-events-none -z-10"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] pointer-events-none -z-10"></div>

                <header className="h-20 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 md:px-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md z-30 transition-colors duration-500">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl lg:hidden text-slate-600 dark:text-slate-400 active:scale-95 transition-all"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight hidden sm:block">Nuraga Safety</h2>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight sm:hidden">Nuraga</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded-lg text-xs font-black uppercase tracking-widest border border-blue-500/20">
                            <Shield size={14} /> System Secure
                        </div>
                    </div>
                </header>



                <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
