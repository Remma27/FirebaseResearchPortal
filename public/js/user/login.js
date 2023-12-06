
var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

const txtEmail = document.querySelector('#txtEmail');
const txtContra = document.querySelector('#txtContra');

const btnLogin = document.querySelector('#btnLogin');

btnLogin.addEventListener('click', function () {
    auth.signInWithEmailAndPassword(txtEmail.value, txtContra.value)
        .then((userCredential) => {
            const user = userCredential.user;
            const dt = new Date();
            db.collection("datosUsuarios").where('idemp', '==', user.uid).get()
                .then(function (docRef) {
                    docRef.forEach(function (doc) {
                        doc.ref.update({ ultAcceso: dt }).then(function () {
                            document.location.href = 'index.html';
                        });
                    });
                })
                .catch(function (FirebaseError) {
                    var mensaje = "Error adding document: " + FirebaseError
                    alert(mensaje);
                });
        })
        .catch((error) => {
            var mensaje = "Error user access: " + error.message;
            alert(mensaje);
        });
});
