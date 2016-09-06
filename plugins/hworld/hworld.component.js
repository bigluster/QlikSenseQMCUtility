(function(){
    "use strict";
    var module = angular.module("QMCUtilities");

    function doSomething($http)
    {
        return $http.get("/hworld/hworld")
        .then(function(result)
        {
            return result.data;
        });
    }


    function hWorldController($http)
    {
        var model = this;
        model.response="";
        
        model.$onInit = function()
        {
                model.response ="Argghhhh";
        }

        model.clickMe = function()
        {
            doSomething($http)
            .then(function(result)
            {
                model.response = result;
            });
        };
    }

    module.component("helloWorld", {
        transclude: true,
        templateUrl:"plugins/hworld/helloWorld.html",
        controllerAs: "model",
        controller: ["$http", hWorldController]
    });


}());