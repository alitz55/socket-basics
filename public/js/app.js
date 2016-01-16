var socket = io();

socket.on("connect", function() {
	console.log("connected to server");
});

socket.on("message", function(message) {
	console.log("New Message: " + message.text);
	var timestampMoment = moment.utc(message.timestamp);
	$("#incomingMessages").append("<p><strong>" + moment.utc(message.timestamp).local().format('h:mm a') + "</strong> " + message.text + "</p>");
});

var $form = jQuery("#message-form");

$form.on("submit", function(event) {
	event.preventDefault();

	var $messageField = $form.find("input[name=message]")

	var mess = $messageField.val();
	var ts = moment().valueOf();

	socket.emit("message", {
		text: mess
		,timestamp: ts
	});

	$messageField.val("");
	$("#incomingMessages").append('<p style="color:red;">' + moment.utc(ts).local().format('h:mm a') + " " + mess + "</p>");

});