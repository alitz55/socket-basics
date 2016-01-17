var socket = io();

var name = getQueryVariable("name") || "Silent Bob";
var room = getQueryVariable("room");
console.log(name + " wants to join " + room);
$("h1.roomTitle").text(room);

socket.on("connect", function() {
	console.log("connected to server");

	if (room) {
		socket.emit("joinRoom", {
			name: name
			,room: room
		});
	}
});

socket.on("message", function(message) {
	console.log("New Message: " + message.text);
	var timestampMoment = moment.utc(message.timestamp);
	var $messages = $("#incomingMessages");
	var $message = jQuery('<li class="list-group-item"></li>');

	$message.append("<p><strong>" + message.name + " " + moment.utc(message.timestamp).local().format('h:mm a') + "</stong></p>");
	$message.append("<p>" + message.text + "</p>");
	$messages.append($message);
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