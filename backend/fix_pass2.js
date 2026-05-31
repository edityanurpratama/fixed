require('dotenv').config();
const User = require('./models/User');
const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function fix() {
    await db.sync();
    const admin = await User.findOne({ where: { email: 'admin@nuraga.com' } });
    if (admin) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash('password123', salt);
        await admin.save({ hooks: false });
        console.log("Admin password FORCED hashed and saved!");
    } else {
        console.log("Admin not found!");
    }
}
fix();
