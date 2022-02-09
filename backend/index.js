const express = require('express')
const bodyParser = require('body-parser')
const cors = require ('cors')
const app = express()
const mysql = require('mysql')

app.use(express.json())
app.use(cors())
app.use (bodyParser.urlencoded({extended: true}));