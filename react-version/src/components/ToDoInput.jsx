import { useState } from "react";

export function TodoInput({onAddTask}) {
    const [text, setText] = useState("")

    return (
        <form className="input-group" id="form">
            <input type="text" placeholder="َAdd New Task ..." value={text} onChange={(e) => setText(e.target.value)}/>
            <input type="submit" className="add-btn" onClick={(e) => {
                e.preventDefault();
                onAddTask(text);
                setText("");
            }} value="+"/>
        </form>
    )
}