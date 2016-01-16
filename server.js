var PORT = process.env.PORT || 3000;
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var moment = require("moment");

app.use(express.static(__dirname + "/public"));

var clientInfo = {};

// Sends current users to provided socket
function sendCurrentUsers(socket) {
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === "undefined") {
		return;
	}

	Object.keys(clientInfo).forEach(function(socketId) {
		var userInfo = clientInfo[socketId];
		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit("message", {
		name: "System"
		,timestamp: moment.valueOf
		,text: "Current users: " + users.join(", ")
	});
}

io.on("connection", function(socket) {
	console.log("some one connected to me");

	socket.on("disconnect", function() {
		var userData = clientInfo[socket.id];
		if (typeof userData !== undefined) {
			socket.leave(userData.room);
			io.to(userData.room).emit("message", {
				name: "System"
				,timestamp: moment.valueOf()
				,text: userData.name + " has left"
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on("joinRoom", function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit("message", {
			name: "System"
			,text: req.name + " has joined"
			,timestamp: moment.valueOf()
		});
	});

	socket.on("message", function(message) {
		console.log("Message received: " + message.text);

		if (message.text === "@currentUsers") {
			sendCurrentUsers(socket);
		} else {
			// // Send to all sockets except for the sender
			// socket.broadcast.emit("message", message);

			// Sends to ALL sockets
			io.to(clientInfo[socket.id].room).emit("message", message);
		}
	});

	socket.emit("message", {
		text: 'Welcome to chat app'
		,timestamp: moment().valueOf()
		,name: "System"
	});
});

http.listen(PORT, function() {
	console.log("server started");
});