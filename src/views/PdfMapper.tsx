import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PdfCanvas } from "./PdfCanvas";
import { FieldSidebar } from "../utils/FieldSideBar";
import { FormField } from "../types";
import { useTranslation } from "react-i18next";


interface MapperState {
    title: string;
    pdfFile: File;
    fields: FormField[];
}


export const PdfMapperView = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { t } = useTranslation();
    const state = location.state as MapperState | null;
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [pageCount, setPageCount] = useState(0);

    const [fields, setFields] =  useState<FormField[]>(state?.fields ?? []);



    if (!state) {

        return (
            <div className="p-10">
                No form data was provided.
            </div>
        );

    }



    const {
        title,
        pdfFile,
    } = state;



    const handleSave = async () => {


        const formData = new FormData();


        formData.append(
            "request",
            new Blob(
                [
                    JSON.stringify({
                        title,
                        formFields: fields
                    })
                ],
                {
                    type:"application/json"
                }
            )
        );


        formData.append(
            "file",
            pdfFile
        );


        const response = await fetch(
            "http://localhost:8080/form/create",
            {                
                credentials: "include",
                method:"POST",
                body:formData
            }
        );


        if(response.ok){
            navigate("/");
        }

    };


return (

            <div className="
            h-screen
            flex
            flex-col
            overflow-hidden
            ">


                <div className="h-16 flex items-center justify-between border-b bg-white px-6 ">

                <button
                onClick={ () => {
                    navigate("/creator", {
                        state:{
                            title: title,
                            fields: fields,
                            pdfFile: pdfFile
                        }
                    });
                }
                    
                }
                className=" 
                px-4 
                py-2 
                rounded-lg
                border
                border-blue-500
                text-blue-600
                font-medium
                hover:bg-blue-50
                transitionrounded cursor-pointer
                "> 
                ← {t("common.goBack")}
                </button>


                <h1 className="font-bold text-xl">
                PDF Mapper: {title}
                </h1>


                <button
                onClick={handleSave}
                className="
                px-4
                py-2
                bg-blue-500
                text-white
                rounded
                "
                >
                {t("common.save")}
                </button>


                </div>




                <div className="
                flex-1
                flex
                overflow-hidden
                ">


                <FieldSidebar
                    fields={fields}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    setFields={setFields}
                    pageCount={pageCount}
                />

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
                            fields={fields}
                            setFields={setFields}
                            selectedId={selectedId}
                            setSelectedId={setSelectedId}
                            setPageCount={setPageCount}
                        />
                </div>
            </div>
        </div>

        );

};