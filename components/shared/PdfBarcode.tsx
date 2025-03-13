"use client"; // Mark as a Client Component

import React, { useRef, forwardRef, useImperativeHandle } from "react";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface BarcodeProps {
    value: string;
    name: string;
}

export interface BarcodeRef {
    generatePdfUrl: () => Promise<string>;
}

const BarcodeComponent = forwardRef<BarcodeRef, BarcodeProps>(
    ({ value, name }, ref) => {
        const barcodeRef = useRef<HTMLDivElement>(null);

        const generatePdfUrl = async () => {
            if (barcodeRef.current) {
                // Temporarily make the barcode visible for html2canvas to capture
                barcodeRef.current.style.visibility = "visible";
                const canvas = await html2canvas(barcodeRef.current);
                barcodeRef.current.style.visibility = "hidden";

                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF();
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(imgData, "PNG", 0, 0, 200, 100);
                pdf.setFontSize(14);

                // Convert PDF to Blob and generate a URL
                const pdfBlob = pdf.output("blob");
                return URL.createObjectURL(pdfBlob);
            }
            throw new Error("Barcode element not found");
        };

        // Expose the generatePdfUrl function to the parent component
        useImperativeHandle(ref, () => ({
            generatePdfUrl,
        }));

        return (
            <div>
                <div ref={barcodeRef} style={{ visibility: "hidden", alignItems: "center" }}>
                    <Barcode value={value} format="CODE128" displayValue={false} />
                    <div className="text-center mr-8 mt-[-10px]">{name}</div>
                </div>
            </div>
        );
    }
);

BarcodeComponent.displayName = "BarcodeComponent";

export default BarcodeComponent;