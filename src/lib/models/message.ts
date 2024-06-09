export interface Message {
    id: number;
    from_id: string;
    from_name: string;
    body: string;
    room_chat_id: number;
    created_at: string;
    updated_at: string;
}

export interface ResponseMessage {
    data: Message[];
    last: number | null;
}