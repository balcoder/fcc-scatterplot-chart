(function () {
  var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

getData(url, drawScatterPlot);

function getData(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      try {
        // store data in myDataObject variable
      var myDataObject = JSON.parse(this.responseText);
        } catch(error) {
          console.log(error.msg + " in " + xmlhttp.responseText);
          return
        }
        // do something with the data
      callback(myDataObject);
    }
  }
  xmlhttp.open("GET", url, true);
    xmlhttp.send();
}


  function drawScatterPlot(arr) {
    var ctx = document.getElementById('myChart').getContext('2d');

    // get datasets for clean and alleged drug takers
    var cleanCyclist = arr.filter((data) => {
      if(data.Doping == "") return data;
    });
    console.log(cleanCyclist);
    var drugCyclist = arr.filter((data) => {
      if(!data.Doping == "") return data;
    });
    //console.log(drugCyclist);
    function findFastestTime(element) {
      return element.Place == 1;
    }
    var fastestTime =arr[arr.findIndex(findFastestTime)].Time;
    var splitTime = fastestTime.split(':');
    var fastestTimeInSec = (Number.parseInt(splitTime[0], 10) * 60) + Number.parseInt(splitTime[1], 10);

    // takes time in format  min:sec and return time in seconds
    function getTimeInSec(time) {
      var splitTime = time.split(':');
      var timeInSec = (Number.parseInt(splitTime[0], 10) * 60) + Number.parseInt(splitTime[1], 10);
      return timeInSec;
    }



    var cleanData = cleanCyclist.map((data) => ({x: getTimeInSec(data.Time) - fastestTimeInSec, y:data.Place}));
    console.log(cleanData);
    var drugData = drugCyclist.map((data) => ({x: getTimeInSec(data.Time) - fastestTimeInSec, y:data.Place}));
    //console.log(drugData);

    // var timeLabels = obj.map((data) => data.Time);
    // var rank = obj.map((data) => data.Place);
    var data = {
      datasets: [{
        label: 'Clean Cyclist',
        borderColor: '#3DC4FF',
        backgroundColor: '#8AF3FF',
        borderColor: '#1d638c',
        data: cleanData
      },
      {
        label: 'Drug Cyclist',
        borderColor: '#A83A44',
        backgroundColor: '#DF3A44',
        data: drugData
      }]
    };
    var myChart = new Chart(ctx, {
      type: 'scatter',
      data: data,
      options: {
        title: {
          display: true,
          text: 'Doping in Professional Bicycle Racing',
          fontSize: 25,
          fontColor: 'black'
        },
        tooltips: {
          callbacks:{
            title: function(tooltipItem, data) {
              let index = tooltipItem[0].yLabel - 1;
              //return arr[tooltipItem[0].index].Name;
               return arr[index].Name;
            },
            label: function(tooltipItem, data) {
              let index = tooltipItem.yLabel - 1;
              if(arr[index].Doping =="") {
                return "No Doping alligations";
              } else {
                return arr[index].Doping;
              }
            }
          }
        },
        scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Number of seconds behind fastest',
                fontColor: 'black',
                fontStyle: 'bold'
              },
              type: 'linear',
              position: 'bottom',
              ticks: {
                //reverse: true,
                max: 240,
                min: 0,
                stepSize: 40
            }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Rank #',
                fontColor: 'black',
                fontStyle: 'bold'
              },
              ticks: {
                reverse: true,
                max: 35,
                min: 1,
              }
            }]
          }

          }
    });
  }

})();
