// ページが読み込まれた時に実行される関数
function init() {
    is_login()
    drawWeeklyRecordBar()
    readRecordData()
}

// ログアウトの処理をする関数
function logout() {
    firebase.auth().signOut().then(function() {
        location.href = './login.html';
    }).catch(function(error) {
        console.log(error)
    });
};

// ログインしているか判定し、していなければログインページへ飛ばす関数
function is_login() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('userId: ' + user.uid)
        } else {
            window.location.href = 'login.html';
        }
    });
}

// 勉強記録の新規作成をする関数
function createRecord() {
    const date = document.forms.newRecord.date.value
    const time = document.forms.newRecord.time.value
    const term = document.forms.newRecord.term.value
    if (!date || !time || !term) {
        alert("未入力の項目があります")
    } else {
        const userId = firebase.auth().currentUser.uid
        firebase.database().ref('records/' + userId).push().set({
            date: date,
            time: time,
            term: term
        });
        drawWeeklyRecordBar()
        document.forms.newRecord.reset()
    }
}

// 週ごとの勉強時間グラフを描く関数
function drawWeeklyRecordBar() {
    firebase.auth().onAuthStateChanged(function(user) {
        firebase.database().ref('/records/' + user.uid).once('value').then(function(snapshot) {
            var data = snapshot.val()
            var now = moment().format('YYYY-MM-DD')
            var barLabels = [
                    moment(now, 'YYYY-MM-DD').subtract(6, 'days').format('DD') + '日',
                    moment(now, 'YYYY-MM-DD').subtract(5, 'days').format('DD') + '日',
                    moment(now, 'YYYY-MM-DD').subtract(4, 'days').format('DD') + '日',
                    moment(now, 'YYYY-MM-DD').subtract(3, 'days').format('DD') + '日',
                    moment(now, 'YYYY-MM-DD').subtract(2, 'days').format('DD') + '日',
                    moment(now, 'YYYY-MM-DD').subtract(1, 'days').format('DD') + '日',
                    moment(now, 'YYYY-MM-DD').format('DD') + '日'
                ]
                // 配列の番号はx日前を示している。例　barData[2] 2日前の勉強時間
            var barData = [
                0, 0, 0, 0, 0, 0, 0
            ]
            for (let key in data) {
                var diff = moment(now, 'YYYY-MM-DD').diff(moment(data[key]['date'], 'YYYY-MM-DD'), 'days');
                if (diff == 0) {
                    barData[0] += Number(data[key]['term'])
                } else if (diff == 1) {
                    barData[1] += Number(data[key]['term'])
                } else if (diff == 2) {
                    barData[2] += Number(data[key]['term'])
                } else if (diff == 3) {
                    barData[3] += Number(data[key]['term'])
                } else if (diff == 4) {
                    barData[4] += Number(data[key]['term'])
                } else if (diff == 5) {
                    barData[5] += Number(data[key]['term'])
                } else if (diff == 6) {
                    barData[6] += Number(data[key]['term'])
                }
            }
            console.log(barData)

            var ctx = document.getElementById("myChart");
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: barLabels,
                    datasets: [{
                        label: '勉強時間（分）',
                        // barDataには日付の遅い順にデータが入っている。しかし、日付の早い順に表示したいため、reberse()を使う
                        data: barData.reverse(),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            categoryPercentage: 0.9,
                            barPercentage: 0.5,
                        }]
                    },
                    layout: { //レイアウト
                        padding: { //余白設定
                            left: 100,
                            right: 50,
                            top: 0,
                            bottom: 0
                        }
                    }
                }
            });

        });
    });
}

// 月ごとの勉強時間グラフを描く関数
function drawMonthlyRecordBar() {
    firebase.auth().onAuthStateChanged(function(user) {
        firebase.database().ref('/records/' + user.uid).once('value').then(function(snapshot) {
            var data = snapshot.val()
            var now = moment().format('YYYY-MM-DD')
            var barLabels = [
                    moment(now, 'YYYY-MM-DD').subtract(11, 'month').format('MM') + '月',
                    moment(now, 'YYYY-MM-DD').subtract(10, 'month').format('MM') + '月',
                    moment(now, 'YYYY-MM-DD').subtract(9, 'month').format('MM') + '月',
                    moment(now, 'YYYY-MM-DD').subtract(8, 'month').format('MM') + '月',
                    moment(now, 'YYYY-MM-DD').subtract(7, 'month').format('MM') + '月',
                    moment(now, 'YYYY-MM-DD').subtract(6, 'month').format('MM') + '月',
                    moment(now, 'YYYY-MM-DD').subtract(5, 'month').format('MM') + '月',
                    moment(now, 'YYYY-MM-DD').subtract(4, 'month').format('MM') + '月',
                    moment(now, 'YYYY-MM-DD').subtract(3, 'month').format('MM') + '月',
                    moment(now, 'YYYY-MM-DD').subtract(2, 'month').format('MM') + '月',
                    moment(now, 'YYYY-MM-DD').subtract(1, 'month').format('MM') + '月',
                    moment(now, 'YYYY-MM-DD').format('MM') + '月'
                ]
                // 配列の番号はx日前を示している。例　barData[2] 2日前の勉強時間
            var barData = [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ]
            for (let key in data) {
                var diff = moment(now, 'YYYY-MM-DD').diff(moment(data[key]['date'], 'YYYY-MM-DD'), 'months');
                if (diff == 0) {
                    barData[0] += Number(data[key]['term'])
                } else if (diff == 1) {
                    barData[1] += Number(data[key]['term'])
                } else if (diff == 2) {
                    barData[2] += Number(data[key]['term'])
                } else if (diff == 3) {
                    barData[3] += Number(data[key]['term'])
                } else if (diff == 4) {
                    barData[4] += Number(data[key]['term'])
                } else if (diff == 5) {
                    barData[5] += Number(data[key]['term'])
                } else if (diff == 6) {
                    barData[6] += Number(data[key]['term'])
                } else if (diff == 7) {
                    barData[7] += Number(data[key]['term'])
                } else if (diff == 8) {
                    barData[8] += Number(data[key]['term'])
                } else if (diff == 9) {
                    barData[9] += Number(data[key]['term'])
                } else if (diff == 10) {
                    barData[10] += Number(data[key]['term'])
                } else if (diff == 11) {
                    barData[11] += Number(data[key]['term'])
                }
            }

            console.log(barData)

            var ctx = document.getElementById("myChart");
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: barLabels,
                    datasets: [{
                        label: '勉強時間（時間）',
                        // barDataの単位を分から時間に変える
                        // barDataには日付の遅い順にデータが入っている。しかし、日付の早い順に表示したいため、reberse()を使う
                        data: barData.map(x => x / 60).reverse(),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            categoryPercentage: 0.9,
                            barPercentage: 0.5,
                        }]
                    },
                    layout: { //レイアウト
                        padding: { //余白設定
                            left: 100,
                            right: 50,
                            top: 0,
                            bottom: 0
                        }
                    }
                }
            });

        });
    });
}

// firebaseからuserの記録を持ってくる関数
// ここにページが読み込まれたら読み込む処理を書く
function readRecordData() {
    firebase.auth().onAuthStateChanged(function(user) {
        firebase.database().ref('/records/' + user.uid).once('value').then(function(snapshot) {
            var data = snapshot.val()
                // データを表示する
            for (let key in data) {
                var oneData = data[key];

                var table = document.getElementById('targetTable');
                var newRow = table.insertRow();

                newCell = newRow.insertCell();
                var beforeDate = moment(oneData.date, "YYYY-MM-DD");
                var afterDate = beforeDate.format('YYYY年MM月DD日');
                newText = document.createTextNode(afterDate);
                newCell.appendChild(newText);

                newCell = newRow.insertCell();
                var beforeTime = moment(oneData.time, "HH:mm");
                var afterTime = beforeTime.format('HH時mm分');
                newText = document.createTextNode(afterTime);
                newCell.appendChild(newText);

                var newCell = newRow.insertCell();
                var newText = document.createTextNode(oneData.term + "分");
                newCell.appendChild(newText);
            }
        });
    });
}