var socket = io();

socket.on("connect", function() {
	console.log("connected to server");
});

socket.on("message", function(message) {
	console.log("New Message: " + message.text);
});

var $form = jQuery("#message-form");

$form.on("submit", function(event) {
	event.preventDefault();

	var $messageField = $form.find("input[name=message]")

	socket.emit("message", {
		text: $messageField.val()
	});

	$messageField.val("");
});