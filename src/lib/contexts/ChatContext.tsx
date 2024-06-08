"use client";

import { Consumer, createConsumer } from "@rails/actioncable";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export interface ChatContextProps {
    chat: Consumer | null;
    userId: string | null;
    userName: string | null;
    show: boolean;
    initialChat: (name: string) => void;
    logout: () => void;
}

const ChatContext = createContext<ChatContextProps>({
    chat: null,
    userId: null,
    userName: null,
    show: false,
    initialChat: () => {},
    logout: () => {},
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['name', 'id']);
    const [chat, setChat] = useState<Consumer | null>(null);
    const [show, setShow] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [id, setId] = useState<string>("");

    useEffect(() => {
        if (!cookies.name || cookies.name === "" || !cookies.id || cookies.id === "") {
            setShow(true);
        } else {
            initiate(cookies.name, cookies.id);
        }
    }, []);

    useEffect(() => {
        if (cookies.name && cookies.name !== "" && cookies.id && cookies.id !== "") {
            initiate(cookies.name, cookies.id);
            setShow(false);
        }
    }, [cookies.id, cookies.name]);

    const initiate = (name: string, id: string) => {
        console.log(name, id);
        setName(name);
        setId(id);
        
        setChat(createConsumer(process.env.NEXT_PUBLIC_WS_NODE));
    }

    const logout = () => {
        setId("");
        setName("");
        removeCookie('id');
        removeCookie('name');
        if (chat) {
            chat.disconnect();
        }
        setChat(null);
    }
    
    return (
        <ChatContext.Provider value={{
            chat: chat,
            userId: id,
            userName: name,
            show: show,
            initialChat: (name: string) => {
                if (chat) {
                    chat.disconnect();
                }
                const id = `${name}-${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`;
                setCookie('name', name);
                setCookie('id', id);
            },
            logout: logout
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export default function useChatContext() {
    return useContext(ChatContext);
}