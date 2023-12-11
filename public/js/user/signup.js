// Firebase initialization
var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

// Selecting HTML elements by their IDs
const txtNombre = document.querySelector('#txtNombre');
const txtEmail = document.querySelector('#txtEmail');
const txtContra = document.querySelector('#txtContra');

const btnInsUser = document.querySelector('#btnInsUser');

// Event listener for the button to insert a new user
btnInsUser.addEventListener('click', function () {
    // Create a new user with email and password
    auth.createUserWithEmailAndPassword(txtEmail.value, txtContra.value)
        .then((userCredential) => {
            // User creation successful
            const user = userCredential.user;

            // Add user data to 'datosUsuarios' collection
            db.collection("datosUsuarios").add({
                "idemp": user.uid,
                "usuario": txtNombre.value,
                "email": user.email
            }).then(function (docRef) {
                // Display success message and redirect to login.html
                alert("User added successfully");
                document.location.href = 'login.html';
            }).catch(function (FirebaseError) {
                // Display an alert if there is an error adding user data
                alert("Error adding user data: " + FirebaseError);
            });
        })
        .catch((error) => {
            // Display an alert if there is an error during user creation
            alert("Error adding new user: " + error.message);
        });
});
