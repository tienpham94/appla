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

  var data_arr = [];

  //TEST
  var priceEls = document.getElementsByClassName("msg-content");
  for (let i = 0; i < priceEls.length; i++) {
    let price = priceEls[i].innerText;
    data_arr.push(price);
  }

  var data = data_arr.join("");

  //END TEST

  // var data= document.getElementById('txt').value;
  var arr = [];
  var freq = wordFreq(data.toLowerCase());
  Object.keys(freq).sort().forEach(function(word) {
  		var obj = {};
      obj["text"] = word;
      obj["size"] = freq[word];
      arr.push(obj);
  });
  var final_arr= arr.filter((el) => {
      return stopWords.indexOf(el.text) === -1;
    }).sort(compare);

  //Find the most frequent 10 words
  let most_freq_words_arr = [];
  for(let i=0; i< 10;i++){
    most_freq_words_arr.push(final_arr[i].text);
  }
  if(final_arr.length > 0){
    document.getElementById("result").innerHTML = `The 10 most frequent words are: ${most_freq_words_arr.join(", ")}`
  }

  console.log(final_arr);
  return final_arr;
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
