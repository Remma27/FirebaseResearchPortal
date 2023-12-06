// JavaScript Document
var db = firebase.apps[0].firestore();
var container = firebase.apps[0].storage().ref();

const txtfullName = document.querySelector('#txtfullName');
const txtschoolGrade = document.querySelector('#txtschoolGrade');
const txtaboutMe = document.querySelector('#txtaboutMe');
const txtprofilePictureURL = document.querySelector('#txtprofilePictureURL');
const txtStudentID = document.querySelector('#txtStudentID');
const btnSaveData = document.querySelector('#btnSaveData');

btnSaveData.addEventListener('click', function () {
    const archivo = txtprofilePictureURL.files[0];

    if (archivo == null) {
        alert('You must select an image');
    } else {
        const metadata = {
            contentType: archivo.type
        }

        const subir = container.child('students/' + archivo.name).put(archivo, metadata);
        subir.then(snapshot => snapshot.ref.getDownloadURL()).then(url => {

            const studentID = db.collection("students").doc().id;

            db.collection("students").doc(studentID).set({
                "studentID": txtStudentID.value,
                "fullName": txtfullName.value,
                "schoolGrade": txtschoolGrade.value,
                "aboutMe": txtaboutMe.value,
                "profilePictureURL": url,
            }).then(function () {
                alert("Student Added Successfully" + studentID);
                limpiar();
            }).catch(function (FirebaseError) {
                alert("Error adding the document:", FirebaseError);
            });
        }).catch(function (FirebaseError) {
            alert("Error getting the URL of the image:", FirebaseError);
        });
    }
});


function limpiar() {
    txtStudentID.value = '';
    txtfullName.value = '';
    txtschoolGrade.value = '';
    txtaboutMe.value = '';
    txtprofilePictureURL.value = '';
    txtfullName.focus();
}
