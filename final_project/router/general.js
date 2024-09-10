const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	// Check if both username and password are provided
	if (username && password) {
		// Check if the user does not already exist
		if (!doesExist(username)) {
			// Add the new user to the users array
			users.push({ username: username, password: password });
			return res.status(200).json({
				message: "User successfully registered. Now you can login",
			});
		} else {
			return res.status(404).json({ message: "User already exists!" });
		}
	}
	// Return error if username or password is missing
	return res.status(404).json({ message: "Unable to register user." });
});

const doesExist = (username) => {
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

// Get the book list available in the shop
public_users.get("/", function (req, res) {
	asyncGetBooks().then((books) => {
		res.send(JSON.stringify(books));
	});
});

const asyncGetBooks = () => {
	return new Promise((resolve) => {
		resolve(books);
	});
};

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	let bookId = req.params["isbn"];

	asyncGetBooks().then((books) => {
		let filteredBook = books[bookId];
		res.send(JSON.stringify(filteredBook));
	});
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	let author = req.params["author"];

	asyncGetBooks().then((books) => {
		let filteredBook = Object.values(books).filter(
			(book) => book.author == author
		);
		res.send(JSON.stringify(filteredBook));
	});
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	let title = req.params["title"];

	asyncGetBooks().then((books) => {
		let filteredBook = Object.values(books).filter(
			(book) => book.title == title
		);
		res.send(JSON.stringify(filteredBook));
	});
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	let bookId = req.params["isbn"];
	let filteredBook = books[bookId];
	res.send(JSON.stringify(filteredBook.reviews));
});

module.exports.general = public_users;
