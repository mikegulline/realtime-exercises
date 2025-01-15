import http from "http";
import handler from "serve-handler";
import nanobuffer from "nanobuffer";
import { Server } from "socket.io";
import { getServerArrFn, disconnect } from "./utils.js";
import * as _ from "ramda";

const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();
msg.push({
  user: "Mod",
  text: "Welcome to the chat!",
  time: Date.now(),
});
const server = http.createServer((request, response) =>
  handler(request, response, {
    public: "./frontend",
  })
);
const io = new Server(server, {});
const returnMsgObj = () => ({ msg: getMsgs() });
const updateOrPush = getServerArrFn(io, msg, returnMsgObj);

io.on("connection", (socket) => {
  socket.emit("msg:get", returnMsgObj());
  socket.on("msg:post", updateOrPush);
  socket.on("disconnect", disconnect);
});

const port = process.env.PORT || 8080;
server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
