const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Certification = sequelize.define('Certification', {
    id_certification: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nama_personil: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jenis_sertifikasi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nomor_sertifikat: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tanggal_terbit: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    tanggal_expired: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Expired', 'Processing'),
        defaultValue: 'Active',
    },
}, {
    timestamps: true,
});

module.exports = Certification;
