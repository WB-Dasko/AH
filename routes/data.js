const express = require("express");
const nodemailer = require('nodemailer');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.

const router = express.Router();
// This will help us connect to the database
const db = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - id
 *         - externalAttributes             
 *         - vehicle
 *         - actors
 *         - actions
 *       properties:
 *         id:
 *           type: string
 *           description: The id of the trip supplies by AH
 *         externalAttributes:
 *           type: object
 *           description: externalAttributes
 *         vehicle:
 *           type: object
 *           description: Requested  vehicle for the trip 
 *         actors:
 *           type: array
 *           description: actors information
 *         actions:
 *           type: array
 *           description: List of actions for this trip
 *   
 */

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: The trips managing API
 * /trips/:
 *   post:
 *     summary: Create new data for a trip
 *     tags: [Api]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       200:
 *         description: The created trip.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       500:
 *         description: Some server error
 *   get:
 *     summary: Retrieve last 50 trips
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: Last 50 trip entries.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 * /trips/{id}:
 *   get:
 *     summary: Get the Trip data by id (ah)
 *     tags: [Metrics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The trip id supplied by AH
 *     responses:
 *       200:
 *         description: The Trip response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       404:
 *         description: The Trip was not found
 */

router.get("/", (req, res) => {
  res.redirect('/api-docs')
});

// Get a list of 50 entries
router.get("/trips", async (req, res) => {
  let db_connect = db.getDb();
  let collection = db_connect.collection("data");
  let results = await collection.find({})
    .limit(50)
    .toArray();

  res.send(results).status(200);
});

router.post('/trips', async (req, res) => {
  if (!req.body) {
    res.sendStatus(404)
  }
  let db_connect = db.getDb();
  let collection = db_connect.collection("data");
  let newDocument = req.body;
  newDocument.created = new Date();
  let result = await collection.insertOne(newDocument);
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// });
  res.status(200).send(result)
});


router.get("/trips/:id", async (req, res) => {
  var id = req.params.id
  let db_connect = db.getDb();
  let collection = db_connect.collection("data");
  let results = await collection.find({ id: id.toString() })
    .toArray();
  results ? res.status(200).json(results) : res.sendStatus(404);
});

// This section will help you get a list of all the records.


module.exports = router;
