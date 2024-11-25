const path = require('path');
const express = require('express');
const cors = require('cors');

const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

const app1 = express();

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC72IaKW_9HPGY5ClP0o1WCmwdstooPeg0",
  authDomain: "parkar-448b3.firebaseapp.com",
  databaseURL: "https://parkar-448b3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parkar-448b3",
  storageBucket: "parkar-448b3.firebasestorage.app",
  messagingSenderId: "323068255491",
  appId: "1:323068255491:web:6e04e08b3a96b211581d36",
  measurementId: "G-YJV0N8GJND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Middleware
app1.use(cors({ origin: '*' })); // Allow all origins
app1.use(express.json());
app1.use(express.urlencoded({ extended: true }));
app1.use(express.static(path.join(__dirname, 'public')));

// Set EJS as view engine and define views directory
app1.set('view engine', 'ejs');
app1.set('views', path.join(__dirname, 'views'));

// Routes
app1.get('/', (req, res) => {
  res.render('index');
});
app1.get('/renting', (req, res) => {
    res.render('renting'); // Ensure this is the Express response object
});

app1.get('/account', (req,res)=>{
  res.render('myaccount');
})

app1.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const auth = getAuth();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user details to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      createdAt: new Date()
    });

    res.status(201).json({ message: "Signup successful!", userId: user.uid });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(400).json({ message: `Signup failed: ${error.message}` });
  }
});

app1.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const auth = getAuth();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    res.status(200).json({ message: `Welcome back, ${user.email}!`, userId: user.uid });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(400).json({ message: `Login failed: ${error.message}` });
  }
});



// Start server
const PORT = 8000;
app1.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});