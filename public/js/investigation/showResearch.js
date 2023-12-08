
//Javascript document

var researchProjectsRef = firebase.firestore().collection("researchProjects");
var projectsContainer = document.getElementById('projectsContainer');

var areaInput = document.getElementById('areaInput');
var schoolGradeInput = document.getElementById('schoolGradeInput');

function showProjectsByArea() {
    projectsContainer.innerHTML = '';

    var areaValue = areaInput.value;

    // If areaValue is empty, show all the projects
    if (!areaValue) {
        showAllProjects();
        return;
    }

    // Filter by areaOfInterest
    researchProjectsRef
        .where('areaOfInterest', '==', areaValue)
        .get()
        .then(function(querySnapshot) {
            console.log("Query Snapshot:", querySnapshot.docs);
            querySnapshot.forEach(function(doc) {
                var projectDiv = createProjectDiv(doc);
                projectsContainer.appendChild(projectDiv);
            });
        })
        .catch(function(error) {
            console.error("Error getting projects: ", error);
        });
}


function showProjectsBySchoolGrade() {
    projectsContainer.innerHTML = '';

    var schoolGradeValue = schoolGradeInput.value;

    // if schoolGradeValue is empty, show all the projects
    if (!schoolGradeValue) {
        showAllProjects();
        return;
    }

    // Filter by school grade
    researchProjectsRef
        .where('schoolGrade', '==', schoolGradeValue)
        .get()
        .then(function(querySnapshot) {
            console.log("Query Snapshot:", querySnapshot.docs);
            querySnapshot.forEach(function(doc) {
                var projectDiv = createProjectDiv(doc);
                projectsContainer.appendChild(projectDiv);
            });
        })
        .catch(function(error) {
            console.error("Error getting projects: ", error);
        });
}

// New evets for each input
areaInput.addEventListener('input', showProjectsByArea);
schoolGradeInput.addEventListener('input', showProjectsBySchoolGrade);


function showAllProjects() {
    researchProjectsRef
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var projectDiv = document.createElement('div');
                projectDiv.classList.add('project');

                var projectTitle = document.createElement('h3');
                projectTitle.textContent = doc.data().researchTitle;

                var projectAuthor = document.createElement('div');
                projectAuthor.innerHTML = '<strong>Author:</strong> ' + doc.data().studentID;

                projectDiv.appendChild(projectTitle);
                projectDiv.appendChild(projectAuthor);

                var projectAreaOfInterest = document.createElement('div');
                projectAreaOfInterest.innerHTML = '<strong>Area of interest:</strong> ' + doc.data().areaOfInterest;

                projectDiv.appendChild(projectAreaOfInterest);

                var viewMoreButton = document.createElement('a');
                viewMoreButton.textContent = 'Show more';
                viewMoreButton.href = 'researchDetails.html?id=' + doc.id; 
                projectDiv.appendChild(viewMoreButton);

                projectsContainer.appendChild(projectDiv);
            });
        })
        .catch(function(error) {
            console.error("Error getting projects: ", error);
        });
}

//Get the firebase data
function createProjectDiv(doc) {
    var projectDiv = document.createElement('div');
    projectDiv.classList.add('project');

    var projectTitle = document.createElement('h3');
    projectTitle.textContent = doc.data().researchTitle;

    var projectAuthor = document.createElement('div');
    projectAuthor.innerHTML = '<strong>Author:</strong> ' + doc.data().studentID;

    var projectAreaOfInterest = document.createElement('div');
    projectAreaOfInterest.innerHTML = '<strong>Area of interest:</strong> ' + doc.data().areaOfInterest;

    projectDiv.appendChild(projectTitle);
    projectDiv.appendChild(projectAuthor);
    projectDiv.appendChild(projectAreaOfInterest);

    var viewMoreButton = document.createElement('a');
    viewMoreButton.textContent = 'Show more';
    viewMoreButton.href = 'researchDetails.html?id=' + doc.id; // Usar doc.id en lugar de doc.projectID
    projectDiv.appendChild(viewMoreButton);

    return projectDiv;
}

// Show all projects on page load
showAllProjects();
