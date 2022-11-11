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
import { TRANSFORMERS,$convertFromMarkdownString,
    $convertToMarkdownString, } from "@lexical/markdown";

import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {$generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $insertNodes } from "lexical";
import TemplateVarPlugin from "./plugins/TemplateVarPlugin";
import { TemplateVarNode, TEMPLATE_VAR } from "./nodes/TemplateVarNode";

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
    TemplateVarNode
  ]
};

export default function Editor() {

   

  return (
    <>
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
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
          <MarkdownShortcutPlugin transformers={[...TRANSFORMERS, TEMPLATE_VAR]} />
          <TemplateVarPlugin />
          {/* <OnChangePlugin onChange={handleOnChange}/> */}
        </div>
      </div>
      <HtmlViewer></HtmlViewer>
      <HtmlInserter></HtmlInserter>
    </LexicalComposer>
    
    </>
  );
}

const HtmlInserter = ()=>{
    const [editor] = useLexicalComposerContext();

    const htmlRef = useRef();
    const markdownRef = useRef();

    const handleInsertHtml= ()=>{
        const htmlString = htmlRef.current.value;

        editor.update(()=>{
            // In the browser you can use the native DOMParser API to parse the HTML string.
            const parser = new DOMParser();
            const dom = parser.parseFromString(htmlString, 'text/html');
            // Once you have the DOM instance it's easy to generate LexicalNodes.
            const nodes = $generateNodesFromDOM(editor, dom);

            // Get the RootNode from the EditorState
            //const root = $getRoot();

            // Get the selection from the EditorState
            //const selection = $getSelection();
            $insertNodes(nodes,true);

            // // Create a new ParagraphNode
            // const paragraphNode = $createParagraphNode();

            // // Create a new TextNode
            // const textNode = $createTextNode('Hello world');

            // // Append the text node to the paragraph
            // paragraphNode.append(textNode);

            // Finally, append the paragraph to the root
            //root.append(paragraphNode);

        });
    };

    const handleInsertMarkdown= ()=>{
        const markdownString = markdownRef.current.value;

        editor.update(()=>{
            // In the browser you can use the native DOMParser API to parse the HTML string.
            //const parser = new DOMParser();
           // const dom = parser.parseFromString(htmlString, 'text/html');
            // Once you have the DOM instance it's easy to generate LexicalNodes.
            $convertFromMarkdownString(markdownString, TRANSFORMERS);

            // Get the RootNode from the EditorState
            //const root = $getRoot();

            // Get the selection from the EditorState
            //const selection = $getSelection();
           // $insertNodes(nodes,true);

            // // Create a new ParagraphNode
            // const paragraphNode = $createParagraphNode();

            // // Create a new TextNode
            // const textNode = $createTextNode('Hello world');

            // // Append the text node to the paragraph
            // paragraphNode.append(textNode);

            // Finally, append the paragraph to the root
            //root.append(paragraphNode);

        });
    };

    return (
        <div className="row py-5">
            <div className="col-6">
                <div className="form-floating">                    
                     <textarea ref={htmlRef} id="generated-html" className="form-control" style={{width:'100%', height:'200px'}}></textarea>
                     <label htmlFor="generated-html">Insert this html into the RTE at the cursor:</label>                    
                     <button id="insert-html" type="button" className="btn btn-secondary" onClick={handleInsertHtml}>Insert HTML</button>
                </div>
            </div>
            <div className="col-6">
                <div className="form-floating">                    
                     <textarea ref={markdownRef} id="generate-markdown" className="form-control" style={{width:'100%', height:'200px'}}></textarea>
                     <label htmlFor="generated-markdown">Insert this markdown into the RTE.  It can only replace all current content:</label>                    
                     <button id="insert-markdown" type="button" className="btn btn-secondary" onClick={handleInsertMarkdown}>Insert Markdown</button>
                </div>
            </div>
        </div>
    );
};

const HtmlViewer = ()=>
{
    
    const [html, setHtml] = useState('');
    const [markdown, setMarkdown] = useState('');


    const handleOnChange = (editorState, editor)=> {

        const jsonString = JSON.stringify(editorState);
        console.log('jsonString', jsonString);
        
        editorState.read(() => {
            const htmlString = $generateHtmlFromNodes(editor, null);
            setHtml(htmlString);
            const markdownString = $convertToMarkdownString(TRANSFORMERS);
            setMarkdown(markdownString);
        });
    };

    return (
        <div className="row py-5">
            <OnChangePlugin onChange={handleOnChange}/>
            <div className="col-6">
                <div className="form-floating">
                    <span>html generated from the editor:</span>
                    <textarea className="form-control" style={{width:'100%', height:'200px'}} defaultValue={html}></textarea>
                    {/* <div id="generated-html" style={{'white-space': 'pre-line'}}>{html}</div> */}
                    {/* <textarea id="generated-html" className="form-control" style={{width:'100%', height:'200px'}} defaultValue={html}></textarea> */}
                    
                </div>
            </div>
            <div className="col-6">
                <div className="form-floating">                    
                    <span>markdown generated from the editor:</span>                    
                    <textarea className="form-control" style={{width:'100%', height:'200px'}} defaultValue={markdown}></textarea>
                    {/* <div id="generated-markdown">{markdown}</div> */}
                    {/* <textarea id="generated-html" className="form-control" style={{width:'100%', height:'200px'}} defaultValue={html}></textarea> */}
                    
                </div>
            </div>
        </div>
    );
};
