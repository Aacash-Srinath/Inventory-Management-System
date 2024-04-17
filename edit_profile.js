import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged, updateProfile, updatePassword, reauthenticateWithCredential, deleteUser, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";

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
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log("User Signed In");
        const emailID = user.email;

        // Fetching User Info from Firestore Database
        const colRef = collection(db, 'users');
        const q = query(colRef, where("email", "==", emailID))
        
        onSnapshot(q, (snapshot) => {
            let curUser = []
            snapshot.docs.forEach((doc) => {
                curUser.push({ ...doc.data(), id: doc.id })
            })
            document.getElementById("firstName").value = curUser[0]['firstName'] || "";
            document.getElementById("lastName").value = curUser[0]['lastName'] || "";
            document.getElementById("email").value = curUser[0]['email'] || "";
            docID = curUser[0]['id'];
        }) 

        // Cancel Button to Cancel Changes
        let docID = '';
        const cancelButton = document.getElementById('cancelButton');
        cancelButton.addEventListener('click', () => {
            saveButton.disabled = true;
            let curUser = []
            onSnapshot(q, (snapshot) => {
                snapshot.docs.forEach((doc) => {
                    curUser.push({ ...doc.data(), id: doc.id })
                })
                document.getElementById("firstName").value = curUser[0]['firstName'] || "";
                document.getElementById("lastName").value = curUser[0]['lastName'] || "";
                document.getElementById("email").value = curUser[0]['email'] || "";
                docID = curUser[0]['id'];
            }) 

        });

        // Checking if the Password Fields are Matching
        const passwordField = document.getElementById("password");
        const confirmPasswordField = document.getElementById("confirmPassword");
        function checkPasswordMatch() {
            const password = passwordField.value;
            const confirmPassword = confirmPasswordField.value;
            const errorDiv = document.getElementById("passwordError");
            
            if (password !== confirmPassword) {
                errorDiv.innerText = "Passwords do not match";
                saveButton.disabled = true;
                errorDiv.style.color = "red";
            } else {
                saveButton.disabled = false;
                errorDiv.innerText = "";
            }
        }
        passwordField.addEventListener("input", checkPasswordMatch);
        confirmPasswordField.addEventListener("input", checkPasswordMatch);
        
        // Updating User Details
        const saveButton = document.getElementById("saveButton");
        saveButton.disabled = true;
        saveButton.addEventListener("click", () => {
            const user = auth.currentUser;
            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;
            const email = document.getElementById("email").value;
            const password = passwordField.value;
            // Update user profile data
            if (firstName!="" && lastName!="") {
                updateProfile(user, {
                    displayName: `${firstName} ${lastName}`,
                })
                .then(() => {
                    console.log("User profile updated successfully!");
                })
                .catch((error) => {
                    console.error("Error updating user profile: ", error);
                    alert("Error Updating User Profile!!");
                });
            }            
            // Update password if it's provided
            if (password !== "") {
                const currentPassword = document.getElementById("currentPassword").value;
                console.log('Current Password :: ', currentPassword);
                const credential = EmailAuthProvider.credential(
                    user.email, 
                    currentPassword
                );
                reauthenticateWithCredential(user, credential).then(() => {}).catch((error) => {});
                updatePassword(user, password).then(() => {
                    console.log("Password updated successfully!");
                    console.log('Current Password :: ', password);
                    alert("Password Updated!! Please Sign In Again");
                    auth.signOut();
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    console.error("Error updating password: ", error);
                    alert("Error Updating Password!! Sign In & Try Again!!");
                    auth.signOut();
                    window.location.href = 'login.html';
                });
            }
            
            updateDoc(doc(db, 'users', docID), {
                firstName: firstName,
                lastName: lastName,
            }).then(() => {
                console.log("Updated Database");
                alert("Updated Database!!");
            }).catch((error) => {
                console.log("Error Updating Database");
                alert("Error Updating Database");
            })
        });

        
        const delButton = document.getElementById("delButton");
        const currentPasswordField = document.getElementById("currentPassword");
        // Add an event listener to check if the current password field is filled
        currentPasswordField.addEventListener("input", () => {
            const currentPassword = currentPasswordField.value;
            // Enable the delete button only if the current password field is not empty
            delButton.disabled = currentPassword === "" && passwordField.value === "" && confirmPasswordField.value === "";
            saveButton.disabled = currentPassword === "" && passwordField.value === "" && confirmPasswordField.value === "";
        });

        // Disable the delete button initially
        delButton.disabled = true;

        // Deleting User Account
        delButton.addEventListener("click", () => {
            const user = auth.currentUser;
            const currentPassword = currentPasswordField.value;

            // Check if the current password field is empty
            if (currentPassword === "") {
                alert("Please enter your current password to delete your account.");
                return; // Don't proceed if the current password is empty
            }

            const credential = EmailAuthProvider.credential(
                user.email, 
                currentPassword
            );

            reauthenticateWithCredential(user, credential)
                .then(() => {
                    // Proceed with account deletion if reauthentication is successful
                    deleteUser(user)
                        .then(() => {                            
                            alert("Current User Deleted!! Sign In with Another Account");
                            window.location.href = 'login.html';
                        })
                        .catch((error) => {
                            console.error("Error deleting account: ", error);
                        });
                    deleteDoc(doc(db, 'users', docID)).then(() => {
                            console.log("Deleted User From Database!!");
                            alert("Deleted User From Database!!");
                        }).catch((error) => {
                            console.log("Error Deleting User From Database");
                            alert("Error Deleting User From Database");
                        });
                })
                .catch((error) => {
                    console.error("Error reauthenticating user: ", error);
                    alert("Enter the Correct Current Password");
                });

            
        });


            
        const searchForm = document.querySelector("form");
        const searchBar = document.getElementById("search-bar");
        console.log('Search Bar Value = "' + searchBar.value + '"');
        searchForm.addEventListener("submit", function (event) {
            if (searchBar.value.trim() == "") {
                // The search bar is empty, show an alert
                alert("Enter a Search Value!!");
                event.preventDefault(); // Prevent the form from submitting
            } else {
                window.location.href = "search.html";
            }
        });
    } 
    else {
        // User is signed out
        console.log("User Signed Out");
        window.location.href = 'login.html';
    }
});