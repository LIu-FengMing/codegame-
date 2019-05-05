var selectChartVar, jsonData;
window.onload = function () {
  selectChartVar = "playNumber";
  selectChart(selectChartVar);
}
function selectChart(thisSelect) {
  var datasetsData = [0], chartType;
  switch (thisSelect) {
    case "playNumber":
      getPlayNumberJson(thisSelect);
      break;
    case "successRate":
      getSuccessRateJson(thisSelect);
      break;
    case "averageFailureRate":
      getAverageFailureRateJson(thisSelect);
      break;
  }
}
function createselectChart(thisSelect) {
  var datasetsData = [0], chartType;
  switch (thisSelect) {
    case "playNumber":
      chartType = "line";
      // getPlayNumberJson();
      setTimeout(function () {
        if (jsonData != undefined) {
          for (var i = 0; i < jsonData.playNumber.length; i++) {
            datasetsData[i] = jsonData.playNumber[i].number;
          }
          var ctx = document.getElementById('playNumberChart').getContext('2d');
          var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: chartType,
            // The data for our dataset
            data: {
              labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'],
              datasets: [{
                label: '遊玩人數：',
                backgroundColor: 'rgba(254, 254, 254, 0)',
                borderColor: 'rgb(255, 99, 132)',
                data: datasetsData
              }]
            },
            // Configuration options go here
            options: {
              scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    fontSize: 25,
                    labelString: '遊玩人數'
                  }
                }],
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    fontSize: 25,
                    labelString: '關卡'
                  }
                }]
              },
              legend: {
                display: false
              }
            }
          });
          document.getElementById('playNumberChart').style.display = "block";
          document.getElementById('successRateChart').style.display = "none";
          document.getElementById('averageFailureRateChart').style.display = "none";
        }
      }, 500);
      break;
    case "successRate":
      chartType = "bar";
      // getSuccessRateJson();
      setTimeout(function () {
        if (jsonData != undefined) {
          for (var i = 0; i < jsonData.successRate.length; i++) {
            datasetsData[i] = jsonData.successRate[i].number;
          }
          var ctx = document.getElementById('successRateChart');
          var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'],
              datasets: [{
                label: '通關率（%）：',
                data: datasetsData,
                backgroundColor: [
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderColor: [
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
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
              scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    fontSize: 25,
                    labelString: '通關率'
                  }
                }],
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    fontSize: 25,
                    labelString: 'Ｘ：關卡　Ｙ：通關率（已通關人數／已遊玩人數）'
                  }
                }]
              },
              legend: {
                display: false
              }
            }
          });
          document.getElementById('playNumberChart').style.display = "none";
          document.getElementById('successRateChart').style.display = "block";
          document.getElementById('averageFailureRateChart').style.display = "none";
        }
      }, 500);
      break;
    case "averageFailureRate":
      chartType = "bar";
      // getAverageFailureRateJson();
      setTimeout(function () {
        if (jsonData != undefined) {
          console.log(jsonData);
          for (var i = 0; i < jsonData.averageFailureRate.length; i++) {
            datasetsData[i] = jsonData.averageFailureRate[i].number;
          }
          var ctx = document.getElementById('averageFailureRateChart');
          var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'],
              datasets: [{
                label: '平均失敗率（%）：',
                data: datasetsData,
                backgroundColor: [
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderColor: [
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
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
              scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    fontSize: 25,
                    labelString: '失敗率'
                  }
                }],
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    fontSize: 25,
                    labelString: 'Ｘ：關卡　Ｙ：失敗率（提交失敗次數／總提交次數）'
                  }
                }]
              },
              legend: {
                display: false
              }
            }
          });
          document.getElementById('playNumberChart').style.display = "none";
          document.getElementById('successRateChart').style.display = "none";
          document.getElementById('averageFailureRateChart').style.display = "block";
        }
      }, 500);
      break;
  }
}



function getSuccessRateJson(thisSelect) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      jsonData = JSON.parse(this.responseText);
      createselectChart(thisSelect)
    }
  };
  xmlhttp.open("GET", "json/successRate.json", true);
  xmlhttp.send();
  return jsonData;
}
function getAverageFailureRateJson(thisSelect) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      jsonData = JSON.parse(this.responseText);
      createselectChart(thisSelect)
    }
  };
  xmlhttp.open("GET", "json/averageFailureRate.json", true);
  xmlhttp.send();
  return jsonData;
}


var href = window.location.href;
var readAllPlayFlag = false
var PlayNumber, SuccessRate, AverageFailureRate, AlluserData

function getPlayNumberJson(thisSelect) {
  if (readAllPlayFlag) { //有資料了
    // jsonData = PlayNumber.slice(0);
    jsonData = JSON.parse(JSON.stringify(PlayNumber));
    createselectChart(thisSelect);
  }
  else {
    var scriptData = {
      type: "readAllPlay",
    }
    $.ajax({
      url: href,              // 要傳送的頁面
      method: 'POST',               // 使用 POST 方法傳送請求
      dataType: 'json',             // 回傳資料會是 json 格式
      data: scriptData,  // 將表單資料用打包起來送出去
      success: function (res) {
        AlluserData = res;
        prosessUserData();
        // jsonData = PlayNumber.slice(0);
        jsonData = JSON.parse(JSON.stringify(PlayNumber));
        createselectChart(thisSelect);
        readAllPlayFlag = true
      }
    })
  }
}
// function getSuccessRateJson(thisSelect) {
//   if (readAllPlayFlag) { //有資料了
//     // jsonData = SuccessRate.slice(0);
//     jsonData = JSON.parse(JSON.stringify(SuccessRate));
//     createselectChart(thisSelect);
//   }
//   else {
//     var scriptData = {
//       type: "readAllPlay",
//     }
//     $.ajax({
//       url: href,              // 要傳送的頁面
//       method: 'POST',               // 使用 POST 方法傳送請求
//       dataType: 'json',             // 回傳資料會是 json 格式
//       data: scriptData,  // 將表單資料用打包起來送出去
//       success: function (res) {
//         AlluserData = res;
//         prosessUserData();
//         // jsonData = SuccessRate.slice(0);
//         jsonData = JSON.parse(JSON.stringify(SuccessRate));
//         createselectChart(thisSelect);
//         readAllPlayFlag = true
//       }
//     })
//   }
// }

// function getAverageFailureRateJson(thisSelect) {
//   if (readAllPlayFlag) { //有資料了
//     // jsonData = AverageFailureRate.slice(0);
//     jsonData = JSON.parse(JSON.stringify(AverageFailureRate));
//     createselectChart(thisSelect);
//   }
//   else {
//     var scriptData = {
//       type: "readAllPlay",
//     }
//     $.ajax({
//       url: href,              // 要傳送的頁面
//       method: 'POST',               // 使用 POST 方法傳送請求
//       dataType: 'json',             // 回傳資料會是 json 格式
//       data: scriptData,  // 將表單資料用打包起來送出去
//       success: function (res) {
//         AlluserData = res;
//         prosessUserData();

//         // jsonData = AverageFailureRate.slice(0);

//         jsonData = JSON.parse(JSON.stringify(AverageFailureRate));
//         createselectChart(thisSelect);
//         readAllPlayFlag = true
//       }
//     })
//   }
// }

function prosessUserData() {
  console.log(AlluserData);
  var mapNumber = new Array(50);
  for (let index = 0; index < AlluserData.length; index++) {
    var obj = AlluserData[index];
    var hightLevel = Math.max(obj.EasyEmpire.codeHighestLevel, obj.MediumEmpire.HighestLevel) + 1;//0~49 49+1 -->1~50 51
    if (hightLevel == 51) {
      hightLevel = 50;
    }
    if (mapNumber[hightLevel - 1]) {
      mapNumber[hightLevel - 1].mapcount = mapNumber[hightLevel - 1].mapcount + 1;
    }
    else {
      mapNumber[hightLevel - 1] = { mapcount: 0, mapSuccessCount: 0, mapFailureCount: 0 }
      mapNumber[hightLevel - 1].mapcount = 1;
    }

  }

  var totPlayNumber = 0;
  var dataPlayNumber = new Array(50)
  var dataSuccessNumber = new Array(50)
  var dataFailureNumber = new Array(50)
  for (let index = 49; index > -1; index--) {
    // data[index]={countdata:0,SuccessCountdata:0,FailureCountdata:0}

    var level = index + 1;
    if (mapNumber[index]) {
      var sum = mapNumber[index].mapcount + totPlayNumber;
      totPlayNumber = sum;
      dataPlayNumber[index] = {
        "level": level,
        "number": sum
      };

    }
    else {
      dataPlayNumber[index] = {
        "level": level,
        "number": totPlayNumber
      };
      // dataSuccessNumber[index] = {
      //   "level": level,
      //   "number": 0
      // };
      // dataFailureNumber[index] = {
      //   "level": level,
      //   "number": 0
      // };
    }

  }
  PlayNumber = {
    "playNumber": dataPlayNumber
  }
  SuccessRate = {
    "successRate": dataSuccessNumber
  }
  AverageFailureRate = {
    "averageFailureRate": dataFailureNumber
  }

}



