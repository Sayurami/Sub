const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Setup uploads folder
const upload = multer({ dest: 'uploads/' });

app.use(express.static('../frontend'));
app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).send('No video uploaded');

    const videoPath = path.resolve(req.file.path);
    const vttPath = videoPath.replace(path.extname(videoPath), '.vtt');

    exec(`python generate_sub.py "${videoPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Subtitle generation failed');
        }

        const videoFile = `/uploads/${req.file.filename}`;
        const subFile = `/uploads/${path.basename(vttPath)}`;

        // Move generated .vtt to uploads folder
        fs.renameSync(vttPath, path.join('uploads', path.basename(vttPath)));

        res.json({
            video: videoFile,
            subtitles: subFile
        });
    });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
