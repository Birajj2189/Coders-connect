const io = require("socket.io")(server);

io.on("connection", (socket) => {
	console.log("New connection established");
	socket.on("sendNotification", (message) => {
		io.emit("receiveNotification", message);
	});
});
