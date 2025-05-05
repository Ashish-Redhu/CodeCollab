import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';

function CodeOutput({ value, language, codeOutput, handleCodeOutputChange, codeRunning, handleCodeRunningChange }) {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL; 

    const languageVersionMap = {
       javascript: "18.15.0",
       python: "3.10.0",
       java: "15.0.2",
       cpp: "11.2.0",
    };

    const handleRun = async () => {
        handleCodeRunningChange(true);
        
        const languageVersion = languageVersionMap[language];

        const requestData = {
            "language": language,
            "version": languageVersion,
            "files": [{
                "content": value,
            }]
        };

        try {
            const response = await axios.post(`${SERVER_URL}/run-code`, requestData);
            const result = response.data.run;
            handleCodeOutputChange(result.stdout || result.stderr || 'No output returned');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            handleCodeOutputChange(`Error: ${errorMessage}`);
        } finally {
            handleCodeRunningChange(false);
        }
    };

    return (
        <Box sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1a1a1a',
            // bgcolor: '#1e1e2f',
        }}>
            <Box sx={{ 
                padding: '16px',
                borderBottom: '1px solid #2d2d2d',
                display: 'flex',
                justifyContent: 'flex-end',
                backgroundColor: '#252526'
            }}>
                <Button 
                    variant="contained" 
                    color="primary"
                    size="medium"
                    onClick={handleRun}
                    disabled={codeRunning}
                    sx={{
                        minWidth: '120px',
                        textTransform: 'none',
                        fontWeight: 600,
                        backgroundColor: '#007acc',
                        '&:hover': {
                            backgroundColor: '#0062a3',
                        },
                        '&:disabled': {
                            backgroundColor: '#3e3e42',
                            color: '#6e6e6e'
                        }
                    }}
                >
                    {codeRunning ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Run Code'
                    )}
                </Button>
            </Box>

            <Box sx={{ 
                padding: '16px',
                flex: 1,
                overflow: 'auto'
            }}>
                <Typography variant="h6" sx={{ 
                    marginBottom: '16px',
                    color: '#ffffff',
                    fontWeight: 600
                }}>
                    Output
                </Typography>
                <Box sx={{
                    backgroundColor: '#1e1e1e',
                    padding: '16px',
                    borderRadius: '4px',
                    height: 'calc(100% - 40px)',
                    overflow: 'auto',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '14px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    border: '1px solid #2d2d2d',
                    color: codeOutput?.startsWith('Error:') ? 
                        '#f48771' : 
                        '#d4d4d4'
                }}>
                    {codeOutput || (
                      <Typography variant="body2" sx={{ color: '#858585' }}>
                        Click "Run Code" to see the output here
                      </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default CodeOutput;