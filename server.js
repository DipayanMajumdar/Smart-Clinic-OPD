require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Appointment = require('./models/Appointment');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// --- API ROUTES ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const validUser = process.env.ADMIN_USER;
    const validPass = process.env.ADMIN_PASS;
    if (username === validUser && password === validPass) { 
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

app.post('/api/add-patient', async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const count = await Appointment.countDocuments({
        date: { $gte: startOfDay }
    });
    const newAppt = new Appointment({
        ...req.body,
        tokenNumber: count + 1,
        date: new Date()
    });
    await newAppt.save();
    res.json(newAppt);
});

app.post('/api/visit-skip', async (req, res) => {
    const { id } = req.body;
    await Appointment.findByIdAndUpdate(id, { status: 'Skipped' });
    res.json({ success: true });
});

app.get('/api/queue', async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const queue = await Appointment.find({
        date: { $gte: startOfDay },
        status: { $ne: 'Done' }
    }).sort('tokenNumber');
    
    res.json(queue);
});

app.post('/api/visit-start', async (req, res) => {
    const { id } = req.body;
    await Appointment.updateMany(
        { status: 'Serving', _id: { $ne: id } }, 
        { status: 'Waiting' }
    );
    await Appointment.findByIdAndUpdate(id, { status: 'Serving' });
    res.json({ success: true });
});

app.post('/api/visit-stop', async (req, res) => {
    await Appointment.updateMany({ status: 'Serving' }, { status: 'Waiting' });
    res.json({ success: true });
});

app.post('/api/prescribe', async (req, res) => {
    try {
        const { id, medicines, status } = req.body;
        if (!id) return res.status(400).json({ error: "Patient ID is required" });
        const updatedPatient = await Appointment.findByIdAndUpdate(
            id,
            { 
                $set: { 
                    medicines: medicines, 
                    status: status || 'Done' 
                } 
            },
            { new: true }
        );
        if (!updatedPatient) {
            return res.status(404).json({ error: "Patient not found" });
        }
        res.json({ success: true, data: updatedPatient });
    } catch (err) {
        console.error("❌ Save Error:", err);
        res.status(500).json({ error: "Failed to save prescription" });
    }
});

app.get('/reception', (req, res) => res.sendFile(path.join(__dirname, 'public', 'reception.html')));
app.get('/doctor', (req, res) => res.sendFile(path.join(__dirname, 'public', 'doctor.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));