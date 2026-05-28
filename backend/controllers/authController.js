const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { nama, email, password, role } = req.body;
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ nama, email, password, role });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: user.id_user, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.json({
            token,
            user: {
                id: user.id_user,
                nama: user.nama,
                email: user.email,
                role: user.role,
                foto: user.foto,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }
        // In a real app, send email with reset link. Here we just mock success.
        res.json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update password (Model will hash it in beforeUpdate hook)
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { nama, email } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        if (nama) user.nama = nama;
        if (email) {
            if (email !== user.email) {
                const userExists = await User.findOne({ where: { email } });
                if (userExists) {
                    return res.status(400).json({ message: 'Email sudah digunakan oleh user lain' });
                }
                user.email = email;
            }
        }
        if (req.file) {
            user.foto = req.file.filename;
        }

        await user.save();

        res.json({
            message: 'Profil berhasil diperbarui',
            user: {
                id: user.id_user,
                nama: user.nama,
                email: user.email,
                role: user.role,
                foto: user.foto,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password saat ini salah' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, getMe, forgotPassword, resetPassword, updateProfile, changePassword };


