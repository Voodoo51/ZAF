import { use, useState } from "react"
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { FormField } from "../types";



interface LocationState {
    title: string;
    fields: FormField[];
    pdfFile: File | null;
}

export const CreatorView = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const location = useLocation();
    const previous = location.state as LocationState | undefined;

    const [arr, setArr] = useState<FormField[]>(previous?.fields ?? []);
    const [formTitle, setFormTitle] = useState<string>(previous?.title ?? "");
    const [pdfFile, setPdfFile] = useState<File | null>(previous?.pdfFile ?? null );
    const [pdfError, setPdfError] = useState<number | null>(0);

    const addInput = () => {
    setArr(arr => {
        const maxId = arr.length
            ? Math.max(...arr.map(item => item.id))
            : 0;

        const newInput: FormField = {
            id: maxId + 1,
            label: "",
            placeholder: "",
            type: "none",
            page: 1,
            x: 50,
            y: 50,
            fontSize: 16
        };

        return [
            ...arr,
            newInput
        ];
    });
};

    const isPasswordProtectedPDF = async (file: File): Promise<boolean> => {
        const buffer = await file.arrayBuffer();
        const uint8 = new Uint8Array(buffer);

        // Convert first part of PDF to string
        const header = new TextDecoder().decode(uint8.slice(0, 1024));

        // Quick heuristic signals
        const hasEncryptMarker = header.includes("/Encrypt");

        return hasEncryptMarker;
    };

    const changeValue = (e: React.ChangeEvent<any>, id: number) => {
        e.preventDefault();

        setArr(arr => arr.map(value => {
            if(id === value.id)
                return {...value, label: e.target.value};
            return value;
        }))
        console.log(arr);
    };
    
    const changePlaceholder = (e: React.ChangeEvent<any>, id: number) => {
        e.preventDefault();

        setArr(arr => arr.map(placeholder => {
            if(id === placeholder.id)
                return {...placeholder, placeholder: e.target.value};
            return placeholder;
        }));
        console.log(arr);
    };

    const changeType = (e: React.ChangeEvent<any>, id: number) => {
        e.preventDefault();

        setArr(arr => arr.map(type => {
            if(id === type.id)
                return {...type, type: e.target.value};
            return type;
        }));
        console.log(arr);
    };
    
    const delInput = (id: number) => {
        setArr(arr => arr.filter((item, index) => id !== item.id));
        console.log(arr);
    };

    const handleSave = async () => {
        try {
            const payload = {
                title: formTitle,
                formFields: arr.map(({ id, label, placeholder, type }) => ({id, label, placeholder, type}))
            };

            const response = await fetch("http://localhost:8080/form/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            window.location.href = "/";
        } else {
            console.error(t("errors.saveForm"));
        }
    } catch (error) {
        console.error(t("errors.saveFormUnexpected"), error);
    }
};
    return (
    <div className="min-h-screen py-10 flex items-start justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-6xl">
            <h1 className="text-3xl font-semibold text-center mb-8">
                {t("creator.title")}
            </h1>

            <div className="flex justify-center mb-10">
                <input
                    placeholder={t("creator.formNamePlaceholder")}
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
                    autoFocus
                />
            </div>

            {/* Headers */}
            <div className="grid grid-cols-4 gap-4 mb-3 px-1">
                <h3 className="font-semibold text-sm">
                    {t("creator.fieldName")}
                </h3>

                <h3 className="font-semibold text-sm">
                    {t("creator.fieldPlaceholder")}
                </h3>

                <h3 className="font-semibold text-sm">
                    {t("creator.fieldRestriction")}
                </h3>

                <h3 className="font-semibold text-sm text-center">
                    {t("creator.remove")}
                </h3>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
                {arr.map((item: FormField) => {
                    return (
                        <div
                            key={item.id}
                            className="grid grid-cols-4 gap-4 items-center"
                        >
                            <input
                                onChange={(e) => changeValue(e, item.id)}
                                value={item.label}
                                type="text"
                                placeholder={t("creator.fieldNamePlaceholder")}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />

                            <input
                                onChange={(e) => changePlaceholder(e, item.id)}
                                value={item.placeholder}
                                type="text"
                                placeholder={t("creator.hintPlaceholder")}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />

                            <select
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                onChange={(e) => changeType(e, item.id)}
                                value={item.type}
                            >
                                <option value="none">{t("creator.none")}</option>
                                <option value="phoneNumber">{t("creator.phoneNumber")}</option>
                                <option value="album">{t("creator.album")}</option>
                                <option value="pesel">{t("creator.pesel")}</option>
                                <option value="email">{t("creator.email")}</option>
                                <option value="date">{t("creator.date")}</option>
                            </select>

                            <div className="flex justify-center">
                                <button
                                    onClick={() => delInput(item.id)}
                                    className="px-4 py-3 rounded-lg text-white bg-[rgb(63,152,255)] hover:opacity-90 transition"
                                >
                                    -
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom buttons */}
            <div className="flex items-center justify-between mt-8 gap-4">
                <div className="flex items-center gap-3">
                    <input
                        id="pdf-upload"
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];

                            if (!file) {
                                setPdfError(3);
                                return;
                            }

                            if (file.type !== "application/pdf") {
                                setPdfError(2);
                                setPdfFile(null);
                                return;
                            }

                            setPdfError(null);
                            setPdfFile(file);
                        }}
                    />

                    <label
                        htmlFor="pdf-upload"
                        className="px-4 py-2 
                            rounded-lg
                            border
                            border-blue-500
                            text-blue-600
                            font-medium
                            hover:bg-blue-50
                            transitionrounded cursor-pointer"
                    >
                        {t("pdf.choosePdf")}
                    </label>

                    {pdfFile && (
                        <span className="ml-3">
                            {pdfFile.name}
                        </span>
                    )}
                </div>

                {pdfError == 1 && (<p className="mt-2 text-sm text-red-500"> {t("pdf.noPdfFile")} </p>)}
                {pdfError == 2 && (<p className="mt-2 text-sm text-red-500"> {t("pdf.notPdfFile")} </p>)}
                {pdfError == 3 && (<p className="mt-2 text-sm text-red-500"> {t("pdf.unknownError")} </p>)}

                <button
                    onClick={addInput}
                    className="px-6 py-3 rounded-xl text-white bg-[rgb(63,152,255)] hover:opacity-90 transition font-medium shadow-sm"
                >
                    +
                </button>

                <button
                    //onClick={handleSave}
                    onClick={() => {
                        if(pdfFile !== null)
                        {
                            setPdfError(0);

                            navigate("/pdf-mapper", {
                                state: {
                                    title: formTitle,
                                    pdfFile,
                                    fields: arr
                                }
                            });
                        } else {
                            setPdfError(1);
                            return;
                        }
                       
                    }}
                    className="px-5 py-3 rounded-lg text-white bg-[rgb(63,152,255)] hover:opacity-90 transition"
                >
                    {t("creator.createForm")}
                </button>
            </div>
        </div>
    </div>
);
}