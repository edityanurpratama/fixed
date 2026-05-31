import re

with open('frontend/src/pages/DashboardPage.jsx', 'r') as f:
    content = f.read()

# Remove the entire block from {/* === FIT FOR DUTY CHECK-IN === */} to the end of the FFD block before {isFieldRole ?
# I'll just find {/* === FIT FOR DUTY CHECK-IN === */} and the exact string `{isFieldRole ? (`
start_marker = "{/* === FIT FOR DUTY CHECK-IN === */}"
end_marker = "{isFieldRole ? ("

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_ui = """{/* === REMINDER BANNER === */}
            {showReminderBanner && (
                <div className="bg-red-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-red-500/20 animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 animate-pulse" />
                        <div>
                            <p className="font-bold">Peringatan: Anda belum mengisi absensi harian!</p>
                            <p className="text-sm">Saat ini sudah melewati pukul 09:00. Segera isi absensi dan fatigue status Anda.</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/attendance')} className="bg-white text-red-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-50">
                        Isi Absensi Sekarang
                    </button>
                </div>
            )}

            {/* === ATTENDANCE POPUP === */}
            {showAttendancePopup && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 relative">
                        <button onClick={() => setShowAttendancePopup(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
                            <X size={20} />
                        </button>
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <Clock className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 text-center mb-2">Absensi Harian</h2>
                        <p className="text-slate-500 text-center mb-6">Halo! Anda belum mencatat kehadiran Anda hari ini. Silakan lapor kehadiran beserta kondisi fatigue Anda.</p>
                        
                        <button onClick={() => navigate('/attendance')} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30">
                            Menuju Halaman Absensi
                        </button>
                        
                        <button onClick={() => navigate('/attendance')} className="w-full mt-3 bg-orange-100 text-orange-600 py-3 rounded-xl font-bold hover:bg-orange-200">
                            Ajukan Izin/Cuti
                        </button>
                    </div>
                </div>
            )}
            
            """
    content = content[:start_idx] + new_ui + content[end_idx:]

with open('frontend/src/pages/DashboardPage.jsx', 'w') as f:
    f.write(content)
