var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgba(254, 254, 254, 0)',
            borderColor: 'rgb(255, 99, 132)',
            data: [1,23,4,5,6,7,8,9,62,1,3,8,72,1,4,7,0,9,5,3,4,9,8,63,2,4,7,8,7]
        }]
    },

    // Configuration options go here
    options: {}
});
