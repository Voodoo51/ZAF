import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { PdfCanvas } from "./PdfCanvas";
import { FormField } from "../types";
import { exportPdf } from "../utils/PdfExporter";


interface State {
    templateId: number;
    fields: FormField[];
    values: Record<number, string>;
    title: string;
    userId: number;
    name: string;
    surname: string;
}


export const PdfPreviewView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as State | null;
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pageSize,setPageSize] = useState<{
        width:number;
        height:number;
    } | null>(null);

    useEffect(() => {
        if (!state?.templateId) return;

        fetch(
            `http://localhost:8080/form/template/file/${state.templateId}`,
            {
                credentials: "include"
            }
        )
        .then(res => {

            if (!res.ok) {
                throw new Error("Failed to fetch PDF");
            }
            return res.blob();
        })
        .then(blob => {

            const file = new File(
                [blob],
                `${state.title}.pdf`,
                {
                    type: "application/pdf"
                }
            );
            setPdfFile(file);
        })
        .catch(err => {

            console.error(err);
        });
    }, [state]);


    if (!state) {
        return (
            <div className="p-10">
                No preview data
            </div>
        );

    }

    if (!pdfFile) {

        return (
            <div className="p-10">
                Loading PDF...
            </div>
        );

    }

    return (
    <div className="
        h-screen
        flex
        flex-col
        overflow-hidden
        bg-gray-100
    ">


        <div className="
            h-16
            bg-white
            border-b
            flex
            items-center
            px-6
            relative
        ">
            <button
                onClick={()=>navigate(-1)}
                className="
                    px-4
                    py-2
                    bg-gray-200
                    rounded-lg
                    hover:bg-gray-300
                    transition
                "
            >
                ← Back
            </button>

            <button
            onClick={()=>{
                if (!pageSize) {
                        return;
                }

                exportPdf(
                    state.userId,
                    state.name,
                    state.surname,
                    state.title,
                    pdfFile,
                    state.fields,
                    state.values ?? {},
                    pageSize.width,
                    pageSize.height,
                    false
                );

            }}
            >
            Download PDF
            </button>


            <h1 className="
                absolute
                left-1/2
                -translate-x-1/2
                font-bold
                text-xl
            ">

                {state.title}
            </h1>
        </div>

        <div
            className="
                flex-1
                overflow-auto
                p-10
                flex
                justify-center
                bg-gray-200
            "
            >

                <PdfCanvas
                    pdfFile={pdfFile}
                    fields={state.fields}
                    preview={true}
                    values={state.values}
                    setPageSize={setPageSize}
                />
        </div>
    </div>
    );
};