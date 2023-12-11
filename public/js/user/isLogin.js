// Validate that the user is logged in
var auth = firebase.apps[0].auth();
var inactivityTimeout;

// Function to check if the user is logged in, redirect to login page if not
function validar() {
    return new Promise((resolve, reject) => {
        // Check for changes in the authentication state
        auth.onAuthStateChanged((user) => {
            if (user) {
                // User is logged in, resolve the promise with the user's UID
                resetInactivityTimer(); // Reset the inactivity timer on user activity
                resolve(user.uid);
            } else {
                // User is not logged in, reject the promise
                reject(new Error('User not authenticated'));
            }
        });
    });
}

// Function to sign out the user
function salir() {
    // Clear the inactivity timer before signing out
    clearTimeout(inactivityTimeout);

    // Sign out the user
    auth.signOut().then(() => {
        // Redirect to index page after successful sign-out
        alert('Log out success');
        document.location.href = 'index.html';
    }).catch((error) => {
        // Display an alert if there is an error during sign-out
        alert('Error logging out: ' + error.message);
    });
}

// Function to reset the inactivity timer
function resetInactivityTimer() {
    // Clear the previous timer
    clearTimeout(inactivityTimeout);

    // Set a new timer for 1 minute (60,000 milliseconds)
    inactivityTimeout = setTimeout(() => {
        // Log out the user after 1 minute of inactivity
        salir();
    }, 60000); // 1 minute
}

// Attach event listeners for user activity
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keydown', resetInactivityTimer);

validar()
    .then((uid) => {
        // User is authenticated, you can use the UID if needed
        console.log('User UID:', uid);
    })
    .catch((error) => {
        // User is not authenticated, redirect to login page
        console.error(error.message);
        document.location.href = 'login.html';
    });
