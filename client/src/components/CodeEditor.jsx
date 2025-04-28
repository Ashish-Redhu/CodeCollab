import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function CodeEditor({value, onChange, language, setLanguage}) {
  const handleLanguageChange = (event)=>{
    setLanguage(event.target.value);
  }
  return (
    <>
     <FormControl sx={{ m: 1, minWidth: 150, color: "white", padding: "8px", borderBottom: "1px solid #333",  position: "relative", top: "10px", borderBottom: "1px solid #333"}}>
        <InputLabel id="demo-simple-select-autowidth-label" sx={{color: "white"}}>language</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={language}
          onChange={handleLanguageChange}
          autoWidth
          label="language"
          sx={{
            color: "#e0e0e0",
            "& .MuiSelect-icon": {
              color: "#e0e0e0",
            },
          }}
        >
          <MenuItem value="java">Java</MenuItem>
          <MenuItem value="cpp">CPP</MenuItem>
          <MenuItem value="python">Python</MenuItem>
          <MenuItem value="javascript">JavaScript</MenuItem>
        </Select>
      </FormControl>  
      <div>
        <Editor
          height="90vh"
          language={language}
          defaultLanguage="javascript"
          value={value}
          onChange={onChange}
          theme="vs-dark"
          options={{
            fontSize: 16,
            fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
            lineHeight: 24,
          }}
        />
      </div>
    </>
  );
}
export default CodeEditor;
