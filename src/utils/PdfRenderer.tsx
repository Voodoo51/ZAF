import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "/pdf.worker.min.mjs";


export interface PdfPageImage {
    page: number;
    image: HTMLImageElement;
    width: number;
    height: number;
}


export async function renderPdf(
    file: File,
    scale = 1.5
): Promise<PdfPageImage[]> {

    const buffer = await file.arrayBuffer();


    const pdf = await pdfjsLib.getDocument({
        data: buffer
    }).promise;


    const pages: PdfPageImage[] = [];


    for (let i = 1; i <= pdf.numPages; i++) {

        const page = await pdf.getPage(i);


        const viewport = page.getViewport({
            scale
        });


        const canvas = document.createElement("canvas");


        canvas.width = viewport.width;
        canvas.height = viewport.height;


        const ctx = canvas.getContext("2d");

        if (!ctx)
            throw new Error("Canvas failed");


        await page.render({
            canvas,
            canvasContext: ctx,
            viewport
        }).promise;


        const image = new Image();


        image.src = canvas.toDataURL();


        await new Promise<void>(resolve => {
            image.onload = () => resolve();
        });


        pages.push({
            page: i,
            image,
            width: viewport.width,
            height: viewport.height
        });
    }


    return pages;
}