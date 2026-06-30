import { TPropositionMessage } from "../types";

export const MessageBubble = ({
    message,
    currentUserId
}: {
    message: TPropositionMessage;
    currentUserId: number;
}) => {

    const isMine = message.user.id === currentUserId;

    return (
        <div
            className={`p-4 rounded-lg max-w-xl ${
                isMine
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-200 text-gray-900 mr-auto"
            }`}
        >

            {!isMine && (
                <div className="text-xs font-semibold mb-1">
                    {message.user.name} {message.user.surname}
                </div>
            )}

            <div>{message.message}</div>

            {message.files?.length > 0 && (
                <div className="mt-2 space-y-1">
                    {message.files.map(f => (
                        <a
                            key={f.id}
                            href={`https://mock-download/${f.id}`}
                            className="text-sm underline block"
                        >
                            📎 {f.fileName}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};