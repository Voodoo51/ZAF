import { TPropositionMessage } from "../types";

const downloadFile = async (url: string) => {
    try {
        const response = await fetch(url, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to download file");
        }

        const blob = await response.blob();

        let fileName = "download";
        const disposition = response.headers.get("Content-Disposition");

        if (disposition) {
            const match = disposition.match(/filename="?([^"]+)"?/);
            if (match) {
                fileName = match[1];
            }
        }

        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
        console.error(err);
    }
};

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
                        <button
                            key={f.id}
                            type="button"
                            onClick={() =>
                                downloadFile(`http://localhost:8080/proposition/message/file/${f.id}`)
                            }
                            className="text-sm underline block text-left"
                        >
                            📎 {f.fileName}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};