const express = require('express')
const router = express.Router()
const { postJob, getJobs, getAllJobs, deleteJob, updateJob } = require('../controllers/jobsController')

router.post("/post", postJob)

router.get("/get", getAllJobs)

router.get("/get/:id", getJobs)

router.delete("/delete/:id", deleteJob)

router.put("/update/:id", updateJob)


module.exports = router