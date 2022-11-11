import { $createTemplateVarNode } from "../nodes/TemplateVarNode";
import { useEffect } from "react";
import { TextNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function templateVarTransform(node) {
    const textContent = node.getTextContent();
    // When you type [FIRST_NAME], we will replace it with an templateVar node
    if (textContent === "[FIRST_NAME]") {
        node.replace($createTemplateVarNode("First Name"));
    }
}

function useTemplateVars(editor) {
    useEffect(() => {
        const removeTransform = editor.registerNodeTransform(
            TextNode,
            templateVarTransform
        );
        return () => {
            removeTransform();
        };
    }, [editor]);
}

export default function TemplateVarPlugin() {
    const [editor] = useLexicalComposerContext();
    useTemplateVars(editor);
    return null;
}
