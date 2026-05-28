const { Op } = require('sequelize');
const HazardReport = require('../models/HazardReport');
const IncidentReport = require('../models/IncidentReport');
const Audit = require('../models/Audit');
const CorrectiveAction = require('../models/CorrectiveAction');


const getDashboardStats = async (req, res) => {
    try {
        const totalHazards = await HazardReport.count();
        const totalIncidents = await IncidentReport.count();
        const totalAudits = await Audit.count();
        const pendingActions = await CorrectiveAction.count({ where: { status: 'Pending' } });

        res.json({
            totalHazards,
            totalIncidents,
            totalAudits,
            pendingActions,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMonthlyAnalytics = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const hazards = await HazardReport.findAll({
            where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
            attributes: ['createdAt']
        });

        const incidents = await IncidentReport.findAll({
            where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
            attributes: ['createdAt']
        });

        // Group by date (simple implementation)
        const analytics = {};
        for (let i = 0; i <= 30; i++) {
            const date = new Date(thirtyDaysAgo);
            date.setDate(date.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            analytics[dateString] = { date: dateString, hazards: 0, incidents: 0 };
        }

        hazards.forEach(h => {
            const date = h.createdAt.toISOString().split('T')[0];
            if (analytics[date]) analytics[date].hazards++;
        });

        incidents.forEach(i => {
            const date = i.createdAt.toISOString().split('T')[0];
            if (analytics[date]) analytics[date].incidents++;
        });

        res.json(Object.values(analytics));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReportData = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const hazards = await HazardReport.findAll({
            where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
            order: [['createdAt', 'DESC']]
        });

        const incidents = await IncidentReport.findAll({
            where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
            order: [['createdAt', 'DESC']]
        });

        const audits = await Audit.findAll({
            where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
            order: [['createdAt', 'DESC']]
        });

        res.json({
            summary: {
                hazards: hazards.length,
                incidents: incidents.length,
                audits: audits.length,
                period: 'Last 30 Days'
            },
            details: {
                hazards,
                incidents,
                audits
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats, getMonthlyAnalytics, getReportData };

