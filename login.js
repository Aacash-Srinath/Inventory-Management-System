/* ===================== Firebase Integration ===================== */ 

// Import the functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEd1eyNCU2-n2187JqHXRpPStNeLn0x5A",
  authDomain: "arcus-inventory-website.firebaseapp.com",
  databaseURL: "https://arcus-inventory-website-default-rtdb.firebaseio.com",
  projectId: "arcus-inventory-website",
  storageBucket: "arcus-inventory-website.appspot.com",
  messagingSenderId: "941481351324",
  appId: "1:941481351324:web:6df77d6bbed8c67ddd7559"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      const uid = user.uid;
      console.log("User Signed In");
      window.location.href = 'search.html';
    } else {
      // User is signed out
      console.log("User Signed Out");
    }
});

// Function to handle form submission
function handleSubmit() {
    // Get the values entered in the form fields
    const username = document.getElementById('LoginEmail').value;
    const password = document.getElementById('LoginPassword').value;

    // Basic validation
    if (!username || !password) {
        alert('Fill the Username and Password Fields!!');
    } else { 
        signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            window.location.href = 'search.html'
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            if ('auth/invalid-email' == errorCode) {
                alert("Invalid Email!!");
            } else if ('auth/wrong-password' == errorCode) {
                alert("Wrong Password!!");
            } else if ('auth/user-not-found' == errorCode) {
                alert("User Not Found!!");
            } else {
                alert(errorMessage);
            }
        });
    }
}

// Attach the handleSubmit function to the login button's click event
document.querySelector('.btn-primary').addEventListener('click', handleSubmit);

// Attach the handleSubmit function to the form's submit event
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission
    handleSubmit(); // Call the custom submit function
});

// Listen for the Enter key press on the password input field
document.getElementById('LoginPassword').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default Enter key behavior (form submission)
        handleSubmit(); // Call the custom submit function
    }
});
