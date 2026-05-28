const WorkPermit = require('../models/WorkPermit');
const User = require('../models/User');

const requestPermit = async (req, res) => {
    try {
        const permit = await WorkPermit.create({
            ...req.body,
            id_user: req.user.id,
            status: 'Pending'
        });

        res.status(201).json(permit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPermits = async (req, res) => {
    try {
        const queryOptions = {
            include: [
                { model: User, attributes: ['nama'], as: 'User' },
                { model: User, attributes: ['nama'], as: 'approver' }
            ],
            order: [['createdAt', 'DESC']]
        };

        // Operators and Contractors can only see their own permits.
        // Admins, HSE, Supervisors, and Managers can see all permits.
        if (req.user.role === 'Operator' || req.user.role === 'Kontraktor') {
            queryOptions.where = { id_user: req.user.id };
        }

        const permits = await WorkPermit.findAll(queryOptions);
        res.json(permits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const approvePermit = async (req, res) => {
    try {
        const { status } = req.body; // 'Approved' or 'Rejected'
        const permit = await WorkPermit.findByPk(req.params.id);
        if (!permit) return res.status(404).json({ message: 'Permit not found' });

        if (status === 'Rejected') {
            permit.status = 'Rejected';
            await permit.save();
            return res.json(permit);
        }

        const userRole = req.user.role;

        // Step 1: Wait for Supervisor (SPV)
        if (permit.approval_step === 1) {
            if (userRole !== 'Supervisor' && userRole !== 'Admin') {
                return res.status(403).json({ message: 'Only Supervisor can approve this step.' });
            }
            permit.supervisor_sig = true;
            permit.supervisor_approved_at = new Date();
            permit.approval_step = 2;
            await permit.save();
            return res.json(permit);
        }

        // Step 2: Wait for HSE
        if (permit.approval_step === 2) {
            if (userRole !== 'HSE' && userRole !== 'Admin') {
                return res.status(403).json({ message: 'Only HSE Officer can approve this step.' });
            }
            permit.safety_officer_sig = true;
            permit.safety_officer_approved_at = new Date();
            permit.approval_step = 3;
            await permit.save();
            return res.json(permit);
        }

        // Step 3: Wait for Manager
        if (permit.approval_step === 3) {
            if (userRole !== 'Manager' && userRole !== 'Admin') {
                return res.status(403).json({ message: 'Only Manager can approve this step.' });
            }
            permit.approver_sig = true;
            permit.manager_approved_at = new Date();
            permit.approval_step = 4;
            permit.status = 'Approved';
            permit.approved_by = req.user.id;
            await permit.save();
            return res.json(permit);
        }

        return res.status(400).json({ message: 'This permit is already fully processed.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { requestPermit, getPermits, approvePermit };
