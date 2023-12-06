var db = firebase.firestore();
var storageRef = firebase.storage().ref();

// Get references to form inputs
const commentText = document.querySelector("#commentText");
const btnSaveComment = document.querySelector("#btnSaveComment");

// Save the comment and upload to Firestore
btnSaveComment.addEventListener("click", function () {
  const commentData = {
    commentText: commentText.value,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };

  return db.collection("comments").add(commentData)
    .then(function () {
      alert("Comment submitted successfully");
      clearForm();
      loadComments(); // Load all comments after submitting
    })
    .catch(function (error) {
      console.error("Error: " + error);
    });
});



// Function to load all comments from Firestore
function loadComments() {
  const commentsContainer = document.getElementById("commentsContainer");

  // Get all comments from Firestore
  db.collection("comments").orderBy("timestamp", "desc").get().then((querySnapshot) => {
    commentsContainer.innerHTML = ""; 

    querySnapshot.forEach((doc) => {
      const commentData = doc.data();

      // Create HTML elements to display each comment
      const commentDiv = document.createElement('div');
      commentDiv.classList.add('comment');

      const commentTextElement = document.createElement('div');
      commentTextElement.textContent = commentData.commentText;

      const timestampElement = document.createElement('div');
      const timestamp = new Date(commentData.timestamp.seconds * 1000);
      timestampElement.textContent = "Posted on: " + timestamp.toLocaleString();

      // Add elements to cooments container
      commentDiv.appendChild(commentTextElement);
      commentDiv.appendChild(timestampElement);
      commentsContainer.appendChild(commentDiv);
    });
  }).catch((error) => {
    console.log("Error getting comments:", error);
  });
}

function clearForm() {
  commentText.value = "";
  commentText.focus();
}

// Load all comments on page load
loadComments();
