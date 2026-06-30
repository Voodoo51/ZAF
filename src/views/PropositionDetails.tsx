import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { TProposition, TPropositionMessage } from "../types";
import { MessageBubble } from "../utils/MessageBubble";
import { useAppContext } from "../App";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 10;

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

export const PropositionDetailsView = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { propositionId } = useParams();
    const { user } = useAppContext();
    const { t } = useTranslation();

    const [proposition, setProposition] = useState<TProposition | null>(null);
    const [messages, setMessages] = useState<TPropositionMessage[]>([]);

    const [message, setMessage] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const chatRef = useRef<HTMLDivElement | null>(null);
    const prevScrollHeight = useRef(0);
    const shouldRestoreScroll = useRef(false);
    const isInitialLoad = useRef(true);

    useEffect(() => {
        if (!propositionId) return;

        setMessages([]);
        setPage(0);
        setHasMore(true);

        loadProposition();
        loadMessages(0, true);
    }, [propositionId]);

    const loadProposition = async () => {
        try {
            const res = await fetch(
                `http://localhost:8080/proposition/${propositionId}`,
                { credentials: "include" }
            );
            if (!res.ok) return;
            setProposition(await res.json());
        } catch (e) {
            console.error(e);
        }
    };

    const loadMessages = async (pageNumber: number, replace = false) => {
        if (loadingMore || !propositionId) return;

            const el = chatRef.current;

            if (!replace && el) {
                prevScrollHeight.current = el.scrollHeight;
                shouldRestoreScroll.current = true;
            }

        setLoadingMore(true);

        try {
            const res = await fetch(
                `http://localhost:8080/proposition/messages/${propositionId}?page=${pageNumber}&size=${PAGE_SIZE}`,
                { credentials: "include" }
            );

            if (!res.ok) throw new Error("Failed to fetch messages");

            const data = await res.json();
            const newMessages: TPropositionMessage[] = data.content;

            setMessages(prev =>
                replace ? newMessages : [...newMessages, ...prev]
            );

            setHasMore(!data.last);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        const el = chatRef.current;
        if (!el) return;

        requestAnimationFrame(() => {

            // first load -> bottom
            if (isInitialLoad.current && messages.length > 0) {
                el.scrollTop = el.scrollHeight;
                isInitialLoad.current = false;
                return;
            }


            // loading old messages -> keep position
            if (shouldRestoreScroll.current) {
                const newScrollHeight = el.scrollHeight;

                el.scrollTop =
                    newScrollHeight - prevScrollHeight.current;

                shouldRestoreScroll.current = false;
            }

        });

    }, [messages]);

    // -----------------------------
    // INFINITE SCROLL
    // -----------------------------
    useEffect(() => {
        const el = chatRef.current;
        if (!el) return;

        const handleScroll = () => {
           if (
                    el.scrollTop < 80 &&
                    hasMore &&
                    !loadingMore
                ) {
                    setPage(prev => {
                        if (loadingMore) return prev;
                        return prev + 1;
                    });
                }
        };

        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, [hasMore, loadingMore]);

    useEffect(() => {
        if (page === 0) return;
        loadMessages(page);
    }, [page]);

    const sendMessage = async () => {
        if (!user || !message.trim()) return;

        try {
            const formData = new FormData();

            formData.append(
                "request",
                new Blob(
                    [
                        JSON.stringify({
                            propositionId: Number(propositionId),
                            userId: user.id,
                            message
                        })
                    ],
                    { type: "application/json" }
                )
            );

            console.log(files);
            files.forEach(file => formData.append("files", file));

            const res = await fetch(
                "http://localhost:8080/proposition/message",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData
                }
            );

            if (!res.ok) return;

            const created = await res.json();

            setMessages(prev => [...prev, created]);

            setMessage("");
            setFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            requestAnimationFrame(() => {
                chatRef.current?.scrollTo({
                    top: chatRef.current.scrollHeight,
                    behavior: "smooth"
                });
            });

        } catch (e) {
            console.error(e);
        }
    };

    if (!proposition) {
        return <div className="p-8">{t("common.loading")}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-5rem)] bg-gray-100 rounded-2xl shadow-xl overflow-hidden">

            {/* ---------------- HEADER ---------------- */}
            <div className="bg-white border-b px-6 py-4 flex justify-between items-start gap-4 shrink-0">

                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {proposition.title + ": " + proposition.user.name + " " + proposition.user.surname}
                    </h1>

                    <p className="mt-1 text-gray-600 text-sm leading-relaxed">
                        {proposition.description}
                    </p>
                </div>

                {/* attachments */}
                {proposition.files.length > 0 && (
                    <div className="text-sm min-w-[220px]">
                        <div className="font-semibold mb-2">
                            {t("common.attachements")}
                        </div>

                        <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                            {proposition.files.map(file => (
                                <button
                                    key={file.id}
                                    type="button"
                                    onClick={() =>
                                        downloadFile(`http://localhost:8080/proposition/file/${file.id}`)
                                    }
                                    className="block text-blue-600 underline text-left"
                                >
                                    📎 {file.fileName}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ---------------- CHAT ---------------- */}
            <div
                ref={chatRef}
                className="flex-1 min-h-0 overflow-y-auto bg-gray-50 px-6 py-5 flex flex-col space-y-3 scrollbar-hide"
            >
                {messages.map(msg => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        currentUserId={user?.id!}
                    />
                ))}

                {loadingMore && (
                    <div className="text-center text-gray-400 text-sm py-2">
                        {t("common.loading")}
                    </div>
                )}
            </div>

            {/* ---------------- INPUT ---------------- */}
            <div className="bg-white border-t p-4 shrink-0">
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={2}
                    className="w-full border rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder={t("common.writeMessage")}
                />

                <div className="flex justify-between items-center mt-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={
                             (e) => {
                               const MAX_FILE_SIZE = 10 * 1024 * 1024;
                                const MAX_TOTAL_SIZE = 50 * 1024 * 1024;

                                const selected = Array.from(e.target.files || []);

                                let totalSize = 0;

                                for (const file of selected) {
                                    if (file.size > MAX_FILE_SIZE) {
                                        alert(t("common.fileTooBig"));
                                        return;
                                    }

                                    totalSize += file.size;
                                }

                                if (totalSize > MAX_TOTAL_SIZE) {
                                    alert(t("common.filesTooBig"));
                                    return;
                                }

                                setFiles(selected);
                             }
                        }
                    />

                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-xl"
                    >
                        {t("common.submit")}
                    </button>
                </div>
            </div>

        </div>
    );
};