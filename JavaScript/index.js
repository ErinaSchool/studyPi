// ページが読み込まれた時に実行される関数
function init() {
    is_login()
    readRecordData()
}

// ログアウトの処理をする関数
function logout() {
    firebase.auth().signOut().then(function () {
        location.href = './login.html';
    }).catch(function (error) {
        console.log(error)
    });
};

// ログインしているか判定し、していなければログインページへ飛ばす関数
function is_login() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('userId: ' + user.uid)
        } else {
            window.location.href = 'login.html';
        }
    });
}

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