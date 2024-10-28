const usersModel = require('../models/usersSchema');
const jobsModel = require('../models/jobsShema');
const companyModel = require('../models/companiesSchema');

const postJob = async (req, res) => {
    try {
        const { title, description, postedBy, salary, monthly, responsibilities, company, companyIcon, experience, skills, qualification, location, jobType } = req.body;

        if (!company) {
            return res.status(201).json({ message: 'Company not found', success: false });
        }

        // Check if the company already exists
        const existingCompany = await companyModel.findById({ _id: company });
        if (!existingCompany) {
            return res.status(201).json({ message: 'Company not found', success: false });
        }

        const newJob = new jobsModel({ title, companyIcon, responsibilities, company, postedBy, monthly, salary, description, experience, skills, qualification, location, jobType });
        await newJob.save();
        res.status(200).json({ message: 'Job posted successfully', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error posting job', error });
    }
}

const getAllJobs = async (req, res) => {


    try {
        const jobs = await jobsModel
            .find()
            .populate({
                path: 'postedBy',
                select: 'profile.avatar companies', // Select fields to populate

            })
            .populate({
                path: 'company',
                select: 'name location', // Select fields to populate

            })


        res.status(200).json({ jobs, success: true });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
}


const getJobs = async (req, res) => {
    try {
        const { id } = req.params
        const jobs = await jobsModel
            .find({ postedBy: id })
            .populate({
                path: 'postedBy',
                select: 'profile.avatar', // Select fields to populate
            })
            .populate({
                path: 'company',
                select: 'name location', // Select fields to populate
            })


        res.status(200).json({ jobs, success: true });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
}

//delete job ----

const deleteJob = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(201).json({ message: 'Job id is required', success: false });
        }
        const deletedJob = await jobsModel.findByIdAndDelete({ _id: id })
        if (deletedJob) {
            return res.status(201).json({ message: 'Job deleted successfully', success: true });
        } else {
            return res.status(201).json({ message: 'Job not found', success: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting job', error });
    }
}

const updateJob = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(201).json({ message: 'Job id is required', success: false });
        }
        const updatedJob = await jobsModel.findByIdAndUpdate({ _id: id }, req.body)
        if (updatedJob) {
            return res.status(201).json({ message: 'Job updated successfully', success: true });
        } else {
            return res.status(201).json({ message: 'Job not found', success: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating job', error });
    }
}


module.exports = {
    postJob,
    getAllJobs,
    getJobs,
    deleteJob,
    updateJob
}
