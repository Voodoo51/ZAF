import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {useAppContext} from "../App";

type TPayment = {
    id: number;
    paymentStatus: {
        id: number;
        name: string;
    };
    title: string;
    description: string;
    amount: number;
};

export const PaymentsView = () => {
    const { user } = useAppContext();
    const [payments, setPayments] = useState<TPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const paymentsWord = [t("paymentStatus.unpaid"), t("paymentStatus.pending"), t("paymentStatus.paid"), t("paymentStatus.cancelled")];

    useEffect(() => {
        console.log(`http://localhost:8080/payment/all/${user?.id}`);
        fetch(`http://localhost:8080/payment/all/${user?.id}`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setPayments(data);
            })
            .catch(err => {
                console.log("Error fetching payments:", err);
                setPayments([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                {t("common.loading")}
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">

            <div className="space-y-4">
                {payments.length === 0 ? (
                    <p className="text-gray-500">
                        {t("payments.empty")}
                    </p>
                ) : (
                    payments.map(payment => (
                        <div
                            key={payment.id}
                            className="border rounded-xl p-5 hover:shadow-md transition"
                            onClick={ 
                                () => {
                                    fetch("http://localhost:8080/payment/pay", {
                                        method: 'POST',
                                        mode: 'cors',
                                        credentials: 'include',
                                        body: JSON.stringify({id:payment.id}),
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                    })
                                    .then(res => res.json())
                                    .then(data => {
                                        window.location.href = data.redirectUrl;
                                    });
                            }}
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">
                                    {payment.title}
                                </h2>

                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                                    {paymentsWord[payment.paymentStatus?.id]}
                                </span>
                            </div>

                            <p className="mt-3 text-gray-600">
                                {payment.description}
                            </p>

                            <div className="mt-4 text-xl font-bold text-green-600">
                                {(payment.amount / 100).toFixed(2)} PLN
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};