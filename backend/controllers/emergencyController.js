const EmergencyCall = require('../models/EmergencyCall');
const User = require('../models/User');
const Certification = require('../models/Certification');

const triggerEmergency = async (req, res) => {
    try {
        const { jenis_kejadian, lokasi } = req.body;
        const emergency = await EmergencyCall.create({ jenis_kejadian, lokasi });

        // Auto Dispatch Logic: Find users with matching active certifications
        const activeCertifications = await Certification.findAll({
            where: { status: 'Active' },
            include: [{
                model: User,
                attributes: ['id_user', 'nama', 'email', 'role']
            }]
        });

        // Map emergency types to certification keywords
        const keywordsMap = {
            'fire': ['k3', 'fire', 'damkar'],
            'medical': ['first aid', 'medis', 'k3', 'medical'],
            'spill': ['hazmat', 'chemical', 'k3', 'storage'],
            'default': ['k3']
        };

        const eventType = (jenis_kejadian || '').toLowerCase();
        const keywords = keywordsMap[eventType] || keywordsMap['default'];

        // Filter unique responders based on their certifications matching keywords
        const matchingResponders = activeCertifications
            .filter(cert => {
                const certName = (cert.jenis_sertifikasi || '').toLowerCase();
                return keywords.some(kw => certName.includes(kw));
            })
            .map(cert => cert.User)
            .filter((user, index, self) => user && self.findIndex(u => u.id_user === user.id_user) === index);

        res.status(201).json({
            message: 'Darurat dipicu dan personil bersertifikat telah diberitahu',
            emergency,
            responders: matchingResponders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEmergencies = async (req, res) => {
    try {
        const emergencies = await EmergencyCall.findAll({
            include: [{ model: User, as: 'responder', attributes: ['nama'] }]
        });
        res.json(emergencies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { triggerEmergency, getEmergencies };
