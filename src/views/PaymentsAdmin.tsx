import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {useAppContext} from "../App";
import { useParams } from "react-router-dom";

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

export const PaymentsAdminView = () => {
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
    const { userId } = useParams();
    
    const [paymentToDelete, setPaymentToDelete] = useState<number | null>(null);
    
    const [paymentToEdit, setPaymentToEdit] = useState<number | null>(null);
    const [editData, setEditData] = useState({
        title: "",
        description: "",
        amount: ""
    });
    const [editErrors, setEditErrors] = useState({
        title: false,
        description: false,
        amount: false
    });

    const [creatingPayment, setCreatingPayment] = useState(false);
    const [newPayment, setNewPayment] = useState({
        title: "",
        description: "",
        amount: ""
    });
    const [createErrors, setCreateErrors] = useState({
        title: false,
        description: false,
        amount: false
    });

    const validateTitle = (title: string) => title.trim().length > 0;
    const validateDescription = (description: string) =>
        description.trim().length > 0;
    const validateAmount = (amount: string) => { 
        const value = Number(amount.replace(",", ".")); 
        return !isNaN(value) && value > 0 && value < 1001; 
    };

    const [userData, setUserData] = useState<{
        name: string;
        surname: string;
    } | null>(null);

    useEffect(() => {
        if (!userId)
            return;

        fetch(`http://localhost:8080/user/${userId}`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => setUserData(data));
        
        console.log(`http://localhost:8080/payment/all/${userId}`);
        fetch(`http://localhost:8080/payment/all/${userId}`, {
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
    }, [userId]);

    if (loading) {
        return (
            <div className="p-6">
                {t("common.loading")}
            </div>
        );
    }

    const createPayment = async () => {
        const titleOk = validateTitle(newPayment.title);
        const descriptionOk = validateDescription(newPayment.description);
        const amountOk = validateAmount(newPayment.amount);

        setCreateErrors({
            title: !titleOk,
            description: !descriptionOk,
            amount: !amountOk
        });

        if (!titleOk || !descriptionOk || !amountOk) {
            return;
        }

        const amount = Math.round(
            parseFloat(newPayment.amount.replace(",", ".")) * 100
        );

        if (
            newPayment.title.trim() === "" ||
            newPayment.description.trim() === "" ||
            isNaN(amount) ||
            amount <= 0
        ) {
            return;
        }

        try {
            const payload = {
                userId: Number(userId),
                title: newPayment.title,
                description: newPayment.description,
                amount: amount
            };

            const response = await fetch("http://localhost:8080/payment/create", {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                console.error("Nie udało się dodać płatności");
            }

            const payment = await response.json();
            setPayments(prev => [...prev, payment]);
            setCreatingPayment(false);
            setNewPayment({
                title: "",
                description: "",
                amount: ""
            });
            setCreateErrors({
                title: false,
                description: false,
                amount: false
            });
        } catch (error) {
            console.error("Coś poszło nie tak w createPayment", error);
        }
    };

    const deletePayment = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/payment/delete/${id}`, {
                method: "DELETE",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete payment. Status: ${response.status}`);
            }

            setPayments(prev =>
                prev.filter(payment => payment.id !== id)
            );


            console.log("Payment deleted successfully.");
        } catch (error) {
            console.error("Coś poszło nie tak w deletePayment:", error);
        }
    };

    const payOffline = async (id: number) => {
        try {
            const response = await fetch(
                `http://localhost:8080/payment/payOffline/${id}`,
                {
                    method: "PUT",
                    mode: "cors",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to mark payment as paid");
            }

            const updatedPayment = await response.json();

            setPayments(prev =>
                prev.map(payment =>
                    payment.id === id ? updatedPayment : payment
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    const beginEdit = (payment: TPayment) => {
        setPaymentToEdit(payment.id);

        setEditData({
            title: payment.title,
            description: payment.description,
            amount: (payment.amount / 100).toFixed(2)
        });
    };

    const updatePayment = async (id: number) => {
        const titleOk = validateTitle(editData.title);
        const descriptionOk = validateDescription(editData.description);
        const amountOk = validateAmount(editData.amount);

        setEditErrors({
            title: !titleOk,
            description: !descriptionOk,
            amount: !amountOk
        });

        if (!titleOk || !descriptionOk || !amountOk) {
            return;
        }

        const amount = Math.round(
            parseFloat(editData.amount.replace(",", ".")) * 100
        );

        if (
            editData.title.trim() === "" ||
            editData.description.trim() === "" ||
            isNaN(amount) ||
            amount <= 0
        ) {
            return;
        }
        try {
            const payload = {
                title: editData.title,
                description: editData.description,
                amount: amount
            };

            const response = await fetch(`http://localhost:8080/payment/update/${id}`, {
            method: 'PUT',
            mode: 'cors',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error("Nie udało się zmodyfikować płatności");
            }

            setPayments(prev =>
                prev.map(payment =>
                    payment.id === id
                        ? {
                            ...payment,
                            title: payload.title,
                            description: payload.description,
                            amount: payload.amount
                        }
                        : payment
                )
            );

            setPaymentToEdit(null);
            setEditErrors({
                title: false,
                description: false,
                amount: false
            });
        } catch (error) {
            console.error("Coś poszło nie tak w updatePayment", error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h1 className="text-2xl font-semibold mb-6">
                {t("paymentView.userPayments")} {" "}
                {userData && `${userData.name} ${userData.surname}`}
            </h1>
            {!creatingPayment && (
                <button
                    className="px-5 py-3 mb-4 rounded-lg text-white bg-[rgb(63,152,255)] hover:opacity-90 transition"
                    onClick={() => setCreatingPayment(true)}
                >
                    {t("paymentView.add")}
                </button>
                
            )}
            {creatingPayment && (
                <div className="border rounded-xl p-5 mt-4 mb-6 bg-gray-50">
                        <div className="flex-col mb-4">
                            {createErrors.title && (
                                <p className="text-red-500 text-sm mt-1">
                                    {t("inputErrors.emptyPaymentTitle")}
                                </p>
                            )}
                            <input
                                className={`flex-1 rounded-lg px-3 py-2 border ${
                                    createErrors.title
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-300"
                                }`}
                                placeholder={t("paymentView.title")}
                                value={newPayment.title}
                                onChange={(e) => {
                                    setCreateErrors(prev => ({...prev, title: false}));
                                    setNewPayment({
                                        ...newPayment,
                                        title: e.target.value
                                    });
                                }}
                            />
                        </div>
                        
                        <div className="flex-col mb-4">
                            {createErrors.amount && (
                                <p className="text-red-500 text-sm mt-1">
                                    {t("inputErrors.emptyPaymentValue")}
                                </p>
                            )}
                            <input
                                className={`w-40 rounded-lg px-3 py-2 border ${
                                    createErrors.amount
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-300"
                                }`}
                                placeholder="0.00 PLN"
                                inputMode="decimal"
                                value={newPayment.amount}
                                onChange={(e) => {
                                    setCreateErrors(prev => ({
                                        ...prev,
                                        amount: false
                                    }))
                                    let value = e.target.value
                                        .replace(",", ".")
                                        .replace(/[^\d.]/g, "");

                                    const parts = value.split(".");

                                    if (parts.length > 2) return;

                                    if (parts[1]?.length > 2) return;

                                    setNewPayment({
                                        ...newPayment,
                                        amount: value
                                    });
                                }}
                            />
                        </div>

                    <div className="flex-col">
                        {createErrors.amount && (
                            <p className="text-red-500 text-sm mt-1">
                                {t("inputErrors.emptyPaymentDescription")}
                            </p>
                        )}
                        <textarea
                            rows={4}
                            className={`w-full rounded-lg px-3 py-2 resize-none border ${
                                createErrors.description
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                            }`}
                            placeholder={t("paymentView.description")}
                            value={newPayment.description}
                            onChange={(e) => {
                                setCreateErrors(prev => ({
                                    ...prev,
                                    description: false
                                }));
                                setNewPayment({
                                    ...newPayment,
                                    description: e.target.value
                                });
                            }}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">

                        <button
                            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:opacity-90"
                            onClick={createPayment}
                        >
                            {t("common.confirm")}
                        </button>

                        <button
                            className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:opacity-90"
                            onClick={() => {
                                setCreatingPayment(false);

                                setNewPayment({
                                    title: "",
                                    description: "",
                                    amount: ""
                                });
                                setCreateErrors({
                                    title: false,
                                    description: false,
                                    amount: false
                                })
                            }}
                        >
                            {t("common.cancel")}
                        </button>

                    </div>

                </div>
            )}
            <div className="space-y-4">
                {payments.length === 0 ? (
                    <p className="text-gray-500">
                        {t("paymentView.empty")}
                    </p>
                ) : (
                    payments.map((payment) => (
                        <div
                            key={payment.id}
                            tabIndex={0}
                            onBlur={() => {
                                if (paymentToDelete === payment.id) {
                                    setPaymentToDelete(null);
                                }
                            }}
                            className="group border rounded-xl p-5 hover:shadow-md transition"
                        >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                {paymentToEdit === payment.id ? (
                                    <div className="flex flex-col gap-3 w-full">
                                        <input
                                            className={`rounded-lg px-3 py-2 border ${
                                                editErrors.title
                                                    ? "border-red-500 bg-red-50"
                                                    : "border-gray-300"
                                            }`}
                                            value={editData.title}
                                            onChange={(e) => {
                                                setEditErrors(prev => ({...prev, title: false}))
                                                setEditData({
                                                    ...editData,
                                                    title: e.target.value
                                                });
                                            }}
                                        />

                                        <input
                                            className={`rounded-lg px-3 py-2 border ${
                                                editErrors.amount
                                                    ? "border-red-500 bg-red-50"
                                                    : "border-gray-300"
                                            }`}
                                            value={editData.amount}
                                            inputMode="decimal"
                                            pattern="^\d*([.,]\d{0,2})?$"
                                            onChange={(e) => {
                                                setEditErrors(prev => ({
                                                    ...prev,
                                                    amount: false
                                                }));
                                                let value = e.target.value
                                                    .replace(",", ".")
                                                    .replace(/[^\d.]/g, "");

                                                const parts = value.split(".");

                                                if (parts.length > 2) return;

                                                if (parts[1]?.length > 2) return;

                                                setEditData({
                                                    ...editData,
                                                    amount: value
                                                });
                                            }}
                                        />

                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-lg font-semibold">
                                            {payment.title}
                                        </h2>

                                        <span className="text-xl font-bold text-green-600">
                                            {(payment.amount / 100).toFixed(2)} PLN
                                        </span>
                                    </>
                                )}
                            </div>

                            <span className={`px-3 py-1 rounded-full ${paymentStatusStyles[payment.paymentStatus?.id]} text-sm`}>
                                {paymentsWord[payment.paymentStatus?.id]}
                            </span>
                        </div>

                        <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-96 group-hover:opacity-100 transition-all duration-300">
                            {paymentToEdit === payment.id ? (
                                <textarea
                                    className={`w-full mt-4 rounded-lg px-3 py-2 resize-none border ${
                                        editErrors.description
                                            ? "border-red-500 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                    rows={4}
                                    value={editData.description}
                                    onChange={(e) => {
                                        setEditErrors(prev => ({
                                            ...prev,
                                            description: false
                                        }));

                                        setEditData({
                                            ...editData,
                                            description: e.target.value
                                        });
                                    }}
                                />
                            ) : (
                                <p className="mt-4 text-gray-600">
                                    {payment.description}
                                </p>
                            )}
                            
                            <div className="flex justify-end mt-4">
                                {(payment.paymentStatus?.id === 0  && paymentToEdit !== payment.id) && (
                                    <button
                                        className="px-3 py-1 m-2 rounded-lg bg-green-600 text-white hover:opacity-90"
                                        onClick={() => payOffline(payment.id)}
                                    >
                                        {t("paymentView.payOffline")}
                                    </button>
                                )}
                                {paymentToEdit === payment.id ? (
                                    <>
                                        <button
                                            className="px-3 py-1 m-2 rounded-lg bg-green-600 text-white"
                                            onClick={() => updatePayment(payment.id)}
                                        >
                                            {t("paymentView.update")}
                                        </button>

                                        <button
                                            className="px-3 py-1 m-2 rounded-lg bg-gray-400 text-white"
                                            onClick={() => {
                                                setPaymentToEdit(null);
                                                setEditErrors({
                                                    title: false,
                                                    description: false,
                                                    amount: false
                                                })
                                            }}
                                        >
                                            {t("common.cancel")}
                                        </button>
                                    </>
                                ) : (
                                    payment.paymentStatus?.id === 0 && (
                                        <button
                                            className="px-3 py-1 m-2 rounded-lg text-white bg-[rgb(188,124,34)] hover:opacity-90 transition"
                                            onClick={() => beginEdit(payment)}
                                        >
                                            {t("paymentView.update")}
                                        </button>
                                    )
                                )}

                                {(payment.paymentStatus?.id !== 2 && paymentToEdit !== payment.id) && (
                                    paymentToDelete === payment.id ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-red-600">
                                                {t("paymentView.confirmDelete")}
                                            </span>

                                            <button
                                                className="px-3 py-1 rounded-lg bg-red-600 text-white hover:opacity-90"
                                                onClick={() => {
                                                    deletePayment(payment.id);
                                                    setPaymentToDelete(null);
                                                }}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                {t("common.yes")}
                                            </button>

                                            <button
                                                className="px-3 py-1 rounded-lg bg-gray-300 hover:bg-gray-400"
                                                onClick={() => setPaymentToDelete(null)}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                {t("common.no")}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="px-3 py-1 m-2 rounded-lg text-white bg-[rgb(255,25,25)] hover:opacity-90 transition"
                                            onClick={() => setPaymentToDelete(payment.id)}
                                        >
                                            {t("paymentView.delete")}
                                        </button>
                                    )
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