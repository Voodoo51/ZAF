import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TProposition } from "../types";
import { PropositionCard } from "../utils/PropositionCard";
import { useAppContext } from "../App";

export const PropositionListView = () => {

    const [propositions, setPropositions] = useState<TProposition[]>([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAppContext();

    useEffect(() => {

        if (!user) return;

        fetch(
            `http://localhost:8080/proposition/all/${user.id}`,
            {
                credentials: "include",
                method: "GET"
            }
        )
            .then(res => res.json())
            .then(data => {
                setPropositions(data);
                setLoading(false);
            });

    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-8">

            <div className="flex justify-between mb-8">

                <h1 className="text-3xl font-bold">
                    My propositions
                </h1>

                <Link
                    to="/proposition/create"
                    className="
                        bg-blue-600
                        text-white
                        px-4
                        py-2
                        rounded-lg
                    "
                >
                    New proposition
                </Link>

            </div>

            <div className="space-y-4">

                {propositions.length === 0 && (
                    <div className="text-center text-gray-500">
                        You don't have any propositions yet.
                    </div>
                )}

              
                {propositions.map(proposition => (
                    <PropositionCard
                        key={proposition.id}
                        proposition={proposition}
                    />
                ))}
            </div>

        </div>
    );
};