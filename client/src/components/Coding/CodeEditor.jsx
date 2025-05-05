import { Editor } from "@monaco-editor/react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

function CodeEditor({value, onChange, language, handleLanguageChange}) {
  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#1e1e1e'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
        backgroundColor: '#252526',
        borderBottom: '1px solid #2d2d2d',
        height: '56px'
      }}>
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel 
            id="language-select-label"
            sx={{ color: '#b0b0b0' }}
          >
            Language
          </InputLabel>
          <Select
            labelId="language-select-label"
            value={language}
            onChange={handleLanguageChange}
            label="Language"
            sx={{
              color: '#ffffff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3e3e42',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#007acc',
              },
              '& .MuiSvgIcon-root': {
                color: '#b0b0b0',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: '#252526',
                  color: '#ffffff',
                  '& .MuiMenuItem-root': {
                    '&:hover': {
                      backgroundColor: '#2a2d2e',
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="python">Python 3</MenuItem>
            <MenuItem value="javascript">JavaScript</MenuItem>
          </Select>
        </FormControl>  
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={onChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', monospace",
            lineHeight: 20,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true },
            wordWrap: 'on',
            smoothScrolling: true,
            'semanticHighlighting.enabled': true,
            cursorBlinking: 'smooth',
            matchBrackets: 'always',
            colorDecorators: true,
          }}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme('leetcode-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'comment', foreground: '#6A9955', fontStyle: 'italic' },
                { token: 'keyword', foreground: '#569CD6' },
                { token: 'number', foreground: '#B5CEA8' },
                { token: 'string', foreground: '#CE9178' },
              ],
              colors: {
                'editor.background': '#1e1e1e',
                'editor.lineHighlightBackground': '#282828',
                'editorLineNumber.foreground': '#858585',
                'editorCursor.foreground': '#A6A6A6',
              }
            });
          }}
          onMount={(editor) => {
            editor.updateOptions({ theme: 'leetcode-dark' });
          }}
        />
      </Box>
    </Box>
  );
}
export default CodeEditor;