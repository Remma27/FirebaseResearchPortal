// Initialize Firestore database and storage
var db = firebase.apps[0].firestore();
var container = firebase.apps[0].storage().ref();

// Get references to form elements
const txtResearchTitle = document.querySelector('#txtResearchTitle');
const txtAreaofInterest = document.querySelector('#txtAreaofInterest');
const txtStudentID = document.querySelector('#txtStudentID');
const txtSchoolGrade = document.querySelector('#txtSchoolGrade');
const txtTopicDescription = document.querySelector('#txtTopicDescription');
const txtPdfFile = document.querySelector('#txtPdfFile');
const txtImages = document.querySelector('#txtImages');
const txtConclusions = document.querySelector('#txtConclusions');
const txtRecommendations = document.querySelector('#txtRecommendations');
const btnSaveProject = document.querySelector('#btnSaveProject');

const form = document.querySelector('#researchForm');

// Event listener for the Save Project button
btnSaveProject.addEventListener('click', function (event) {
    event.preventDefault();

    // Input validation
    if (!validateForm()) {
        return;
    }

    // Show the progress container
    const progressContainer = document.getElementById('progress-container');
    progressContainer.style.display = 'block';

    // Get selected PDF file and image files
    const pdfFile = txtPdfFile.files[0];
    const imageFiles = txtImages.files;

    // Check if a PDF file is selected
    if (!pdfFile) {
        alert('You must select a PDF file');
    } else {
        // Metadata for the PDF file
        const pdfMetadata = {
            contentType: pdfFile.type
        }

        // Upload PDF file to storage and get its download URL
        const pdfUpload = container.child('pdfs/' + pdfFile.name).put(pdfFile, pdfMetadata);

        // Update progress bar during PDF upload
        pdfUpload.on('state_changed',
            function progress(snapshot) {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                const progressBar = document.getElementById('progress-bar');
                const progressText = document.getElementById('progress-text');
                progressBar.value = progress;
                progressText.textContent = `Uploading PDF... ${Math.round(progress)}%`;
            },
            function error(error) {
                alert('Error uploading PDF: ' + error.message);
            },
            function complete() {
                // Promises for uploading image files and getting their download URLs
                const imagePromises = Array.from(imageFiles).map((imageFile, index) => {
                    const imageMetadata = {
                        contentType: imageFile.type
                    };

                    const imageUpload = container.child(`images/${index}_${imageFile.name}`).put(imageFile, imageMetadata);

                    // Update progress bar during image upload
                    imageUpload.on('state_changed',
                        function progress(snapshot) {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            const progressBar = document.getElementById('progress-bar');
                            const progressText = document.getElementById('progress-text');
                            progressBar.value = progress;
                            progressText.textContent = `Uploading Images... ${Math.round(progress)}%`;
                        },
                        function error(error) {
                            alert('Error uploading images: ' + error.message);
                        }
                    );

                    return imageUpload.then(imageSnapshot => imageSnapshot.ref.getDownloadURL());
                });

                // Resolve all image upload promises
                Promise.all(imagePromises)
                    .then(imageUrls => {
                        // Check if the specified studentID exists in the 'students' collection
                        const studentID = txtStudentID.value;
                        db.collection("students").where("studentID", "==", studentID).get()
                            .then((querySnapshot) => {
                                if (!querySnapshot.empty) {
                                    // If student exists, generate a unique projectID
                                    const projectID = db.collection("researchProjects").doc().id;

                                    // Get the download URL of the PDF file
                                    pdfUpload.snapshot.ref.getDownloadURL()
                                        .then(pdfUrl => {
                                            // Save project details to Firestore
                                            db.collection("researchProjects").doc(projectID).set({
                                                "projectID": projectID,
                                                "researchTitle": txtResearchTitle.value,
                                                "areaOfInterest": txtAreaofInterest.value,
                                                "studentID": studentID,
                                                "schoolGrade": txtSchoolGrade.value,
                                                "topicDescription": txtTopicDescription.value,
                                                "pdfUrl": pdfUrl,
                                                "images": imageUrls,
                                                "conclusions": txtConclusions.value,
                                                "finalRecommendations": txtRecommendations.value,
                                            }).then(function () {
                                                alert("Project Added Successfully: " + projectID);
                                                clearFormFields(); // Clear form fields
                                            }).catch(function (error) {
                                                alert("Error adding the document to Firestore: " + error.message);
                                            });
                                        })
                                        .catch(pdfError => {
                                            alert('Error getting PDF download URL: ' + pdfError.message);
                                        });
                                } else {
                                    alert("The student with the specified studentID does not exist.");
                                }
                            })
                            .catch((error) => {
                                alert("Error checking if student exists: " + error.message);
                            });
                    })
                    .catch(error => {
                        alert('Error uploading images: ' + error.message);
                    });
            }
        );
    }
});


// Function to clear form fields
function clearFormFields() {
    txtResearchTitle.value = '';
    txtAreaofInterest.value = '';
    txtStudentID.value = '';
    txtSchoolGrade.value = '';
    txtTopicDescription.value = '';
    txtPdfFile.value = '';
    txtImages.value = '';
    txtConclusions.value = '';
    txtRecommendations.value = '';

    if (form) {
        form.reset(); // Reset form
    } else {
        console.error('Form element is null. Unable to reset.');
    }

    txtResearchTitle.focus(); // Set focus to the Research Title input

    // Hide the progress container after completion
    const progressContainer = document.getElementById('progress-container');
    progressContainer.style.display = 'none';
}

// Function to validate form inputs
function validateForm() {
    // Validation for Research Title
    const researchTitle = txtResearchTitle.value.trim();
    if (!researchTitle || typeof researchTitle !== 'string') {
        alert('Please enter a valid Research Title.');
        return false;
    }

    // Validation for Area of Interest
    const areaOfInterest = txtAreaofInterest.value.trim();
    if (!areaOfInterest || typeof areaOfInterest !== 'string') {
        alert('Please enter a valid Area of Interest.');
        return false;
    }

    // Validation for Student ID
    const studentID = txtStudentID.value.trim();
    if (!/^\d{9}$/.test(studentID)) {
        alert('Please enter a valid 9-digit Student ID.');
        return false;
    }

    // Validation for School Grade
    const schoolGrade = txtSchoolGrade.value.trim();
    if (!schoolGrade || typeof schoolGrade !== 'string') {
        alert('Please enter a valid School Grade.');
        return false;
    }

    // Validation for Topic Description
    const topicDescription = txtTopicDescription.value.trim();
    if (topicDescription.length > 500 || typeof topicDescription !== 'string') {
        alert('Topic Description should be a string with a maximum of 500 characters.');
        return false;
    }

    // Validation for PDF file
    const pdfFiles = txtPdfFile.files;
    if (!pdfFiles || pdfFiles.length !== 1) {
        alert('Please select exactly one PDF file.');
        return false;
    }

    // Validation for Images
    const imageFiles = txtImages.files;
    if (!imageFiles || imageFiles.length < 4 || imageFiles.length > 6) {
        alert('Please select between 4 and 6 image files.');
        return false;
    }

    // Validation for Conclusions
    const conclusions = txtConclusions.value.trim();
    if (conclusions.length > 500 || typeof conclusions !== 'string') {
        alert('Conclusions should be a string with a maximum of 500 characters.');
        return false;
    }

    // Validation for Final Recommendations
    const finalRecommendations = txtRecommendations.value.trim();
    if (finalRecommendations.length > 500 || typeof finalRecommendations !== 'string') {
        alert('Final Recommendations should be a string with a maximum of 500 characters.');
        return false;
    }

    // All validations passed
    return true;
}
