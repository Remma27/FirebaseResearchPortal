// Firebase initialization
var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

// Selecting HTML elements by their IDs
const txtEmail = document.querySelector('#txtEmail');
const txtContra = document.querySelector('#txtContra');

const btnLogin = document.querySelector('#btnLogin');

// Event listener for the login button
btnLogin.addEventListener('click', function () {
    // Authenticate user with email and password
    auth.signInWithEmailAndPassword(txtEmail.value, txtContra.value)
        .then((userCredential) => {
            // User authentication successful
            const user = userCredential.user;
            const dt = new Date();

            // Update the 'ultAcceso' field in 'datosUsuarios' collection
            db.collection("datosUsuarios").where('idemp', '==', user.uid).get()
                .then(function (docRef) {
                    docRef.forEach(function (doc) {
                        doc.ref.update({ ultAcceso: dt }).then(function () {
                            // Redirect to index.html after updating 'ultAcceso'
                            document.location.href = 'index.html';
                        });
                    });
                })
                .catch(function (FirebaseError) {
                    var mensaje = "Error updating document: " + FirebaseError;
                    alert(mensaje);
                });
        })
        .catch((error) => {
            // Display an alert if there is an error during user authentication
            var mensaje = "Error user access: " + error.message;
            alert(mensaje);
        });
});
