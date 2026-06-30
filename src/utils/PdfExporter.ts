import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { FormField } from "../types";
import fontkit from "@pdf-lib/fontkit";
import fontUrl from "../resources/Roboto-Regular.ttf"

export async function exportPdf(
    userId: number,
    name: string,
    surname: string,
    templateName: string,
    file: File,
    fields: FormField[],
    values: Record<number,string>,
    renderedWidth: number,
    renderedHeight: number,
    includePageNumbers = false
) {

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);

    pdfDoc.registerFontkit(fontkit);

    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
    const font = await pdfDoc.embedFont(fontBytes);


    const pages = pdfDoc.getPages();


    pages.forEach((page, index)=>{

        const pageNumber = index + 1;


        const pageFields =
            fields.filter(
                f => f.page === pageNumber
            );


       pageFields.forEach(field => {

        const konvaFontSize = field.fontSize ?? 20;
        
        const pdfWidth = page.getWidth();
        const pdfHeight = page.getHeight();

        const scaleX = pdfWidth / renderedWidth;
        const scaleY = pdfHeight / renderedHeight;
        
        const fontSize = konvaFontSize * scaleY;
        const ascent = font.heightAtSize(fontSize);

        const textHeight = font.heightAtSize(fontSize);

        page.drawText(
            values[field.id] ?? "",
            {
                x: (field.x ?? 50) * scaleX,
                y:
                        pdfHeight
                        - (field.y ?? 50) * scaleY
                        - textHeight
                        + fontSize * 0.2,   
                    size: fontSize,
                font,
                color:rgb(0,0,0)
            }
        );

});



        if(includePageNumbers){

            page.drawText(
                `${pageNumber}`,
                {
                    x:
                    page.getWidth()/2 - 5,

                    y:20,

                    size:12,

                    font,

                    color:
                    rgb(
                        0.4,
                        0.4,
                        0.4
                    )
                }
            );

        }


    });


    const output = await pdfDoc.save();

    const blob = new Blob(
        [new Uint8Array(output)],
        {
            type: "application/pdf"
        }
    );

    const url =
        URL.createObjectURL(blob);


    const a =
        document.createElement("a");

    a.href=url;

    a.download=`${templateName}_${name}_${surname}_${userId}.pdf`;

    a.click();


    URL.revokeObjectURL(url);

}