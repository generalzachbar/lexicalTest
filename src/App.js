import React from "react";
import "./App.scss";
import Editor from "./Editor";
import PlainTextEditor from "./PlainTextEditor";

function App() {
    return (
        <div className="App">
            <Editor />

            {/* <div className="other">
                <h2>Other Examples</h2>
                <PlainTextEditor />
            </div> */}
        </div>
    );
}

export default App;
