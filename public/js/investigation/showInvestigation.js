var researchProjectsRef = firebase.firestore().collection("researchProjects");

// Get reference to the container where projects will be displayed
var projectsContainer = document.querySelector('#projectsContainer');

// Get reference to the combobox
var areaFilterSelect = document.getElementById('areaFilter');

// Function to show projects based on the selected area
function showProjectsByAreaFilter() {
    projectsContainer.innerHTML = '';

    // Get the selected value from the combobox
    var selectedArea = areaFilterSelect.value;

    // If no specific area is selected, show all projects
    if (selectedArea === 'Select an Area of Interest') {
        showAllProjects();
        return;
    }

    // Filter and show projects based on the selected area
    researchProjectsRef
        .where("areaOfInterest", "==", selectedArea)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // Create HTML elements to display project information
                var projectDiv = document.createElement('div');
                projectDiv.classList.add('project');

                var projectID = document.createElement('h3');
                projectID.textContent=doc.data().projectID;

                var projectTitle = document.createElement('h3');
                projectTitle.textContent = doc.data().researchTitle;

                var projectAreaOfInterest = document.createElement('div');
                projectAreaOfInterest.innerHTML = '<strong>Area of interest:</strong> ' + doc.data().areaOfInterest;

                var projectDescription = document.createElement('div');
                projectDescription.innerHTML = '<strong>Topic description:</strong> ' + doc.data().topicDescription;

                var projectPdfUrl = document.createElement('a');
                projectPdfUrl.href = doc.data().pdfUrl;
                projectPdfUrl.innerHTML = '<strong>Click to view the PDF file</strong>';

                var projectConclusions = document.createElement('div');
                projectConclusions.innerHTML = '<strong>Conclusions:</strong> ' + doc.data().conclusions;

                var projectFinalRecommendations = document.createElement('div');
                projectFinalRecommendations.innerHTML = '<strong>Final recommendations:</strong> ' + doc.data().finalRecommendations;

                // Add elements to the container
                projectDiv.appendChild(projectTitle);
                projectDiv.appendChild(projectAreaOfInterest);
                /*
                projectDiv.appendChild(projectDescription);
                projectDiv.appendChild(projectPdfUrl);
                projectDiv.appendChild(projectConclusions);
                projectDiv.appendChild(projectFinalRecommendations);*/

                var viewMoreButton = document.createElement('a');
                viewMoreButton.textContent = 'Show more';
                viewMoreButton.href = 'investigationDetails.html?id=' + doc.projectID; // ID from the investigation
                projectDiv.appendChild(viewMoreButton);

                // Add the project to the main container
                projectsContainer.appendChild(projectDiv);
            });
        })
        .catch(function(error) {
            console.error("Error getting projects: ", error);
        });
}

// Function to handle the change event in the combobox
areaFilterSelect.addEventListener('change', showProjectsByAreaFilter);

// Function to show all projects
function showAllProjects() {
    researchProjectsRef
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // Create HTML elements to display project information
                var projectDiv = document.createElement('div');
                projectDiv.classList.add('project');

                var projectTitle = document.createElement('h3');
                projectTitle.textContent = doc.data().researchTitle;

                var projectAreaOfInterest = document.createElement('div');
                projectAreaOfInterest.innerHTML = '<strong>Area of interest:</strong> ' + doc.data().areaOfInterest;

                var projectDescription = document.createElement('div');
                projectDescription.innerHTML = '<strong>Topic description:</strong> ' + doc.data().topicDescription;

                var projectPdfUrl = document.createElement('a');
                projectPdfUrl.href = doc.data().pdfUrl;
                projectPdfUrl.innerHTML = '<strong>Click to view the PDF file</strong>';

                var projectConclusions = document.createElement('div');
                projectConclusions.innerHTML = '<strong>Conclusions:</strong> ' + doc.data().conclusions;

                var projectFinalRecommendations = document.createElement('div');
                projectFinalRecommendations.innerHTML = '<strong>Final recommendations:</strong> ' + doc.data().finalRecommendations;

                // Add elements to the container
                projectDiv.appendChild(projectTitle);
                projectDiv.appendChild(projectAreaOfInterest);
                /*projectDiv.appendChild(projectDescription);
                projectDiv.appendChild(projectPdfUrl);
                projectDiv.appendChild(projectConclusions);
                projectDiv.appendChild(projectFinalRecommendations);*/

                var viewMoreButton = document.createElement('a');
                viewMoreButton.textContent = 'Show more';
                viewMoreButton.href = 'investigationDetails.html?id=' + doc.projectID; // ID from the investigation
                projectDiv.appendChild(viewMoreButton);
                
                // Add the project to the main container
                projectsContainer.appendChild(projectDiv);
            });
        })
        .catch(function(error) {
            console.error("Error getting projects: ", error);
        });
}

// Show all projects on page load
showAllProjects();
