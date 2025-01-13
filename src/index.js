const express = require("express");
const path = require("path");
const ejs = require("ejs");
const collection = require("./mongodb");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const templatePath = path.join(__dirname, "../views");

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
  })
);

app.use(cookieParser());

// Middleware
app.set("view engine", "ejs");
app.set("views", templatePath);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to decode the JWT token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.user = null;
    return next(); // Allow access to public routes
  }

  try {
    const decoded = jwt.verify(token, "shhh"); // Use the same secret as used during token creation
    req.user = decoded.email; // Attach user email to the request
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    req.user = null; // Clear user if token is invalid
    next();
  }
};

// Apply authentication middleware globally
app.use(authenticateToken);

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/home", (req, res) => {
  res.render("home");
});

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered. Please log in.",
      });
    }

    // Hash the password and save the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new collection({ email, password: hashedPassword });
    await newUser.save();

    // Create a new token for the user
    const token = jwt.sign({ email }, "shhh", { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Create a new token for the user
    const token = jwt.sign({ email }, "shhh", { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({ message: "Login successful!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Logout Route
app.get("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the JWT token cookie
  return res.redirect("/home");
});

// Account Route
app.get("/account", async (req, res) => {
  if (!req.user) {
    return res.redirect("/home"); // Redirect to home if not logged in
  }

  try {
    // Fetch the user's data using the email from the decoded token
    const user = await collection.findOne({ email: req.user });
    if (!user) {
      return res.redirect("/home"); // Redirect to home if user not found
    }

    res.render("myaccount", { user }); // Pass user data to the view
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/check-login", (req, res) => {
  if (req.cookies.token) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// Renting Route
app.get("/renting", (req, res) => {
  res.render("renting"); // Render the renting page
});

// Start the server
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
