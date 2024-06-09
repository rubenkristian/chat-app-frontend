import { CSSProperties, LegacyRef } from "react";

interface ChatBubbleProps {
    id: number;
    isOwn: boolean;
    idSender: string;
    displayName: string;
    body: string;
}

export default function ChatBubble({
    id,
    isOwn,
    idSender,
    displayName,
    body,
}: ChatBubbleProps) {
    if (isOwn) return (
        <div className="flex w-full my-2">
            <div key={id} className="ml-auto bg-blue-500 text-white rounded-lg rounded-tr-none p-2 flex flex-col items-center">
                <span className="text-end text-xs w-full text-gray-200">{displayName}</span>
                <p>
                    {body}
                </p>
            </div>
        </div>
    );

    return (
        <div className="flex w-full my-2">
            <div key={id} className="mr-auto bg-white rounded-lg rounded-tl-none p-2 flex flex-col items-center">
                <span className="text-xs w-full text-gray-500">{displayName}</span>
                <p>
                    {body}
                </p>
            </div>
        </div>
    );
}