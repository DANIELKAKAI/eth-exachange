

function fetchUsers() {
    let tableBody = $("#user-table tbody");
    let content = "";
    firebase.firestore().collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            content += `<tr><td>${doc.data().username}</td><td>${doc.data().email}</td></tr>`
        });
        tableBody.append(content);
    });
};

function searchUsers(searchTerm) {
    let tableBody = $("#user-table tbody");
    let content = "";
    firebase.firestore().collection("users")
        .orderBy("username")
        .startAt(searchTerm)
        .endAt(searchTerm + "\uf8ff")
        .get()
        .then((querySnapshot) => {
            tableBody.empty();
            querySnapshot.forEach((doc) => {
                content += `<tr><td>${doc.data().username}</td><td>${doc.data().email}</td></tr>`
            });
            tableBody.append(content);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;

    if (email && password && username) {
        firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
            const uid = userCredential.user.uid;
            firebase.firestore().collection("users").doc(uid).set({
                username,
                email,
                uid
            });
        }).catch((err) => {
            alert(err.message);
        });
        console.log("Success");
    };
};

function signIn() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                location.href = "index.html"
            })
            .catch((error) => {
                alert(error.message);
            });
    };

};

function checkAuth() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            location.href = "signin.html";
        }
    });
};

function signOut() {
    firebase.auth().signOut().then(() => {
        location.href = "signin.html";
    }).catch((error) => {
        console.log(error);
    });
}

