const express = require('express');
const cors = require('cors');
const candidateRoutes = require('./routes/candidateRoutes');
const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/candidates', candidateRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
