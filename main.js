var nextTrain;
var minAway;
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAySBpCZlaYYiH-Aj3Zpy4ubagv-3fZ2Z8",
    authDomain: "train-scheduler-b98f5.firebaseapp.com",
    databaseURL: "https://train-scheduler-b98f5.firebaseio.com",
    projectId: "train-scheduler-b98f5",
    storageBucket: "train-scheduler-b98f5.appspot.com",
    messagingSenderId: "83894203975"
  };
  firebase.initializeApp(config);


var db = firebase.database();


db.ref().on("child_changed", function(childSnapshot) {
  console.log(childSnapshot.val());
  console.log(childSnapshot.val().train);
  console.log(childSnapshot.val().dest);
  console.log(childSnapshot.val().ft);
  console.log(childSnapshot.val().freq);

  var row = $("<tr>")
  row.append("<td class='col-xs-2 train_list'>" + childSnapshot.val().train + "</td>");
  row.append("<td class='col-xs-2 train_list'>" + childSnapshot.val().dest + "</td>");
  row.append("<td class='col-xs-2 train_list'>" + childSnapshot.val().freq + "</td>");
  row.append("<td class='col-xs-2 train_list'>" + childSnapshot.val().ft + "</td>");
  row.append("<td class='col-xs-2 train_list'>" + childSnapshot.val().away + "</td>");

  $(".train-schedule").append(row);

})


//this is waiting for a change to happen in the database

db.ref().on("child_added", function(snapshot) {
console.log(snapshot.val());
console.log(snapshot.val().train);
console.log(snapshot.val().dest);
console.log(snapshot.val().ft);
console.log(snapshot.val().freq);

var row = $("<tr>")
row.append("<td class='col-xs-2 train_list'>" + snapshot.val().train + "</td>");
row.append("<td class='col-xs-2 train_list'>" + snapshot.val().dest + "</td>");
row.append("<td class='col-xs-2 train_list'>" + snapshot.val().freq + "</td>");
row.append("<td class='col-xs-2 train_list'>" + snapshot.val().ft + "</td>");
row.append("<td class='col-xs-2 train_list'>" + snapshot.val().away + "</td>");


$(".train-schedule").append(row);

})



// x is going to be initial time, y is the interval
function addInputs(x, y) { 
   var time = moment(x, "H:mm");
    console.log(time.format("H:mm"));
    console.log(+y);
    while(moment().diff(time, "minutes") > 0) {
      time.add(+y, 'm');
    }
    console.log(time.format("HH:mm"));
    return time;

}





$("#add-train").on('click', function() {
  event.preventDefault();
  var name = $("#name-input").val(); // this is the value
  var destination = $("#destination-input").val();
  var firstTrain = $("#first-train-time-input").val();
  var frequency = $("#frequency-input").val();

console.log(name);
console.log(destination);
console.log(firstTrain);
console.log(frequency);

  
  nextTrain = addInputs(firstTrain, frequency);
  minAway = Math.ceil(nextTrain.diff(moment(), "minutes"));

  console.log(nextTrain);
  console.log(minAway);

  var info = {
    train: name,
    dest: destination,
    ft: nextTrain.format("HH:mm A"),
    freq: frequency,
    away: minAway
  };

db.ref().push(info);

});



function updateinfo() {
  setInterval(function () {
    $(".train_list").remove();
    db.ref().once("value").then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        console.log(key);
        console.log(childData);
        var time1 = childData.ft;
        var freq1 = childData.freq;

        var tiempo = addInputs(time1, freq1);
        var minAway1 = Math.ceil(tiempo.diff(moment(), "minutes"));
        db.ref(key).update({away: minAway1, ft: tiempo.format("HH:mm A")});
    })
    })
  }, 60000)
}


updateinfo();


