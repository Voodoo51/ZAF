import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {useAppContext} from "../App";
import { Link } from "react-router-dom";

type TUser = {
    id: number,
    email: string,
    name: string,
    surname: string,
    role: {
        id: number,
        name: string
    }
};

export const UsersView = () => {
    const { user } = useAppContext();
    const [users, setUsers] = useState<TUser[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [maxPage, setMaxPage] = useState(1);

    const isPrivileged = user?.role === "worker" || user?.role === "admin";

    const fetchAllUsers = () => {
        fetch(`http://localhost:8080/user/all?page=${page}&size=10`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setUsers(data.content);
            setMaxPage(data.totalPages);
        })
        .catch(err => {
            console.log("Error fetching users:", err);
            setUsers([]);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
    if (!user) return;
        if (isPrivileged) {
            fetchAllUsers();
        }
    }, [user, page]);

    if (loading) {
        return (
            <div className="p-6">
                {t("common.loading")}
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm h-[calc(100vh-7rem)] flex flex-col">
            <h1 className="text-2xl font-semibold mb-4">
                {t("navigation.users")}
            </h1>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                <div className="space-y-4">
                    {users.length === 0 ? (
                        <p className="text-gray-500">
                            {t("paymentView.empty")}
                        </p>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user.id}
                                className="group border rounded-xl p-5 hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-lg font-semibold">
                                            {user.name + " " + user.surname}
                                        </h2>
                                    </div>
                                </div>

                                <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-96 group-hover:opacity-100 transition-all duration-300">
                                    <p className="mt-4 text-gray-600">
                                        {user.email}
                                    </p>
                                    <Link to={`/payments/${user.id}`} className="text-blue-600 hover:underline">
                                        {t("users.seePayments")}
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-4 pt-4 border-t shrink-0">
                <button
                    disabled={page === 0}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    {t("pagination.previous")}
                </button>

                <span className="self-center">
                    {t("pagination.page")} {page + 1} / {maxPage}
                </span>

                <button
                    disabled={page + 1 >= maxPage}
                    onClick={() =>
                        setPage((prev) => Math.min(prev + 1, maxPage - 1))
                    }
                    className="px-4 border rounded disabled:opacity-50"
                >
                    {t("pagination.next")}
                </button>
            </div>
        </div>
    );
};