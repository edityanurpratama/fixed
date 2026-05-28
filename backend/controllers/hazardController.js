const HazardReport = require('../models/HazardReport');
const User = require('../models/User');
const CorrectiveAction = require('../models/CorrectiveAction');

const createHazard = async (req, res) => {
    try {
        const { lokasi, deskripsi, risiko, koordinat_gps } = req.body;
        const hazard = await HazardReport.create({
            id_user: req.user.id,
            lokasi,
            deskripsi,
            risiko,
            koordinat_gps,
            foto: req.file ? req.file.filename : null,
        });

        // Auto-create CAPA for High/Critical risks
        if (risiko === 'High' || risiko === 'Critical') {
            await CorrectiveAction.create({
                id_hazard: hazard.id_hazard,
                description: `Immediate corrective action required for: ${deskripsi}`,
                assigned_to: 1, // Default to HSE Manager (User 1)
                deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hour deadline
                status: 'Open'
            });
        }

        res.status(201).json(hazard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getHazards = async (req, res) => {
    try {
        const hazards = await HazardReport.findAll({
            include: [{ model: User, attributes: ['nama', 'role'] }],
            order: [['createdAt', 'DESC']],
        });
        res.json(hazards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const hazard = await HazardReport.findByPk(req.params.id);
        if (!hazard) return res.status(404).json({ message: 'Hazard not found' });

        hazard.status = status;
        await hazard.save();
        res.json(hazard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createHazard, getHazards, updateStatus };
