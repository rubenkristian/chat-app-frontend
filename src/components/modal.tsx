import { ReactElement, ReactNode } from "react";

interface ModalProps {
    show: boolean;
    title: string;
    actionButton: ReactElement;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({
    show,
    onClose,
    title,
    actionButton,
    children,
}: ModalProps) {
    if (!show) return null;

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl text-black font-bold mb-4">{title}</h2>
        <div className="mb-4">
            {children}
        </div>
        <div>
            {actionButton}
        </div>
      </div>
    </div>
    )
}