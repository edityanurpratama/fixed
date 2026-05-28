const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ContractorCSMS = sequelize.define('ContractorCSMS', {
    id_vendor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nama_pt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dokumen_legal: {
        type: DataTypes.JSON, // { insurance: url, bpjs: url, profile: url }
        allowNull: true,
    },
    safety_score: {
        type: DataTypes.FLOAT,
        defaultValue: 100,
    },
    status: {
        type: DataTypes.ENUM('Qualified', 'Blacklisted', 'Pending Review'),
        defaultValue: 'Pending Review',
    },
}, {
    timestamps: true,
});

module.exports = ContractorCSMS;
