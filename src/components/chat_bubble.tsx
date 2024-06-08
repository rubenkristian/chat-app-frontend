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
    body
}: ChatBubbleProps) {
    if (isOwn) return (
        <div key={id} className="self-end bg-blue-500 text-white rounded-lg rounded-tr-none p-2 flex flex-col items-center">
            <span className="text-end text-xs w-full text-gray-200">{displayName}</span>
            <p>
                {body}
            </p>
        </div>
    );

    return (
        <div key={id} className="self-start bg-gray-200 rounded-lg rounded-tl-none p-2 flex flex-col items-center">
            <span className="text-xs w-full text-gray-500">{displayName}</span>
            <p>
                {body}
            </p>
        </div>
    );
}