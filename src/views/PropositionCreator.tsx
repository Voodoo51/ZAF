import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../App";
import { useTranslation } from "react-i18next";

export const PropositionCreatorView = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
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
        <div className="flex justify-center p-8">
            <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-3xl">

                <h1 className="text-3xl font-semibold mb-8">
                    {t("proposition.newProposition")}
                </h1>

                <div className="space-y-6">

                    <div>
                        <label className="block mb-2 font-medium">
                            {t("proposition.title")}
                        </label>

                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            {t("proposition.description")}
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
                            {t("proposition.attachFiles")}
                        </label>

                        <input
                            type="file"
                            multiple
                            onChange={(e) =>
                             {
                                const MAX_FILE_SIZE = 10 * 1024 * 1024;
                                const MAX_TOTAL_SIZE = 50 * 1024 * 1024;

                                const selected = Array.from(e.target.files || []);

                                let totalSize = 0;

                                for (const file of selected) {
                                    if (file.size > MAX_FILE_SIZE) {
                                        alert(`${file.name} exceeds 10 MB.`);
                                        return;
                                    }

                                    totalSize += file.size;
                                }

                                if (totalSize > MAX_TOTAL_SIZE) {
                                    alert("The total size of selected files exceeds 50 MB.");
                                    return;
                                }

                                setFiles(selected);
                                }
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
                        {t("proposition.sendProposition")}
                    </button>

                </div>
            </div>
        </div>
    );
};