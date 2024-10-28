const mongoose = require('mongoose');

const jobsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'companies',
        required: true
    },
    responsibilities: {
        type: String
    },
    experience: {
        type: String,
    },
    skills: {
        type: String
    },
    qualification: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    companyIcon: {
        type: String
    },
    jobType: {
        type: String,
        required: true
    },
    salary: {
        type: String
    },
    monthly: {
        type: Boolean
    },
    address: {
        type: String
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }, // Recruiter ID
    postedDate: {
        type: Date,
        default: Date.now
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'applications'
        }
    ]
});

module.exports = mongoose.model('Jobs', jobsSchema);
