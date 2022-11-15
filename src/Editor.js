import React, { useRef, useState } from "react";
import ExampleTheme from "./themes/ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import {
    TRANSFORMERS,
    $convertFromMarkdownString,
    $convertToMarkdownString,
} from "@lexical/markdown";

import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $createTextNode, $insertNodes, $getSelection } from "lexical";
import TemplateVarPlugin from "./plugins/TemplateVarPlugin";
import { TemplateVarNode, TEMPLATE_VAR } from "./nodes/TemplateVarNode";

const templateVariables = [
    {
        marker: "[FIRST_NAME]",
        display: "First Name",
        color: "warning",
    },
    {
        marker: "[LAST_NAME]",
        display: "Last Name",
        color: "warning",
    },
    {
        marker: "[FULL_NAME]",
        display: "Full Name",
        color: "danger",
    },
];

function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>;
}

const editorConfig = {
    // The editor theme
    theme: ExampleTheme,
    // Handling of errors during update
    onError(error) {
        throw error;
    },
    // Any custom nodes go here
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
        TemplateVarNode,
    ],
};

export default function Editor() {
    return (
        <>
            <LexicalComposer initialConfig={editorConfig}>
                <div className="editor-container">
                    <TemplateInserter></TemplateInserter>
                    <ToolbarPlugin />
                    <div className="editor-inner">
                        <RichTextPlugin
                            contentEditable={
                                <ContentEditable className="editor-input" />
                            }
                            placeholder={<Placeholder />}
                        />
                        <HistoryPlugin />
                        <TreeViewPlugin />
                        <AutoFocusPlugin />
                        <CodeHighlightPlugin />
                        <ListPlugin />
                        <LinkPlugin />
                        <AutoLinkPlugin />
                        <ListMaxIndentLevelPlugin maxDepth={7} />
                        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                        <TemplateVarPlugin templates={templateVariables} />
                    </div>
                </div>
                <div className="container">
                    <HtmlInserter></HtmlInserter>
                    <HtmlViewer></HtmlViewer>
                </div>
            </LexicalComposer>
        </>
    );
}

const TemplateInserter = () => {
    const [editor] = useLexicalComposerContext();
    const selectControl = useRef();
    const handleInsertTemplate = (ev) => {
        const selectedText = ev.target.value;

        if (selectedText !== "-1") {
            editor.update(() => {
                const node = $createTextNode(selectedText);
                // Get the selection from the EditorState
                const selection = $getSelection();

                $insertNodes([node], true);
            });

            selectControl.current.value = "-1";
        }
    };

    return (
        <div className="row">
            <div className="col-6">
                <select
                    ref={selectControl}
                    defaultValue={"-1"}
                    className="form-select mb-3"
                    id="inputGroupSelect01"
                    onChange={handleInsertTemplate}
                >
                    <option value="-1">Add a template field...</option>
                    <option value="[FIRST_NAME]">First Name</option>
                    <option value="[LAST_NAME]">Last Name</option>
                    <option value="[FULL_NAME]">Full Name</option>
                </select>
            </div>
        </div>
    );
};

const HtmlInserter = () => {
    const [editor] = useLexicalComposerContext();

    const htmlRef = useRef();
    const markdownRef = useRef();

    const handleInsertHtml = () => {
        const htmlString = htmlRef.current.value;

        editor.update(() => {
            // In the browser you can use the native DOMParser API to parse the HTML string.
            const parser = new DOMParser();
            const dom = parser.parseFromString(htmlString, "text/html");
            // Once you have the DOM instance it's easy to generate LexicalNodes.
            const nodes = $generateNodesFromDOM(editor, dom);

            // Get the RootNode from the EditorState
            //const root = $getRoot();

            // Get the selection from the EditorState
            const selection = $getSelection();
            $insertNodes(nodes, true);
        });
    };

    const handleInsertMarkdown = () => {
        const markdownString = markdownRef.current.value;

        editor.update(() => {
            $convertFromMarkdownString(markdownString, TRANSFORMERS);
        });
    };

    const template =
        "hello [FIRST_NAME], [FIRST_NAME], what is your [LAST_NAME]. Can I call you [FULL_NAME]?";

    return (
        <div className="row pb-3">
            <div className="col-6">
                <div className="form-floating">
                    <textarea
                        defaultValue={template}
                        ref={htmlRef}
                        id="generated-html"
                        className="form-control"
                        style={{ width: "100%", height: "200px" }}
                    ></textarea>
                    <label htmlFor="generated-html">
                        Insert this html into the RTE at the cursor:
                    </label>
                    <button
                        id="insert-html"
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleInsertHtml}
                    >
                        Insert HTML
                    </button>
                </div>
            </div>
            <div className="col-6">
                <div className="form-floating">
                    <textarea
                        ref={markdownRef}
                        id="generate-markdown"
                        className="form-control"
                        style={{ width: "100%", height: "200px" }}
                        defaultValue={template}
                    ></textarea>
                    <label htmlFor="generated-markdown">
                        Insert this markdown into the RTE. It can only replace
                        all current content:
                    </label>
                    <button
                        id="insert-markdown"
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleInsertMarkdown}
                    >
                        Insert Markdown
                    </button>
                </div>
            </div>
        </div>
    );
};

const HtmlViewer = () => {
    const [html, setHtml] = useState("");
    const [json, setJson] = useState("");
    const [markdown, setMarkdown] = useState("");

    const handleOnChange = (editorState, editor) => {
        const jsonString = JSON.stringify(editorState, null, 4); //JSON.stringify(editorState);
        setJson(jsonString);
        //console.log("jsonString", jsonString);

        editorState.read(() => {
            const htmlString = $generateHtmlFromNodes(editor, null);
            setHtml(htmlString);
            const markdownString = $convertToMarkdownString([
                TEMPLATE_VAR,
                ...TRANSFORMERS,
            ]);
            setMarkdown(markdownString);
        });
    };

    return (
        <>
            <div className="row py-3">
                <OnChangePlugin onChange={handleOnChange} />
                <div className="col-6">
                    <div className="form-floating">
                        <span>html generated from the editor:</span>
                        <textarea
                            className="form-control"
                            style={{ width: "100%", height: "200px" }}
                            defaultValue={html}
                        ></textarea>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-floating">
                        <span>markdown generated from the editor:</span>
                        <textarea
                            className="form-control"
                            style={{ width: "100%", height: "200px" }}
                            defaultValue={markdown}
                        ></textarea>
                    </div>
                </div>
            </div>
            <div className="row pb-5">
                <div className="col-12">
                    <div className="form-floating">
                        <span>json generated from the editor:</span>
                        <textarea
                            className="form-control"
                            style={{ width: "100%", height: "200px" }}
                            defaultValue={json}
                        ></textarea>
                    </div>
                </div>
            </div>
        </>
    );
};
