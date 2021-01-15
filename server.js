const express = require('express');
const fileUpload = require('express-fileupload');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'myapp'
});

app.use( fileUpload() );


app.post('/upload', (req, res) => {
  if(req.files === null){
    return res.status(400).json({msg:'no file uploaded'});
  }
  const file = req.files.file;
  file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
    if(err){
      return res.status(500).send(err);
    }
    let spawn = require("child_process").spawn;
    let minsup = req.body.minsup;
    let minconf = req.body.minconf;
    let maxoutput = req.body.maxoutput;
    let sort = req.body.sort;
    let pythonProcess = spawn('python',["process.py", `${__dirname}/client/public/uploads/${file.name}`, minsup, minconf, maxoutput, sort])
    pythonProcess.stdout.on('data', (data0) => {
        const time = new Date()
        let sql = "INSERT INTO history (time,csv,min_sup,min_conf,max_output,sort) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [time, file.name, minsup, minconf, maxoutput, sort], (err, data, fields) => {
            if(err){
              console.log(err)
              return;
            }
            return;
        });       
        const parsedString = JSON.parse(data0);
        rules = parsedString.Rule;
        res.json({
          fileName: file.name,
          rules: rules,
        });
        return;
    });
  });  
});

app.get('/history', (req, res) => {
    let sql = 'SELECT * FROM history order by id desc limit 10'
    db.query(sql, (err, data, fields) => {
        if(err){
            console.log(err);
            return;
        }
        res.json({
            history: data
        });
    });
});


app.listen(
  5000,
  () => {
    console.log('Server started...')
  }
);