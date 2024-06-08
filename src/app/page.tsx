"use client";

import { useEffect, useState } from "react";
import Modal from "../components/modal";
import useChatContext from "@/lib/contexts/ChatContext";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const { show, chat, userName, userId, initialChat } = useChatContext();

  const saveName = () => {
    if (name) {
      initialChat(name);
    }
  }

  useEffect(() => {
    if (chat) {
      const homeNotif = chat.subscriptions.create({channel: 'ChatChannel', room: 1}, {
        received(data) {
          console.log(data);
        }
      });

      return () => {
        if (homeNotif) {
          homeNotif.unsubscribe();
        }
      }
    }
  }, [chat]);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Modal
        show={show}
        actionButton={
          <>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => saveName()}
          >
            Continue
          </button>
          </>
        }
        title="Setup"
        onClose={() => {}}
      >
        <input 
          onChange={(e) => setName(e.target.value)} 
          type="text" 
          placeholder="type your name" 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </Modal>
      <div>
        <h1>Your display name : {userName}</h1>
      </div>
    </main>
  );
}
