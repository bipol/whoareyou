(function() {
	angular.module('app', [
	  'ui.bootstrap',
	  'ui.router'
	]);

	angular.module('app').config([ '$stateProvider',
	function($stateProvider) {
		$stateProvider.state('hits', {
			  templateUrl: 'templates/hits.html',
				url: '/hits/:name',
				resolve: {
					socket: 'socket',
					$state: '$state',
					name: function($stateParams) {
						return $stateParams.name;
					}
				},
				onEnter: function(socket, name) {
					socket.emit('usernames', {'name': name});
				}
			});
	}]);
})();

(function() {
	angular.module('app').controller('searchCtrl', [ '$scope', 'socket', '$state',
	function($scope, socket, $state) {

	  $scope.name = 'username'; //default value for the form
	  $scope.hits = [];
		$scope.nsfw = false;
	  $scope.searching = false;
	  $scope.submit = submit;
	  socket.on('connect', onConnect);

	  function submit(name) {
		  // socket.emit('usernames', {'name': name});
	    $scope.searching = true;
			$state.go('hits', {
				name: name
			});
	  }

	  function onConnect() {
	    socket.on('name', function(username) {
	      if (username.username == 'finished') {
					$scope.searching = false;
	      } else {
					$scope.hits.push({'url': username.username, 'nsfw': username.nsfw});
	      }
	      $scope.$digest();
	    });
	  }
	}]);
})();

(function() {
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
})();
