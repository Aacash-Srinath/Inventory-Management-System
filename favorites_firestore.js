import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getFirestore, collection, query, where, onSnapshot, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";

// Firebase configuration
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
const db = getFirestore();
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        const uid = user.uid;
        console.log("User Signed In");
        var alerted = localStorage.getItem('alerted') || '';
        if (alerted != 'yes') {
            Notification.requestPermission().then(perm => {
                if (perm === "granted") {
                    console.log("Notification");
                    alert("Signed in with " + user.email);
                    localStorage.setItem('alerted','yes');
                }
            })
        }

        const firstName = user.displayName.split(" ")[0];
        const lastName = user.displayName.split(" ")[1];
        const email = user.email;

        let fav = {};
        let pID = [];

        getDoc(doc(db, "users", firstName)).then(docSnap => {
            if (docSnap.exists()) {
                console.log("Document Exists");
                pID = docSnap.data()['favorites'];

                if (pID != []){
                    pID.forEach(ID => {
                        fav[ID] = true;            
                    });
                }
                
                $('.favorite-checkbox').each(function() {
                    const productId = $(this).data('product-id');
                    if (pID.includes(productId)) {
                        $(this).prop('checked', true);
                        console.log(productId);
                    }
                });

                const favoritesTable = $('#favoritesTable').DataTable({
                    ajax: {
                        url: 'get_favorites.php', 
                        type: 'POST',
                        data: { productIds: pID },
                        datatype: "json", 
                        processing: true,
                        serverSide: true,
                        dataSrc: ''
                    },
                    columns: [
                        { data: 'serialNo' },
                        { data: 'batchId' },
                        { data: 'productId' },
                        { data: 'stockingDate' },
                        { data: 'nextRestock' },
                        { data: 'manufacturingDate' },
                        { data: 'shippingCompany' },
                        { data: 'shippingStatus' },
                        { data: 'quantity' },
                        {
                            data: null,
                            render: function(data, type, row) {
                                const isChecked = fav[row.productId] ? 'checked' : '';
                                return `                        
                                    <label class="custom-checkbox">
                                        <input type="checkbox" class="favorite-checkbox" data-product-id="${row.productId}" ${isChecked}>
                                        <span class="checkmark"></span>
                                    </label>                        
                                `;
                            }
                        }
                    ]
                }).draw();
            } else {
                console.log("No Such Document!");
            }
        });

        function updateFavorites(productId, isChecked) {
            if (isChecked) {
                // Mark the product as favorite by adding it to the dictionary
                fav[productId] = true;
                Notification.requestPermission().then(perm => {
                    if (perm === "granted") {
                        console.log("Notification");
                        alert(productId + " Bookmarked");
                    }
                })
            } else {
                // Remove the product from favorites
                delete fav[productId];
                const index = pID.indexOf(productId);
                if (index !== -1) {
                    pID.splice(index, 1);
                }
                Notification.requestPermission().then(perm => {
                    if (perm === "granted") {
                        console.log("Notification");
                        alert(productId + " Removed from Bookmarks");
                    }
                })
            }
            if (!pID.includes(productId) && isChecked) {
                pID.push(productId);
                fav[productId] = true
            }
    
            setDoc(doc(db, "users", firstName), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                favorites: pID
            });           

            pID.forEach(ID => {
                fav[ID] = true;            
            });

            $('.favorite-checkbox').each(function() {
                const productId = $(this).data('product-id');
                if (pID.includes(productId)) {
                    $(this).prop('checked', true);
                }
            });
        }

        // Handle favorite-checkbox change event
        $('#favoritesTable tbody').on('change', '.favorite-checkbox', function() {
            const productId = $(this).data('product-id');
            const isChecked = $(this).prop('checked');
            updateFavorites(productId, isChecked);   
            
            $('.favorite-checkbox').each(function() {
                const productId = $(this).data('product-id');
                if (pID.includes(productId)) {
                    $(this).prop('checked', true);
                }
            });
        }); 

        const searchForm = document.querySelector("form");
        const searchBar = document.getElementById("search-bar");
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