import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TProposition, TPropositionMessage } from "../types";
import { MessageBubble } from "../utils/MessageBubble";
import { useAppContext } from "../App";

export const PropositionDetailsView = () => {
    const { propositionId } = useParams();
    const [proposition, setProposition] = useState<TProposition | null>(null);
    const [messages, setMessages] = useState<TPropositionMessage[]>([]);
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const { user } = useAppContext();

    useEffect(() => {
        loadData();
    }, [propositionId]);

    const loadData = async () => {

        const propositionResponse = await fetch(
            `http://localhost:8080/proposition/${propositionId}`, {
                credentials: "include"
            }
        );

        const messagesResponse = await fetch(
            `http://localhost:8080/proposition/messages/${propositionId}`, {
                credentials: "include"
            }
        );

        setProposition(await propositionResponse.json());
        setMessages(await messagesResponse.json());
    };

    const sendMessage = async () => {
        const formData = new FormData();

        formData.append(
            "request",
            new Blob(
                [
                    JSON.stringify({
                        propositionId: Number(propositionId),
                        userId: user?.id,
                        message
                    })
                ],
                { type: "application/json" }
            )
        );

        files.forEach(file =>
            formData.append("files", file)
        );

        const response = await fetch(
            "http://localhost:8080/proposition/message",
            {
                method: "POST",
                credentials: "include",
                body: formData
            }
        );

        if (response.ok) {
            const created = await response.json();

            setMessages(prev => [...prev, created]);
            setMessage("");
            setFiles([]);
        }
    };

    if (!proposition)
        return <div>Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto p-8">

            <div className="bg-white rounded-xl shadow p-8 mb-8">

                <h1 className="text-3xl font-bold">
                    {proposition.title}
                </h1>

                <p className="mt-4 text-gray-700">
                    {proposition.description}
                </p>

                {proposition.files.length > 0 && (
                    <div className="mt-6">

                        <h3 className="font-semibold mb-2">
                            Attachments
                        </h3>

                        {proposition.files.map(file => (
                            <div key={file.id}>
                                📎 {file.fileName}
                            </div>
                        ))}
                    </div>
                )}

            </div>

            <div className="space-y-4 mb-8">
                {messages.map(msg => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        currentUserId={user?.id!}
                    />
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow">

                <textarea
                    rows={4}
                    value={message}
                    onChange={e =>
                        setMessage(e.target.value)
                    }
                    className="w-full border rounded-lg p-3"
                    placeholder="Write message..."
                />

                <div className="mt-4 flex justify-between items-center">

                    <input
                        type="file"
                        multiple
                        onChange={e =>
                            setFiles(
                                Array.from(
                                    e.target.files || []
                                )
                            )
                        }
                    />

                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                    >
                        Send
                    </button>

                </div>

            </div>

        </div>
    );
};