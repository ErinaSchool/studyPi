// ログインしているか判定
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(user.uid)
    } else {
        console.log('No user is signed in.')
    }
});
// ログアウトの処理
document.getElementById("logout-button").onclick = function () {
    firebase.auth().signOut().then(function () {
        location.href = './login.html';
    }).catch(function (error) {
        console.log(error)
    });
};
// realtime databaseの処理
var database = firebase.database();
// firebaseから全員の記録を持ってくる関数
function readRecordData() {
    firebase.database().ref('/records/').once('value').then(function (snapshot) {
        var data = snapshot.val();
        console.log(JSON.stringify(data));
        document.getElementById("getData").textContent = JSON.stringify(data);
        var json = JSON.stringify(data);

    });
};