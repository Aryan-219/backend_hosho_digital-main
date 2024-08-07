const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const PDFDocument = require('pdfkit');
const cors = require('cors');

const { generateTeam } = require('./utils/generationTeam')

const app = express();

app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const extension = file.mimetype.split('/')[1];
        cb(null, `ic.${extension}`);
    },
});

const upload = multer({ storage });

app.get('/api/v1', (req, res, next) => {
    res.send({
        status: 200,
        message: 'Welcome to the API',
    })
})


// Endpoint to handle generation of team
app.get('/api/v1/generate-team', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', "ic.csv");

    // Read and parse the Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const team = generateTeam(data);

    // Create a new PDF document
    const doc = new PDFDocument();

    // Pipe the document to a writable stream (response in this case)
    const PDFPath = 'output.pdf';
    doc.pipe(fs.createWriteStream(PDFPath));

    // Add title
    doc.fontSize(20).text('Team Members', { align: 'left' });

    // Add some space
    doc.moveDown();

    // Add table headers
    doc.fontSize(12).text('Name', { width: 200, continued: true })
        .text('Position', { width: 200, align: 'right' });

    doc.moveDown();

    // Add table rows
    team.forEach(item => {
        doc.fontSize(12).text(item.Name, { width: 200, continued: true })
            .text(item.Position, { width: 200, align: 'right' })
            .moveDown(0.5);

        doc.moveDown();
    });

    // Finalize the PDF and end the stream
    doc.end();

    // Send the file to the client
    res.download(PDFPath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to download file.');
        }
        // fs.unlinkSync(PDFPath); // Delete the file after sending it
    });
})

// Endpoint to handle file uploads
app.post('/api/v1/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }
    res.send({ message: 'File uploaded successfully' });
});

module.exports = app;