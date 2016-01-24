(function() {
  'use strict';
  angular
    .module('app')
    .config(routes);

  routes.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function routes($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise("404");
    $locationProvider.html5Mode(true);
    $stateProvider
      .state('home', {
        url:'/',
        templateUrl: 'app/components/home/home.tpl.html',
        controller : 'homeCtrl',
        controllerAs : 'vm'
      })
      .state('404', {
        url:'/404',
        templateUrl: 'app/components/404/404.tpl.html'
      });
  }
})();
