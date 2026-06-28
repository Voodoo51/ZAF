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

    const createPayment = async () => {
        try {
            const payload = {
                userId: user?.id,
                title: "New payment",
                description: "New payment description",
                amount: 10000
            };

            const response = await fetch("http://localhost:8080/payment/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            console.log(payload);

            if (!response.ok) {
                console.error("Nie udało się dodać płatności");
            }
            if (response.ok) {
                
            }
        } catch (error) {
            console.error("Coś poszło nie tak w createPayment", error);
        }
    };

    const deletePayment = (id: number) => {
        try {
            fetch(`http://localhost:8080/payment/delete/${id}`, {
            method: 'DELETE',
            mode: 'cors',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: id}),
            });
        } catch (error) {
            console.error("Coś poszło nie tak w deletePayment", error);
        }
    };

    const updatePayment = (id: number) => {
        try {
            const payload = {
                title: "Modified payment",
                description: "Modified payment description",
                amount: 20000
            };

            fetch(`http://localhost:8080/payment/update/${id}`, {
            method: 'PUT',
            mode: 'cors',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            });
        } catch (error) {
            console.error("Coś poszło nie tak w updatePayment", error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <button
                className="px-5 py-3 rounded-lg text-white bg-[rgb(63,152,255)] hover:opacity-90 transition"
                onClick={createPayment}    
            >
                {t("paymentView.add")}
            </button>
            <div className="space-y-4">
                {payments.length === 0 ? (
                    <p className="text-gray-500">
                        {t("paymentView.empty")}
                    </p>
                ) : (
                    payments.map(payment => (
                        <div
                            key={payment.id}
                            className="border rounded-xl p-5 hover:shadow-md transition"
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

                            <div className="flex justify-between items-center">
                                <div className="mt-4 text-xl font-bold text-green-600">
                                    {(payment.amount / 100).toFixed(2)} PLN
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    {payment.paymentStatus?.id !== 2 && (
                                        <button
                                            className="px-3 py-1 m-2 rounded-lg text-white bg-green-600 hover:opacity-90 transition"
                                            onClick={() => doPayment(payment.id)}    
                                        >
                                            {t("paymentView.pay")}
                                        </button>
                                    )}
                                    {payment.paymentStatus?.id === 0 && (
                                        <button
                                            className="px-3 py-1 m-2 rounded-lg text-white bg-[rgb(188,124,34)] hover:opacity-90 transition"
                                            onClick={() => updatePayment(payment.id)}    
                                        >
                                            {t("paymentView.update")}
                                        </button>
                                    )}
                                    {payment.paymentStatus?.id !== 2 && (
                                        <button
                                            className="px-3 py-1 m-2 rounded-lg text-white bg-[rgb(255,25,25)] hover:opacity-90 transition"
                                            onClick={() => deletePayment(payment.id)}    
                                        >
                                            {t("paymentView.delete")}
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