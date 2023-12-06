var researchProjectsRef = firebase.firestore().collection("researchProjects");

// Get reference to the input field and search button
var projectTitleFilterInput = document.getElementById("projectTitleFilter");
var btnTitleFilter = document.getElementById("btnTitleFilter");

// Get reference to the container where the project will be displayed
var projectContainer = document.getElementById("projectContainer");

function showProjectByTitleFilter(titleFilter) {
  projectContainer.innerHTML = "";

  // Get and display the project with the specified title
  researchProjectsRef
    .where("researchTitle", "==", titleFilter)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // Create HTML elements to display project information
        var projectDiv = document.createElement("div");
        projectDiv.classList.add("project");

        var projectTitle = document.createElement("h3");
        projectTitle.textContent = doc.data().researchTitle;

        var projectAreaOfInterest = document.createElement("div");
        projectAreaOfInterest.innerHTML =
          "<strong>Area of interest:</strong> " + doc.data().areaOfInterest;

        var projectDescription = document.createElement("div");
        projectDescription.innerHTML =
          "<strong>Topic description:</strong> " + doc.data().topicDescription;

        var projectPdfUrl = document.createElement("a");
        projectPdfUrl.href = doc.data().pdfUrl;
        projectPdfUrl.innerHTML = "<strong>Click to view the PDF file</strong>";

        var projectConclusions = document.createElement("div");
        projectConclusions.innerHTML =
          "<strong>Conclusions:</strong> " + doc.data().conclusions;

        var projectFinalRecommendations = document.createElement("div");
        projectFinalRecommendations.innerHTML =
          "<strong>Final recommendations:</strong> " +
          doc.data().finalRecommendations;

        // Add elements to the container
        projectDiv.appendChild(projectTitle);
        projectDiv.appendChild(projectAreaOfInterest);
        projectDiv.appendChild(projectDescription);
        projectDiv.appendChild(projectPdfUrl);
        projectDiv.appendChild(projectConclusions);
        projectDiv.appendChild(projectFinalRecommendations);

        // Add the project to the main container
        projectContainer.appendChild(projectDiv);
      });
    })
    .catch(function (error) {
      console.error("Error getting project by title: ", error);
    });
}

// Function to filter with the enter key
function handleEnterKey(event) {
  if (event.key === 'Enter') {
      var titleFilterValue = projectTitleFilterInput.value.trim();
      showProjectByTitleFilter(titleFilterValue);
  }
}

// Add click event to the search button
btnTitleFilter.addEventListener("click", function () {
  var titleFilterValue = projectTitleFilterInput.value.trim();
  if (titleFilterValue !== "") {
    showProjectByTitleFilter(titleFilterValue);
  } else {
    // If the field is empty, clear the container
    projectContainer.innerHTML = "";
  }
});

projectTitleFilterInput.addEventListener('keyup', handleEnterKey);