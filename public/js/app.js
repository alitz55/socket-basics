var socket = io();

var name = getQueryVariable("name") || "Silent Bob";
var room = getQueryVariable("room");
console.log(name + " wants to join " + room);

socket.on("connect", function() {
	console.log("connected to server");
});

socket.on("message", function(message) {
	console.log("New Message: " + message.text);
	var timestampMoment = moment.utc(message.timestamp);
	var newMessage = $("#incomingMessages");
	newMessage.append("<p><strong>" + message.name + " " + moment.utc(message.timestamp).local().format('h:mm a') + "</stong></p>");
	newMessage.append("<p>" + message.text + "</p>");
});

var $form = jQuery("#message-form");

$form.on("submit", function(event) {
	event.preventDefault();

	var $messageField = $form.find("input[name=message]")

	socket.emit("message", {
		text: $messageField.val()
		,timestamp: moment().valueOf()
		,name: name
	});

	$messageField.val("");
});