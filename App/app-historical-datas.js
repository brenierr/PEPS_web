// to load historical stock of indices 
var app = angular.module('app-historical-datas', []);

app.factory('HistoricalStocks', ['$http', '$q', function ($http, $q) {
    var HistoricalStocks = {};

    // View model
    var HistoricalStock = function (data) {
        if (!data) data = {};

        var HistoricalStock = {
            Date: data.Date,
            Close: data.Close
        };
        return HistoricalStock;
    };

    // array of historicalStock
    HistoricalStocks.all = [];

    HistoricalStocks.getHistoricalStock = function () {
        var deferred = $q.defer(); // to return promise to wait the end of the function after
            $http.get('/HistoricalStock/GetHistoricalStock')
                .error(function (data, status, headers, config) {
                    //reject the promise
                    deferred.reject('ERROR');
                    console.log("Unable to retrieve historical data from the yahoo API.");
                })
                .success(function (data, status, headers, config) {
                    //resolve the promise
                    deferred.resolve('request successful');
                    console.log("Just retrieved historical data from yahoo API.");
                    angular.forEach(data, function (historicalStock) {
                        HistoricalStocks.all.push(new HistoricalStock(historicalStock))
                    });
                });
        return deferred.promise;
    };

    return HistoricalStocks;
}]);

app.filter('ctime', function () {

    return function (jsonDate) {

        var date = new Date(parseInt(jsonDate.substr(6)));
        return date;
    };

});

app.controller('HistoricalStockController', ['$rootScope', 'HistoricalStocks', function ($rootScope, HistoricalStocks) {
    HistoricalStocks.getHistoricalStock();
    $rootScope.historicalStocks = HistoricalStocks.all;
}]);