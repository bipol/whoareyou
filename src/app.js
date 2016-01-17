angular.module('app', [
  'ui.bootstrap',
  'ui.router'
]);

angular.module('app').controller('searchCtrl', [ '$scope', 'search', 'socket',
function($scope, search, socket) {

  $scope.name = 'username'; //default value for the form
  $scope.hits = [];
  $scope.searching = false;
  $scope.submit = submit;
  socket.on('connect', onConnect);

  function submit(name) {
  socket.emit('usernames', {'name': name});
    $scope.searching = true;
  }

  function onConnect() {
    socket.on('name', function(username) {
      if (username.username == 'finished') {
        $scope.searching = false;
      } else {
        $scope.hits.push(username.username);
      }
      $scope.$digest();
    });
  }
}]);

angular.module('app').factory('socket', [
function() {

  var socket = {};
  socket._socket = io();
  socket.emit = emit;
  socket.on = on;

  function emit(_event, data) {
    socket._socket.emit(_event, data);
  }

  function on(_event, func) {
    return socket._socket.on(_event, func);
  }

  return socket;
}]);

angular.module('app').factory('search', [ 'urls', '$http',
function(urls, $http) {

  search = {};
  search.hits = [];
  search.whois = whois;

  function whois(name) {
    search.hits = [];
    for (url in urls) {
      $http.get(urls[url].api, { params: { user: name } }).then( function(response) {
        if (response.data == false) {
          search.hits.push(urls[url].page + name);
        }
      });
    }
  };

  return search;
}]);

angular.module('app').constant('urls', {
  "reddit": {'api': "https://www.reddit.com/api/username_available.json", 'page': "http://www.reddit.com/u/"},
});
