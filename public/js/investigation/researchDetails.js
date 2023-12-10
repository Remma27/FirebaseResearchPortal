// JavaScript Document
var db = firebase.firestore();

// Get the project ID from the URL
var urlParams = new URLSearchParams(window.location.search);
var projectID = urlParams.get('id');
var currentUserID;

// Function to load investigation details
function loadInvestigationDetails() {
    var projectDetailsContainer = document.getElementById("projectDetails");

    //Get the ID of the authenticated user
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            currentUserID = user.uid;
        } else {
            currentUserID = null;
            continueLoadInvestigationDetails();
        }

        //Continue loading details after getting the user ID
        continueLoadInvestigationDetails();
    });
}

function continueLoadInvestigationDetails() {
    var projectDetailsContainer = document.getElementById("projectDetails");

    db.collection("researchProjects").doc(projectID).get().then(function (doc) {
        if (doc.exists) {
            var projectData = doc.data();

            // Show all research fields

            // 1. Titulo de la investigacion
            var projectTitleElement = document.getElementById("projectTitle");
            projectTitleElement.textContent = projectData.researchTitle;

            // 2. Area de interes
            var projectAreaOfInterestElement = document.getElementById("projectAreaOfInterest");
            projectAreaOfInterestElement.innerHTML = '<strong>Area of Interest:</strong> ' + projectData.areaOfInterest;

            // 3. Investigation School Grade
            var projectSchoolGradeElement = document.getElementById("projectSchoolGrade");
            projectSchoolGradeElement.innerHTML = '<strong>Investigation School Grade:</strong> ' + projectData.schoolGrade;

            // 4. Topic description
            var projectTopicDescriptionElement = document.getElementById("projectTopicDescription");
            projectTopicDescriptionElement.innerHTML = '<strong>Topic Description:</strong> ' + projectData.topicDescription;

            // Student information
            var studentID = projectData.studentID;
            if (studentID) {
                db.collection("students").where("studentID", "==", studentID).get().then(function (querySnapshot) {
                    if (!querySnapshot.empty) {
                        // Assume only one result, as studentID should be unique
                        var studentDoc = querySnapshot.docs[0];
                        var studentData = studentDoc.data();

                        // Show author information

                        // 5. Author name
                        var authorNameElement = document.getElementById("authorName");
                        authorNameElement.innerHTML = '<strong>Author Name:</strong> ' + studentData.fullName;

                        // 6. Profile picture
                        var authorProfilePictureElement = document.getElementById("authorProfilePicture");
                        authorProfilePictureElement.innerHTML = '<strong>Profile Picture:</strong> ' + '<img src="' + studentData.profilePictureURL + '" alt="Author Profile Picture" />';

                        // 7. Author School Grade
                        var authorSchoolGradeElement = document.getElementById("authorSchoolGrade");
                        authorSchoolGradeElement.innerHTML = '<strong>Author School Grade:</strong> ' + studentData.schoolGrade;

                        // 8. About me
                        var authorAboutMeElement = document.getElementById("authorAboutMe");
                        authorAboutMeElement.innerHTML = '<strong>About Me:</strong> ' + studentData.aboutMe;
                    } else {
                        console.log("No student document found for studentID:", studentID);
                    }
                }).catch(function (error) {
                    console.error("Error getting student data for studentID", studentID, ":", error);
                });
            }

            // 9. Click to view the PDF file
            var projectPdfUrlElement = document.getElementById("projectPdfUrl");
            projectPdfUrlElement.innerHTML = '<a href="' + projectData.pdfUrl + '" target="_blank"><strong>Click to view the PDF file</strong></a>';

            // 10. Carrusel de imagenes
            var projectImagesElement = document.getElementById("projectImages");
            var carouselInner = document.createElement('div');
            carouselInner.classList.add('carousel-inner');

            projectData.images.forEach(function (imageUrl, index) {
                var carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');

                // La primera imagen será la activa
                if (index === 0) {
                    carouselItem.classList.add('active');
                }

                var imageElement = document.createElement('img');
                imageElement.src = imageUrl; // La ruta de la imagen
                imageElement.classList.add('d-block', 'w-100'); // Clases de Bootstrap

                carouselItem.appendChild(imageElement);
                carouselInner.appendChild(carouselItem);
            });

            // Botones de control del carrusel
            var prevButton = document.createElement('button');
            prevButton.classList.add('carousel-control-prev');
            prevButton.type = 'button';
            prevButton.setAttribute('data-bs-target', '#projectImages');
            prevButton.setAttribute('data-bs-slide', 'prev');
            prevButton.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>';

            var nextButton = document.createElement('button');
            nextButton.classList.add('carousel-control-next');
            nextButton.type = 'button';
            nextButton.setAttribute('data-bs-target', '#projectImages');
            nextButton.setAttribute('data-bs-slide', 'next');
            nextButton.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>';

            projectImagesElement.innerHTML = ''; // Limpia el contenido actual
            projectImagesElement.appendChild(carouselInner);
            projectImagesElement.appendChild(prevButton);
            projectImagesElement.appendChild(nextButton);

            // 11. Conclusiones
            var projectConclusionsElement = document.getElementById("projectConclusions");
            projectConclusionsElement.innerHTML = '<strong>Conclusions:</strong> ' + projectData.conclusions;

            // 12. Final recomentations
            var projectFinalRecommendationsElement = document.getElementById("projectFinalRecommendations");
            projectFinalRecommendationsElement.innerHTML = '<strong>Final Recommendations:</strong> ' + projectData.finalRecommendations;

            // Function call to load comments after getting project details
            loadSpecificComments();
        } else {
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}




// Function to load project-specific comments
function loadSpecificComments() {
    var commentsContainer = document.getElementById("commentsContainer");

    //Get comments related to the project ID
    db.collection("comments").where("projectID", "==", projectID).get().then((querySnapshot) => {
        commentsContainer.innerHTML = "";

        querySnapshot.forEach((doc) => {
            const commentData = doc.data();

            // Create HTML elements to display each comment
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');

            const commentTextElement = document.createElement('div');
            commentTextElement.textContent = commentData.commentText;

            const ratingElement = document.createElement('div');
            ratingElement.textContent = "Rating: " + commentData.rating + " stars";

            const timestampElement = document.createElement('div');
            const timestamp = new Date(commentData.timestamp.seconds * 1000);
            timestampElement.textContent = "Posted on: " + timestamp.toLocaleString();

            // Get and show the username
            loadUserName(commentData.uid, commentDiv);

            // Add elements to the comments container
            commentDiv.appendChild(commentTextElement);
            commentDiv.appendChild(ratingElement);
            commentDiv.appendChild(timestampElement);
            commentsContainer.appendChild(commentDiv);
        });
    }).catch((error) => {
        console.log("Error getting comments:", error);
    });
}

function loadUserName(userID, commentDiv) {
    // Get user data
    db.collection("datosUsuarios").doc(userID).get().then(function (userDoc) {
        const userData = userDoc.data();
        const userName = userData ? userData.usuario : "Anonymous";  // If userName is empty, shows "Anonymous"
        const userElement = document.createElement('div');
        userElement.textContent = "User: " + userName;
        commentDiv.appendChild(userElement);
    }).catch(function (error) {
        console.log("Error getting user data:", error);
    });
}

// Function for load details to load the page
loadInvestigationDetails();
