var playerData, playerData_All, playerData_OneDay, playerData_SevenDay, playerData_OneMonth, playerData_SixMonth, playerData_OneYear, playerData_Var;
var playNumberFirst = false, successRateFirst = false, averageFailureRateFirst = false;
var playNumberVar, successRateVar, averageFailureRateVar;
var collectedstarsFirst = false,collectedstarsVar,collectedstarsCanvas; //宜靜
//登出函式
function logout() {
  var href = "/logout";
  window.location.replace(href);
}
var selectChartVar, jsonData, playNumberCanvas, successRateCanvas, averageFailureRateCanvas;
//頁面載入後會執行的函式
window.onload = function () {
  selectChartVar = "playNumber"; //將selechChartVar設為playNumber
  selectChart(selectChartVar); //將selectChartVar傳到selectChart函式
}
//此函式用來決定顯示的圖表
function selectChart(thisSelect) {
  switch (thisSelect) {
    //顯示遊玩人數
    case "playNumber":
      //取得遊玩人數之JSON格式資料
      getPlayNumberJson(thisSelect);
      break;
    //顯示成功率
    case "successRate":
      //取得成功率之JSON格式資料
      getSuccessRateJson(thisSelect);
      break;
    //顯示平均失敗次數
    case "averageFailureRate":
      //取得失敗率之JSON格式資料
      getAverageFailureRateJson(thisSelect);
      break;
    //以下宜靜
    case "collectedstars":
      //取得收集星星之JSON格式資料
      getcollectedstarsJson(thisSelect);
      break;
    //以上宜靜
  }
}
//根據傳入的值創造Chart圖表
function createselectChart(thisSelect) {
  //datasetsData用來存放要顯示的資料；chartType存放圖表樣式"line"為折線圖...剩下的參考chart.js官網
  var datasetsData = [0],
    chartType;
  switch (thisSelect) {
    case "playNumber":
      chartType = "line";
      setTimeout(function () {
        if (jsonData != undefined) {
          //將json內需要的資料存進datasetsData字串內
          for (var i = 0; i < jsonData.playNumber.length; i++) {
            datasetsData[i] = jsonData.playNumber[i].number;
            playerData = datasetsData; //將資料存進playerData內以便之後恢復圖表使用
          }
          //若第一次，則執行創立圖表的動作
          if (!playNumberFirst) {
            playerData_All = datasetsData;
            playNumberFirst = true;
            //取得畫布ID並創立2D畫面
            var ctx = document.getElementById('playNumberChart').getContext('2d');
            playNumberCanvas = new Chart(ctx, {
              // The type of chart we want to create
              type: chartType,
              // The data for our dataset
              data: {
                //將Y軸lables設為1-50
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'],
                datasets: [{
                  //設定每一個點上的資訊為「遊玩人數:datasetsData」
                  label: '遊玩人數：',
                  //設定背景顏色
                  backgroundColor: 'rgba(254, 254, 254, 0)',
                  //設定線條顏色
                  borderColor: '#8B8E3D',
                  //顯示數據
                  data: datasetsData
                }]
              },
              // Configuration options go here
              options: {
                scales: {
                  //畫布底下的字
                  yAxes: [{
                    scaleLabel: {
                      //是否顯示
                      display: true,
                      //字體大小
                      fontSize: 25,
                      //要顯示的字
                      labelString: '遊玩人數'
                    },
                    ticks: {
                      //顯示範圍[min,max]
                      min: 0,
                      max: jsonData.playNumber[0].number + 1,
                      callback: function (value) {
                        if (Number.isInteger(value)) {
                          return value;
                        }
                      }
                    }
                  }],
                  //同yAxes
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
                //圖表縮放設定
                zoom: {
                  enabled: true,
                  drag: false,
                  //只縮放Y軸
                  mode: "y",
                  //顯示範圍[min,max]
                  limits: {
                    max: 10,
                    min: 0.5
                  }
                }
              }
            });
            //自己的設為顯示，另外三個隱藏
            document.getElementById('playNumberChart').style.display = "block";
            document.getElementById('successRateChart').style.display = "none";
            document.getElementById('averageFailureRateChart').style.display = "none";
            document.getElementById('collectedstarsChart').style.display = "none"; //宜靜
          } else { //如果不是第一次則執行updata()來更新圖表，並將另外三個圖表隱藏
            playNumberCanvas.update();
            document.getElementById('playNumberChart').style.display = "block";
            document.getElementById('successRateChart').style.display = "none";
            document.getElementById('averageFailureRateChart').style.display = "none";
            document.getElementById('collectedstarsChart').style.display = "none";  //宜靜
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
                  //設定長條圖外框顏色，一個圖表一個顏色
                  backgroundColor: [
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7'
                  ],
                  //設定長條圖顏色，一個圖表一個顏色
                  borderColor: [
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7'
                  ],
                  //設定長條圖寬度
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
                //設定滑鼠移到長條圖上要顯示的資訊
                tooltips: {
                  callbacks: {
                    label: function (tooltipItem) {
                      // 「通關率；Y軸資訊」，「遊玩人數；X資訊-1」
                      return "通關率：" + tooltipItem.yLabel + "；遊玩人數：" + playerData[tooltipItem.xLabel - 1];
                    }
                  }
                }
              }
            });
            document.getElementById('playNumberChart').style.display = "none";
            document.getElementById('successRateChart').style.display = "block";
            document.getElementById('averageFailureRateChart').style.display = "none";
            document.getElementById('collectedstarsChart').style.display = "none"; //宜靜
          } else {
            successRateCanvas.update();
            document.getElementById('playNumberChart').style.display = "none";
            document.getElementById('successRateChart').style.display = "block";
            document.getElementById('averageFailureRateChart').style.display = "none";
            document.getElementById('collectedstarsChart').style.display = "none"; //宜靜
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
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7'
                  ],
                  borderColor: [
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7',
                    '#668600',
                    '#C08900',
                    '#C96986',
                    '#DE6948',
                    '#74AFA9',
                    '#009FC7'
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
            document.getElementById('collectedstarsChart').style.display = "none"; //宜靜
          } else {
            averageFailureRateCanvas.update();
            document.getElementById('playNumberChart').style.display = "none";
            document.getElementById('successRateChart').style.display = "none";
            document.getElementById('averageFailureRateChart').style.display = "block";
            document.getElementById('collectedstarsChart').style.display = "none"; //宜靜
          }
        }
      }, 500);
      break;
      // 以下宜靜
      case "collectedstars":
      chartType = "line";  //radar 雷達圖
      setTimeout(function () {
        if (jsonData != undefined) {
          //將json內需要的資料存進datasetsData字串內
          for (var i = 0; i < jsonData.collectedstars.length; i++) {
            datasetsData[i] = jsonData.collectedstars[i].number;
          }
          //若第一次，則執行創立圖表的動作
          if (!collectedstarsFirst) {
            collectedstarsVar = datasetsData;
            collectedstarsFirst = true;
            //取得畫布ID並創立2D畫面
            var ctx = document.getElementById('collectedstarsChart').getContext('2d');
            collectedstarsCanvas = new Chart(ctx, {
              // The type of chart we want to create
              type: chartType,
              // The data for our dataset
              data: {
                //將Y軸lables設為1-50
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'],
                datasets: [{
                  //設定每一個點上的資訊為「遊玩人數:datasetsData」
                  label: '平均收集星星數',
                  //設定背景顏色
                  backgroundColor: 'rgba(255, 99, 132, 0.1)',
                  //設定線條顏色
                  borderColor: 'rgba(255, 99, 132, 1)',
                  //顯示數據
                  data: datasetsData
                }]
              },
              // Configuration options go here
              options: {
                scales: {
                  //畫布底下的字
                  yAxes: [{
                    scaleLabel: {
                      //是否顯示
                      display: true,
                      //字體大小
                      fontSize: 25,
                      //要顯示的字
                      labelString: '平均收集星星數'
                    },
                    ticks: {
                      //顯示範圍[min,max]
                      min: 0,
                      max: jsonData.collectedstars[0].number + 1,
                      callback: function (value) {
                        if (Number.isInteger(value)) {
                          return value;
                        }
                      }
                    }
                  }],
                  //同yAxes
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
                //圖表縮放設定
                zoom: {
                  enabled: true,
                  drag: false,
                  //只縮放Y軸
                  mode: "y",
                  //顯示範圍[min,max]
                  limits: {
                    max: 10,
                    min: 0.5
                  }
                },
                elements: {
                  line: {
                    tension: 0 // 禁用貝塞爾曲線
                  }
                }
              }
            });
            //自己的設為顯示，另外兩個隱藏
            document.getElementById('playNumberChart').style.display = "none";
            document.getElementById('successRateChart').style.display = "none";
            document.getElementById('averageFailureRateChart').style.display = "none";
            document.getElementById('collectedstarsChart').style.display = "block";
          } else { //如果不是第一次則執行updata()來更新圖表，並將另外兩個圖表隱藏
            collectedstarsCanvas.update();
            document.getElementById('playNumberChart').style.display = "none";
            document.getElementById('successRateChart').style.display = "none";
            document.getElementById('averageFailureRateChart').style.display = "none";
            document.getElementById('collectedstarsChart').style.display = "block";
          }
        }
      }, 500);
      playerData = playerData_All;
      break;
      //以上宜靜
  }
  Chart.defaults.global.defaultFontFamily = "Microsoft JhengHei";
}

var href = window.location.href;
var readAllPlayFlag = false;
var PlayNumber, SuccessRate, AverageFailureRate, AlluserData;
var Collectedstars;  //宜靜

//以下為豐銘在用的
function getPlayNumberJson(thisSelect) {
  if (readAllPlayFlag) { //有資料了
    jsonData = JSON.parse(JSON.stringify(PlayNumber));
    createselectChart(thisSelect);
  } else {
    var scriptData = {
      type: "readAllPlay",
    }
    $.ajax({
      url: href, // 要傳送的頁面
      method: 'POST', // 使用 POST 方法傳送請求
      dataType: 'json', // 回傳資料會是 json 格式
      data: scriptData, // 將表單資料用打包起來送出去
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
  } else {
    var scriptData = {
      type: "readAllPlay",
    }
    $.ajax({
      url: href, // 要傳送的頁面
      method: 'POST', // 使用 POST 方法傳送請求
      dataType: 'json', // 回傳資料會是 json 格式
      data: scriptData, // 將表單資料用打包起來送出去
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
  } else {
    var scriptData = {
      type: "readAllPlay",
    }
    $.ajax({
      url: href, // 要傳送的頁面
      method: 'POST', // 使用 POST 方法傳送請求
      dataType: 'json', // 回傳資料會是 json 格式
      data: scriptData, // 將表單資料用打包起來送出去
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

//以下宜靜
function getcollectedstarsJson(thisSelect) {
  if (readAllPlayFlag) { //有資料了
    jsonData = JSON.parse(JSON.stringify(Collectedstars));
    createselectChart(thisSelect);
  } else {
    var scriptData = {
      type: "readAllPlay",
    }
    $.ajax({
      url: href, // 要傳送的頁面
      method: 'POST', // 使用 POST 方法傳送請求
      dataType: 'json', // 回傳資料會是 json 格式
      data: scriptData, // 將表單資料用打包起來送出去
      success: function (res) {
        AlluserData = res;
        prosessUserData();
         // jsonData = PlayNumber.slice(0);
        jsonData = JSON.parse(JSON.stringify(Collectedstars));
        createselectChart(thisSelect);
        readAllPlayFlag = true
        
      }
    })
  }
}
//以上宜靜

// 抓取使用者的數據
function prosessUserData() {
  // console.log(AlluserData);
  var mapNumber = new Array(50);
  mapNumber[50] = {
    mapcount: 0,
    mapSuccessCountDel: 0,
    mapFailureCount: 0,
    mapStarcount : 0 //宜靜
  }
  for (let index = 0; index < AlluserData.length; index++) {
    var obj = AlluserData[index];
    for (let indexFail = 0; indexFail < obj.EasyEmpire.codeLevel.length; indexFail++) {
      var thisLevelRecord = obj.EasyEmpire.codeLevel[indexFail].challengeLog;
      var thisStarRecord = obj.EasyEmpire.codeLevel[indexFail].HighestStarNum; //宜靜
      var addF = false,playCountF = false;
      var CounterStar = false; //宜靜
      for (let indexLevel = 0; indexLevel < thisLevelRecord.length; indexLevel++) {
        var thisRecordData = thisLevelRecord[indexLevel];

        var failF = false;
        if (thisRecordData.srarNum == "0") {
          failF = true;
        }
        if (mapNumber[indexFail]) {
          if (failF) {
            mapNumber[indexFail].failCount = mapNumber[indexFail].failCount + 1;
          } else {
            if (addF == false) {
              addF = true;
              mapNumber[indexFail].mapSuccessCount = mapNumber[indexFail].mapSuccessCount + 1;
            }
          }
          if (playCountF == false) {
            playCountF = true
            mapNumber[indexFail].mapcount = mapNumber[indexFail].mapcount + 1;
          }
          //以下宜靜
          if(CounterStar == false){
            CounterStar = true
            if(thisStarRecord == "1"){
              mapNumber[indexFail].mapStarcount = mapNumber[indexFail].mapStarcount + 1;
            }
            if(thisStarRecord == "2"){
              mapNumber[indexFail].mapStarcount = mapNumber[indexFail].mapStarcount + 2;
            }
            if(thisStarRecord == "3"){
              mapNumber[indexFail].mapStarcount = mapNumber[indexFail].mapStarcount + 3;
            }
          }
          //以上宜靜
        } else {
          mapNumber[indexFail] = {
            mapcount: 0,
            mapSuccessCount: 0,
            mapFailureCount: 0,
            mapStarcount : 0, //宜靜
            failCount: 0,
            playCount: 0
          }
          if (failF) {
            mapNumber[indexFail].failCount = mapNumber[indexFail].failCount + 1;
          } else {
            addF = true;
            mapNumber[indexFail].mapSuccessCount = mapNumber[indexFail].mapSuccessCount + 1;
          }
          playCountF = true
          mapNumber[indexFail].mapcount = mapNumber[indexFail].mapcount + 1;
          mapNumber[indexFail].playCount = mapNumber[indexFail].playCount + 1;
          //以下宜靜
          CounterStar = true;
          if(thisStarRecord == "1"){
            mapNumber[indexFail].mapStarcount = mapNumber[indexFail].mapStarcount + 1;
          }
          if(thisStarRecord == "2"){
            mapNumber[indexFail].mapStarcount = mapNumber[indexFail].mapStarcount + 2;
          }
          if(thisStarRecord == "3"){
            mapNumber[indexFail].mapStarcount = mapNumber[indexFail].mapStarcount + 3;
          }
          //以上宜靜
        }


      }
    }
    for (let indexFail = 0; indexFail < obj.MediumEmpire.codeLevel.length; indexFail++) {
      var thisLevelRecord = obj.MediumEmpire.codeLevel[indexFail].challengeLog;
      var thisStarRecord = obj.MediumEmpire.codeLevel[indexFail].HighestStarNum; //宜靜
      var addF = false,playCountF = false;
      var CounterStar = false; //宜靜
      for (let indexLevel = 0; indexLevel < thisLevelRecord.length; indexLevel++) {
        var thisRecordData = thisLevelRecord[indexLevel];

        var failF = false;
        if (thisRecordData.srarNum == "0") {
          failF = true;
        }
        if (mapNumber[indexFail + 24]) {
          if (failF) {
            mapNumber[indexFail + 24].failCount = mapNumber[indexFail + 24].failCount + 1;
          } else {
            if (addF == false) {
              addF = true;
              mapNumber[indexFail + 24].mapSuccessCount = mapNumber[indexFail + 24].mapSuccessCount + 1;
            }
          }
          if (playCountF == false) {
            playCountF = true
            mapNumber[indexFail + 24].mapcount = mapNumber[indexFail + 24].mapcount + 1;
          }
          //以下宜靜
          if(CounterStar == false){
            CounterStar = true
            if(thisStarRecord == "1"){
              mapNumber[indexFail + 24].mapStarcount = mapNumber[indexFail + 24].mapStarcount + 1;
            }
            if(thisStarRecord == "2"){
              mapNumber[indexFail + 24].mapStarcount = mapNumber[indexFail + 24].mapStarcount + 2;
            }
            if(thisStarRecord == "3"){
              mapNumber[indexFail + 24].mapStarcount = mapNumber[indexFail + 24].mapStarcount + 3;
            }
          }
          //以上宜靜
        } else {
          mapNumber[indexFail + 24] = {
            mapcount: 0,
            mapSuccessCount: 0,
            mapFailureCount: 0,
            mapStarcount : 0, //宜靜
            failCount: 0,
            playCount: 0
          }
          if (failF) {
            mapNumber[indexFail + 24].failCount = mapNumber[indexFail + 24].failCount + 1;
          } else {
            addF = true;
            mapNumber[indexFail + 24].mapSuccessCount = mapNumber[indexFail + 24].mapSuccessCount + 1;
          }
          playCountF = true
          mapNumber[indexFail + 24].mapcount = mapNumber[indexFail + 24].mapcount + 1;
          mapNumber[indexFail + 24].playCount = mapNumber[indexFail + 24].playCount + 1;
          //以下宜靜
          CounterStar = true;
          if(thisStarRecord == "1"){
            mapNumber[indexFail + 24].mapStarcount = mapNumber[indexFail + 24].mapStarcount + 1;
          }
          if(thisStarRecord == "2"){
            mapNumber[indexFail + 24].mapStarcount = mapNumber[indexFail + 24].mapStarcount + 2;
          }
          if(thisStarRecord == "3"){
            mapNumber[indexFail + 24].mapStarcount = mapNumber[indexFail + 24].mapStarcount + 3;
          }
          //以上宜靜
        }


      }
    }
  }

  var totPlayNumber = 0;
  var dataPlayNumber = new Array(50)
  var dataSuccessNumber = new Array(50)
  var dataFailureNumber = new Array(50)
  var dataStarNumber = new Array(50) //宜靜
  for (let index = 49; index > -1; index--) {
    var level = index + 1;
    var number = 0;
    if (mapNumber[index]) {
      number = mapNumber[index].mapcount
    } else {
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
    } else {
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
    } else {
      number = 0
    }
    dataFailureNumber[index] = {
      "level": level,
      "number": number
    };
    //以下宜靜
    if(mapNumber[index]){
      var num = 0;
      console.log(mapNumber);
      num = mapNumber[index].mapStarcount / (mapNumber[index].mapcount)
      number = num
      //console.log(mapNumber[index].mapStarcount);
    }else {
      number = 0
    }
    dataStarNumber[index] = {
      "level": level,
      "number": number
    };
    //以上宜靜
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
  //以下宜靜
  Collectedstars = {
    "collectedstars": dataStarNumber
  }
  //以上宜靜
}

function resetzoom() {
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
    //以下宜靜
    case "collectedstars":
      collectedstarsCanvas.resetZoom();
      break;
    //以上宜靜
  }
}
// 單純為了使用p5的存檔功能而創的
function setup() {
}
function draw() {
}
//----------------------------
//下載遊玩時間資料
function download() {
  var dt = new Date();
  var year = dt.getFullYear();
  var month = dt.getMonth() + 1;
  var day = dt.getDate();
  var fileName = "userPlayTimes" + year + month + day ;
  var savejson = [{
    "_id": "5dd23bb4c03f2958e0130807",
    "username": "s",
    "email": "s@gmail.com",
    "startDate": "2019-11-18T06:35:30.000Z",
    "endDate": "2019-11-18T06:35:32.000Z",
    "__v": 0
  }];
  $.ajax({
    url: "API/downloadUserPlayTimes",              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    async: false,
    data: null,  // 將表單資料用打包起來送出去
    success: function (res) {
      // saveJSON(res, fileName+".txt");
      saveSelfCSV(res, fileName);

    }
  });
  // console.log(savejson,fileName,save());
}
function saveSelfCSV(res, fileName) {
  var rows =[["使用者名稱","信箱","開始時間","結束時間","是否遊玩關卡","關卡","星星數","指令數","是否破紀錄","提交時間"]]
  for (let index = 0; index < res.length; index++) {
    var eleRecord= res[index];
    var temp =[];
    temp.push(eleRecord.username.toString());
    temp.push(eleRecord.email);
    temp.push(eleRecord.startDate);
    temp.push(eleRecord.endDate);
    temp.push(eleRecord.playState);
    temp.push(eleRecord.level);
    temp.push(eleRecord.starNum);
    temp.push(eleRecord.instructionNum);
    temp.push(eleRecord.isRecordHightScore);
    temp.push(eleRecord.submitTime);
    rows.push(temp);

  }
  // const rows = [
  //   ["我是誰", "city1", "some other info"],
  //   ["" , "qwewe"]
  // ];
  var csvContent="";
  rows.forEach(function (rowArray) {
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  });
  // var csvContent = "欄位A,欄位B\n值A,值B";

  var link = window.document.createElement("a");
  link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvContent));
  link.setAttribute("download", fileName+".csv");
  link.click();

}

function changeTimeFunc(timeType) {
  var thisPlayer;
  /*將遊玩人數存入thisPlayer中*/
  var showjson
  var nowTime = new Date()
  var startTime = nowTime.getTime(),
    endTime = nowTime.getTime()
  var oneMinute = 1000 * 60;
  if (timeType == "oneDay") {
    startTime = startTime - oneMinute * 60 * 24;
  } else if (timeType == "sevenDay") {
    startTime = startTime - oneMinute * 60 * 24 * 7;
  } else if (timeType == "oneMonth") {
    startTime = startTime - oneMinute * 60 * 24 * 30;
  } else if (timeType == "sixMonth") {
    startTime = startTime - oneMinute * 60 * 24 * (31 * 4 + 30 * 3);
  } else if (timeType == "oneYear") {
    startTime = startTime - oneMinute * 60 * 24 * 365;
  } else {
    // console.log("error here");
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
    //以下宜靜
    case "collectedstars":
      collectedstarsCanvas.data.datasets[0].data = showjson.data;
      collectedstarsCanvas.update();
      break;
    //以上宜靜
  }
}

function setTimeFunc() {
  var startTime = document.getElementById("timeStart"); //起始日期
  var endTime = document.getElementById("timeEnd"); //結束日期

  if (startTime.value.length < 1) {
    alert("開始時間尚未填完整");
  } else if (endTime.value.length < 1) {
    alert("結束時間尚未填完整");
  } else {
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
      //以下宜靜
      case "collectedstars":
        collectedstarsCanvas.data.datasets[0].data = showjson.data;
        collectedstarsCanvas.update();
        break;
      //以上宜靜
    }
  }
}

function UseTimeUpdateFunc(startTime, endTime) {
  // console.log(startTime, endTime);

  // AlluserData
  var mapNumber = new Array(50);
  mapNumber[50] = {
    mapcount: 0,
    mapSuccessCountDel: 0,
    mapFailureCount: 0
  }
  for (let index = 0; index < AlluserData.length; index++) {
    var obj = AlluserData[index];
    for (let indexFail = 0; indexFail < obj.EasyEmpire.codeLevel.length; indexFail++) {
      var thisLevelRecord = obj.EasyEmpire.codeLevel[indexFail].challengeLog;
      var addF = false,
        playCountF = false;
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
            } else {
              if (addF == false) {
                addF = true;
                mapNumber[indexFail].mapSuccessCount = mapNumber[indexFail].mapSuccessCount + 1;
              }
            }
            if (playCountF == false) {
              playCountF = true
              mapNumber[indexFail].mapcount = mapNumber[indexFail].mapcount + 1;
            }
          } else {
            mapNumber[indexFail] = {
              mapcount: 0,
              mapSuccessCount: 0,
              mapFailureCount: 0,
              failCount: 0,
              playCount: 0
            }
            if (failF) {
              mapNumber[indexFail].failCount = mapNumber[indexFail].failCount + 1;
            } else {
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
      var addF = false,
        playCountF = false;
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
            } else {
              if (addF == false) {
                addF = true;
                mapNumber[indexFail + 24].mapSuccessCount = mapNumber[indexFail + 24].mapSuccessCount + 1;
              }
            }
            if (playCountF == false) {
              playCountF = true
              mapNumber[indexFail + 24].mapcount = mapNumber[indexFail + 24].mapcount + 1;
            }
          } else {
            mapNumber[indexFail + 24] = {
              mapcount: 0,
              mapSuccessCount: 0,
              mapFailureCount: 0,
              failCount: 0,
              playCount: 0
            }
            if (failF) {
              mapNumber[indexFail + 24].failCount = mapNumber[indexFail + 24].failCount + 1;
            } else {
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
  // console.log("mapNumber:", mapNumber);
  var dataPlayNumber = new Array(50)
  var playerData = new Array(50)

  levelSelectValue = document.getElementById("levelSelect").value
  // console.log(levelSelectValue);
  if (levelSelectValue == "playNumber") {
    for (let index = 49; index > -1; index--) {
      if (mapNumber[index]) {
        dataPlayNumber[index] = mapNumber[index].mapcount
        playerData[index] = mapNumber[index].mapcount
      } else {
        dataPlayNumber[index] = 0
        playerData[index] = 0
      }
    }
  } else if (levelSelectValue == "successRate") {
    for (let index = 49; index > -1; index--) {
      if (mapNumber[index]) {
        var num = 0;
        num = mapNumber[index].mapSuccessCount / (mapNumber[index].mapcount)
        num = num.toFixed(2); // 输出结果为 2.45

        dataPlayNumber[index] = num
        playerData[index] = mapNumber[index].mapcount
      } else {
        dataPlayNumber[index] = 0
        playerData[index] = 0
      }
    }
  } else if (levelSelectValue == "averageFailureRate") {
    for (let index = 49; index > -1; index--) {
      if (mapNumber[index]) {
        var num = 0;
        if (mapNumber[index].playCount != 0) {
          // num=mapNumber[index].failCount/mapNumber[index].playCount
          num = mapNumber[index].failCount / (mapNumber[index].mapcount)
        }

        dataPlayNumber[index] = num
        playerData[index] = mapNumber[index].mapcount
      } else {
        dataPlayNumber[index] = 0
        playerData[index] = 0
      }
    }
  }else if (levelSelectValue == "collectedstars") { //此行以下宜靜
    for (let index = 49; index > -1; index--) {
      if (mapNumber[index]) {
        dataPlayNumber[index] = mapNumber[index].mapcount
        playerData[index] = mapNumber[index].mapcount
      } else {
        dataPlayNumber[index] = 0
        playerData[index] = 0
      }
    }//以上宜靜
  }else {
    // console.log("error here");

  }
  // console.log(dataPlayNumber);
  // console.log(playerData);
  return {
    data: dataPlayNumber,
    playerData: playerData
  }
  // return { data: [7, 8, 9], playerData: [1, 2, 3] }
}


//將各個圖表資料設初使狀態
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
    //以下宜靜
    case "collectedstars":
      collectedstarsCanvas.data.datasets[0].data = playerData_All;
      collectedstarsCanvas.update();
      break;
    //以上宜靜
  }
}
