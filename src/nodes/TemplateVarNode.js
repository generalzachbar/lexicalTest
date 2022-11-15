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
        const dom = document.createElement("span");
        const inner = super.createDOM(config);
        inner.className = `badge text-dark bg-${this.__color}`;
        inner.textContent = this.__text;
        dom.appendChild(inner);
        return dom;
    }

    updateDOM(prevNode, dom, config) {
        const inner = dom.firstChild;
        if (inner === null) {
            return true;
        }
        super.updateDOM(prevNode, inner, config);
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

    exportDOM() {
        const element = document.createElement("span");
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
    export: (node) => {
        if (!$isTemplateVarNode(node)) {
            return null;
        }
        return node.__marker;
    },
    importRegExp: /\[(\S*)\]/g,
    regExp: /\[(\S*)\]/g,
    replace: (textNode, match) => {},
    trigger: "]",
    type: "text-match",
};
