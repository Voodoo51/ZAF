import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { TProposition, TPropositionMessage } from "../types";
import { MessageBubble } from "../utils/MessageBubble";
import { useAppContext } from "../App";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 10;

export const PropositionDetailsView = () => {
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
    const isInitialLoad = useRef(true);

    // -----------------------------
    // LOAD PROPOSITION + RESET
    // -----------------------------
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

    // -----------------------------
    // LOAD MESSAGES (FIXED SCROLL)
    // -----------------------------
    const loadMessages = async (pageNumber: number, replace = false) => {
        if (loadingMore || !propositionId) return;

        const el = chatRef.current;

        // SAVE scroll height BEFORE DOM change
        prevScrollHeight.current = el?.scrollHeight || 0;

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

    // -----------------------------
    // RESTORE SCROLL POSITION (FIX JUMP)
    // -----------------------------
    useEffect(() => {
        const el = chatRef.current;
        if (!el) return;

        requestAnimationFrame(() => {
            if (isInitialLoad.current) {
                el.scrollTop = el.scrollHeight;
                isInitialLoad.current = false;
                return;
            }

            const newScrollHeight = el.scrollHeight;
            el.scrollTop = newScrollHeight - prevScrollHeight.current;
        });
    }, [messages]);

    // -----------------------------
    // INFINITE SCROLL
    // -----------------------------
    useEffect(() => {
        const el = chatRef.current;
        if (!el) return;

        const handleScroll = () => {
            if (el.scrollTop < 80 && hasMore && !loadingMore) {
                setPage(p => p + 1);
            }
        };

        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, [hasMore, loadingMore]);

    useEffect(() => {
        if (page === 0) return;
        loadMessages(page);
    }, [page]);

    // -----------------------------
    // SEND MESSAGE
    // -----------------------------
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
                        {proposition.title}
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
                                <a
                                    key={file.id}
                                    href={`http://localhost:8080/files/${file.id}`}
                                    className="block text-blue-600 underline"
                                >
                                    📎 {file.fileName}
                                </a>
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
                        type="file"
                        multiple
                        onChange={e =>
                            setFiles(Array.from(e.target.files || []))
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