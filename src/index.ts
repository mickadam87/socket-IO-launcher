import { Server as http } from "http";
import JWT from "jsonwebtoken";
import { Server as websocket } from "socket.io";

let port: number = parseInt(process.env.SOCKET_PORT) || 3000;

export default function launchSocketIO(server: http) {
  const socket = new websocket({});

  new Promise((resolve) => {
    socket.listen(server || port, {});
    resolve(server || port);
  }).then((value) => {
    console.log(
      ">>>>> SocketI0 is waiting for you on port " + value + " <<<<<"
    );
    socket
      .use((socket, next) => {
        let auth = socket.data.token || socket.handshake.auth;
        let [token] = auth.split("Bearer ");
        let secret = process.env.JWT_SECRET;
        JWT.verify(token, secret, (err: Error, data: any) => {
          if (err) throw err;
          next();
        });
      })
      .on("error", (err: Error) => console.log(err.message))
      .on("connection", (client) => {});
  });
}
