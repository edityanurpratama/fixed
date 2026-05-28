const IncidentReport = require('../models/IncidentReport');
const User = require('../models/User');

const createIncident = async (req, res) => {
    try {
        const { kategori, kronologi, korban } = req.body;
        const incident = await IncidentReport.create({
            id_user: req.user.id,
            kategori,
            kronologi,
            korban,
            foto: req.file ? req.file.filename : null,
        });
        res.status(201).json(incident);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getIncidents = async (req, res) => {
    try {
        const incidents = await IncidentReport.findAll({
            include: [{ model: User, attributes: ['nama', 'role'] }],
            order: [['createdAt', 'DESC']],
        });
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createIncident, getIncidents };
