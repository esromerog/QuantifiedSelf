import Editor from '@monaco-editor/react'



// Code Editor Made Using monaco-editor/react
// It has the advantage of using the same editor as VSCode
// Includes syntax highlighting and intellisense

export function CodeEditor({code, setCode}) {

    const settings = {
        minimap: { 
            enabled: false 
        }
    }

    return (
        <Editor
            value={code}
            defaultPath="./viscards.js"
            theme="vs-dark"
            defaultLanguage="javascript"
            options={settings}
            onChange={(val) => setCode(val)}
        />
    )
}
