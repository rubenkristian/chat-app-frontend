import { ResponseMessage } from "@/lib/models/message";
import { ResponseRoom } from "@/lib/models/room";

const url = process.env.NEXT_PUBLIC_API_NODE;

export const getChatRooms = async (page: number, size: number): Promise<ResponseRoom> => {
    const req = await fetch(`${url}/room_chat?page=${page}&size=${size}`);

    return await req.json();
}

export const getMessages = async (room: number, size: number, threshold_id: number | null): Promise<ResponseMessage> => {
    console.log(threshold_id);
    const req = await fetch(`${url}/messages?room_id=${room}${threshold_id ? '&threshold_id=' + threshold_id : '' }&size=${size}`);

    return await req.json();
}

export const addRoom = async (name: string, creator: string) => {
    const req = await fetch(`${url}/room_chat/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            creator: creator,
        }),
    });

    return await req.json();
}

export const sendMessage = async (name: string, id: string, msg: string, room: number) => {
    const req = await fetch(`${url}/messages/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from_id: id,
            from_name: name,
            body: msg,
            room_chat_id: room,
        })
    });

    return await req.json();
}