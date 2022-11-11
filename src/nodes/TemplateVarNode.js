import { TextNode, SerializedTextNode, Spread, DOMExportOutput } from "lexical";




export class TemplateVarNode extends TextNode {
    static getType() {
        return "templateVar";
    }

    static clone(node) {
        return new TemplateVarNode(node.__text, node.__key);
    }

    constructor(text, key) {
        super(text, key);              
    }

    createDOM(config) {
        const dom = document.createElement("span");
        const inner = super.createDOM(config);
        inner.className = "badge text-dark bg-warning";
        inner.textContent=this.__text;
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




    static importJSON(
        serializedNode,
      ) {
        const node = $createTemplateVarNode(node.text);
        node.setFormat(serializedNode.format);
        node.setIndent(serializedNode.indent);
        node.setDirection(serializedNode.direction);
        return node;
      }

    
   
exportDOM() {
        const element = document.createElement('span');        
        element.textContent = '[FIRST_NAME]';
        return {element};
}

    exportJSON() {

        const temp = {
            ...super.exportJSON(),
            type: 'templateVar',
            version: 1,
            text: '[FIRST_NAME]'
          };

        return temp;
      }
}

export function $isTemplateVarNode(node) {
    return node instanceof TemplateVarNode;
}

export function $createTemplateVarNode(titleText) {
    return new TemplateVarNode(titleText).setMode("token");
}


export const TEMPLATE_VAR = {
    dependencies: [TemplateVarNode],
    export: (node, exportChildren) => {
      if (!$isTemplateVarNode(node)) {
        return null;
      }    
      return '[FIRST_NAME]';
    },
    regExp: /^(First Name)\s/,
    
    type: 'element',
  };