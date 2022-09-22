const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const middleware = require('./app/middleware/middleware')

app.use(cors())
app.use(bodyParser.json())
app.use(middleware)

require('./app/routes/user')(app)
require('./app/routes/auth')(app)

app.get('*', function (req, res) {
  res.status(404).send('Huhhh smart!')
});

const port = process.env.PORT || 1997

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
});
