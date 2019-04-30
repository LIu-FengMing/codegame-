var selectChartVar,jsonData;
window.onload = function() {
  selectChartVar = "playNumber";
  getPlayNumberJson();
  selectChart(selectChartVar);
}
function selectChart(thisSelect) {
  var datasetsData=null,chartType;
  switch (thisSelect) {
    case "playNumber":
      chartType = "line";
      // var text = {
      //   "playNumber":[
      //     {
      //       "number":1
      //     },
      //     {
      //       "number":1
      //     }
      //   ]
      // };datasetsData
      // console.log(datasetsData);
      var ctx = document.getElementById('playNumberChart').getContext('2d');
      var chart = new Chart(ctx, {
          // The type of chart we want to create
          type: chartType,

          // The data for our dataset
          data: {
              labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50'],
              datasets: [{
                  label: '遊玩人數：',
                  backgroundColor: 'rgba(254, 254, 254, 0)',
                  borderColor: 'rgb(255, 99, 132)',
                  data: [1,23,4,5,6,7,8,9,62,1,3,8,72,1,4,7,0,9,5,3,4,9,8,63,2,4,7,8,7]
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
      break;
    case "successRate":
      chartType = "bar";
      var ctx = document.getElementById('successRateChart');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50'],
          datasets: [{
              label: '通關率（%）：',
              data: [19, 3, 5, 2, 3, 19, 3, 5, 2, 3, 19, 3, 5, 2, 3, 19, 3, 5, 2, 3, 19, 3, 5, 2, 3, 19, 3, 5, 2, 3, 19, 3, 5, 2, 3, 19, 3, 5, 2, 3, 19, 3, 5, 2, 3, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
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
             labelString: '關卡'
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
      break;
    case "averageFailureRate":
    chartType = "bar";
    var ctx = document.getElementById('averageFailureRateChart');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50'],
        datasets: [{
            label: '平均失敗率（%）：',
            data: [19, 3, 5, 2, 3, 19, 3, 5, 2, 3, 19, 3, 50, 2, 3, 19, 3, 5, 2, 3, 19, 3, 5, 2, 3, 19, 3, 5, 2, 3, 19, 3, 5, 2, 3, 19, 3, 5, 2, 3, 19, 3, 5, 2, 3, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
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
           labelString: '關卡'
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
    break;
  }
  console.log(jsonData);
}
function getPlayNumberJson() {
  // var jsonData = null;
  var xmlhttp = new XMLHttpRequest();
  // while(jsonData == null){
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        jsonData = JSON.parse(this.responseText);
      }
    };
    xmlhttp.open("GET", "json/dictionary.json", true);
    xmlhttp.send();
  // }
  console.log(jsonData);
  return jsonData;
}
