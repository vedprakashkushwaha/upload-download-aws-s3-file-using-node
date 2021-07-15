const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink) 
const { uploadFile, getFileStream } = require('./s3')
const upload = multer({dest: 'uploads/'})
const app = express();

app.get('/image/:key', async (req, res) => {
    const readStream = getFileStream(req.params.key);
    readStream.pipe(res);
})

app.post('/upload', upload.single('image'), async (req, res)=> {
    
    
    const result = await uploadFile(req.file);
    await unlinkFile(req.file.path)
    res.send(result.key);
    res.end();
})

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log("server is listing on port ", PORT);
})