import { Link } from "react-router-dom";
import type { TProposition } from "../types";

type Props = {
    proposition: TProposition;
};

export const PropositionCard = ({
    proposition
}: Props) => {

    return (
        <Link
            to={`/proposition/${proposition.id}`}
            className="block bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
        >
            <div className="flex justify-between">

                <div>
                    <h2 className="font-semibold text-xl">
                        {proposition.title}
                    </h2>

                    <p className="text-gray-500 mt-2">
                        {proposition.description.slice(0, 120)}
                    </p>
                </div>

                <div className="text-sm text-gray-400">
                    {new Date(
                        proposition.createdAt
                    ).toLocaleDateString()}
                </div>

            </div>

            {proposition.files.length > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                    📎 {proposition.files.length} attachments
                </div>
            )}
        </Link>
    );
};