export interface Room {
    id: number;
    name: string;
    creator: string;
    created_at: Date;
    updated_at: Date;
}

export interface ResponseRoom {
    data: Room[];
    current_page: number;
    total_pages: number;
    total_count: number;
}