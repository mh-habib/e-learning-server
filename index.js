const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 5000;


//Database Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u9gzn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
	console.log('Connection Error:', err);
	const courseCollection = client.db("e-learning").collection("course");
	const reviewMessageCollection = client.db("e-learning").collection("message");
	const contactMessageCollection = client.db("e-learning").collection("contact-message");
	const orderCollection = client.db("e-learning").collection("order");
	const adminCollection = client.db("e-learning").collection("admin");
	// console.log("Database Connected Successfully!");

	app.post('/addAdmin', (req, res) => {
		const newAdmin = req.body;
		// console.log('Add to server:', newProduct);
		adminCollection.insertOne(newAdmin)
			.then(result => {
				// console.log('inserted count:', result.insertedCount)
				res.send(result.insertedCount > 0)
			})
	})
	app.post('/isAdmin', (req, res) => {
		const email = req.body.email;
		adminCollection.find({ email: email })
			.toArray((err, admin) => {
				res.send(admin.length > 0) 

			})
	})


	app.post('/addCourse', (req, res) => {
		const newCourse = req.body;
		// console.log('Add to server:', newProduct);
		courseCollection.insertOne(newCourse)
			.then(result => {
				// console.log('inserted count:', result.insertedCount)
				res.send(result.insertedCount > 0)
			})
	})
	app.get('/getCourses', (req, res) => {
		courseCollection.find({})
			.toArray((err, items) => {
				res.send(items)
			})
	})
	app.delete("/deleteCourse/:id", (req, res) => {
		// console.log(req.params.id);
		courseCollection.deleteOne({ _id: ObjectID(req.params.id) })
			.then(result => {
				//   console.log(result);
				res.send(result.deletedCount > 0)
			})
	})


	app.post('/submitOrder', (req, res) => {
		const newOrder = req.body;
		// console.log('Add to server:', newProduct);
		orderCollection.insertOne(newOrder)
			.then(result => {
				// console.log('inserted count:', result.insertedCount)
				res.send(result.insertedCount > 0)
			})
	})
	app.post('/allOrders', (req, res) => {
		const email = req.body.email;
		adminCollection.find({ email: email })
			.toArray((err, admin) => {
				if (admin.length === 0) {
					orderCollection.find({email: email})
						.toArray((err, items) => {
							res.send(items)
						})
				} else {
					orderCollection.find({})
						.toArray((err, items) => {
							res.send(items)
						})
				}

			})
	})
	app.get('/userOrders', (req, res) => {
		orderCollection.find({ email: req.query.email })
			.toArray((err, items) => {
				res.send(items)
			})
	})

	app.patch('/updateStatus/:id', (req, res) => {
		orderCollection.updateOne({ _id: ObjectID(req.params.id) },
			{
				$set: { status: req.body.selectedValue }
			})
			.then(result => {
				res.send(result.modifiedCount > 0)
			})
	})


	app.post('/review', (req, res) => {
		const newReview = req.body;
		// console.log('Add to server:', newProduct);
		reviewMessageCollection.insertOne(newReview)
			.then(result => {
				// console.log('inserted count:', result.insertedCount)
				res.send(result.insertedCount > 0)
			})
	})
	app.get('/getReview', (req, res) => {
		reviewMessageCollection.find({})
			.toArray((err, items) => {
				res.send(items)
			})
	})


	app.post('/contactMessage', (req, res) => {
		const newContactMessage = req.body;
		// console.log('Add to server:', newProduct);
		contactMessageCollection.insertOne(newContactMessage)
			.then(result => {
				// console.log('inserted count:', result.insertedCount)
				res.send(result.insertedCount > 0)
			})
	})
	app.get('/getContactMessage', (req, res) => {
		contactMessageCollection.find({})
			.toArray((err, items) => {
				res.send(items)
			})
	})
	app.delete("/deleteContactMessage/:id", (req, res) => {
		// console.log(req.params.id);
		contactMessageCollection.deleteOne({ _id: ObjectID(req.params.id) })
			.then(result => {
				//   console.log(result);
				res.send(result.deletedCount > 0)
			})
	})



	//client.close();
});


app.get('/', (req, res) => {
	res.send('Hello, I am Working');
})

app.listen(port)