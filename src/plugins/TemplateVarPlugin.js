import {
    $createTemplateVarNode,
    $isTemplateVarNode,
} from "../nodes/TemplateVarNode";
import { useEffect } from "react";
import { TextNode, $createTextNode, $insertNodes } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function templateVarTransform(node, templates) {
    const nodes = [node];
    let isReplace = false;
    let rerun = true;
    let breakout = false;
    // TODO optimize this if possible
    while (rerun === true) {
        rerun = false;
        for (let outer = 0; outer < nodes.length; outer++) {
            if (breakout === true) {
                breakout = false;
                break;
            }
            for (let index = 0; index < templates.length; index++) {
                let processedNodes = processTemplate(
                    templates[index],
                    nodes[outer]
                );
                if (processedNodes.length) {
                    nodes.splice(outer, 1, ...processedNodes);
                    rerun = true;
                    isReplace = true;
                    breakout = true;
                    break;
                }
            }
        }
    }

    if (isReplace) {
        node.remove();
        $insertNodes(nodes);
    }
}

const processTemplate = (template, node) => {
    const newNodes = [];
    if (!$isTemplateVarNode(node)) {
        const textContent = node.getTextContent();
        const splitText = textContent.split(template.marker);
        if (splitText.length > 1) {
            for (let i = 0; i < splitText.length; i++) {
                const prevText = splitText[i];
                if (prevText) {
                    const prevNode = $createTextNode(prevText);
                    newNodes.push(prevNode);
                }
                if (i !== splitText.length - 1) {
                    const templateNode = $createTemplateVarNode(
                        template.marker,
                        template.display,
                        template.color
                    );
                    newNodes.push(templateNode);
                }
            }
        }
    }
    return newNodes;
};

function useTemplateVars(editor, templates) {
    useEffect(() => {
        const transform = (node) => templateVarTransform(node, templates);

        const removeTransform = editor.registerNodeTransform(
            TextNode,
            transform
        );
        return () => {
            removeTransform();
        };
    }, [editor, templates]);
}

export default function TemplateVarPlugin({ templates }) {
    const [editor] = useLexicalComposerContext();
    useTemplateVars(editor, templates);
    return null;
}
