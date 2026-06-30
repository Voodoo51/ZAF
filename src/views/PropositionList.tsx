import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TProposition } from "../types";
import { PropositionCard } from "../utils/PropositionCard";
import { useAppContext } from "../App";
import { useTranslation } from "react-i18next";

export const PropositionListView = () => {
    const [propositions, setPropositions] = useState<TProposition[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { t } = useTranslation();
    const { user, search } = useAppContext();

    const size = 10;

    const buildUrl = (pageNumber: number) => {
        const base = "http://localhost:8080/proposition";

        if (search.trim()) {
            if (user?.role === "student") {
                return `${base}/all/search/${user!.id}?query=${search}&page=${pageNumber}&size=${size}`;
            }
            return `${base}/all/search?query=${search}&page=${pageNumber}&size=${size}`;
        }

        if (user?.role === "student") {
            return `${base}/all/${user!.id}?page=${pageNumber}&size=${size}`;
        }

        return `${base}/all?page=${pageNumber}&size=${size}`;
    };

    const load = async (pageNumber: number) => {
        const res = await fetch(
            `${buildUrl(pageNumber)}`,
            { credentials: "include" }
        );

        const data = await res.json();

        setPropositions(data.content);
        setTotalPages(data.totalPages);
    };

    useEffect(() => {
        if (!user) return;
        load(page);
    }, [user, page, search]);

    useEffect(() => {
        setPage(0);
    }, [search]);

    if (!user) return null;

    return (
        <div className="max-w-5xl mx-auto p-8">

            <div className="flex justify-between mb-6">
                <h1 className="text-3xl font-bold">
                    {user?.role === "student" ? t("proposition.myPropositions") : t("proposition.receivedPropositions") }
                </h1>

                {user?.role === "student" && (
                    <Link
                        to="/proposition/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        {t("proposition.newProposition")}
                    </Link>
                )}
            </div>


            <div className="space-y-4">
                {propositions.map(p => (
                    <PropositionCard key={p.id} proposition={p} />
                ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center gap-2 mt-8">

                <button
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    {t("pagination.previous")}
                </button>

                <span className="px-4 py-2">
                    {page + 1} / {totalPages === 0 ? 1 : totalPages}
                </span>

                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    {t("pagination.next")}
                </button>

            </div>

        </div>
    );
};