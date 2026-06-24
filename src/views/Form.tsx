import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

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

export const FormView = () => {
    const { t } = useTranslation();

    const [template, setTemplate] =
        useState<TFormTemplate | null>(null);

    const [formData, setFormData] = useState<Record<number, string>>({});
    const [editable, setEditable] = useState<boolean>(true);
    const { templateId } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        fetch(`http://localhost:8080/form/templates/${templateId}`, {
                credentials: 'include', 
                mode: 'cors',
                method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                setTemplate(data);
                if (data.statusId != 3 && data.statusId != 4) {
                    setEditable(false);
                }

                if (data.formFilledFields?.length) {
                  const filledMap: Record<number, string> = {};

                  data.formFilledFields.forEach((field: TFilledFormField) => {
                      filledMap[field.id] = field.value;
                  });

                  setFormData(filledMap);
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
                    formTemplateId: Number(templateId),
                    formData: filledFields
                })
            }
        );

        if (response.ok) {
            navigate("/");
        }
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
            </div>
        </div>
    );
};