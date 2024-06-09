"use client";

import ChatBubble from "@/components/chat_bubble";
import { getMessages, getRoom } from "@/lib/apis";
import useChatContext from "@/lib/contexts/ChatContext";
import { Message } from "@/lib/models/message";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { sendMessage } from "@/lib/apis";
import InfiniteScroll from 'react-infinite-scroller';
import { ArrowLeftCircleIcon, ArrowLeftIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

const maxSize = 20;

export default function Chats() {
    const params = useParams();
    const router = useRouter();
    const { chat, userName, userId } = useChatContext();
    const [ roomName, setRoomName ] = useState<string>("");
    const [ message, setMessage ] = useState<string>("");
    const [ messages, setMessages ] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [roomId, setRoomId] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [initialLoad, setInitialLoad] = useState<boolean>(false);
    const listRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        textAreaRef.current?.addEventListener('paste', handlePaste);
        return () => {
            textAreaRef.current?.removeEventListener('paste', handlePaste);
        }
    }, [textAreaRef]);

    useEffect(() => {
        getRoomDetail();
    }, [roomId]);

    const getRoomDetail = async () => {
        if (roomId) {
            const res = await getRoom(roomId);

            if (res) {
                setRoomName(res.data.name);
            }
        }
    }

    useEffect(() => {
        if (chat && roomId) {
            let chatList = chat.subscriptions.create({channel: 'ChatChannel', room: roomId}, {
                connected() {
                    console.log("Connected to room");
                },
                disconnected() {
                    console.log("Disconnected to room");
                },
                received(data: Message) {
                    setMessages(prevMessages => [...prevMessages, data]);
                }
            });

            loadMore();
            return () => {
                if (chatList) {
                    chatList.unsubscribe();
                }
            }
        } else {
            setRoomId(parseInt(params.chat_id as string));
        }
    }, [chat, roomId]);

    useEffect(() => {
        if (!initialLoad && messages.length > 0 && listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
            setInitialLoad(true);
        }
    }, [messages, initialLoad]);

    const loadMore = async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        const threshold = messages[0]?.id ?? null;
        const res = await getMessages(parseInt(params.chat_id as string), maxSize, threshold);
        if (!res) return;
        if (res.data.length > 0) {
            const oldList = res.data.reverse();
            setMessages(prevList => [...oldList, ...prevList]);
        }
        
        if (res.data.length < maxSize) {
            setHasMore(false);
        }
        
        setIsLoading(false);
    }

    const backToHome = () => {
        router.push('/');
    }

    const submit = async () => {
      if (userName && userId && message && params) {
        try {
            await sendMessage(userName, userId, message, parseInt(params.chat_id as string));
            setMessage("");
            if (textAreaRef.current) {
                textAreaRef.current.innerText = '';
            }
        } catch (err) {
            console.error(err);
        }
      }
    }

    const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
    
        // Get the pasted plain text content
        const clipboardData = e.clipboardData;
        const pastedData = clipboardData?.getData('text/plain');
    
        // Insert the plain text content at the cursor position
        insertTextAtCursor(pastedData);
      };
    
      const insertTextAtCursor = (text:any) => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const textNode = document.createTextNode(text);
          range.insertNode(textNode);
    
          // Move the cursor to the end of the inserted text
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      };
     
    return (
        <main className="flex flex-col min-h-screen items-center py-24 px-4">
            <div className="flex lg:w-1/2 w-full rounded-t-md bg-white gap-2 align-middle justify-center">
                <ArrowLeftIcon onClick={backToHome} className="cursor-pointer" color="#3b82f6" height={40}/>
                <div className="flex-grow text-2xl capitalize items-center m-auto text-blue-500">{roomName}</div>
            </div>
            <div className="flex flex-col flex-grow lg:w-1/2 w-full h-[600px]">
                <div ref={listRef} className="overflow-auto h-[600px] p-2">
                    <InfiniteScroll
                        loadMore={loadMore}
                        hasMore={hasMore}
                        isReverse={true}
                        useWindow={false}
                        initialLoad={false}
                        loader={<div key={0}>Loading...</div>}
                    >
                        {
                            messages.map((message) => (
                                <ChatBubble
                                    key={message.id}
                                    id={message.id}
                                    isOwn={message.from_id === userId}
                                    idSender={message.from_id}
                                    displayName={message.from_name}
                                    body={message.body}
                                />
                            ))
                        }
                    </InfiniteScroll>
                </div>
                <div className="flex gap-1 w-full py-2 px-2 border border-black rounded bg-white shadow-lg">
                    <div
                        contentEditable
                        ref={textAreaRef}
                        style={{minHeight: '24px', maxHeight: '96px', height: '24px'}}
                        aria-label="Type a message"
                        aria-placeholder="Type a message..."
                        className="w-full border-0 focus:outline-none resize-none break-words overflow-y-auto whitespace-pre-wrap outline-none" 
                        onInput={(e) => {
                            setMessage(e.currentTarget.innerText);
                            if (textAreaRef.current) {
                                textAreaRef.current.style.height = 'auto';
                                textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
                            }
                        }}>
                    </div>
                    <button onClick={() => submit()} className="bg-blue-500 min-h-6 max-h-24 text-white py-[2px] px-4 rounded hover:bg-blue-700">Send</button>
                </div>
            </div>
        </main>
    );
}