import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../App";

type TTemplateField = {
    id: number;
    label: string;
    placeholder: string;
    type: string;
};

type TFormTemplate = {
    id: number;
    title: string;
    formFields: TTemplateField[];
};

type TFilledFormField = {
    id: number;
    value: string;
};

interface FormViewState {
    templateId?: number;
    userId?: number;
    sentFormId?: number;
}

export const FormView = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const { templateId, userId, sentFormId } = (location.state as FormViewState) ?? {};
    const [template, setTemplate] = useState<TFormTemplate | null>(null);

    const { user } = useAppContext();
    const [formData, setFormData] = useState<Record<number, string>>({});
    const [editable, setEditable] = useState<boolean>(true);
    const [role, setRole] = useState("");
    const [statusId, setStatusId] = useState<number>(0);
    const [responseText, setResponseText] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        fetch(`http://localhost:8080/form/template?formTemplateId=${templateId}&userId=${userId}`, {
                credentials: 'include', 
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
        })
            .then(res => res.json())
            .then(data => {
                setTemplate(data);

                if (data.statusId != 3 && data.statusId != 4) {
                    setEditable(false);
                } else if (user?.role !== "student") {
                        setEditable(false);
                }

                if (data.formFilledFields?.length) {
                    const filledMap: Record<number, string> = {};

                    data.formFilledFields.forEach((field: TFilledFormField) => {
                        filledMap[field.id] = field.value;
                    });

                    if(data.statusId === 1) {
                        setStatusId(0);
                    } else {
                        setStatusId(data.statusId);
                    }
                    setFormData(filledMap);
                    setResponseText(data.response || "");
              }
            });

    }, [templateId]);

    const changeValue = (
        id: number,
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const sendForm = async () => {

        if (!template) return;

        const filledFields: TFilledFormField[] =
            template.formFields.map(field => ({
                id: field.id,
                value: formData[field.id] || ""
            }));
            console.log(filledFields);
        const response = await fetch(
            "http://localhost:8080/form/send",
            {
                credentials: 'include', 
                mode: 'cors',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    formTemplateId: templateId,
                    formData: filledFields
                })
            }
        );

        if (response.ok) {
            navigate("/");
        }
    };

    const updateStatus = async () => {
        await fetch(
            `http://localhost:8080/form/sent/update`,
            {
                method: "PUT",
                mode: 'cors',
                credentials: 'include', 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sentFormId: sentFormId,
                    newStatusId: statusId,
                    response: responseText
                })
            }
        ).then(res => {
            if (res.ok) {
                navigate("/");
            }
        });
};

    if (!template) {
        return <div>{t("common.loading")}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-10 flex justify-center">
            <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl">
                
                <h1 className="text-3xl font-semibold mb-8 text-center">
                    {template.title}
                </h1>

                <div className="space-y-5">
                    {template.formFields.map(field => {

                        return (
                            <div
                                key={field.id}
                                className="flex flex-col"
                            >
                                <label className="mb-2 text-sm font-medium text-gray-700">
                                    {field.label}
                                </label>

                                <input
                                    type="text"
                                    placeholder={editable ? field.placeholder : ""}
                                    value={formData[field.id] || ""} 
                                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    disabled={!editable}
                                    onChange={(e) =>
                                        changeValue(
                                            field.id,
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        );

                    })}
                </div>

                {user?.role !== "student"  && (
                    <div className="mt-8 space-y-4">
                        <div>
                            <label>Status</label>

                            <select
                                value={statusId}
                                onChange={(e) =>
                                    setStatusId(Number(e.target.value))
                                }
                                className="border rounded p-2 w-full"
                            >
                                <option value={0}>Accepted</option>
                                <option value={2}>Declined</option>
                                <option value={4}>In need of update</option>
                            </select>
                        </div>

                        <div>
                            <label>Response</label>

                            <textarea
                                value={responseText}
                                onChange={(e) =>
                                    setResponseText(e.target.value)
                                }
                                className="border rounded p-3 w-full"
                                rows={5}
                            />
                        </div>

                    </div>
                )}

                    {user?.role === "student" && responseText && (
                        <div className="mt-8">
                            <h2 className="font-semibold mb-2">
                                Response
                            </h2>

                            <div className="border rounded-lg p-4 bg-gray-50">
                                {responseText}
                            </div>
                        </div>
                    )}

                {user?.role !== "student" ? (
                    <button
                        onClick={updateStatus}
                        className={`
                            mt-8 w-full text-white font-medium py-3 rounded-lg transition bg-blue-500 hover:bg-blue-600 cursor-pointer                
                        `}
                    >
                        {t("form.submit")}
                    </button>
                    )
                : 
                    (
                            <button
                            onClick={sendForm}
                            disabled={!editable}
                            className={`
                                mt-8 w-full text-white font-medium py-3 rounded-lg transition
                                ${editable
                                    ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                                    : "bg-gray-400 cursor-not-allowed"}
                            `}
                        >
                            {t("form.submit")}
                        </button>
                    )
                }
                
            </div>

           
        </div>
    );
};