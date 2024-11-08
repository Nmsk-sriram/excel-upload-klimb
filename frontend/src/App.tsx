import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            if (selectedFile && selectedFile.name.endsWith(".xlsx")) {
                setFile(selectedFile);
                setFileName(selectedFile.name);  
            } else {
                setMessage("Please upload a valid Excel file (.xlsx).");
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) {
            setMessage("Please select a file first.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:5000/api/candidates/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setData(response.data);
            setMessage("File uploaded and data processed successfully.");
        } catch (error) {
            console.error("Error uploading file:", error);
            setMessage("Error uploading file. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>Upload Candidate Records</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    title="Select an Excel file to upload"
                    placeholder="Choose file"
                />
                {fileName && <p>File selected: {fileName}</p>}  {}
                <button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </form>
            <p>{message}</p>
            {data.length > 0 && (
                <div>
                    <h2>Data from Excel:</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default App;
