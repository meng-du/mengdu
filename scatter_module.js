angular.module('views.report.main.scatter', ['views.report.main.scatter.service', 'views.report.main.scatter.config'])
.controller('scatterCtrl', ['$scope', '$timeout', '$ionicPopup', 'report_manager', 'scatter_config', function($scope, $timeout, $ionicPopup, report_manager, config) {
    /* Placeholder data incase the report is still loading */
    $scope.chart_data = {
        datasets: [{
            label: "Waiting",
            data: [{x: 0, y: 0}]
        }]
    };

    /* Chart options */
    $scope.chart_options = {
        hoverMode: 'single' // should always use single for a scatter chart
    };

    /* Set the desired chart color */
    Chart.defaults.global.elements.line.backgroundColor = "rgba(0, 0, 0 ,0)";
    Chart.defaults.global.elements.line.borderWidth = 0;
    Chart.defaults.global.elements.line.borderColor = "rgba(0, 0, 0, 0)";
    Chart.defaults.global.elements.line.fill = false;
    Chart.defaults.global.elements.point.backgroundColor = "rgba(184, 63, 63, 0.75)";
    Chart.defaults.global.elements.point.borderColor = "rgba(184, 63, 63, 1)";

    Chart.defaults.global.tooltips.enabled = false;

    /* Insure the data is loaded before updating the view */
    $scope.ready.then(function() {
        console.log('Ready');

        $scope.blockquote = config.blockquote;
        $scope.scatter = $scope.report.data.items.scatter;

        /* Charts have a "before" and "after" dataset */
        $scope.state = "before";
        $scope.chart_data = $scope.scatter[$scope.state].data;
    });

    /* Keeps track if we're displaying the data table */
    $scope.show_dataset = false;

    /* Changes between before/after views */
    $scope.toggleBeforeAndAfter = function() {
        if($scope.state == "before") { $scope.state = "after"; }
        else { $scope.state = "before"; }
        /* Update the graph */
        $scope.chart_data = $scope.scatter[$scope.state].data;
    };

    /* Adds a new column to the dataset */
    $scope.addData = function() {
        $scope.scatter[$scope.state].data.datasets[0].data.push({x:0.5, y:0.5});
        $scope.chart_data = $scope.scatter[$scope.state].data;
    }

    /* Removes a column */
    $scope.removeData = function(index) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Remove Data',
            template: 'Are you sure you want to remove this data point?'
        });

        confirmPopup.then(function(res) {
            if(res) 
            {
                $scope.scatter[$scope.state].data.datasets[0].data.splice(index, 1);
                $scope.chart_data = $scope.scatter[$scope.state].data;
            } 
            else { /* Nothing */ }
        });
    };


    /* Save on quit */
    $scope.$on('$ionicView.beforeLeave', function() {
        $scope.report.data.items.scatter = angular.copy($scope.scatter);
        report_manager.updateReport($scope.report);
    });

}]);
