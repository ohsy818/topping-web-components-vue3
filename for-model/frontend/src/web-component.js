forEach: Model
fileName: web-component.js
path: frontend/src
---
import { createApp, h } from 'vue';
import vuetify from './plugins/vuetify';
import './GlobalStyle.css';
import axios from 'axios';

{{#boundedContexts}}
    {{#aggregates}}
import {{boundedContext.namePascalCase}}{{namePascalCase}}Manager from "./components/listers/{{boundedContext.namePascalCase}}{{namePascalCase}}Cards"
import {{boundedContext.namePascalCase}}{{namePascalCase}}Detail from "./components/listers/{{boundedContext.namePascalCase}}{{namePascalCase}}Detail"
    {{/aggregates}}

    {{#readModels}}
import {{namePascalCase}}View from "./components/{{namePascalCase}}View"
import {{namePascalCase}}ViewDetail from "./components/{{namePascalCase}}ViewDetail"
    {{/readModels}}
{{/boundedContexts}}

axios.fixUrl = function(original) {
    if (!axios.backend && original.indexOf("/") === 0) {
        return original;
    }

    let url = null;
    try {
        url = new URL(original);
    } catch (e) {
        url = new URL(axios.backend + original);
    }

    if (!axios.backend) return url.pathname;

    url.hostname = axios.backendUrl.hostname;
    url.port = axios.backendUrl.port;

    return url.href;
};

class WebComponentElement extends HTMLElement {
    constructor() {
        super();
        this.vueInstance = null;
    }

    connectedCallback() {
        // Map of registered components
        const componentMap = {
{{#boundedContexts}}
    {{#aggregates}}
            '{{boundedContext.nameCamelCase}}-{{nameCamelCase}}-manager': {{boundedContext.namePascalCase}}{{namePascalCase}}Manager,
            '{{boundedContext.nameCamelCase}}-{{nameCamelCase}}-detail': {{boundedContext.namePascalCase}}{{namePascalCase}}Detail,
    {{/aggregates}}
    {{#readModels}}
            '{{nameCamelCase}}-view': {{namePascalCase}}View,
            '{{nameCamelCase}}-view-detail': {{namePascalCase}}ViewDetail,
    {{/readModels}}
{{/boundedContexts}}
        };

        // Collect child components to render
        const childComponents = Array.from(this.childNodes)
            .filter(node => node.nodeType === Node.ELEMENT_NODE)
            .map(node => {
                const tagName = node.tagName.toLowerCase();
                const component = componentMap[tagName];
                if (component) {
                    const props = {};
                    if (node.attributes) {
                        Array.from(node.attributes).forEach(attr => {
                            try {
                                props[attr.name] = JSON.parse(attr.value);
                            } catch (e) {
                                props[attr.name] = attr.value;
                            }
                        });
                    }

                    return h(component, { ...props });
                } else {
                    console.warn(`Component for tag <${tagName}> not found.`);
                    return null;
                }
            }).filter(Boolean);

        this.vueInstance = createApp({
            render() {
                return h('div', childComponents);
            }
        });

        this.vueInstance.use(vuetify);
{{#boundedContexts}}
    {{#aggregates}}
        this.vueInstance.component('{{boundedContext.nameCamelCase}}-{{nameCamelCase}}-manager', {{boundedContext.namePascalCase}}{{namePascalCase}}Manager);
        this.vueInstance.component('{{boundedContext.nameCamelCase}}-{{nameCamelCase}}-detail', {{boundedContext.namePascalCase}}{{namePascalCase}}Detail);
    {{/aggregates}}
    {{#readModels}}
        this.vueInstance.component('{{nameCamelCase}}-view', {{namePascalCase}}View);
        this.vueInstance.component('{{nameCamelCase}}-view-detail', {{namePascalCase}}ViewDetail);
    {{/readModels}}
{{/boundedContexts}}
        this.vueInstance.mount(this);
    }

    disconnectedCallback() {
        if (this.vueInstance) {
            this.vueInstance.unmount(); // Correct method to unmount in Vue 3
        }
    }
}

window.customElements.define('{{options.package}}-app', WebComponentElement);