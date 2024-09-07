import React, { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
    onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    return (
        <div>
            <Button asChild className="w-full btn-animation">
                <label htmlFor="file-upload">Upload CSV</label>
            </Button>
            <input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} style={{ display: "none" }} />
        </div>
    );
};

export default FileUpload;
