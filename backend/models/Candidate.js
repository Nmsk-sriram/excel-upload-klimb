const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true }, 
    dateOfBirth: { type: Date, required: false }, 
    workExperience: { type: String, required: false }, 
    resumeTitle: { type: String, required: false }, 
    currentLocation: { type: String, required: false }, 
    postalAddress: { type: String, required: false }, 
    currentEmployer: { type: String, required: false }, 
    currentDesignation: { type: String, required: false }, 
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
