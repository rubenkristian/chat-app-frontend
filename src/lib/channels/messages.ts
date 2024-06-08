import { createConsumer } from "@rails/actioncable";



const loadApp = () => {
    const consumer = createConsumer("ws://localhost:8080/cable");
    const chatRoom = consumer.subscriptions.create({channel: "ChatChannel", room: "first"}, {
      received(data) {
        console.log(data);
      }
    });
    chatRoom.un

    chatRoom.send({msg: "Hello", name: name});
  }