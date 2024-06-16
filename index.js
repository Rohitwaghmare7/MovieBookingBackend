const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors') 
const bodyParser = require('body-parser');

connectToMongo();
const app = express()
const port = 5000
app.use(cors())

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json())

app.use('/api/users', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})