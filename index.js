// index.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/authRoute');
const protectedRoutes = require('./routes/protected');
const studentRoutes = require('./routes/studentRoute');
const applicationRoutes = require('./routes/applicationRoute');
const jobRoutes = require("./routes/jobRoute");


dotenv.config();


connectDB();

const app = express();


app.use(cors());
app.use(express.json()); 


app.get('/', (req, res) => {
  res.send('API is running...');
});


app.use('/api/students', studentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use("/api", jobRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
