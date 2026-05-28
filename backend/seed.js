const sequelize = require('./config/db');
const User = require('./models/User');
const HazardReport = require('./models/HazardReport');
const IncidentReport = require('./models/IncidentReport');
const Audit = require('./models/Audit');
const CorrectiveAction = require('./models/CorrectiveAction');
const Certification = require('./models/Certification');
const WorkPermit = require('./models/WorkPermit');
const EmergencyCall = require('./models/EmergencyCall');

const CHECKLIST_TEMPLATES = {
    'APAR': ['Tabung tidak berkarat', 'Segel dalam kondisi baik', 'Penunjuk tekanan pada posisi hijau', 'Label inspeksi terbaru', 'Akses tidak terhalang'],
    'Perancah': ['Kaki perancah terkunci', 'Papan lantai tidak patah', 'Pagar pengaman terpasang', 'Beban tidak melebihi kapasitas'],
    'Forklift': ['Rem berfungsi normal', 'Lampu peringatan hidup', 'Klakson berfungsi', 'Fork tidak bengkok', 'Sabuk pengaman ada'],
    'Panel Listrik': ['Tutup panel tertutup', 'Label bahaya terpasang', 'Grounding terhubung', 'Tidak ada kabel terkelupas'],
};

const hazardLocations = [
    'Warehouse Zone A', 'Power Room B', 'Lantai Produksi 1', 'Main Factory Yard',
    'Loading Dock C', 'Lantai Produksi 2', 'Mechanical Workshop', 'Chemical Storage Room'
];

const hazardDescriptions = [
    'Lantai licin karena ceceran oli di dekat stasiun forklift.',
    'Kabel tegangan tinggi terbuka tanpa pelindung di panel B-12.',
    'Tekanan tabung APAR berada di zona merah (kurang tekanan).',
    'Pintu keluar darurat terhalang oleh tumpukan palet kayu.',
    'Pekerja mengoperasikan overhead crane tanpa menggunakan helm keselamatan.',
    'Scaffolding di area konstruksi B2 tidak memiliki mid-rail pengaman.',
    'Drum bahan kimia disimpan tanpa label identifikasi di zona A.',
    'Alarm mundur forklift tidak berfungsi saat beroperasi.',
    'Kabel listrik liar melintang di jalur penyeberangan pejalan kaki.',
    'Penutup pelindung mesin gerinda pecah dan terlepas.',
    'Akumulasi debu tebal di dekat ventilasi pembuangan berpotensi memicu percikan api.'
];

const risks = ['Low', 'Medium', 'High', 'Critical'];

const incidentCategories = ['Medical', 'Near Miss', 'Property Damage', 'First Aid'];

const incidentChronologies = [
    'Pekerja tersandung kabel melintang dan mengalami cedera memar pada lutut kanan.',
    'Forklift berjalan mundur di jalur pejalan kaki tanpa alarm berbunyi, nyaris menabrak operator.',
    'Percikan api las mengenai kain lap basah berbahan bakar minyak, sempat menyala namun langsung dipadamkan.',
    'Cairan pembersih kimia tepercik ke tangan pekerja saat penuangan manual, langsung dibilas di wastafel.',
    'Pekerja terpeleset di tangga besi basah saat hujan, mengalami terkilir ringan pada pergelangan tangan.'
];

const victims = [
    'Main Operator', 'PT Petro Kimia Contractor', 'CV Bangun Jaya worker', 'Workshop Technician'
];

const templates = ['APAR', 'Perancah', 'Forklift', 'Panel Listrik'];
const checklistScore = ['5/5', '4/5', '4/4', '3/4'];

const seed = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced for seeding...');

        // 1. Create Core Users
        const password = 'password123';
        const admin = await User.create({ nama: 'Nuraga Admin', email: 'admin@nuraga.com', password, role: 'Admin' });
        const hse = await User.create({ nama: 'HSE Officer', email: 'hse@nuraga.com', password, role: 'HSE' });
        const operator = await User.create({ nama: 'Main Operator', email: 'operator@nuraga.com', password, role: 'Operator' });

        const today = new Date();

        // 2. Loop through the past 30 days to generate records
        for (let i = 30; i >= 0; i--) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() - i);
            
            // Set a random time during working hours (08:00 to 18:00)
            currentDate.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);

            // Generate Hazards (65% chance daily)
            if (Math.random() < 0.65) {
                const numHazards = Math.floor(Math.random() * 2) + 1; // 1 to 2 hazards
                for (let h = 0; h < numHazards; h++) {
                    const loc = hazardLocations[Math.floor(Math.random() * hazardLocations.length)];
                    const desc = hazardDescriptions[Math.floor(Math.random() * hazardDescriptions.length)];
                    const risk = risks[Math.floor(Math.random() * risks.length)];
                    // Past reports are closed, newer ones might be open
                    const status = i > 7 ? (Math.random() < 0.85 ? 'Closed' : 'Open') : (Math.random() < 0.4 ? 'Closed' : 'Open');

                    const hazard = await HazardReport.create({
                        id_user: operator.id_user,
                        lokasi: loc,
                        deskripsi: desc,
                        risiko: risk,
                        status: status,
                        createdAt: currentDate,
                        updatedAt: currentDate
                    });

                    // Auto-generate CAPA for High & Critical risks
                    if (risk === 'High' || risk === 'Critical') {
                        const capaStatus = status === 'Closed' ? 'Closed' : (Math.random() < 0.5 ? 'In Progress' : 'Open');
                        await CorrectiveAction.create({
                            id_hazard: hazard.id_hazard,
                            assigned_to: hse.id_user,
                            description: `Tindak lanjut bahaya: ${desc} di ${loc}`,
                            deadline: new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000)),
                            status: capaStatus,
                            createdAt: currentDate,
                            updatedAt: currentDate
                        });
                    }
                }
            }

            // Generate Incidents (12% chance daily)
            if (Math.random() < 0.12) {
                const cat = incidentCategories[Math.floor(Math.random() * incidentCategories.length)];
                const chron = incidentChronologies[Math.floor(Math.random() * incidentChronologies.length)];
                const vic = victims[Math.floor(Math.random() * victims.length)];

                await IncidentReport.create({
                    id_user: operator.id_user,
                    kategori: cat,
                    kronologi: chron,
                    korban: vic,
                    createdAt: currentDate,
                    updatedAt: currentDate
                });
            }

            // Generate Audits (35% chance daily)
            if (Math.random() < 0.35) {
                const tpl = templates[Math.floor(Math.random() * templates.length)];
                const score = checklistScore[Math.floor(Math.random() * checklistScore.length)];
                const items = {};
                
                CHECKLIST_TEMPLATES[tpl].forEach(item => {
                    items[item] = Math.random() < 0.85; // 85% pass rate
                });

                await Audit.create({
                    auditor_id: hse.id_user,
                    area: hazardLocations[Math.floor(Math.random() * hazardLocations.length)],
                    tanggal: currentDate,
                    hasil: `Inspeksi berkala ${tpl} telah diselesaikan. Beberapa catatan perbaikan telah dicantumkan di lampiran checklist.`,
                    qr_code_asset: `${tpl.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
                    checklist_items: JSON.stringify({
                        template: tpl,
                        items,
                        score
                    }),
                    createdAt: currentDate,
                    updatedAt: currentDate
                });
            }

            // Generate Work Permits (25% chance daily)
            if (Math.random() < 0.25) {
                const permitTypes = ['Hot Work', 'Cold Work', 'Confined Space', 'Working at Height', 'Electrical Work', 'Excavation'];
                const type = permitTypes[Math.floor(Math.random() * permitTypes.length)];
                // Older permits are completed, newer ones might be approved or pending
                const status = i > 5 
                    ? 'Closed' 
                    : (Math.random() < 0.5 ? 'Approved' : 'Pending');

                await WorkPermit.create({
                    id_user: operator.id_user,
                    jenis_permit: type,
                    perusahaan: Math.random() < 0.5 ? 'PT Petro Kimia' : 'CV Bangun Jaya',
                    lokasi: hazardLocations[Math.floor(Math.random() * hazardLocations.length)],
                    waktu_mulai: currentDate,
                    waktu_selesai: new Date(currentDate.getTime() + 8 * 60 * 60 * 1000),
                    deskripsi_pekerjaan: `Melakukan pekerjaan ${type} konstruksi di lapangan sesuai standar prosedur keselamatan K3.`,
                    supervisor_name: 'Andi Supervisor',
                    daftar_pekerja: ['Pekerja A', 'Pekerja B', 'Pekerja C'],
                    bahaya: ['Tergelincir/Terjatuh', 'Peralatan Jatuh', 'Sengatan Listrik'],
                    apd: ['Helm Keselamatan', 'Sepatu Safety', 'Sarung Tangan', 'Full Body Harness'],
                    applicant_sig: true,
                    supervisor_sig: status !== 'Pending',
                    supervisor_approved_at: status !== 'Pending' ? currentDate : null,
                    safety_officer_sig: status === 'Approved' || status === 'Closed',
                    safety_officer_approved_at: status === 'Approved' || status === 'Closed' ? currentDate : null,
                    approver_sig: status === 'Approved' || status === 'Closed',
                    manager_approved_at: status === 'Approved' || status === 'Closed' ? currentDate : null,
                    approval_step: status === 'Pending' ? 1 : (status === 'Approved' ? 3 : 4),
                    status: status,
                    createdAt: currentDate,
                    updatedAt: currentDate
                });
            }
        }

        // 3. Create Certifications for Operator
        await Certification.create({
            id_user: operator.id_user,
            nama_personil: 'Main Operator',
            jenis_sertifikasi: 'General K3 Specialist',
            nomor_sertifikat: 'K3-2026-089A',
            tanggal_terbit: new Date('2026-01-10'),
            tanggal_expired: new Date('2029-01-10'),
            status: 'Active'
        });

        await Certification.create({
            id_user: operator.id_user,
            nama_personil: 'Main Operator',
            jenis_sertifikasi: 'Scaffolding Inspector',
            nomor_sertifikat: 'SCAF-2026-112B',
            tanggal_terbit: new Date('2026-03-05'),
            tanggal_expired: new Date('2028-03-05'),
            status: 'Active'
        });

        // 4. Create Emergency Calls
        await EmergencyCall.create({
            jenis_kejadian: 'Kebocoran Gas Kimia',
            lokasi: 'Chemical Storage Room',
            status: 'Triggered'
        });

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seed();
