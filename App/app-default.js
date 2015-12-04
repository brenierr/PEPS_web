// deals with the date form 
var app = angular.module('default-app-management', ["highcharts-ng"]);

// Afficher : la date de pricing (jour où on calcule le prix)
// la valeur des indices ce jour la 
// la VLR 
// la performance moyenne des trois indices 
// la performance moyenne finale du panier 
// puis la formule et le res 
// valeur estimée des indices aux huits dates de constatations. 
var priceDate = new Date("2014", "12", "12");;

app.factory('Perf', function () {
    var Perf = this; 
    Perf.ObservationDates = [];
    Perf.Performances = [];// Performances of indices at observation dates
    Perf.InitialObservationDates = [];
    Perf.InitialPerformances = []; // performances of indices at InitialObservationDates
    Perf.BeginDate = new Date("2014", "12", "12");
    Perf.EndDate = new Date("2018", "12", "14");

    Perf.InitialObservationDates.push(new Date("2014", "12", "12"));
    Perf.InitialObservationDates.push(new Date("2014", "12", "15"));
    Perf.InitialObservationDates.push(new Date("2014", "12", "16"));
    Perf.ObservationDates.push(new Date("2015", "06", "12"));
    Perf.ObservationDates.push(new Date("2015", "12", "14"));
    Perf.ObservationDates.push(new Date("2016", "06", "13"));
    Perf.ObservationDates.push(new Date("2016", "12", "12"));
    Perf.ObservationDates.push(new Date("2017", "06", "12"));
    Perf.ObservationDates.push(new Date("2017", "12", "12"));
    Perf.ObservationDates.push(new Date("2018", "06", "12"));
    Perf.ObservationDates.push(new Date("2018", "12", "11"));
    Perf.VLR = 100.0;

    Perf.setPriceDate = function (date) {
        priceDate = date;
    };

    Perf.getPastPerformances = function () {
        // Get performance of indices at observation dates before priceDate
        // A lier a du c# qui fait ca (acces aux valeurs, moyenne des perfs, ...)
    };

    Perf.computePrice = function () {
        // Simulate performance of indices at observation dates after priceDate
        // acces au c# qui accède au pricer qui renvoie les valeurs aux dates de constatations + le prix + tout
        return 10.0;
    };

    Perf.computeDelta = function () {

    };

    return Perf;
});

app.controller('PriceController', ['$rootScope', 'Perf', function ($rootScope, Perf) {
    $rootScope.isPriced = false;
    $rootScope.datePrice = priceDate;
    $rootScope.endDate = Perf.EndDate;
    $rootScope.BeginDate = Perf.BeginDate;
    $rootScope.observationDates = Perf.ObservationDates;
    $rootScope.initialObservationDates = Perf.InitialObservationDates;

    $rootScope.price = function (date) {
        Perf.setPriceDate(date);
        $rootScope.price = Perf.computePrice();
        $rootScope.isPriced = true;
    }
}]);


// File to get Json data
app.value('jsonAdress', 'https://api.myjson.com/bins/4mfof');

// everything related to indices
app.factory('Indices', ['$http', 'jsonAdress', '$q', function ($http, jsonAdress, $q) {
    var Indices = this;

    // View model
    var Indice = function (data) {
        if (!data) data = {};

        var Indice = {
            id: data.id,
            name: data.name,
            prices: angular.forEach(data.prices, function (price) {
                new Price(price);
            }),
            display: function () {
                return 'indice-template'; // TODO 
            }
        };
        return Indice;
    };

    var Price = function (price) {
        if (!price) price = {};

        var Price = {
            date: new Date(price[0]),
            value: price[1],
            display: function () {
                return 'price-template'; // TODO 
            }
        };
        return Price;
    }

    // Variable
    Indices.all = []; // array of indice

    //Methods
    Indices.getIndice = function () { // get indice id, name and prices from a Json file
        var deferred = $q.defer(); // to return promise to wait the end of the function after

        $http.get(jsonAdress)
            .error(function (data, status, headers, config) {
                //reject the promise
                deferred.reject('ERROR');
                console.log("Unable to retrieve the indice from the Json file.");
            })
            .success(function (data, status, headers, config) {
                //resolve the promise
                deferred.resolve('request successful');
                console.log("Just retrieved indices from Json file.");
                angular.forEach(data, function (indice) {
                    Indices.all.push(new Indice(indice))
                });
            });
        return deferred.promise;
    };

    // Get the number of Indices
    Indices.getNbIndices = function () {
        return Indices.all.length;
    };

    return Indices;
}]);

app.controller('IndicesController', ['$rootScope', 'Indices', function ($rootScope, Indices) {
    var myPromise = Indices.getIndice();

    myPromise.then(function () { // once the data are loaded from the JSON file, bind them
        $rootScope.indices = Indices.all;
        alert($rootScope.indices.length);
        // Print a chart of the indices
        $rootScope.chartConfig = {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'Stocks values'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                labels: {
                    formatter: function () {
                        return $rootScope.indices[0].prices[this.value][0]; // clean, unformatted date
                        // carefull : xAxis are the same for every one
                    }
                }
            },

            yAxis: {
                title: {
                    text: 'market value'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            // TODO select only past values (before priceDate)
            series: [
                {
                    type: 'area',
                    name: $rootScope.indices[0].name,
                    data: $rootScope.indices[0].prices
                },
                {
                    type: 'area',
                    name: $rootScope.indices[1].name,
                    data: $rootScope.indices[1].prices
                },
                {
                    type: 'area',
                    name: $rootScope.indices[2].name,
                    data: $rootScope.indices[2].prices
                }
            ]
        };

    });


}]);

