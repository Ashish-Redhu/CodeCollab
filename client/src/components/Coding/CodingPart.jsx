import React from 'react'
import CodeEditor from './CodeEditor'
import CodeOutput from './CodeOutput'
import { Box, Divider } from '@mui/material';

function CodingPart({value, onChange, language, handleLanguageChange, codeOutput, handleCodeOutputChange, codeRunning, handleCodeRunningChange}) {
  return (
    <Box display="flex" height="100%">
        <Box flex={0.6} overflow="auto">
            <CodeEditor value={value} onChange={onChange} language={language} handleLanguageChange={handleLanguageChange}/>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box flex={0.4} overflow="auto">
            <CodeOutput value={value} language={language} codeOutput={codeOutput} handleCodeOutputChange={handleCodeOutputChange} codeRunning={codeRunning} handleCodeRunningChange={handleCodeRunningChange}/>
        </Box>
    </Box>
  )
}

export default CodingPart