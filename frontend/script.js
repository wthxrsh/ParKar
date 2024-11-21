async function searchLocation(query) {
    const apiKey = 'pk.4aa50b3509eb35021789f305ebcd4f37';
    const response = await fetch(`https://api.locationiq.com/v1/autocomplete.php?key=${apiKey}&q=${encodeURIComponent(query)}`);
    const data = await response.json();
    console.log(data);
}

document.getElementById('autocomplete').addEventListener('input', (e) => {
    searchLocation(e.target.value);
});
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC72IaKW_9HPGY5ClP0o1WCmwdstooPeg0",
  authDomain: "parkar-448b3.firebaseapp.com",
  projectId: "parkar-448b3",
  storageBucket: "parkar-448b3.firebasestorage.app",
  messagingSenderId: "323068255491",
  appId: "1:323068255491:web:6e04e08b3a96b211581d36",
  measurementId: "G-YJV0N8GJND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
document.getElementById('login-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert('Login successful!');
        // Close the modal or redirect
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            // User doesn't exist, show signup option
            document.getElementById('auth-container').classList.add('hidden');
            document.getElementById('otp-container').classList.remove('hidden');
            document.getElementById('message').innerText = 'User  not found. Please sign up.';
        } else {
            document.getElementById('message').innerText = error.message;
        }
    }
});

document.getElementById('signup-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await auth.createUserWithEmailAndPassword(email, password);
        alert('Signup successful! Please verify your email.');
        // Send OTP or verification email
        await auth.currentUser.sendEmailVerification();
        // Optionally, show a message to check email for verification
    } catch (error) {
        document.getElementById('message').innerText = error.message;
    }
});

// OTP Verification Logic
document.getElementById('verify-otp-btn').addEventListener('click', async () => {
    const otp = document.getElementById('otp').value;
    // Here, you would typically verify the OTP with your backend or service
    // For simplicity, we assume // OTP verification is successful
    alert('OTP verified! Your account has been created.');
    // Close the modal or redirect to the main application
});