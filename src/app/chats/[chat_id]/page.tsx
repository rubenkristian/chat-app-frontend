"use client";

import ChatBubble from "@/components/chat_bubble";
import { getMessages } from "@/lib/apis/chat";
import useChatContext from "@/lib/contexts/ChatContext";
import { Message } from "@/lib/models/message";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { sendMessage } from "@/lib/apis/chat";

export default function Chats() {
    const params = useParams();
    const router = useRouter();
    const { chat, userName, userId } = useChatContext();
    const [ message, setMessage ] = useState<string>("");
    const [ messages, setMessages ] = useState<Message[]>([]);
    const [thresholdId, setThresholdId] = useState<number | null>(null);
    const messageBoxRef = useRef<HTMLDivElement>(null);
    const endContainer = useRef<HTMLDivElement>(null);
    const [firstLoad, setFirstLoad] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (chat && params) {
            let chatList = chat.subscriptions.create({channel: 'ChatChannel', room: params.chat_id}, {
                received(data: Message) {
                    setMessages(prevMessages => [...prevMessages, data]);
                }
            });

            return () => {
                if (chatList) {
                    chatList.unsubscribe();
                }
            }
        }
    }, [chat, params]);

    useEffect(() => {
        if (!messageBoxRef || !messageBoxRef.current) return;

        const handleScroll = () => {
            if ((messageBoxRef.current?.scrollTop ?? 0) < 20 && !isLoading && thresholdId) {
                setIsLoading(true);
                getMessages(parseInt(params.chat_id as string), 20, thresholdId).then(val => {
                    if (val.data) {
                        const oldList = val.data.reverse();
                        setMessages(prevList => [...oldList, ...prevList]);
                    }
    
                    if (val.last) {
                        setThresholdId(val.last);
                    } else {
                        setThresholdId(null);
                    }
                    setIsLoading(false);
                });
            }
        }

        messageBoxRef.current?.addEventListener('scroll', handleScroll);

        return () => {
            messageBoxRef.current?.removeEventListener('scroll', handleScroll);
        }
    }, [thresholdId, isLoading]);

    useEffect(() => {
        if (messages.length > 0 && !firstLoad) {
            endContainer.current?.scrollIntoView({'behavior': 'smooth'});
            setFirstLoad(true)
        }
    }, [messages, firstLoad]);

    useEffect(() => {
        if (params.chat_id) {
            getMessages(parseInt(params.chat_id as string), 20, thresholdId).then(val => {
                if (val.data) {
                    setMessages(val.data.reverse());
                }

                if (val.last) {
                    setThresholdId(val.last);
                }
            });
        }
    }, [params]);

    const backToHome = () => {
        router.push('/');
    }

    const submit = async () => {
      if (userName && userId && message && params) {
        try {
            await sendMessage(userName, userId, message, parseInt(params.chat_id as string));
            setMessage("");
        } catch (err) {
            console.error(err);
        }
      }
    }
     
    return (
        <main className="flex flex-col min-h-screen items-center py-24 px-4">
            <div className="flex lg:w-1/2 w-full">
                <button onClick={() => backToHome()}></button>
            </div>
            <div className="flex flex-col flex-grow lg:w-1/2 w-full h-[600px]">
                <div className="flex-grow overflow-y-auto" ref={messageBoxRef}>
                    <div className="flex flex-col space-y-2 p-4">
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
                        <div ref={endContainer}></div>
                    </div>
                </div>
                <div className="flex gap-1 w-full h-16 py-2 px-2 border border-black rounded bg-white shadow-lg">
                    <textarea className="w-full border-0 focus:outline-none resize-none" onChange={(e) => setMessage(e.target.value)} value={message}></textarea>
                    <button onClick={() => submit()} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Send</button>
                </div>
            </div>
        </main>
    );
}