import { TPropositionMessage } from "../types";

type Props = {
    message: TPropositionMessage;
    currentUserId: number;
};

export const MessageBubble = ({
    message,
    currentUserId
}: Props) => {

    const own = message.user.id === currentUserId;

    return (
        <div
            className={`flex ${
                own ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`
                    max-w-[70%]
                    rounded-2xl
                    px-5
                    py-3
                    shadow
                    ${
                        own
                            ? "bg-blue-600 text-white"
                            : "bg-white"
                    }
                `}
            >
                <div className="font-semibold text-sm mb-2">
                    {message.user.firstName}{" "}
                    {message.user.lastName}
                </div>

                <p>{message.message}</p>

                {message.files.length > 0 && (
                    <div className="mt-3 space-y-2">
                        {message.files.map(file => (
                            <div
                                key={file.id}
                                className="text-sm underline cursor-pointer"
                            >
                                📎 {file.fileName}
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-xs opacity-70 mt-2">
                    {new Date(
                        message.createdAt
                    ).toLocaleString()}
                </div>
            </div>
        </div>
    );
};