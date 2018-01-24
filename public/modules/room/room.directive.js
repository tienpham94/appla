let all_messages = "";
let words_chosen = [];

angular.module('room.module')
    .controller('navController', function($scope) {
    // $scope.showMe = false;
      $scope.clickConversation = function() {
        // if(!elem.hasClass('desired_class')){
        //   elem.addClass('desired_class');
        //  }
        document.getElementById("conversation").classList.remove("hide-on-med-and-down");
        document.getElementById("cloud").classList.add("hide-on-med-and-down");
        document.getElementById("my-dictionary").classList.add("hide-on-med-and-down");
        // document.getElementById("conversation").style.display = 'block';
        // // hide the lorem ipsum text
        // document.getElementById("cloud").style.display = 'none';
        // document.getElementById("my-dictionary").style.display = 'none';

        // Restyle button
        document.getElementById("conversation-button").classList.remove("lighten-4");
        document.getElementById("conversation-button").classList.add("lighten-1");
        document.getElementById("wordcloud-button").classList.remove("lighten-1");
        document.getElementById("wordcloud-button").classList.add("lighten-4");
        document.getElementById("dictionary-button").classList.remove("lighten-1");
        document.getElementById("dictionary-button").classList.add("lighten-4");
      }

      $scope.clickWordCloud = function() {
        document.getElementById("cloud").classList.remove("hide-on-med-and-down");
        document.getElementById("conversation").classList.add("hide-on-med-and-down");
        document.getElementById("my-dictionary").classList.add("hide-on-med-and-down");
        // document.getElementById("cloud").style.display = 'block';
        // // hide the lorem ipsum text
        // document.getElementById("conversation").style.display = 'none';
        // document.getElementById("my-dictionary").style.display = 'none';
        // Restyle button
        document.getElementById("conversation-button").classList.remove("lighten-1");
        document.getElementById("conversation-button").classList.add("lighten-4");
        document.getElementById("wordcloud-button").classList.remove("lighten-4");
        document.getElementById("wordcloud-button").classList.add("lighten-1");
        document.getElementById("dictionary-button").classList.remove("lighten-1");
        document.getElementById("dictionary-button").classList.add("lighten-4");
      }

      $scope.clickDictionary = function() {
        document.getElementById("conversation").classList.add("hide-on-med-and-down");
        document.getElementById("cloud").classList.add("hide-on-med-and-down");
        document.getElementById("my-dictionary").classList.remove("hide-on-med-and-down");
        // document.getElementById("my-dictionary").style.display = 'block';
        // // hide the lorem ipsum text
        // document.getElementById("cloud").style.display = 'none';
        // document.getElementById("conversation").style.display = 'none';
        // Restyle button
        document.getElementById("conversation-button").classList.remove("lighten-1");
        document.getElementById("conversation-button").classList.add("lighten-4");
        document.getElementById("wordcloud-button").classList.remove("lighten-1");
        document.getElementById("wordcloud-button").classList.add("lighten-4");
        document.getElementById("dictionary-button").classList.remove("lighten-4");
        document.getElementById("dictionary-button").classList.add("lighten-1");
      }
    })
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
          drawWordCloud();
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
                    drawWordCloud();
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
                all_messages = scope.messages;

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
  // var priceEls = document.getElementsByClassName("msg-content");
  for (let i = 0; i < all_messages.length; i++) {
    let mess = all_messages[i].message;
    data_arr.push(mess);
  }

  var data = data_arr.join(" ");

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

  // //Find the most frequent 10 words
  // let most_freq_words_arr = [];
  // for(let i=0; i< 10;i++){
  //   most_freq_words_arr.push(final_arr[i].text);
  // }
  // if(final_arr.length > 0){
  //   document.getElementById("result").innerHTML = `The 10 most frequent words are: ${most_freq_words_arr.join(", ")}`
  // }

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
    .spiral("archimedean")
    .onwordclick(function(d, i) {
      var div = document.getElementById('result');
      var clicked_word = `<li style="list-style:disc" id=${d.text}>${d.text}</li>`;

      if(!words_chosen.includes(`${d.text}`)){
        document.getElementById('dictionary').innerHTML += clicked_word
        words_chosen.push(`${d.text}`)
      }

    })
    .start();
  }


// document.addEventListener("DOMContentLoaded", function(event) {
//     drawWordCloud()
// });
