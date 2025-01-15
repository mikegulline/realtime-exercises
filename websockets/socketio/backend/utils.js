import * as _ from "ramda";

export const getServerArrFn = _.curry((server, arr, fn) => {
  // get the last message or null
  const getLastMessage = () =>
    arr._size > 0 ? arr._buffer[arr._size - 1] : null;

  // boolean is last user
  const isLastUser = (data) => {
    const lastMessage = getLastMessage();
    return lastMessage ? lastMessage.user === data.user : false;
  };

  // update last message with new data
  const handleUpdateLastMessage = (data) => {
    const lastMessage = getLastMessage();
    lastMessage.date = Date.now();
    lastMessage.text += `<br/>${data.text}`;
  };

  // push new message to array
  const handlePushNewMessage = (data) =>
    arr.push({
      user: data.user,
      text: data.text,
      time: Date.now(),
    });

  // send messages
  const sendMessages = () => server.emit("msg:get", fn());

  // the function returned will receive data from the socket
  // if user is the previous user it will update last message
  // else push new message
  // then send messages
  return _.compose(
    sendMessages,
    _.ifElse(isLastUser, handleUpdateLastMessage, handlePushNewMessage)
  );
});

// when socket disconnects
export const disconnect = (socket) => console.log(`Disconnected: ${socket.id}`);
