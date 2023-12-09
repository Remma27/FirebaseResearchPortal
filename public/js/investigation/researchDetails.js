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
    firebase.auth().onAuthStateChanged(function(user) {
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
            var projectTitleElement = document.getElementById("projectTitle");
            var projectAreaOfInterestElement = document.getElementById("projectAreaOfInterest");
            var projectStudentIDElement = document.getElementById("projectStudentID");
            var projectSchoolGradeElement = document.getElementById("projectSchoolGrade");
            var projectTopicDescriptionElement = document.getElementById("projectTopicDescription");
            var projectPdfUrlElement = document.getElementById("projectPdfUrl");
            var projectImagesElement = document.getElementById("projectImages");
            var projectConclusionsElement = document.getElementById("projectConclusions");
            var projectFinalRecommendationsElement = document.getElementById("projectFinalRecommendations");

            projectTitleElement.textContent = projectData.researchTitle;
            projectAreaOfInterestElement.innerHTML = '<strong>Area of Interest:</strong> ' + projectData.areaOfInterest;
            projectStudentIDElement.innerHTML = '<strong>Student ID:</strong> ' + projectData.studentID;
            projectSchoolGradeElement.innerHTML = '<strong>School Grade:</strong> ' + projectData.schoolGrade;
            projectTopicDescriptionElement.innerHTML = '<strong>Topic Description:</strong> ' + projectData.topicDescription;
            projectPdfUrlElement.innerHTML = '<a href="' + projectData.pdfUrl + '" target="_blank"><strong>Click to view the PDF file</strong></a>';

            projectImagesElement.innerHTML = '<strong>Images:</strong> ' + projectData.images.map(imageUrl => `<img src="${imageUrl}" alt="Project Image" />`).join('');
            projectConclusionsElement.innerHTML = '<strong>Conclusions:</strong> ' + projectData.conclusions;
            projectFinalRecommendationsElement.innerHTML = '<strong>Final Recommendations:</strong> ' + projectData.finalRecommendations;

            // Get author information based on studentID
            var studentID = projectData.studentID;
            if (studentID) {
                db.collection("students").doc(studentID).get().then(function (studentDoc) {
                    if (studentDoc.exists) {
                        var studentData = studentDoc.data();

                        // Show author information
                        var authorNameElement = document.getElementById("authorName");
                        var authorAboutMeElement = document.getElementById("authorAboutMe");
                        var authorProfilePictureElement = document.getElementById("authorProfilePicture");

                        authorNameElement.innerHTML = '<strong>Author:</strong> ' + studentData.fullName;
                        authorAboutMeElement.innerHTML = '<strong>About Me:</strong> ' + studentData.aboutMe;
                        authorProfilePictureElement.innerHTML = '<img src="' + studentData.profilePictureURL + '" alt="Author Profile Picture" />';
                    } else {
                        console.log("No student document found for studentID:", studentID);
                    }
                }).catch(function (error) {
                    console.log("Error getting student data:", error);
                });
            }

            //Function call to load comments after getting project details
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
    db.collection("datosUsuarios").doc(userID).get().then(function(userDoc) {
        const userData = userDoc.data();
        const userName = userData ? userData.usuario : "Anonymous";  // If userName is empty, shows "Anonymous"
        const userElement = document.createElement('div');
        userElement.textContent = "User: " + userName;
        commentDiv.appendChild(userElement);
    }).catch(function(error) {
        console.log("Error getting user data:", error);
    });
}

// Function for load details to load the page
loadInvestigationDetails();
