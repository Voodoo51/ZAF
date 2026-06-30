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
    const paymentsWord = [t("paymentStatus.unpaid"), t("paymentStatus.pending"), t("paymentStatus.paid"), t("paymentStatus.cancelled"), t("paymentStatus.initiated"), t("paymentStatus.failed")];
    const paymentStatusStyles = [
        "bg-yellow-100 text-yellow-700",
        "bg-blue-100 text-blue-700",
        "bg-green-100 text-green-700",
        "bg-red-100 text-red-700",
        "bg-blue-100 text-blue-700",
        "bg-green-100 text-green-700"
    ];

    useEffect(() => {
        console.log("halo");
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

    const doPayment = (id: number) => {
        try {
            fetch("http://localhost:8080/payment/pay", {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id: id}),
            })
            .then(res => res.json())
            .then(data => {
                window.location.href = data.redirectUrl;
            });
        } catch (error) {
            console.error("Coś poszło nie tak w doPayment", error);
        }  
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="space-y-4">
                {payments.length === 0 ? (
                    <p className="text-gray-500">
                        {t("paymentView.empty")}
                    </p>
                ) : (
                    payments.map((payment) => (
                        <div
                            key={payment.id}
                            className="group border rounded-xl p-5 hover:shadow-md transition"
                        >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-semibold">
                                    {payment.title}
                                </h2>

                                <span className="text-xl font-bold text-green-600">
                                    {(payment.amount / 100).toFixed(2)} PLN
                                </span>
                            </div>

                            <span className={`px-3 py-1 rounded-full ${paymentStatusStyles[payment.paymentStatus?.id]} text-sm`}>
                                {paymentsWord[payment.paymentStatus?.id]}
                            </span>
                        </div>

                        <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-96 group-hover:opacity-100 transition-all duration-300">
                            <p className="mt-4 text-gray-600">
                                {payment.description}
                            </p>

                            <div className="flex justify-end mt-4">
                                {payment.paymentStatus?.id !== 2 && (
                                    <button
                                        className="px-3 py-1 m-2 rounded-lg text-white bg-green-600 hover:opacity-90 transition"
                                        onClick={() => doPayment(payment.id)}
                                    >
                                        {t("paymentView.pay")}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    ))
                )}
            </div>
        </div>
    );
};