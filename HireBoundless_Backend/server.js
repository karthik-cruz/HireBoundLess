const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 9000;
const seedAdmin = require("./controllers/seedAdminController");
//import routes ----
const userRoutes = require("./routes/usersRoutes");
const companiesRoutes = require("./routes/companiesRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const path = require("path");
const jobRoutes = require("./routes/jobsRoutes");



dotenv.config();
//mongoose connect
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log("Database connected successfully");
    await seedAdmin();
}).catch((err) => {
    console.log("database connect error:" + err.message);
})



//middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads', 'avatars')));
app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads', 'resumes')));


//routes 
app.use("/", userRoutes);
app.use("/company", companiesRoutes)
app.use("/job", jobRoutes)
app.use("/application", applicationRoutes)



//server running ------------
app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server is running on port ${PORT}`);
    } else {
        console.log(error.message);
    }
});