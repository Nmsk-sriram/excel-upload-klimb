const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const async = require('async');
const Candidate = require('../models/Candidate');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => { 
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
        for (const record of data) {
            const candidateData = {
                name: record["Name of the Candidate"],
                email: record["Email"],
                phone: record["Mobile No."],
                dateOfBirth: record["Date of Birth"],
                workExperience: record["Work Experience"],
                resumeTitle: record["Resume Title"],
                currentLocation: record["Current Location"],
                postalAddress: record["Postal Address"],
                currentEmployer: record["Current Employer"],
                currentDesignation: record["Current Designation"]
            };
            if (!candidateData.email) {
                console.log('Skipping record due to missing email:', record);
                continue;
            }

            try {
                const existingCandidate = await Candidate.findOne({ email: candidateData.email });

                if (existingCandidate) {
                    console.log(`Skipping duplicate email: ${candidateData.email}`);
                    continue; 
                }
                const candidate = new Candidate(candidateData);
                await candidate.save(); 

            } catch (err) {
                console.error(`Error processing candidate ${candidateData.email}:`, err);
                return res.status(500).send('Error processing records.');
            }
        }

        res.send('File uploaded and data processed successfully.');

    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Error processing file.');
    }
});

module.exports = router;
