const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth")

// Item Model:
const User = require("../../models/User");

// @ desc     Auth user/login
// @ route    GET api/auth
// @ access   Public
router.post("/", (req, res) => {
	// Destructuring, Pulling the values out from request.body
	const { email, password } = req.body;

	// Simple validation:
	if (!email || !password) {
		return res.status(400).json({ msg: "Please enter all fields" });
	}

	// Check for existing user:
	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				return res.status(400).json({ msg: "User does not exist!" });
			}
			// Compare password with hash:   user.password = hash
			bcrypt.compare(password, user.password)
			.then(isMatch => {
				if(!isMatch) return res.status(400).json({ msg: "Invalid credentials..." });
				// If match successful then send token:
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
							}});
					})})
			//End of token/post----
		});
});

// @ desc     Get User Data
// @ route    GET user
// @ access   Private
router.get("/user", auth, (req, res) => {
	User.findById(req.user.id)
	// disregard password/Dont select/use password:
	.select("-password")
	.then(user => res.json(user));
})

module.exports = router;