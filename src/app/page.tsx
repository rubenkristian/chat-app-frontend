"use client";

import { useCallback, useEffect, useState } from "react";
import Modal from "../components/modal";
import useChatContext from "@/lib/contexts/ChatContext";
import { Room } from "@/lib/models/room";
import { addRoom, getChatRooms } from "@/lib/apis";
import { Virtuoso } from "react-virtuoso";
import { useRouter } from "next/navigation";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const { show, chat, userName, userId, initialChat } = useChatContext();
  const [listRoom, setListRoom] = useState<Room[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [modalRoom, setModalRoom] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>("");

  const saveName = () => {
    if (name) {
      initialChat(name);
    }
  }

  const loadListRooms = useCallback(() => {
    if (!hasMore) return;

    return setTimeout(async () => {
      const res = await getChatRooms(page, 20);
      if (res.data.length > 0) {
        setListRoom(oldListRoom => [...oldListRoom, ...res.data]);
        setPage(oldPage => oldPage + 1);
      } else {
        setHasMore(false);
      }
    }, 500);
  }, [page]);

  useEffect(() => {
    if (chat) {
      const timoutList = loadListRooms();

      return () => {
        clearTimeout(timoutList);
      }
    }
  }, [chat]);

  const createRoom = async () => {
    if (roomName && userId) {
      const res = await addRoom(roomName, userId);
      if (res) {
        const {id} = res.data;
        router.push(`/chats/${id}`);
      }
    }
  }
  
  return (
    <main className="flex gap-10 min-h-screen flex-col items-center justify-between p-24">
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
          value={name}
        />
      </Modal>
      
      <Modal
        show={modalRoom}
        actionButton={
          <div className="flex justify-between">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={() => {
                createRoom()
              }}
            >
              Create
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
              onClick={() => setModalRoom(false)}
            >
              Cancel
            </button>
          </div>
        }
        title="Create Room"
        onClose={() => {}}
      >
        <input 
          onChange={(e) => setRoomName(e.target.value)} 
          type="text" 
          placeholder="type room name" 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={roomName}
        />
      </Modal>
      <div className="flex">
        <h1>Your display name : {userName}</h1>
      </div>
      <div className="w-1/2 flex-grow">
        <InfiniteLoader
          isItemLoaded={(index) => !hasMore || index < listRoom.length}
          itemCount={hasMore ? listRoom.length + 1 : listRoom.length}
          loadMoreItems={() => {loadListRooms();}}
          threshold={1}
        >
        {({ onItemsRendered, ref }) => (
            <FixedSizeList
              height={600}
              width={'100%'}
              itemCount={listRoom.length}
              itemSize={80}
              onItemsRendered={onItemsRendered}
              
              ref={ref}
            >
              {({index, style}) => {
                return (
                  <div style={{...style, }}>
                    <div className="p-2 bg-white border rounded-md cursor-pointer" key={listRoom[index].id} onClick={() => {
                      router.push(`/chats/${listRoom[index].id}`);
                    }}>
                      <div className="flex flex-col gap">
                        <div className="text-md">Room Name: {listRoom[index].name}</div>
                        <div className="text-sm">Creator: {listRoom[index].creator}</div>
                        <div className="text-xs">created at: {listRoom[index].created_at}</div>
                      </div>
                    </div>
                  </div>
                );
              }}
            </FixedSizeList>
        )}
        </InfiniteLoader>
        <div className="flex">
          <button 
            className="bg-blue-500 w-full min-h-8 max-h-24 text-white py-[2px] px-4 rounded hover:bg-blue-700"
            onClick={() => {setModalRoom(true)}}
          >
              Create Room
          </button>
        </div>
      </div>
    </main>
  );
}
