// JavaScript Document
var db = firebase.firestore();
var storageRef = firebase.storage().ref();

// Get references to form inputs
const projectIDInput = document.querySelector('#projectID');
const researchTitleInput = document.querySelector('#researchTitle');
const areaOfInterestInput = document.querySelector('#areaOfInterest');
const topicDescriptionInput = document.querySelector('#topicDescription');
const pdfFileInput = document.querySelector('#pdfFile');
const conclusionsInput = document.querySelector('#conclusions');
const finalRecommendationsInput = document.querySelector('#finalRecommendations');
const btnSaveProject = document.querySelector('#btnSaveProject');

// Add click event listener to the Save button
btnSaveProject.addEventListener('click', function () {
    const pdfFile = pdfFileInput.files[0];

    // Check if a PDF file is selected
    if (pdfFile == null) {
        alert('You must select a PDF file');
    } else {
        // Set metadata for the PDF file
        const metadata = {
            contentType: pdfFile.type
        };

        // Create a reference to the 'pdfs' folder
        var pdfsRef = storageRef.child('pdfs');

        // Declare uploadTask variable
        var uploadTask;

        // Check if the 'pdfs' folder exists
        pdfsRef.listAll().then(function (result) {
            // If the 'pdfs' folder doesn't exist, create it
            if (!result.items.length && !result.prefixes.length) {
                return pdfsRef.putString('').then(function (snapshot) {
                    console.log('Folder created successfully!');
                });
            } else {
                console.log('Folder already exists.');
                return Promise.resolve(); // Resolve the promise to proceed
            }
        }).then(function () {
            // Create a reference for the PDF file in storage
            const pdfStorageRef = storageRef.child('pdfs/' + pdfFile.name);

            // Upload the PDF file to Firebase Storage
            uploadTask = pdfStorageRef.put(pdfFile, metadata);

            // Handle the upload process
            return uploadTask.then(snapshot => snapshot.ref.getDownloadURL())
        }).then(url => {
            // Check if the projectID already exists
            return checkIfProjectIDExists(projectIDInput.value).then(exists => {
                if (exists) {
                    alert("Project ID already exists. Please choose a different one.");
                    return Promise.reject("Project ID already exists");
                } else {
                    // Generate a unique ID for the research project
                    const projectID = db.collection("researchProjects").doc().id;

                    // Save project information and PDF URL to Firestore
                    return db.collection("researchProjects").doc(projectID).set({
                        "projectID": projectIDInput.value,
                        "researchTitle": researchTitleInput.value,
                        "areaOfInterest": areaOfInterestInput.value,
                        "topicDescription": topicDescriptionInput.value,
                        "pdfUrl": url,
                        "conclusions": conclusionsInput.value,
                        "finalRecommendations": finalRecommendationsInput.value,
                        "timestamp": firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            });
        }).then(function () {
            // Display success message
            alert("Research Project ID: " + projectIDInput.value);
            clearForm();
        }).catch(function (error) {
            // Handle errors during project data saving or PDF upload
            console.error("Error: " + error);
        });
    }
});

// Function to clear form inputs
function clearForm() {
    projectIDInput.value = '';
    researchTitleInput.value = '';
    areaOfInterestInput.value = '';
    topicDescriptionInput.value = '';
    pdfFileInput.value = '';
    conclusionsInput.value = '';
    finalRecommendationsInput.value = '';
    projectIDInput.focus();
}

// Function to check if a projectID already exists
function checkIfProjectIDExists(projectID) {
    return db.collection("researchProjects").where("projectID", "==", projectID).get().then(querySnapshot => {
        return !querySnapshot.empty;
    });
}
