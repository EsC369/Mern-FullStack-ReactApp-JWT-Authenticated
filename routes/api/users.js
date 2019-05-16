const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

// Item Model:
const User = require("../../models/User");

// @ desc     Register new User
// @ route    GET api/users
// @ access   Public
router.post("/", (req, res) => {
	// Destructuring, Pulling the values out from request.body
	const { name, email, password } = req.body;

	// Simple validation:
	if (!name || !email || !password) {
		return res.status(400).json({ msg: "Please enter all fields" });
	}

	// Check for existing user:
	User.findOne({ email: email })
		.then(user => {
			if (user) {
				return res.status(400).json({ msg: "User already exists..." });
			}
			const newUser = new User({
				name,
				email,
				password
			})
			// Create salt and hashed password:
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err
					newUser.password = hash;
					console.log("HASHED Password", hash);
					newUser.save()
						.then(user => {

							//Json Web Token Assign:
							jwt.sign(
								{ id: user.id},
								config.get("jwtSecret"),
								{expiresIn: 3600}, // one hour
								(err, token) => {
									if(err) throw err;
									res.json({
										token: token,
										user: {
											id: user.id,
											name: user.name,
											email: user.email
										}
									});
								}
							)

							
						});
				})
			})

		})
});

module.exports = router;