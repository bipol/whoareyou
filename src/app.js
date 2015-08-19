angular.module('app', [ 'ui.bootstrap'
]);


angular.module('app').controller('searchCtrl', [ '$scope', 'search', function($scope, search) {

    $scope.submit = function(name) {
      console.log('form submitted with name', name);
      search.whois(name);
    };
    $scope.hits = search.hits;

    $scope.$watch(function(){ return search.hits }, function(new_val) {
        $scope.hits = new_val;
    });
}]);

angular.module('app').factory('search', [ 'urls', '$http', function(urls, $http) {
  search = {};
  search.hits = [];

  search.whois = function(name) {
    search.hits = [];
    for (url in urls) {
      $http.get(urls[url].api, { params: { user: name } }).then( function(response) {
        if (response.data == false) {
          search.hits.push(urls[url].page + name);
        }
      })
    }
  };

  return search;
}]);

angular.module('app').constant('urls', {
  "reddit": {'api': "https://www.reddit.com/api/username_available.json", 'page': "http://www.reddit.com/u/"},
});
