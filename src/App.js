import React from "react";
import "./App.css";
import Editor from "./Editor";

function App() {
    return (
        <div className="App">
            <Editor />

            <div className="other">
                <h2>Other Examples</h2>
                <ul>
                    <li>
                        <a
                            href="https://codesandbox.io/s/lexical-rich-text-example-5tncvy"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Rich text example
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default App;
