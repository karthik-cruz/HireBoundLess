const usersModel = require('../models/usersSchema');
const companyModel = require('../models/companiesSchema');
const jobsModel = require('../models/jobsShema');


const companyCreate = async (req, res) => {
    try {
        const { name, industry, city, state, size, link, recruiterId } = req.body;
        //check if the company already exists -------
        const existingCompany = await companyModel.findOne({ name });
        if (existingCompany) {
            return res.status(201).json({ message: 'Company already exists', success: false });
        }
        //check if the recruiterId exists -------
        const existingUser = await usersModel.findById(recruiterId);
        if (!existingUser) {
            return res.status(201).json({ message: 'Recruiter not found', success: false });
        }
        const location = { city, state }

        const newCompany = new companyModel({
            name,
            industry,
            location,
            size,
            link,
            recruiterId
        });
        existingUser.profile.company = newCompany._id
        // console.log(existingUser.profile)
        // console.log(existingUser.profile.company)
        await newCompany.save();
        await existingUser.save();
        res.status(200).json({ message: 'Company created successfully', success: true, newCompany });

    } catch (error) {
        res.status(500).json({ message: 'Error creating company', error });
    }
};

const getCompany = async (req, res) => {
    try {
        const { id } = req.params
        const company = await companyModel.findOne({ recruiterId: id });
        if (!company) {
            return res.status(201).json({ message: 'Company not found', success: false });
        }
        res.status(200).json({ company, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company', error });
    }
}

const updateCompany = async (req, res) => {
    try {
        const { id } = req.params
        const company = await companyModel.findById(id);
        if (!company) {
            return res.status(201).json({ message: 'Company not found', success: false });
        }
        const { name, industry, size, link, state, city } = req.body;
        const location = { state, city }
        const updatedCompany = await companyModel.updateOne({ _id: id }, {
            $set: {
                name,
                industry,
                location,
                size,
                link
            }
        })
        res.status(200).json({ message: 'Company updated successfully', success: true, updatedCompany });
    } catch (error) {
        res.status(500).json({ message: 'Error updating company', error });
    }
}

const getAllCompany = async (req, res) => {
    try {
        // Fetch all companies and populate recruiterId
        const companies = await companyModel
            .find()
            .populate({
                path: 'recruiterId',
                select: 'profile.avatar', // Select fields to populate
            });

        // Fetch jobs for each company and add them to the company data
        const companiesWithJobs = await Promise.all(
            companies.map(async (company) => {
                const jobs = await jobsModel.find({ company: company._id }); // Find jobs related to each company
                return { ...company.toObject(), jobs }; // Convert Mongoose document to plain object and add jobs
            })
        );

        res.status(200).json({ companies: companiesWithJobs, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching companies', error });
    }
};


module.exports = {
    companyCreate,
    getCompany,
    updateCompany,
    getAllCompany
}