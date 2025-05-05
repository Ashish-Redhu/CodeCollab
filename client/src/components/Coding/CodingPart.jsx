import React from 'react'
import CodeEditor from './CodeEditor'
import CodeOutput from './CodeOutput'
import { Box } from '@mui/material';

function CodingPart({value, onChange, language, handleLanguageChange, codeOutput, handleCodeOutputChange, codeRunning, handleCodeRunningChange}) {
  return (
    <Box display="flex" height="100vh" sx={{ 
      backgroundColor: '#1a1a1a',
      color: '#e0e0e0'
    }}>
        <Box flex={0.6} overflow="auto" sx={{ 
          borderRight: '1px solid #2d2d2d',
          backgroundColor: '#1e1e1e'
        }}>
            <CodeEditor 
              value={value} 
              onChange={onChange} 
              language={language} 
              handleLanguageChange={handleLanguageChange}
            />
        </Box>
        <Box flex={0.4} overflow="auto" sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: '#1a1a1a'
        }}>
            <CodeOutput 
              value={value} 
              language={language} 
              codeOutput={codeOutput} 
              handleCodeOutputChange={handleCodeOutputChange} 
              codeRunning={codeRunning} 
              handleCodeRunningChange={handleCodeRunningChange}
            />
        </Box>
    </Box>
  )
}

export default CodingPart