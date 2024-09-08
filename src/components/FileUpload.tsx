import React, { useRef } from "react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
    onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onFileUpload(event.target.files[0]);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
            <Button onClick={handleButtonClick} className="w-full btn-primary">
                Upload CSV File
            </Button>
        </>
    );
};

export default FileUpload;
