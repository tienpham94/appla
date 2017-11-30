angular.module('room.module')
    .component('wordCloud', {
        // template: "<div class=''><h1 class='new-class'>{{ title }}</h1><button ng-click='someClickTest()'>Click me!</button></div>",
        templateUrl: '/modules/room/views/wordcloud.html',
        controller: function($scope){
            // $scope.title = 'Wordcloud'
            // $scope.clicks = 0
            // $scope.someClickTest = function(){
            //     console.log("clicked")
            //     $scope.clicks += 1
            //     $scope.title = 'Clicked ' + $scope.clicks + ' times'
            // }
          $scope.drawWordCloud = drawWordCloud;

        }
    })
    .directive('userList', ['roomSocket','RoomService', function (roomSocket, RoomService) {
        return {
            restrict: 'E',
            templateUrl: 'modules/room/views/user_list.html',
            link: function(scope){

                roomSocket.forward('rooms/updateUserList', scope);

                scope.$on('rooms/updateUserList', function(ev, users) {
                    scope.users = users;
                });


            }
        }
    }])
    .directive('chatbox', ['roomSocket', 'RoomService', '$rootScope',
        function(roomSocket, RoomService, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'modules/room/views/chatbox.html',
            link: function(scope) {
                scope.sendMessage = sendMessage;
                scope.message = "";
                scope.messages = [
                  {
                  "owner_info": {
                    "first_name": "Tien",
                    "last_name": "Pham"
                    }
                  },
                  {
                    "created_at": "12:30"
                  },
                  {
                    "message": "Hi there this is Tien"
                  },
                  {
                  "owner_info": {
                    "first_name": "Tien",
                    "last_name": "Pham"
                    }
                  },
                  {
                    "created_at": "12:30"
                  },
                  {
                    "message": "Hi there this is Tien"
                  },{
                  "owner_info": {
                    "first_name": "Tien",
                    "last_name": "Pham"
                    }
                  },
                  {
                    "created_at": "12:30"
                  },
                  {
                    "message": "Hi there this is Tien"
                  }
                ];

        //         {{message.owner_info.first_name}} {{message.owner_info.last_name}}
        //     </div>
        //     <div class="col m12 time-stamp">
        //         {{ message.created_at  | amFromUnix | amDateFormat:'HH:mm DD MMM'}}
        //     </div>
        // </div>
        // <div class="hide-on-med-and-up">
        //     <div class="col s6 left-align username text-accent-1">
        //         {{message.owner_info.first_name}} {{message.owner_info.last_name}}
        //     </div>
        //     <div class="col s6 right-align time-stamp text-accent-1">
        //         {{ message.created_at  | amFromUnix | amDateFormat:'HH:mm DD MMM'}}
        //     </div>
        // </div>
        // <div class="col s12 m8">
        //     <div class="msg-content msg grey lighten-4">{{message.message}}</div>

                roomSocket.forward('messages/received', scope);

                scope.$on('messages/received', function(ev, message){
                    var index = null;
                    for (var i = 0; i < scope.messages.length; i++) {
                        if (scope.messages[i].messageId == message.messageId) {
                            index = i;
                        }
                    }
                    if (index!= null) {
                        scope.messages[index] = message;
                    } else {
                        scope.messages.push(message);
                    }
                    scope.message = "";
                });

                function sendMessage() {
                    RoomService.sendMessage(scope.message, $rootScope.user);
                }
            }
        }
    }]);

var stopWords = ["a", "an", "and", "tien"];

function wordFreq(string) {
    var words = string.replace(/[.,]/g, '').split(/\s/);
    var freqMap = {};
    words.forEach(function(w) {
        if (!freqMap[w] ) {
            freqMap[w] = 0;
        }
        freqMap[w] += 1;
    });

    return freqMap;
}

function compare(a,b) {
  if (a.size < b.size)
    return 1;
  if (a.size > b.size)
    return -1;
  return 0;
}


function returnWords(){
  var data= document.getElementById('txt').value;
  var arr = [];
  var freq = wordFreq(data.toLowerCase());
  Object.keys(freq).sort().forEach(function(word) {
  		var obj = {};
      obj["text"] = word;
      obj["size"] = freq[word];
      arr.push(obj);
  });
  return arr.filter((el) => {
      return stopWords.indexOf(el.text) === -1;
    }).sort(compare);
};

function drawWordCloud(){
  document.getElementById("wordcloud").innerHTML = "";
  var words = returnWords();
  d3.wordcloud()
    .size([350, 350])
    .selector('#wordcloud')
    .scale("log")
    .fontWeight("bold")
    .fill(d3.scale.ordinal().range(["#884400", "#448800", "#888800", "#444400"]))
    .words(words)
    .onwordclick(function(d, i) {
      var div = document.getElementById('result');
      div.innerHTML += d.text + ", ";
    })
    .start();
  }
