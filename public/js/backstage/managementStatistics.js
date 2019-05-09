var playerData, playerData_All, playerData_OneDay, playerData_SevenDay, playerData_OneMonth, playerData_SixMonth, playerData_OneYear, playerData_Var;
var playNumberFirst = false, successRateFirst = false, averageFailureRateFirst = false;
var playNumberVar, successRateVar, averageFailureRateVar;
function logout() {
  // console.log("dddddd");
  var href = "/logout";
  window.location.replace(href);
}
var selectChartVar, jsonData, playNumberCanvas,successRateCanvas,averageFailureRateCanvas;
window.onload = function () {
  selectChartVar = "playNumber";
  selectChart(selectChartVar);
}
function selectChart(thisSelect) {
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
            playerData = datasetsData;
          }
          if (!playNumberFirst) {
            playerData_All = datasetsData;
            playNumberFirst = true;
            var ctx = document.getElementById('playNumberChart').getContext('2d');
            playNumberCanvas = new Chart(ctx, {
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
                    },
                    ticks: {
                      min: 0,
                      max: jsonData.playNumber[0].number + 1,
                      callback: function (value) { if (Number.isInteger(value)) { return value; } }
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
                },
                pan: {
                  enabled: true,
                  mode: "y",
                  speed: 10,
                  threshold: 10
                },
                zoom: {
                  enabled: true,
                  drag: false,
                  mode: "y",
                  limits: {
                    max: 10,
                    min: 0.5
                  }
                }
              }
            });
            document.getElementById('playNumberChart').style.display = "block";
            document.getElementById('successRateChart').style.display = "none";
            document.getElementById('averageFailureRateChart').style.display = "none";
          }else{
            playNumberCanvas.update();
            document.getElementById('playNumberChart').style.display = "block";
            document.getElementById('successRateChart').style.display = "none";
            document.getElementById('averageFailureRateChart').style.display = "none";
          }
        }
      }, 500);
      playerData = playerData_All;
      break;
    case "successRate":
      chartType = "bar";
      // getSuccessRateJson();
      setTimeout(function () {
        if (jsonData != undefined) {
          for (var i = 0; i < jsonData.successRate.length; i++) {
            datasetsData[i] = jsonData.successRate[i].number;
          }
          if (!successRateFirst) {
            successRateVar = datasetsData;
            successRateFirst = true;
            var ctx = document.getElementById('successRateChart');
            successRateCanvas = new Chart(ctx, {
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
                }
                ]
              },
              options: {
                scales: {
                  yAxes: [{
                    scaleLabel: {
                      display: true,
                      fontSize: 25,
                      labelString: '通關率'
                    },
                    ticks: {
                      min: 0,
                      max: 1.1
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
                },
                pan: {
                  enabled: true,
                  mode: "y",
                  speed: 10,
                  threshold: 10
                },
                zoom: {
                  enabled: true,
                  drag: false,
                  mode: "y",
                  limits: {
                    max: 10,
                    min: 0.5
                  }
                },
                tooltips: {
                  callbacks: {
                    label: function (tooltipItem) {
                      // console.log(tooltipItem)
                      return "通關率：" + tooltipItem.yLabel + "；遊玩人數：" + playerData[tooltipItem.xLabel - 1];
                    }
                  }
                }
              }
            });
            document.getElementById('playNumberChart').style.display = "none";
            document.getElementById('successRateChart').style.display = "block";
            document.getElementById('averageFailureRateChart').style.display = "none";
          }else{
            successRateCanvas.update();
            document.getElementById('playNumberChart').style.display = "none";
            document.getElementById('successRateChart').style.display = "block";
            document.getElementById('averageFailureRateChart').style.display = "none";
          }
        }
      }, 500);
      break;
    case "averageFailureRate":
      chartType = "bar";
      // getAverageFailureRateJson();
      setTimeout(function () {
        if (jsonData != undefined) {
          for (var i = 0; i < jsonData.averageFailureRate.length; i++) {
            datasetsData[i] = jsonData.averageFailureRate[i].number;
          }
          if (!averageFailureRateFirst) {
            averageFailureRateVar = datasetsData;
            averageFailureRateFirst = true;
            var ctx = document.getElementById('averageFailureRateChart');
            averageFailureRateCanvas = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'],
                datasets: [{
                  label: '平均失敗次數：',
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
                }
                ]
              },
              options: {
                scales: {
                  yAxes: [{
                    scaleLabel: {
                      display: true,
                      fontSize: 25,
                      labelString: '平均失敗次數'
                    },
                    ticks: {
                      min: 0
                    }
                  }],
                  xAxes: [{
                    scaleLabel: {
                      display: true,
                      fontSize: 25,
                      labelString: 'Ｘ：關卡　Ｙ：平均失敗次數（提交失敗次數／遊玩人數）'
                    }
                  }]
                },
                legend: {
                  display: false
                },
                pan: {
                  enabled: true,
                  mode: "y",
                  speed: 10,
                  threshold: 10
                },
                zoom: {
                  enabled: true,
                  drag: false,
                  mode: "y",
                  limits: {
                    max: 10,
                    min: 0.5
                  }
                },
                tooltips: {
                  callbacks: {
                    label: function (tooltipItem) {
                      // console.log(tooltipItem)
                      return "平均失敗次數：" + tooltipItem.yLabel + "；遊玩人數：" + playerData[tooltipItem.xLabel - 1];
                    }
                  }
                }
              }
            });
            document.getElementById('playNumberChart').style.display = "none";
            document.getElementById('successRateChart').style.display = "none";
            document.getElementById('averageFailureRateChart').style.display = "block";
          }else{
            averageFailureRateCanvas.update();
            document.getElementById('playNumberChart').style.display = "none";
            document.getElementById('successRateChart').style.display = "none";
            document.getElementById('averageFailureRateChart').style.display = "block";
          }
        }
      }, 500);
      break;
  }
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

function getSuccessRateJson(thisSelect) {
  if (readAllPlayFlag) { //有資料了
    // jsonData = SuccessRate.slice(0);
    jsonData = JSON.parse(JSON.stringify(SuccessRate));
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
        // jsonData = SuccessRate.slice(0);
        jsonData = JSON.parse(JSON.stringify(SuccessRate));
        createselectChart(thisSelect);
        readAllPlayFlag = true
      }
    })
  }
}

function getAverageFailureRateJson(thisSelect) {
  if (readAllPlayFlag) { //有資料了
    // jsonData = AverageFailureRate.slice(0);
    jsonData = JSON.parse(JSON.stringify(AverageFailureRate));
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

        // jsonData = AverageFailureRate.slice(0);

        jsonData = JSON.parse(JSON.stringify(AverageFailureRate));
        createselectChart(thisSelect);
        readAllPlayFlag = true
      }
    })
  }
}

// function prosessUserData() {
//   console.log(AlluserData);
//   var mapNumber = new Array(50);
//   mapNumber[50] = { mapcount: 0, mapSuccessCountDel: 0, mapFailureCount: 0 }
//   for (let index = 0; index < AlluserData.length; index++) {
//     var obj = AlluserData[index];
//     var hightLevel = Math.max(obj.EasyEmpire.codeHighestLevel, obj.MediumEmpire.HighestLevel) + 1;//0~49 49+1 -->1~50 51
//     /*  PlayNumber   */
//     if (hightLevel == 51) {
//       hightLevel = 50;
//       mapNumber[50].mapcount = mapNumber[50].mapcount + 1;
//     }

//     // mapNumber[hightLevel - 1].mapcount = mapNumber[hightLevel - 1].mapcount + 1;
//     if (mapNumber[hightLevel - 1]) {
//       mapNumber[hightLevel - 1].mapcount = mapNumber[hightLevel - 1].mapcount + 1;
//       // mapNumber[hightLevel - 1] = { mapcount: 0, mapSuccessCountDel: 0, mapFailureCount: 0 }
//     }
//     else {
//       mapNumber[hightLevel - 1] = { mapcount: 0, mapSuccessCountDel: 0, mapFailureCount: 0, failCount: 0, playCount: 0 }
//       mapNumber[hightLevel - 1].mapcount = mapNumber[hightLevel - 1].mapcount + 1;
//     }
//     /*  SuccessRate   */
//     if (hightLevel < 25) {
//       /*還未挑戰最高的 */
//       if (obj.EasyEmpire.codeLevel.length < hightLevel) {
//         mapNumber[hightLevel - 1].mapSuccessCountDel = mapNumber[hightLevel - 1].mapSuccessCountDel + 1;
//       }
//     }
//     else {
//       if (obj.MediumEmpire.codeLevel.length < hightLevel - 25) {
//         mapNumber[hightLevel - 1].mapSuccessCountDel = mapNumber[hightLevel - 1].mapSuccessCountDel + 1;
//       }
//     }
//     /*  mapFailureCount   */
//     for (let indexFail = 0; indexFail < obj.EasyEmpire.codeLevel.length; indexFail++) {
//       var thisLevelRecord = obj.EasyEmpire.codeLevel[indexFail].challengeLog;
//       for (let indexLevel = 0; indexLevel < thisLevelRecord.length; indexLevel++) {
//         var thisRecordData = thisLevelRecord[indexLevel];
//         var failF = false;
//         if (thisRecordData.srarNum == "0") {
//           failF = true;
//         }

//         if (mapNumber[indexFail]) {
//           if (failF) {
//             mapNumber[indexFail].failCount = mapNumber[indexFail].failCount + 1;
//           }
//           mapNumber[indexFail].playCount = mapNumber[indexFail].playCount + 1;
//         }
//         else {
//           mapNumber[indexFail] = { mapcount: 0, mapSuccessCountDel: 0, mapFailureCount: 0, failCount: 0, playCount: 0 }
//           if (failF) {
//             mapNumber[indexFail].failCount = mapNumber[indexFail].failCount + 1;
//           }
//           mapNumber[indexFail].playCount = mapNumber[indexFail].playCount + 1;
//         }
//       }
//     }
//     for (let indexFail = 0; indexFail < obj.MediumEmpire.codeLevel.length; indexFail++) {
//       var thisLevelRecord = obj.MediumEmpire.codeLevel[indexFail].challengeLog;
//       for (let indexLevel = 0; indexLevel < thisLevelRecord.length; indexLevel++) {
//         var thisRecordData = thisLevelRecord[indexLevel];
//         var failF = false;
//         if (thisRecordData.srarNum == "0") {
//           failF = true;
//         }

//         if (mapNumber[indexFail + 24]) {
//           if (failF) {
//             mapNumber[indexFail + 24].failCount = mapNumber[indexFail + 24].failCount + 1;
//           }
//           mapNumber[indexFail + 24].playCount = mapNumber[indexFail + 24].playCount + 1;
//         }
//         else {
//           mapNumber[indexFail + 24] = { mapcount: 0, mapSuccessCountDel: 0, mapFailureCount: 0, failCount: 0, playCount: 0 }
//           if (failF) {
//             mapNumber[indexFail + 24].failCount = mapNumber[indexFail + 24].failCount + 1;
//           }
//           mapNumber[indexFail + 24].playCount = mapNumber[indexFail + 24].playCount + 1;
//         }
//       }
//     }
//   }

//   var totPlayNumber = 0;
//   var dataPlayNumber = new Array(50)
//   var dataSuccessNumber = new Array(50)
//   var dataFailureNumber = new Array(50)
//   for (let index = 49; index > -1; index--) {

//     var level = index + 1;
//     /*  PlayNumber   */
//     if (mapNumber[index]) {
//       var sum = (mapNumber[index].mapcount - mapNumber[index].mapSuccessCountDel) + totPlayNumber;
//       totPlayNumber = sum;
//       dataPlayNumber[index] = {
//         "level": level,
//         "number": sum
//       };
//     }
//     else {
//       mapNumber[index] = { mapcount: 0, mapSuccessCountDel: 0, mapFailureCount: 0, failCount: 0, playCount: 0 }
//       dataPlayNumber[index] = {
//         "level": level,
//         "number": totPlayNumber
//       };
//     }
//     /*  SuccessRate   */
//     var num = 0;
//     if (index == 49) {
//       num = mapNumber[50].mapcount / (dataPlayNumber[index].number - mapNumber[index].mapSuccessCountDel)
//     }
//     else {
//       num = dataPlayNumber[index + 1].number / (dataPlayNumber[index].number - mapNumber[index].mapSuccessCountDel)
//     }
//     num = num.toFixed(2); // 输出结果为 2.45
//     dataSuccessNumber[index] = {
//       "level": level,
//       "number": num
//     };

//     /*  mapFailureCount   */
//     var num = 0;
//     if (mapNumber[index].playCount != 0) {
//       // num=mapNumber[index].failCount/mapNumber[index].playCount
//       num = mapNumber[index].failCount / (dataPlayNumber[index].number - mapNumber[index].mapSuccessCountDel)
//     }

//     num = num.toFixed(2); // 输出结果为 2.45
//     dataFailureNumber[index] = {
//       "level": level,
//       "number": num
//     };
//   }
//   PlayNumber = {
//     "playNumber": dataPlayNumber
//   }
//   SuccessRate = {
//     "successRate": dataSuccessNumber
//   }
//   AverageFailureRate = {
//     "averageFailureRate": dataFailureNumber
//   }

// }

function prosessUserData() {
  console.log(AlluserData);
  var mapNumber = new Array(50);
  mapNumber[50] = { mapcount: 0, mapSuccessCountDel: 0, mapFailureCount: 0 }
  for (let index = 0; index < AlluserData.length; index++) {
    var obj = AlluserData[index];
    for (let indexFail = 0; indexFail < obj.EasyEmpire.codeLevel.length; indexFail++) {
      var thisLevelRecord = obj.EasyEmpire.codeLevel[indexFail].challengeLog;
      var addF = false, playCountF = false;
      for (let indexLevel = 0; indexLevel < thisLevelRecord.length; indexLevel++) {
        var thisRecordData = thisLevelRecord[indexLevel];

        var failF = false;
        if (thisRecordData.srarNum == "0") {
          failF = true;
        }
        if (mapNumber[indexFail]) {
          if (failF) {
            mapNumber[indexFail].failCount = mapNumber[indexFail].failCount + 1;
          }
          else {
            if (addF == false) {
              addF = true;
              mapNumber[indexFail].mapSuccessCount = mapNumber[indexFail].mapSuccessCount + 1;
            }
          }
          if (playCountF == false) {
            playCountF = true
            mapNumber[indexFail].mapcount = mapNumber[indexFail].mapcount + 1;
          }
        }
        else {
          mapNumber[indexFail] = { mapcount: 0, mapSuccessCount: 0, mapFailureCount: 0, failCount: 0, playCount: 0 }
          if (failF) {
            mapNumber[indexFail].failCount = mapNumber[indexFail].failCount + 1;
          }
          else {
            addF = true;
            mapNumber[indexFail].mapSuccessCount = mapNumber[indexFail].mapSuccessCount + 1;
          }
          playCountF = true
          mapNumber[indexFail].mapcount = mapNumber[indexFail].mapcount + 1;

          mapNumber[indexFail].playCount = mapNumber[indexFail].playCount + 1;
        }


      }
    }
    for (let indexFail = 0; indexFail < obj.MediumEmpire.codeLevel.length; indexFail++) {
      var thisLevelRecord = obj.MediumEmpire.codeLevel[indexFail].challengeLog;
      var addF = false, playCountF = false;
      for (let indexLevel = 0; indexLevel < thisLevelRecord.length; indexLevel++) {
        var thisRecordData = thisLevelRecord[indexLevel];

          var failF = false;
          if (thisRecordData.srarNum == "0") {
            failF = true;
          }
          if (mapNumber[indexFail + 24]) {
            if (failF) {
              mapNumber[indexFail + 24].failCount = mapNumber[indexFail + 24].failCount + 1;
            }
            else {
              if (addF == false) {
                addF = true;
                mapNumber[indexFail + 24].mapSuccessCount = mapNumber[indexFail + 24].mapSuccessCount + 1;
              }
            }
            if (playCountF == false) {
              playCountF = true
              mapNumber[indexFail + 24].mapcount = mapNumber[indexFail + 24].mapcount + 1;
            }
          }
          else {
            mapNumber[indexFail + 24] = { mapcount: 0, mapSuccessCount: 0, mapFailureCount: 0, failCount: 0, playCount: 0 }
            if (failF) {
              mapNumber[indexFail + 24].failCount = mapNumber[indexFail + 24].failCount + 1;
            }
            else {
              addF = true;
              mapNumber[indexFail + 24].mapSuccessCount = mapNumber[indexFail + 24].mapSuccessCount + 1;
            }
            playCountF = true
            mapNumber[indexFail + 24].mapcount = mapNumber[indexFail + 24].mapcount + 1;

            mapNumber[indexFail + 24].playCount = mapNumber[indexFail + 24].playCount + 1;
          }


      }
    }
  }

  var totPlayNumber = 0;
  var dataPlayNumber = new Array(50)
  var dataSuccessNumber = new Array(50)
  var dataFailureNumber = new Array(50)
  for (let index = 49; index > -1; index--) {
    var level = index + 1;
    var number = 0;
    if (mapNumber[index]) {
      number = mapNumber[index].mapcount
    }
    else {
      number = 0
    }
    dataPlayNumber[index] = {
      "level": level,
      "number": number
    };
    if (mapNumber[index]) {
      var num = 0;
      num = mapNumber[index].mapSuccessCount / (mapNumber[index].mapcount)
      num = num.toFixed(2); // 输出结果为 2.45
      number = num
    }
    else {
      number = 0
    }
    dataSuccessNumber[index] = {
      "level": level,
      "number": number
    };

    if (mapNumber[index]) {
      var num = 0;
      if (mapNumber[index].playCount != 0) {
        // num=mapNumber[index].failCount/mapNumber[index].playCount
        num = mapNumber[index].failCount / (mapNumber[index].mapcount)
      }
      number = num
    }
    else {
      number = 0
    }
    dataFailureNumber[index] = {
      "level": level,
      "number": number
    };
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

$('#reset_zoom').click(function () {
  switch (document.getElementById("levelSelect").value) {
    case "playNumber":
      playNumberCanvas.resetZoom();
      break;
    case "successRate":
      successRateCanvas.resetZoom();
      break;
    case "averageFailureRate":
      averageFailureRateCanvas.resetZoom();
      break;
  }
})

function changeTimeFunc(timeType) {
  var thisPlayer;
  /*將遊玩人數存入thisPlayer中*/
  var showjson
  var nowTime = new Date()
  var startTime = nowTime.getTime(), endTime = nowTime.getTime()
  var oneMinute = 1000 * 60;
  if (timeType == "oneDay") {
    startTime = startTime - oneMinute * 60 * 24;
  }
  else if (timeType == "sevenDay") {
    startTime = startTime - oneMinute * 60 * 24 * 7;
  }
  else if (timeType == "oneMonth") {
    startTime = startTime - oneMinute * 60 * 24 * 30;
  }
  else if (timeType == "sixMonth") {
    startTime = startTime - oneMinute * 60 * 24 * (31 * 4 + 30 * 3);
  }
  else if (timeType == "oneYear") {
    startTime = startTime - oneMinute * 60 * 24 * 365;
  }
  else {
    console.log("error here");
  }
  showjson = UseTimeUpdateFunc(startTime, endTime);

  // mycanvas.data.datasets[0].data = [1,2,3,4];//在此改變資料集
  // console.log(showjson.data);
  //mycanvas.data.datasets[0].data = showjson.data;//在此改變資料集

  /*以下為改變標籤內容*/
  // if(document.getElementById("levelSelect").value != "playNumber"){
  // playerData = [7,8,9,10];
  playerData = showjson.playerData;
  // }
  switch (document.getElementById("levelSelect").value) {
    case "playNumber":
      playNumberCanvas.data.datasets[0].data = showjson.data;
      playNumberCanvas.update();
      break;
    case "successRate":
      successRateCanvas.data.datasets[0].data = showjson.data;
      successRateCanvas.update();
      break;
    case "averageFailureRate":
      averageFailureRateCanvas.data.datasets[0].data = showjson.data;
      averageFailureRateCanvas.update();
      break;
  }
}
function setTimeFunc() {
  var startTime = document.getElementById("timeStart");//起始日期
  var endTime = document.getElementById("timeEnd");//結束日期

  if (startTime.value.length < 1) {
    alert("開始時間尚未填完整");
  }
  else if (endTime.value.length < 1) {
    alert("結束時間尚未填完整");
  }
  else {
    var ST = new Date(startTime.value.toString());
    var ET = new Date(endTime.value.toString());
    showjson = UseTimeUpdateFunc(ST.getTime(), ET.getTime());
    // mycanvas.data.datasets[0].data = showjson.data;//在此改變資料集

    /*以下為改變標籤內容*/
    // if(document.getElementById("levelSelect").value != "playNumber"){
    // playerData = [7,8,9,10];
    playerData = showjson.playerData;
    // }
    switch (document.getElementById("levelSelect").value) {
      case "playNumber":
        playNumberCanvas.data.datasets[0].data = showjson.data;
        playNumberCanvas.update();
        break;
      case "successRate":
        successRateCanvas.data.datasets[0].data = showjson.data;
        successRateCanvas.update();
        break;
      case "averageFailureRate":
        averageFailureRateCanvas.data.datasets[0].data = showjson.data;
        averageFailureRateCanvas.update();
        break;
    }
  }
}

function UseTimeUpdateFunc(startTime, endTime) {
  console.log(startTime, endTime);

  // AlluserData
  var mapNumber = new Array(50);
  mapNumber[50] = { mapcount: 0, mapSuccessCountDel: 0, mapFailureCount: 0 }
  for (let index = 0; index < AlluserData.length; index++) {
    var obj = AlluserData[index];
    for (let indexFail = 0; indexFail < obj.EasyEmpire.codeLevel.length; indexFail++) {
      var thisLevelRecord = obj.EasyEmpire.codeLevel[indexFail].challengeLog;
      var addF = false, playCountF = false;
      for (let indexLevel = 0; indexLevel < thisLevelRecord.length; indexLevel++) {
        var thisRecordData = thisLevelRecord[indexLevel];
        var RecordTime = new Date(thisRecordData.submitTime.toString());
        var thisRecordTime = RecordTime.getTime();

        if (thisRecordTime >= startTime && thisRecordTime <= endTime) {

          var failF = false;
          if (thisRecordData.srarNum == "0") {
            failF = true;
          }
          if (mapNumber[indexFail]) {
            if (failF) {
              mapNumber[indexFail].failCount = mapNumber[indexFail].failCount + 1;
            }
            else {
              if (addF == false) {
                addF = true;
                mapNumber[indexFail].mapSuccessCount = mapNumber[indexFail].mapSuccessCount + 1;
              }
            }
            if (playCountF == false) {
              playCountF = true
              mapNumber[indexFail].mapcount = mapNumber[indexFail].mapcount + 1;
            }
          }
          else {
            mapNumber[indexFail] = { mapcount: 0, mapSuccessCount: 0, mapFailureCount: 0, failCount: 0, playCount: 0 }
            if (failF) {
              mapNumber[indexFail].failCount = mapNumber[indexFail].failCount + 1;
            }
            else {
              addF = true;
              mapNumber[indexFail].mapSuccessCount = mapNumber[indexFail].mapSuccessCount + 1;
            }
            playCountF = true
            mapNumber[indexFail].mapcount = mapNumber[indexFail].mapcount + 1;

            mapNumber[indexFail].playCount = mapNumber[indexFail].playCount + 1;
          }

        }
      }
    }
    for (let indexFail = 0; indexFail < obj.MediumEmpire.codeLevel.length; indexFail++) {
      var thisLevelRecord = obj.MediumEmpire.codeLevel[indexFail].challengeLog;
      var addF = false, playCountF = false;
      for (let indexLevel = 0; indexLevel < thisLevelRecord.length; indexLevel++) {
        var thisRecordData = thisLevelRecord[indexLevel];
        var RecordTime = new Date(thisRecordData.submitTime.toString());
        var thisRecordTime = RecordTime.getTime();

        if (thisRecordTime >= startTime && thisRecordTime <= endTime) {
          var failF = false;
          if (thisRecordData.srarNum == "0") {
            failF = true;
          }
          if (mapNumber[indexFail + 24]) {
            if (failF) {
              mapNumber[indexFail + 24].failCount = mapNumber[indexFail + 24].failCount + 1;
            }
            else {
              if (addF == false) {
                addF = true;
                mapNumber[indexFail + 24].mapSuccessCount = mapNumber[indexFail + 24].mapSuccessCount + 1;
              }
            }
            if (playCountF == false) {
              playCountF = true
              mapNumber[indexFail + 24].mapcount = mapNumber[indexFail + 24].mapcount + 1;
            }
          }
          else {
            mapNumber[indexFail + 24] = { mapcount: 0, mapSuccessCount: 0, mapFailureCount: 0, failCount: 0, playCount: 0 }
            if (failF) {
              mapNumber[indexFail + 24].failCount = mapNumber[indexFail + 24].failCount + 1;
            }
            else {
              addF = true;
              mapNumber[indexFail + 24].mapSuccessCount = mapNumber[indexFail + 24].mapSuccessCount + 1;
            }
            playCountF = true
            mapNumber[indexFail + 24].mapcount = mapNumber[indexFail + 24].mapcount + 1;

            mapNumber[indexFail + 24].playCount = mapNumber[indexFail + 24].playCount + 1;
          }

        }
      }
    }
  }
  console.log("mapNumber:", mapNumber);
  var dataPlayNumber = new Array(50)
  var playerData = new Array(50)

  levelSelectValue = document.getElementById("levelSelect").value
  console.log(levelSelectValue);
  if (levelSelectValue == "playNumber") {
    for (let index = 49; index > -1; index--) {
      if (mapNumber[index]) {
        dataPlayNumber[index] = mapNumber[index].mapcount
        playerData[index] = mapNumber[index].mapcount
      }
      else {
        dataPlayNumber[index] = 0
        playerData[index] = 0
      }
    }
  }
  else if (levelSelectValue == "successRate") {
    for (let index = 49; index > -1; index--) {
      if (mapNumber[index]) {
        var num = 0;
        num = mapNumber[index].mapSuccessCount / (mapNumber[index].mapcount)
        num = num.toFixed(2); // 输出结果为 2.45

        dataPlayNumber[index] = num
        playerData[index] = mapNumber[index].mapcount
      }
      else {
        dataPlayNumber[index] = 0
        playerData[index] = 0
      }
    }
  }
  else if (levelSelectValue == "averageFailureRate") {
    for (let index = 49; index > -1; index--) {
      if (mapNumber[index]) {
        var num = 0;
        if (mapNumber[index].playCount != 0) {
          // num=mapNumber[index].failCount/mapNumber[index].playCount
          num = mapNumber[index].failCount / (mapNumber[index].mapcount)
        }

        dataPlayNumber[index] = num
        playerData[index] = mapNumber[index].mapcount
      }
      else {
        dataPlayNumber[index] = 0
        playerData[index] = 0
      }
    }
  }
  else {
    console.log("error here");

  }
  console.log(dataPlayNumber);
  console.log(playerData);
  return { data: dataPlayNumber, playerData: playerData }
  // return { data: [7, 8, 9], playerData: [1, 2, 3] }
}



function clrFunc() {
  switch (document.getElementById("levelSelect").value) {
    case "playNumber":
      playNumberCanvas.data.datasets[0].data = playerData_All;
      playNumberCanvas.update();
      break;
    case "successRate":
      successRateCanvas.data.datasets[0].data = successRateVar;
      playerData = playerData_All;
      successRateCanvas.update();
      break;
    case "averageFailureRate":
      averageFailureRateCanvas.data.datasets[0].data = averageFailureRateVar;
      playerData = playerData_All;
      averageFailureRateCanvas.update();
      break;
  }
}
