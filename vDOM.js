/**
 * renderNode() converts a js Object describing a DOM node, 
 * into a real DOM element.
 * 
 * vnode: {
 *      nodeName: (a string describing a DOM element, or a custom vDOM class (App for instance))
 *      attributes: (an object describing all the attrs the DOM element should have)
 *      children: (array of vnode objects)
 *  }
 * 
 * @param {object describing DOM node} vnode 
 */
const renderNode = vnode => {
    let el;
    const {nodeName, attributes, children} = vnode;

    // if vnode is a string and not an object, it represents a DOM text node
    if (Object.prototype.toString.call(vnode) === '[object String]') {
        return document.createTextNode(vnode);
    }
    
    if (typeof nodeName === 'string') {
        // if nodeName is a string, it means it represents a basic DOM element (dir, ul, li etc)
        el = document.createElement(nodeName);
        for (let key in attributes) {
            el.setAttribute(key, attributes[key]);
        }

    } else if (typeof nodeName === 'function') {
        // if nodeName is a function, it means a vDOM class was passed in. 
        // the vDOM class needs to be instantiated, and then recursively call renderNode() on that new object
        const component = new nodeName(attributes);
        el = renderNode(
            component.render(component.props, component.state)
        )
        component.base = el;
    }

    // if there are any child vnodes, add them as child elements after rendering them
    (children || []).forEach(child => el.appendChild(renderNode(child)));
    return el;
}

/**
 * renderComponent() calls the vDOM objects render() function, then runs the diff function against
 * what has changed in the render, and stores the change in the base attribute
 * 
 * @param {vDOM object} component 
 */
export const renderComponent = (component) => {
    let rendered = component.render(component.props, component.state);
    component.base = diff(component.base, rendered);
}

/**
 * the diff() function is designed to only re-render elements of the DOM which 
 * are different, and require re-rendering
 */
export const diff = (dom, vnode, parent) => {
    if (dom) {
        // if the dom object exists, perform the diff function

        if (typeof vnode === 'string') {
            // 
            dom.nodeValue = vnode;
            return dom;
        } 
        if (typeof vnode.nodeName === 'function') {
            const component = new vnode.nodeName(vnode.attributes);
            const rendered = component.render(component.props, component.state);

            diff(dom, rendered);
            return dom;
        }

        // naive check to se if there are any new children
        if (vnode.children.length !== dom.childNodes.length) {
            dom.appendChild(
                renderNode(vnode.children[vnode.children.length - 1]));
        }

        // run the diff function on all children
        // this step can be optimised, as all children do not necessarily need to be diffed
        dom.childNodes.forEach((child, i) => diff(child, vnode.children[i]));
        return dom;

    } else {
        // the dom object doesnt exist, so just render the node
        const newDom = renderNode(vnode);
        parent.appendChild(newDom);
        return newDom;
    }
}

/**
 * hyperscript() is a function used to build vDOM nodes, as a replacement for jsx
 * 
 * @param {DOM element or VDOM class} nodeName 
 * @param {object of DOM attrs} attrs 
 * @param  {... vnodes created by hyperscript} children 
 */
export const hyperscript = (nodeName, attrs, ...children) => {
    return {nodeName, attrs, children};
}

/**
 * init() function is designed to be called to begin the code. requires a div with
 * id="root" in the base html.
 * 
 * @param {vDOM class} Root 
 */
export const init = (Root) => {
    ((vnode, parent) => {
        diff(undefined, vnode, parent);
    })(hyperscript(Root), document.querySelector('#root'));
}

export class Component {
    constructor(props) {
        this.props = props;
        this.state = {};
    }

    setState(state) {
        this.state = Object.assign({}, state);
        renderComponent(this);
    }
}