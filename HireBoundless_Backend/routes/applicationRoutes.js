const express = require('express')
const router = express.Router()
const { createApplication, getApplicationForJob, getAllApplicants, updateApplication } = require('../controllers/applicationController')

router.post("/create", createApplication)

router.get("/get/:jobId/:jobSeekerId", getApplicationForJob);

router.get("/getAll/:id", getAllApplicants)

router.put("/update/:id", updateApplication)





module.exports = router