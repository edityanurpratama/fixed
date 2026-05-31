require('dotenv').config({ path: './backend/.env' });
const User = require('./backend/models/User');
const db = require('./backend/config/db');

async function fix() {
    await db.sync();
    const admin = await User.findOne({ where: { email: 'admin@nuraga.com' } });
    if (admin) {
        admin.password = 'password123';
        await admin.save();
        console.log("Admin password hashed and saved!");
    } else {
        console.log("Admin not found!");
    }
}
fix();
