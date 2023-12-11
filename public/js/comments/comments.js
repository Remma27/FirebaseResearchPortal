var db = firebase.firestore();

// Get the project ID from the URL
var urlParams = new URLSearchParams(window.location.search);
var projectID = urlParams.get('id');

// Get references to form inputs
const commentText = document.querySelector("#commentText");
const ratingSelect = document.querySelector("#ratingSelect");
const btnSaveComment = document.querySelector("#btnSaveComment");

// Save the comment and upload to Firestore
btnSaveComment.addEventListener("click", function () {
  // Check if a grade has been selected
  const selectedRating = ratingSelect.value;
  if (!selectedRating) {
    alert("Please select a rating.");
    return;
  }

  // Check if the user is logged in
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    alert("Please sign in to leave a comment.");
    return;
  }

  // Create an object with the comment data
  const commentData = {
    commentText: commentText.value,
    rating: parseInt(selectedRating),
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    projectID: projectID, // Associate the project ID to the comment
    uid: currentUser.uid, // Associate the ID of the authenticated user to the comment
  };

  // Check if the user has already commented on this research
  db.collection("comments")
    .where("uid", "==", currentUser.uid)
    .where("projectID", "==", projectID)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.size > 0) {
        alert("You have already commented on this project.");
      } else {
        // Save the comment only if the user has not commented on this investigation before
        db.collection("comments")
          .add(commentData)
          .then(function () {
            alert("Comment submitted successfully");
            clearForm();
            loadComments(); // Load all comments after submitting them
          })
          .catch(function (error) {
            console.error("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.log("Error checking previous comments:", error);
    });
});

// Function to load comments associated with the current project
function loadComments() {
  const commentsContainer = document.getElementById("commentsContainer");

  // View all comments related to the current project
  db.collection("comments")
    .where("projectID", "==", projectID)
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
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

        // Add elements to comments container
        commentDiv.appendChild(commentTextElement);
        commentDiv.appendChild(ratingElement);
        commentDiv.appendChild(timestampElement);
        commentsContainer.appendChild(commentDiv);
      });
    })
    .catch((error) => {
      console.log("Error getting comments:", error);
    });
}

function clearForm() {
  commentText.value = "";
  ratingSelect.value = "";
  commentText.focus();
}

// Load comments associated with the current project on page load
loadComments();

