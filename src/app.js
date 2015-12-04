angular.module('app', [
  'ui.bootstrap',
  'ui.router'
]);


angular.module('app').controller('searchCtrl', [ '$scope', 'search', 'socket', function($scope, search, socket) {

    $scope.name = 'username'; //default value for the form
    $scope.hits = [];
    $scope.searching = false;

    $scope.submit = function(name) {
      socket.emit('usernames', {'name': name});
      $scope.searching = true;
    };

    socket.on('connect', function() {
      console.log('on connect');
      socket.on('name', function(username) {
        console.log('recieved a msg on client: ' + username.username );
        if (username.username == 'finished') {
          $scope.searching = false;
        } else {
          $scope.hits.push(username.username);
        }
        $scope.$digest();
      });
    });
}]);

angular.module('app').factory('socket', [ function() {
  var socket = {};

  socket._socket = io();

  socket.emit = function(_event, data) {
    console.log('socket emitting on' + _event);
    socket._socket.emit(_event, data);
  }

  socket.on = function(_event, func) {
      return socket._socket.on(_event, func);
  }

  return socket;
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
