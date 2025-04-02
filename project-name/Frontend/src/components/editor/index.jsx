import React,{useState, useCallback} from 'react'

import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';

const Editor = () => {
    const [value, setValue] = useState("public static void main(String[] args) {\n System.out.print(\"Hello World!\"); \n} ");
    const onChange = useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
    }, []);
    return (
        <div>
            <CodeMirror value={value} height="200px" width="800px" extensions={[java()]} onChange={onChange} />
            <button
            onClick = { () => console.log(value)}>
                Run
            </button>
        </div>
        
    )
}

export default Editor 