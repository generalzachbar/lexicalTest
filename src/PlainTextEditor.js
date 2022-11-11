import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import EmoticonPlugin from "./plugins/EmoticonPlugin";
import MyCustomAutoFocusPlugin from "./plugins/MyCustomAutoFocusPlugin";
import { EmojiNode } from "./nodes/EmojiNode";

import onChange from "./onChange";

const exampleTheme = {
    ltr: "ltr",
    rtl: "rtl",
    placeholder: "editor-placeholder",
    paragraph: "editor-paragraph"
  };
  

const editorConfig = {
    theme: exampleTheme,
    onError(error) {
      throw error;
    },
    nodes: [EmojiNode]
  };
  

export default function PlainTextEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <PlainTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<Placeholder />}
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        <TreeViewPlugin />
        <EmoticonPlugin />
        <MyCustomAutoFocusPlugin />
      </div>
    </LexicalComposer>
  );
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some plain text...</div>;
}
