// JavaScript Document

// Validate that the user is logged in
var auth = firebase.apps[0].auth();

// Function to check if the user is logged in, redirect to login page if not
function validar() {
    var uid = -1;

    // Check for changes in the authentication state
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is logged in, get the user's UID
            uid = user.uid;
        } else {
            // User is not logged in, redirect to login page
            document.location.href = 'login.html';
        }
    });

    // Return the user's UID (or -1 if not logged in)
    return uid;
}

// Function to sign out the user
function salir() {
    // Sign out the user
    auth.signOut().then(() => {
        // Redirect to login page after successful sign-out
        document.location.href = 'login.html';
    }).catch((error) => {
        // Display an alert if there is an error during sign-out
        alert('Error al cerrar la sesión: ' + error.message);
    });
}
