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
        .then(function (querySnapshot) {
            console.log("Query Snapshot:", querySnapshot.docs);
            querySnapshot.forEach(function (doc) {
                var projectDiv = createProjectDiv(doc);
                projectsContainer.appendChild(projectDiv);
            });
        })
        .catch(function (error) {
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
        .then(function (querySnapshot) {
            console.log("Query Snapshot:", querySnapshot.docs);
            querySnapshot.forEach(function (doc) {
                var projectDiv = createProjectDiv(doc);
                projectsContainer.appendChild(projectDiv);
            });
        })
        .catch(function (error) {
            console.error("Error getting projects: ", error);
        });
}

// New events for each input
areaInput.addEventListener('input', showProjectsByArea);
schoolGradeInput.addEventListener('input', showProjectsBySchoolGrade);

function showAllProjects() {
    researchProjectsRef
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                var projectDiv = document.createElement('div');
                projectDiv.classList.add('project');

                var projectTitle = document.createElement('h3');
                projectTitle.textContent = doc.data().researchTitle;

                // Llamada asíncrona a studentName
                studentName(doc).then(function (studentName) {
                    var projectAreaOfInterest = document.createElement('div');
                    projectAreaOfInterest.innerHTML = '<strong>Area of interest:</strong> ' + doc.data().areaOfInterest;

                    var schoolGrade = document.createElement('div');
                    schoolGrade.innerHTML = '<strong>School Grade:</strong> ' + doc.data().schoolGrade;

                    var projectAuthor = document.createElement('div');
                    projectAuthor.innerHTML = '<strong>Author:</strong> ' + studentName;

                    // Mueve el autor antes del botón "Show more"
                    projectDiv.appendChild(projectTitle);
                    projectDiv.appendChild(projectAreaOfInterest);
                    projectDiv.appendChild(schoolGrade);
                    projectDiv.appendChild(projectAuthor);

                    var viewMoreButton = document.createElement('a');
                    viewMoreButton.textContent = 'Show more';
                    viewMoreButton.href = 'researchDetails.html?id=' + doc.id;

                    // Agrega el botón "Show more" al final
                    projectDiv.appendChild(viewMoreButton);

                    projectsContainer.appendChild(projectDiv);
                });
            });
        })
        .catch(function (error) {
            console.error("Error getting projects: ", error);
        });
}



// Get the firebase data
function createProjectDiv(doc) {
    var projectDiv = document.createElement('div');
    projectDiv.classList.add('project');

    var projectTitle = document.createElement('h3');
    projectTitle.textContent = doc.data().researchTitle;
    projectDiv.appendChild(projectTitle);

    var projectAreaOfInterest = document.createElement('div');
    projectAreaOfInterest.innerHTML = '<strong>Area of interest:</strong> ' + doc.data().areaOfInterest;
    projectDiv.appendChild(projectAreaOfInterest);

    // Llamada asíncrona a studentName
    studentName(doc).then(function (studentName) {
        

        var schoolGrade = document.createElement('div');
        schoolGrade.innerHTML = '<strong>School Grade:</strong> ' + doc.data().schoolGrade;
        projectDiv.appendChild(schoolGrade);

        var projectAuthor = document.createElement('div');
        projectAuthor.innerHTML = '<strong>Author:</strong> ' + studentName;
        projectDiv.appendChild(projectAuthor);

        var viewMoreButton = document.createElement('a');
        viewMoreButton.textContent = 'Show more';
        viewMoreButton.href = 'researchDetails.html?id=' + doc.id;
        projectDiv.appendChild(viewMoreButton);

        projectsContainer.appendChild(projectDiv);
    });

    return projectDiv;
}


const db = firebase.firestore();
function studentName(doc) {
    return new Promise(function (resolve, reject) {
        //Student information
        var studentID = doc.data().studentID;
        if (studentID) {
            db.collection("students").where("studentID", "==", studentID).get().then(function (querySnapshot) {
                if (!querySnapshot.empty) {
                    // Si hay resultados, asumiremos que solo hay uno, ya que studentID debería ser único
                    var studentDoc = querySnapshot.docs[0];
                    var studentData = studentDoc.data();
                    var studentName = studentData.fullName;
                    resolve(studentName);
                } else {
                    console.log("No student document found for studentID:", studentID);
                    reject("No student document found");
                }
            }).catch(function (error) {
                console.error("Error getting student data for studentID", studentID, ":", error);
                reject(error);
            });
        } else {
            reject("No studentID found in project document");
        }
    });
}

// Show all projects on page load
showAllProjects();
