// JavaScript Document

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

    // Get selected PDF file and image files
    const pdfFile = txtPdfFile.files[0];
    const imageFiles = txtImages.files;

    // Check if a PDF file is selected
    if (pdfFile == null) {
        alert('You must select a PDF file');
    } else {
        // Metadata for the PDF file
        const pdfMetadata = {
            contentType: pdfFile.type
        }

        // Upload PDF file to storage and get its download URL
        const pdfUpload = container.child('pdfs/' + pdfFile.name).put(pdfFile, pdfMetadata);
        pdfUpload.then(pdfSnapshot => pdfSnapshot.ref.getDownloadURL()).then(pdfUrl => {

            // Promises for uploading image files and getting their download URLs
            const imagePromises = Array.from(imageFiles).map((imageFile, index) => {
                const imageMetadata = {
                    contentType: imageFile.type
                };

                const imageUpload = container.child(`images/${index}_${imageFile.name}`).put(imageFile, imageMetadata);
                return imageUpload.then(imageSnapshot => imageSnapshot.ref.getDownloadURL());
            });

            // Resolve all image upload promises
            Promise.all(imagePromises).then(imageUrls => {

                console.log('PDF URL:', pdfUrl);
                console.log('Image URLs:', imageUrls);

                // Log other project details
                console.log('Research Title:', txtResearchTitle.value);
                console.log('Area of Interest:', txtAreaofInterest.value);

                // Check if the specified studentID exists in the 'students' collection
                const studentID = txtStudentID.value;
                db.collection("students").where("studentID", "==", studentID).get()
                    .then((querySnapshot) => {
                        if (!querySnapshot.empty) {
                            // If student exists, generate a unique projectID
                            const projectID = db.collection("researchProjects").doc().id;

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
                                alert("Project Added Successfully" + projectID);
                                limpiar(); // Clear form fields
                            }).catch(function (error) {
                                console.error("Error adding the document to Firestore:", error);
                                alert("Error adding the document to Firestore: " + error.message);
                            });
                        } else {
                            alert("The student with the specified studentID does not exist.");
                        }
                    })
                    .catch((error) => {
                        console.error("Error checking if student exists:", error);
                        alert("Error checking if student exists: " + error.message);
                    });

            }).catch(error => {
                alert('Error uploading images: ' + error.message);
            });

        }).catch(pdfError => {
            alert('Error uploading PDF: ' + pdfError.message);
        });
    }
});

// Function to clear form fields
function limpiar() {
    txtResearchTitle.value = '';
    txtAreaofInterest.value = '';
    txtStudentID.value = '';
    txtSchoolGrade.value = '';
    txtTopicDescription.value = '';
    txtPdfFile.value = '';
    txtImages.value = '';
    txtConclusions.value = '';
    txtRecommendations.value = '';

    form.reset(); // Reset form

    txtResearchTitle.focus(); // Set focus to the Research Title input
}
