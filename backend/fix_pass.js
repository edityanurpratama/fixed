require('dotenv').config();
const User = require('./models/User');
const db = require('./config/db');

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
