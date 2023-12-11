// Javascript document

var researchProjectsRef = firebase.firestore().collection("researchProjects");
var projectsContainer = document.getElementById('projectsContainer');

var areaInput = document.getElementById('areaInput');
var schoolGradeInput = document.getElementById('schoolGradeInput');

async function showProjectsByArea() {
    await showProjects('areaOfInterest', areaInput.value);
}

async function showProjectsBySchoolGrade() {
    await showProjects('schoolGrade', schoolGradeInput.value);
}

// New events for each input
areaInput.addEventListener('input', showProjectsByArea);
schoolGradeInput.addEventListener('input', showProjectsBySchoolGrade);

async function showProjects(field, value) {
    projectsContainer.innerHTML = '';

    // If the input is empty, show all the projects
    if (!value) {
        await showAllProjects();
        return;
    }

    try {
        const querySnapshot = await researchProjectsRef.where(field, '>=', value).where(field, '<=', value + '\uf8ff').get();

        querySnapshot.forEach(function (doc) {
            var projectDiv = createProjectDiv(doc);
            projectsContainer.appendChild(projectDiv);
        });
    } catch (error) {
        console.error("Error getting projects: ", error);
    }
}

async function showAllProjects() {
    projectsContainer.innerHTML = '';

    try {
        const querySnapshot = await researchProjectsRef.get();

        const projectsPromises = querySnapshot.docs.map(async function (doc) {
            const projectDiv = await createProjectDiv(doc);
            projectsContainer.appendChild(projectDiv);
        });

        await Promise.all(projectsPromises);
    } catch (error) {
        console.error("Error getting projects: ", error);
    }
}

// Get the firebase data
async function createProjectDiv(doc) {
    var projectDiv = document.createElement('div');
    projectDiv.classList.add('project');

    var projectTitle = document.createElement('h3');
    projectTitle.textContent = doc.data().researchTitle;
    projectDiv.appendChild(projectTitle);

    var projectAreaOfInterest = document.createElement('div');
    projectAreaOfInterest.innerHTML = '<strong>Area of interest:</strong> ' + doc.data().areaOfInterest;
    projectDiv.appendChild(projectAreaOfInterest);

    try {
        var studentName = await getStudentName(doc.data().studentID);

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
    } catch (error) {
        console.error("Error creating project div: ", error);
    }

    return projectDiv;
}

async function getStudentName(studentID) {
    return new Promise(async function (resolve, reject) {
        if (studentID) {
            try {
                const querySnapshot = await firebase.firestore().collection("students").where("studentID", "==", studentID).get();

                if (!querySnapshot.empty) {
                    var studentDoc = querySnapshot.docs[0];
                    var studentData = studentDoc.data();
                    var studentName = studentData.fullName;
                    resolve(studentName);
                } else {
                    console.log("No student document found for studentID:", studentID);
                    reject("No student document found");
                }
            } catch (error) {
                console.error("Error getting student data for studentID", studentID, ":", error);
                reject(error);
            }
        } else {
            reject("No studentID found in project document");
        }
    });
}

// Show all projects on page load
showAllProjects();
