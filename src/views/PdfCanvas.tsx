import { useEffect, useState } from "react";
import {
    Stage,
    Layer,
    Image as KonvaImage,
    Text,
} from "react-konva";

import { useRef } from "react";
import Konva from "konva";

import { FormField } from "../types";
import {
    PdfPageImage,
    renderPdf
} from "../utils/PdfRenderer";


interface Props {

    pdfFile: File;
    fields: FormField[];

    preview?: boolean;
    values?: Record<number,string>;

    setFields?: 
        React.Dispatch<
            React.SetStateAction<FormField[]>
        >;

    selectedId?: number | null;

    setSelectedId?:
        React.Dispatch<
            React.SetStateAction<number | null>
        >;

    setPageCount?:
        React.Dispatch<
            React.SetStateAction<number>
        >;

    setPageSize?: React.Dispatch<
        React.SetStateAction<{
            width:number;
            height:number;
        } | null>
    >;
}


export const PdfCanvas = ({
    pdfFile,
    fields,
    preview,
    values,
    setFields,
    selectedId,
    setSelectedId,
    setPageCount,
    setPageSize
}: Props) => {

    const [pages, setPages] = useState<PdfPageImage[]>([]);
    const textRefs = useRef<{[key:number]: Konva.Text}>({});

    useEffect(() => {
        renderPdf(pdfFile)
            .then(result => {
                setPages(result);
                setPageCount?.(result.length);
                if(result.length){
                    setPageSize?.({
                        width: result[0].width,
                        height: result[0].height
                    });
                }
            });
    }, [pdfFile]);


    if (!pages.length) {
        return (
            <div>
                Rendering PDF...
            </div>
        );
    }

    

    let offsetY = 0;

    return (
        <div
        style={{
            display: "flex",
            flexDirection: "column",
            gap: "50px",
            alignItems: "center",
            width: "100%",
        }}
    >
                {
                pages.map(page => {
                    return (

           <div
                key={page.page}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >

                <div
                    style={{
                        background: "white",
                        padding: "0",
                        borderRadius: "4px",
                        overflow: "hidden",

                        boxShadow:
                            "0 8px 30px rgba(0,0,0,0.12)",

                        border:
                            "1px solid rgba(0,0,0,0.08)",
                    }}
                >

                    <Stage
                            key={page.page}
                width={page.width}
                height={page.height}
        >

            <Layer>


                        <KonvaImage
                            key={
                                "pdf-" + page.page
                            }
                            image={page.image}
                            x={0}
                            y={0}

                        />


                        <Text
                            text={`${page.page}`}
                            fontFamily="Roboto"
                            x={0}
                            y={page.height - 30}
                            width={page.width}
                            align="center"
                            fontSize={14}
                            fill="#666"
                        />

                        {
                        fields
                        .filter(
                            f =>
                            f.page === page.page
                        )
                        .map(field => (

                           <Text
                                ref={(node)=>{

                                    if(node){
                                        textRefs.current[field.id] = node;
                                    }

                                }}
                                fontFamily="Roboto"
                                key={field.id}
                                text={
                                    values ? `${values[field.id]}`
                                    : `${field.label}: ${field.placeholder}`
                                }

                                position={{
                                    x: field.x ?? 50,
                                    y: field.y ?? 50,
                                }}


                                fontSize={
                                    field.fontSize ?? 20
                                }

                                fill={
                                    selectedId === field.id
                                    ? "blue" : "black"
                                }

                                wrap="none"
                                ellipsis={false}
                                draggable={!preview}
                                onClick={()=>{

                                    if(!preview){
                                        setSelectedId?.(field.id);
                                    }

                                }}


                               dragBoundFunc={(pos)=>{

                                const node =
                                textRefs.current[field.id];


                                const width =
                                node?.width() ?? 100;


                                const height =
                                node?.height() ?? 30;

                                return {
                                x: Math.max(
                                    0,
                                    Math.min(
                                        pos.x,
                                        page.width-width
                                    )
                                ),

                                y: Math.max(
                                        0,
                                        Math.min(
                                            pos.y,
                                            page.height-height
                                        )
                                    )

                                };
                                }}

                                onDragEnd={(e)=>{
                                    if(preview) return;

                                    const node=e.target;

                                    setFields?.(old=>

                                        old.map(f=>

                                            f.id===field.id

                                            ?

                                            {
                                                ...f,
                                                x: node.x(),
                                                y: node.y(), 
                                                page:page.page

                                            }

                                            :

                                            f

                                        )

                                    );

                                }}

                            />

                        ))
                        }

                    </Layer>
                    </Stage>
                    </div>
                    </div>
                    
                    );
                })
                }


         </div>

    );
};