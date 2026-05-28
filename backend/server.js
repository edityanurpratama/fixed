const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

// Import models to sync
const User = require('./models/User');
const HazardReport = require('./models/HazardReport');
const IncidentReport = require('./models/IncidentReport');
const Audit = require('./models/Audit');
const CorrectiveAction = require('./models/CorrectiveAction');
const Certification = require('./models/Certification');
const EmergencyCall = require('./models/EmergencyCall');
const WorkPermit = require('./models/WorkPermit');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads
app.use('/uploads', express.static('uploads'));

// Associations
User.hasMany(HazardReport, { foreignKey: 'id_user', sourceKey: 'id_user' });
HazardReport.belongsTo(User, { foreignKey: 'id_user', targetKey: 'id_user' });

User.hasMany(IncidentReport, { foreignKey: 'id_user', sourceKey: 'id_user' });
IncidentReport.belongsTo(User, { foreignKey: 'id_user', targetKey: 'id_user' });

HazardReport.hasMany(CorrectiveAction, { foreignKey: 'id_hazard', sourceKey: 'id_hazard' });
CorrectiveAction.belongsTo(HazardReport, { foreignKey: 'id_hazard', targetKey: 'id_hazard' });

Audit.belongsTo(User, { as: 'auditor', foreignKey: 'auditor_id', targetKey: 'id_user' });
CorrectiveAction.belongsTo(User, { as: 'assignee', foreignKey: 'assigned_to', targetKey: 'id_user' });

User.hasMany(Certification, { foreignKey: 'id_user', sourceKey: 'id_user' });
Certification.belongsTo(User, { foreignKey: 'id_user', targetKey: 'id_user' });

User.hasMany(WorkPermit, { foreignKey: 'id_user', sourceKey: 'id_user' });
WorkPermit.belongsTo(User, { foreignKey: 'id_user', targetKey: 'id_user' });

EmergencyCall.belongsTo(User, { as: 'responder', foreignKey: 'handled_by', targetKey: 'id_user' });
WorkPermit.belongsTo(User, { as: 'approver', foreignKey: 'approved_by', targetKey: 'id_user' });


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/hazards', require('./routes/hazardRoutes'));
app.use('/api/incidents', require('./routes/incidentRoutes'));
app.use('/api/audits', require('./routes/auditRoutes'));
app.use('/api/actions', require('./routes/correctiveActionRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/certifications', require('./routes/certificationRoutes'));
app.use('/api/permits', require('./routes/workPermitRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Nuraga API' });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

// Sync Database & Start Server with robust port handling
// force:false = don't touch existing tables (safest for production-like use)
function startServer(port, retries = 5) {
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
            if (retries > 0) {
                console.warn(`Port ${port} in use, trying port ${port + 1} (${retries} retries left)`);
                setTimeout(() => startServer(port + 1, retries - 1), 1000);
            } else {
                console.error(`Port ${port} in use and no retries left. Exiting.`);
                process.exit(1);
            }
        } else {
            console.error('Server error:', err);
            process.exit(1);
        }
    });

    return server;
}

sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
    startServer(PORT);
}).catch(err => {
    console.error('Failed to sync database: ' + err.message);
    process.exit(1);
});

module.exports = app;
