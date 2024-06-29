const express = require('express');
const mysql2 = require('mysql2');

const app = express();
app.use(express.json())
require('dotenv').config({ path: `.env` });
const PORT = 3000;

const db_host = process.env.HOST;
const db_user = process.env.USER;
const db_password = process.env.PASSWORD;
const db_database = process.env.DATABASE;

console.log(db_host);

const db = mysql2.createConnection({
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_database
})

db.connect((err) =>{
    if(err){
        console.log('Error connecting to database');
        return;
    }
    console.log('Connected to database');
})

//get all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) throw err;
        res.json(results);
    })
})

//get specific user
app.get('/users/:id', (req, res) => {
    const {id} = req.params
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    })
})

//add a new user
app.post('/users', (req, res) => {
    const {name, email} = req.body
    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, results) => {
        if (err) throw err;
        res.json({message: 'User added', id: results.insertId})
    })
})

//update user
app.put('/users/:id', (req, res) => {
    const {name, email} = req.body
    const {id} = req.params
    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err) => {
        if(err) throw err
        res.json({message: 'user updated'})
    })
})

//delete user
// app.delete('/users/:id', (req, res) => {
//     const {id} = req.params
//     db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
//         if(err) throw err
//         res.json({message: 'User deleted'})
//     })
// })/

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
      if (err) throw err;
      res.json({ message: 'User deleted successfully' });
    });
  });

app.listen(PORT, () => {
    console.log('Server running on port 3000');
})