const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	// Filter the users array for any user with the same username
	let userswithsamename = users.filter((user) => {
		return user.username === username;
	});
	// Return true if any user with the same username is found, otherwise false
	if (userswithsamename.length > 0) {
		return true;
	} else {
		return false;
	}
};

const authenticatedUser = (username, password) => {
	let validusers = users.filter((user) => {
		return user.username === username && user.password === password;
	});

	if (validusers.length > 0) {
		return true;
	} else {
		return false;
	}
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	// Check if username or password is missing
	if (!username || !password) {
		return res.status(404).json({ message: "Error logging in" });
	}
	// Authenticate user
	if (authenticatedUser(username, password)) {
		// Generate JWT access token
		let accessToken = jwt.sign(
			{
				data: password,
			},
			"access",
			{ expiresIn: 60 * 60 }
		);
		// Store access token and username in session
		req.session.authorization = {
			accessToken,
			username,
		};
		return res.status(200).send("User successfully logged in");
	} else {
		return res
			.status(208)
			.json({ message: "Invalid Login. Check username and password" });
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  if(!username){
    res.status(403).json({message: "User not found"})
  }

	const bookId = req.params["isbn"];
	const reviewContent = req.query["review"];

  const filteredBook = books[bookId];

  if(!filteredBook){
    res.status(404).json({message: "Book not found"})
  }

  filteredBook.review = reviewContent

	return res.send(JSON.stringify(filteredBook))
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  if(!username){
    res.status(403).json({message: "User not found"})
  }

	const bookId = req.params["isbn"];
  const filteredBook = books[bookId];

  if(!filteredBook){
    res.status(404).json({message: "Book not found"})
  }

  filteredBook.review = {}

	return res.status(300).json({ message: "Deleted Successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
