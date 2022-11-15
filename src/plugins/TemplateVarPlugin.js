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
    // TODO optimize this spaghetti
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

// function templateVarTransformOLD(node, templates) {
//     let textContent = node.getTextContent();
//     const nodes = [];
//     let isReplace = false;
//     templates.forEach((template) => {
//         if (!isReplace && textContent.indexOf(template.marker) > -1) {
//             isReplace = true;
//             const splitText = textContent.split(template.marker);

//             const prevText = splitText.shift();
//             const prevNode = $createTextNode(prevText);
//             const templateNode = $createTemplateVarNode(
//                 template.marker,
//                 template.display,
//                 template.color
//             );

//             nodes.push(prevNode);
//             nodes.push(templateNode);
//             const postText = splitText.join(template.marker);
//             if (postText) {
//                 const postNode = $createTextNode(postText);
//                 nodes.push(postNode);
//             }
//         }
//     });

//     if (isReplace) {
//         node.remove();
//         $insertNodes(nodes);
//     }
// }

function useTemplateVars(editor, templates) {
    useEffect(() => {
        const removeTransform = editor.registerNodeTransform(TextNode, (node) =>
            templateVarTransform(node, templates)
        );
        return () => {
            removeTransform();
        };
    }, [editor]);
}

export default function TemplateVarPlugin({ templates }) {
    const [editor] = useLexicalComposerContext();
    useTemplateVars(editor, templates);
    return null;
}
