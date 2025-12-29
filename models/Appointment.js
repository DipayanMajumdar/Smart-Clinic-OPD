const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    patientName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0, max: 120 },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    phone: { type: String, required: true },
    tokenNumber: Number,
    status: { type: String, default: 'Waiting', enum: ['Waiting', 'Serving', 'Done', 'Skipped'] },
    medicines: [{
        name: String,
        dose: String,
        days: String
    }],
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);