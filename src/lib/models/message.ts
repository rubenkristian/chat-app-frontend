export interface Message {
    id: number;
    from_id: string;
    from_name: string;
    body: string;
    room_chat_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface ResponseMessage {
    data: Message[];
    last: number | null;
}