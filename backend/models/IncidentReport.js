const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const IncidentReport = sequelize.define('IncidentReport', {
    id_incident: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    kategori: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    five_whys: {
        type: DataTypes.JSON, // { why1, why2, why3, why4, why5 }
        allowNull: true,
    },
    loss_cost: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    koordinat_gps: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    kronologi: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    korban: {
        type: DataTypes.STRING,
        allowNull: true,
    },

}, {
    timestamps: true,
});

module.exports = IncidentReport;
