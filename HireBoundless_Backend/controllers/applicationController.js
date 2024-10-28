const usersModel = require('../models/usersSchema');
const jobsModel = require('../models/jobsShema'); // Ensure the filename is correct (jobsSchema)
const companyModel = require('../models/companiesSchema');
const applicationModel = require('../models/applicationSchema');

const createApplication = async (req, res) => {
    try {
        const { jobId, jobSeekerId, status } = req.body;

        // Validate job
        const job = await jobsModel.findById(jobId);
        if (!job) {
            return res.status(201).json({ message: 'Job not found', success: false });
        }

        // Validate job seeker
        const jobSeeker = await usersModel.findById(jobSeekerId);
        if (!jobSeeker) {
            return res.status(201).json({ message: 'Job seeker not found', success: false });
        }

        // Check for existing application
        const existingApplication = await applicationModel.findOne({ jobSeekerId, jobId });
        if (existingApplication) {
            return res.status(201).json({ message: 'Application already exists', success: false });
        }

        // Create new application
        const newApplication = new applicationModel({ jobSeekerId, jobId, status });
        await newApplication.save();

        // Push application ID to job's applications array
        job.applications.push(newApplication._id); // Corrected field name
        await job.save();

        // Send success response
        return res.status(201).json({
            message: 'Job Applied successfully',
            success: true,
            application: newApplication
        });

    } catch (error) {
        console.error(error, "Error creating application");
        return res.status(500).json({ message: 'Error creating application', error });
    }
}

const getApplicationForJob = async (req, res) => {
    try {
        const { jobId, jobSeekerId } = req.params; // get jobId and jobSeekerId from request params

        // Find the job by jobId
        const job = await jobsModel.findById(jobId).populate('applications'); // Populate applications for this job

        if (!job) {
            return res.status(201).json({ message: 'Job not found', success: false });
        }

        // Find the specific application for the logged-in job seeker
        const userApplication = job.applications.find(application => application.jobSeekerId.toString() === jobSeekerId);

        // Return the application details
        return res.status(200).json({ success: true, application: userApplication });

    } catch (error) {
        console.error("Error fetching user application:", error);
        return res.status(500).json({ message: 'Error fetching user application', error });
    }
}


const getAllApplicants = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await applicationModel.findById(id)
            .populate({
                path: 'jobSeekerId',
                select: 'profile.resume name email',
            })
        if (!application) {
            return res.status(201).json({ message: 'Application not found', success: false });
        }

        return res.status(200).json({ success: true, application });
    } catch (error) {
        console.error("Error fetching user application:", error);
        return res.status(500).json({ message: 'Error fetching user application', error });
    }
}

const updateApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const application = await applicationModel.findById(id);

        if (!application) {
            return res.status(201).json({ message: 'Application not found', success: false });
        }

        application.status = status;
        await application.save();
        return res.status(200).json({ success: true, application, message: "status updated" });
    } catch (error) {
        console.error("Error fetching user application:", error);
        return res.status(500).json({ message: 'Error fetching user application', error });
    }
}

module.exports = {
    createApplication,
    getApplicationForJob,
    getAllApplicants,
    updateApplication
};
