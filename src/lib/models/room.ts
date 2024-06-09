export interface Room {
    id: number;
    name: string;
    creator: string;
    created_at: string;
    updated_at: string;
}

export interface RoomShow {
    status: string;
    message: string;
    data: Room;
}

export interface ResponseRoom {
    data: Room[];
    current_page: number;
    total_pages: number;
    total_count: number;
}