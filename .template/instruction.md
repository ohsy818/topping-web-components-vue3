## Create a Web Component based on Vue.js 3 + Vite + Vuetify
Create a reusable custom element and use it wherever you want.

### How to create web components
```
# frontend
npm install
npm run dev
npm run start
```
You can now use web components: &lt;component-name&gt;&lt;/component-name&gt;

If you want to rename a web components, modify {{component-name}} in the following files.
```
-- frontend/vite.config.js
  /** ... existing code ... */
  build: {
    lib: {
      entry: './src/web-component.js',
      name: '{{component-name}}App',
      fileName: () => '{{component-name}}-app.js',
      formats: ['umd'],
    },
  },
  /** ... existing code ... */


-- frontend/src/web-component.js
/** ... existing code ... */
window.customElements.define('{{component-name}}', WebComponentElement);
```

After modifying the component name, npm run dev and npm run start again.


### How to use web components for other projects

#### 1. Load Web Components from HTML Files
To use Web Components built from other projects or HTML files, load the components through the &lt;script&gt; tag.

- Add the required libraries, such as Vuetify, Vue.js, to the &lt;head&gt; tag.
- Add files of built Web Components within the &lt;body&gt; tag as &lt;script&gt;.

```
<head>
    <!-- Vuetify, Vue.js -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vuetify@3.x/dist/vuetify.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css" />
    <link rel="stylesheet" href="https://fonts.bunny.net/css?family=roboto:400,500,700" />
    <script type="importmap">
    {
      "imports": {
        "vue": "https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.esm-browser.js",
        "vuetify": "https://cdn.jsdelivr.net/npm/vuetify@3.x/dist/vuetify.esm.js"
      }
    }
    </script>
</head>
<body>
    <!-- built Web Components file -->
    <script src="http://localhost:8080/component-name.js"></script>
</body>
```

#### 2. Using Web Components

Built Web Components can be used like HTML tags. Below is an example of using Web Components.

```
<component-name>
    <child-component-name></child-component-name>
</component-name>


-- Example of Use
<template>
    <review-app>
        <!-- The JSON Object must be converted to a string using JSON.stringify() -->
        <review-review-cards
            :value="JSON.stringify(reviewData)"
            :show-reviews="showReviews" 
        ></review-review-cards>
    </review-app>
</template>

<script>
/** ... existing code ... */
    data: () => ({
        reviewData: {
          itemId: 1,
          userId: "user1",
        },
        showReviews: true
    })
/** ... existing code ... */
</script>
```
"review-review-cards" is a component registered with a Vue instance defined as a Web component, and the vue component that you want to use as a Web component must be registered with 'web-component.js'.

```
-- frontend/src/web-component.js
// ... existing code ...
import ReviewReviewCards from './components/ReviewReviewCards'
// ... existing code ...

class WebComponentElement extends HTMLElement {
  // ... existing code ...
  connectedCallback() {
    const componentMap = {
      'review-review-cards': ReviewReviewCards
    }
    // ... existing code ...
    this.vueInstance.component('review-review-cards', ReviewReviewCards);
    // ... existing code ...        
  }
  // ... existing code ...
}
```
