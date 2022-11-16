import { TextNode } from "lexical";

export class TemplateVarNode extends TextNode {
    static getType() {
        return "templateVar";
    }

    static clone(node) {
        return new TemplateVarNode(
            node.__marker,
            node.__text,
            node.__color,
            node.__key
        );
    }

    constructor(marker, display, color, key) {
        super(display, key);
        this.__marker = marker;
        this.__color = color;
    }

    createDOM(config) {
        const dom = super.createDOM(config);
        dom.classList.add(...["badge", "text-dark", `bg-${this.__color}`]);
        dom.textContent = this.__text;
        return dom;
    }

    updateDOM(prevNode, dom, config) {
        // const inner = dom.firstChild;
        // if (inner === null) {
        //     return true;
        // }
        super.updateDOM(prevNode, dom, config);
        return false;
    }

    static importJSON(serializedNode) {
        const node = $createTemplateVarNode(
            node.__marker,
            node.text,
            node.__color
        );
        node.setFormat(serializedNode.format);
        node.setIndent(serializedNode.indent);
        node.setDirection(serializedNode.direction);
        return node;
    }

    exportDOM(editor) {
        const { element } = super.exportDOM(editor);
        element.textContent = this.__marker;
        return { element };
    }

    exportJSON() {
        const temp = {
            ...super.exportJSON(),
            type: "templateVar",
            version: 1,
            text: this.__marker,
        };

        return temp;
    }
}

export function $isTemplateVarNode(node) {
    return node instanceof TemplateVarNode;
}

export function $createTemplateVarNode(marker, display, color) {
    return new TemplateVarNode(marker, display, color).setMode("token");
}

export const TEMPLATE_VAR = {
    dependencies: [TemplateVarNode],
    export: (node, exportChildren, exportFormat) => {
        if (!$isTemplateVarNode(node)) {
            return null;
        }

        return exportFormat(node, node.__marker);
    },
    importRegExp: /\[(\S*)\]/g,
    regExp: /\[(\S*)\]/g,
    replace: (textNode, match) => {},
    trigger: "]",
    type: "text-match",
};
