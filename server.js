var PORT = process.env.PORT || 3000;
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

io.on("connection", function(socket) {
	console.log("some one connected to me");

	socket.on("message", function(message) {
		console.log("Message received: " + message.text);

		// // Send to all sockets except for the sender
		// socket.broadcast.emit("message", message);

		// Sends to ALL sockets
		io.emit("message", message);
	});

	socket.emit("message", {
		text: "Welcome to chat app"
	});
});

http.listen(PORT, function() {
	console.log("server started");
});