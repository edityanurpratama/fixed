const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Audit = sequelize.define('Audit', {
    id_audit: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    auditor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tanggal: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    hasil: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    qr_code_asset: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    checklist_items: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
});

module.exports = Audit;
