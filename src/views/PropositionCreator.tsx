import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../App";

export const PropositionCreatorView = () => {
    const navigate = useNavigate();
    
    const { user } = useAppContext();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const submit = async () => {
        const formData = new FormData();

        formData.append(
            "request",
            new Blob(
                [
                    JSON.stringify({
                        userId: user?.id,
                        title,
                        description
                    })
                ],
                { type: "application/json" }
            )
        );

        files.forEach(file => {
            formData.append("files", file);
        });

        const response = await fetch(
            "http://localhost:8080/proposition/create",
            {
                credentials: "include",
                method: "POST",
                body: formData
            }
        );

        if (response.ok) {
            navigate("/proposition");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center p-8">
            <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-3xl">

                <h1 className="text-3xl font-semibold mb-8">
                    New proposition
                </h1>

                <div className="space-y-6">

                    <div>
                        <label className="block mb-2 font-medium">
                            Title
                        </label>

                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Description
                        </label>

                        <textarea
                            rows={8}
                            value={description}
                            onChange={e =>
                                setDescription(e.target.value)
                            }
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Attach files
                        </label>

                        <input
                            type="file"
                            multiple
                            onChange={e =>
                                setFiles(
                                    Array.from(e.target.files || [])
                                )
                            }
                        />
                    </div>

                    {files.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            {files.map(file => (
                                <div key={file.name}>
                                    {file.name}
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={submit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                        Send proposition
                    </button>

                </div>
            </div>
        </div>
    );
};