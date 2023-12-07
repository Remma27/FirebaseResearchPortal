// JavaScript Document
var db = firebase.apps[0].firestore();
var container = firebase.apps[0].storage().ref();

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

btnSaveProject.addEventListener('click', function (event) {
    event.preventDefault();

    const pdfFile = txtPdfFile.files[0];
    const imageFiles = txtImages.files;

    if (pdfFile == null) {
        alert('You must select a PDF file');
    } else {
        const pdfMetadata = {
            contentType: pdfFile.type
        }

        const pdfUpload = container.child('pdfs/' + pdfFile.name).put(pdfFile, pdfMetadata);
        pdfUpload.then(pdfSnapshot => pdfSnapshot.ref.getDownloadURL()).then(pdfUrl => {

            const imagePromises = Array.from(imageFiles).map((imageFile, index) => {
                const imageMetadata = {
                    contentType: imageFile.type
                };

                const imageUpload = container.child(`images/${index}_${imageFile.name}`).put(imageFile, imageMetadata);
                return imageUpload.then(imageSnapshot => imageSnapshot.ref.getDownloadURL());
            });

            Promise.all(imagePromises).then(imageUrls => {

                console.log('PDF URL:', pdfUrl);
                console.log('Image URLs:', imageUrls);

                console.log('Research Title:', txtResearchTitle.value);
                console.log('Area of Interest:', txtAreaofInterest.value);

                const studentID = txtStudentID.value;

                db.collection("students").where("studentID", "==", studentID).get()
                    .then((querySnapshot) => {
                        if (!querySnapshot.empty) {
                            const projectID = db.collection("researchProjects").doc().id;

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
                                limpiar();
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

    form.reset();

    txtResearchTitle.focus();
}
