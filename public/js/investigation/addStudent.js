// JavaScript Document
var db = firebase.apps[0].firestore();
var container = firebase.apps[0].storage().ref();

// Get references to form elements
const txtfullName = document.querySelector('#txtfullName');
const txtschoolGrade = document.querySelector('#txtschoolGrade');
const txtaboutMe = document.querySelector('#txtaboutMe');
const txtprofilePictureURL = document.querySelector('#txtprofilePictureURL');
const txtStudentID = document.querySelector('#txtStudentID');
const btnSaveData = document.querySelector('#btnSaveData');
const form = document.querySelector('#studentForm');

// Event listener for the Save Data button
btnSaveData.addEventListener('click', function (event) {
    event.preventDefault();

    // Input validation
    if (!validateForm()) {
        return;
    }

    // Get selected image file
    const archivo = txtprofilePictureURL.files[0];

    // Check if an image is selected
    if (!archivo) {
        alert('You must select an image');
    } else {
        // Metadata for the image file
        const metadata = {
            contentType: archivo.type
        }

        // Upload image file to storage and get its download URL
        const subir = container.child('students/' + archivo.name).put(archivo, metadata);
        subir.then(snapshot => snapshot.ref.getDownloadURL()).then(url => {

            // Generate a unique studentID
            const studentID = db.collection("students").doc().id;

            // Save student details to Firestore
            db.collection("students").doc(studentID).set({
                "studentID": txtStudentID.value,
                "fullName": txtfullName.value,
                "schoolGrade": txtschoolGrade.value,
                "aboutMe": txtaboutMe.value,
                "profilePictureURL": url,
            }).then(function () {
                alert("Student Added Successfully: " + studentID);
                clearFormFields(); // Clear form fields
            }).catch(function (FirebaseError) {
                alert("Error adding the document: " + FirebaseError.message);
            });
        }).catch(function (FirebaseError) {
            alert("Error getting the URL of the image: " + FirebaseError.message);
        });
    }
});

// Function to clear form fields
function clearFormFields() {
    txtStudentID.value = '';
    txtfullName.value = '';
    txtschoolGrade.value = '';
    txtaboutMe.value = '';
    txtprofilePictureURL.value = '';

    if (form) {
        form.reset(); // Reset form
    } else {
        console.error('Form element is null. Unable to reset.');
    }

    txtfullName.focus(); // Set focus to the Full Name input
}

// Function to validate form inputs
function validateForm() {
    // Validation for Student ID
    const studentID = txtStudentID.value.trim();
    if (!/^\d{9}$/.test(studentID)) {
        alert('Please enter a valid 9-digit Student ID.');
        return false;
    }

    // Validation for Full Name
    const fullName = txtfullName.value.trim();
    if (!fullName) {
        alert('Please enter a valid Full Name.');
        return false;
    }

    // Validation for School Grade
    const schoolGrade = txtschoolGrade.value.trim();
    if (!schoolGrade) {
        alert('Please enter a valid School Grade.');
        return false;
    }

    // Validation for About Me
    const aboutMe = txtaboutMe.value.trim();
    if (!aboutMe) {
        alert('Please enter a valid About Me.');
        return false;
    }

    // Validation for Profile Picture
    const profilePictureFiles = txtprofilePictureURL.files;
    if (!profilePictureFiles || profilePictureFiles.length !== 1) {
        alert('Please select exactly one profile picture.');
        return false;
    }

    // All validations passed
    return true;
}
