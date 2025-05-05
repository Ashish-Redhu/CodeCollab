import { useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import axios from 'axios';

function CodeOutput({ value, language, codeOutput, handleCodeOutputChange, codeRunning, handleCodeRunningChange }) {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL; 

    const languageVersionMap = {
       javascript: "18.15.0",
       python: "3.10.0",
       java: "15.0.2",
       cpp: "11.2.0",
    };
    // const [output, setOutput] = useState('');
    // const [isLoading, setIsLoading] = useState(false);

    const handleRun = async () => {

        handleCodeRunningChange(true); // Start loading
        // setIsLoading(true); // Start loading
        console.log("Running code...");
        
        const languageVersion = languageVersionMap[language]; // Default to language if version not mapped

        const requestData = {
            "language": language,
            "version": languageVersion,
            "files":[
                {
                    "content": value,
                }
            ]
        };

        try {
            // const response = await axios.get(PISTON_API_URL, requestData);
            const response = await axios.post(`${SERVER_URL}/run-code`, requestData);
            // console.log(response.data.run);
            const result = response.data.run;
            handleCodeOutputChange(result.stdout || result.stderr || 'No output returned');
            // setOutput(result.stdout || result.stderr || 'No output returned');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            console.error('Error executing code:', errorMessage);
            handleCodeOutputChange(`Error: ${errorMessage}`);
        }
        finally{
            handleCodeRunningChange(false);
            // setIsLoading(false); // End loading
        }
    };

    return (
        <div style={{
            color: "white",
            height: "100%",
            overflowY: "auto"
        }}>
            <Button 
                variant="contained" 
                color="success" 
                style={{
                    position: "relative",
                    top: "25px",
                    cursor: "pointer",
                }}
                onClick={handleRun}
                disabled={codeRunning} // Disable button while loading
            >
               {codeRunning ? <CircularProgress size={24} color="inherit" /> : 'Run Code'}

            </Button>

            <div>
                <h2 style={{ textAlign: "center", marginTop: "20px" }}>Output</h2>
                <div style={{
                    backgroundColor: "#1f1f33",
                    padding: "20px",
                    borderRadius: "10px",
                    height: "80vh",
                    overflowY: "auto",
                    color: "#e0e0e0",
                    fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
                }}>
                    {/* Output will be displayed here */}
                    <pre>{codeOutput}</pre>
                </div>
            </div>
        </div>
    );
}

export default CodeOutput;
