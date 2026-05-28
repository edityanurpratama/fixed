const Certification = require('../models/Certification');
const User = require('../models/User');

const addCertification = async (req, res) => {
    try {
        const certification = await Certification.create({
            ...req.body,
            id_user: req.user.id
        });
        res.status(201).json(certification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyCertifications = async (req, res) => {
    try {
        const certs = await Certification.findAll({ where: { id_user: req.user.id } });
        res.json(certs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllCertifications = async (req, res) => {
    try {
        const certs = await Certification.findAll({
            include: [{ model: User, attributes: ['nama', 'role'] }]
        });
        res.json(certs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addCertification, getMyCertifications, getAllCertifications };
