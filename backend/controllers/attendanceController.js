const axios = require('axios');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { Op } = require('sequelize');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

exports.clockIn = async (req, res) => {
    try {
        const { sleep_hours, stress_level } = req.body;
        const id_user = req.user.id;
        const foto_bukti = req.file ? req.file.filename : null;

        // Check if already clocked in today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        
        const existing = await Attendance.findOne({
            where: {
                id_user,
                type: 'Datang',
                createdAt: { [Op.gte]: startOfDay }
            }
        });

        if (existing) {
            return res.status(400).json({ message: "Anda sudah melakukan Absen Datang hari ini." });
        }

        // Call AI Service for Fatigue Prediction
        let aiPrediction = { fatigue_status: 'Tidak Diketahui', recommendation: '' };
        if (sleep_hours && stress_level) {
            try {
                const aiResponse = await axios.post(`${AI_SERVICE_URL}/predict-fatigue`, {
                    sleep_hours: parseFloat(sleep_hours),
                    stress_level: parseFloat(stress_level)
                });
                aiPrediction = aiResponse.data;
            } catch (error) {
                console.error("AI Service Error:", error.message);
                // We don't fail the clock-in, just record it as unknown
            }
        }

        const attendance = await Attendance.create({
            id_user,
            type: 'Datang',
            sleep_hours: sleep_hours || null,
            stress_level: stress_level || null,
            fatigue_status: aiPrediction.fatigue_status,
            recommendation: aiPrediction.recommendation,
            foto_bukti
        });

        res.status(201).json({
            message: "Absen Datang berhasil disimpan",
            data: attendance
        });
    } catch (error) {
        console.error("Error in clockIn:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.clockOut = async (req, res) => {
    try {
        const id_user = req.user.id;
        
        // Check if already clocked out today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        
        const existingOut = await Attendance.findOne({
            where: {
                id_user,
                type: 'Pulang',
                createdAt: { [Op.gte]: startOfDay }
            }
        });

        if (existingOut) {
            return res.status(400).json({ message: "Anda sudah melakukan Absen Pulang hari ini." });
        }

        const attendance = await Attendance.create({
            id_user,
            type: 'Pulang'
        });

        res.status(201).json({
            message: "Absen Pulang berhasil disimpan",
            data: attendance
        });
    } catch (error) {
        console.error("Error in clockOut:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.getTodayStatus = async (req, res) => {
    try {
        const id_user = req.user.id;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const clockIn = await Attendance.findOne({
            where: { id_user, type: 'Datang', createdAt: { [Op.gte]: startOfDay } }
        });
        const clockOut = await Attendance.findOne({
            where: { id_user, type: 'Pulang', createdAt: { [Op.gte]: startOfDay } }
        });

        res.status(200).json({
            clockedIn: !!clockIn,
            clockedOut: !!clockOut,
            fatigue_status: clockIn ? clockIn.fatigue_status : null
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getMyHistory = async (req, res) => {
    try {
        const id_user = req.user.id;
        const history = await Attendance.findAll({
            where: { id_user },
            order: [['createdAt', 'DESC']],
            limit: 60
        });
        
        const leaves = await LeaveRequest.findAll({
            where: { id_user },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ attendance: history, leaves });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllHistory = async (req, res) => {
    try {
        const history = await Attendance.findAll({
            include: [{ model: User, attributes: ['nama', 'nik', 'role'] }],
            order: [['createdAt', 'DESC']],
            limit: 500
        });
        
        const leaves = await LeaveRequest.findAll({
            include: [{ model: User, attributes: ['nama', 'nik', 'role'] }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ attendance: history, leaves });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.submitLeave = async (req, res) => {
    try {
        const { type, start_date, end_date, reason } = req.body;
        const id_user = req.user.id;
        const document_proof = req.file ? req.file.filename : null;

        const leave = await LeaveRequest.create({
            id_user,
            type,
            start_date,
            end_date,
            reason,
            document_proof,
            status: 'Pending'
        });

        res.status(201).json({ message: "Pengajuan berhasil dikirim", data: leave });
    } catch (error) {
        console.error("Error submitLeave:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.approveLeave = async (req, res) => {
    try {
        const { id_leave } = req.params;
        const { status } = req.body; // Approved or Rejected
        
        const leave = await LeaveRequest.findByPk(id_leave);
        if (!leave) return res.status(404).json({ message: "Data tidak ditemukan" });

        leave.status = status;
        await leave.save();

        res.status(200).json({ message: `Pengajuan berhasil di-${status}`, data: leave });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
