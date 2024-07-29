const port = 8000;
const webSocketServer = require("websocket").server;
// const { on } = require("events");
const http = require("http");

const server = http.createServer();
server.listen(port);
console.log("Listening of port: " + port);

const wsServer = new webSocketServer({
  httpServer: server,
});

const getUniqueId = () => {
  const id = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return id() + id() + "-" + id();
};

const clients = {};

wsServer.on("request", function (request) {
  var userId = getUniqueId();

  console.log(
    new Date() +
      "  Received a new connection from origin: " +
      request.origin +
      "."
  );

  const connection = request.accept(null, request.origin);
  clients[userId] = connection;
  console.log(
    "connected: " + userId + "in " + Object.getOwnPropertyNames(clients)
  );
  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("Received message: " + message.utf8Data);

      for (key in clients) {
        clients[key].sendUTF(message.utf8Data);
        console.log("message sent to: " + clients[key].toString());
      }
    }
  });
});
