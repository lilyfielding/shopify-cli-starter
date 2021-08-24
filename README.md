# Shopify CLI Starter

A blank theme to get you started with Shopify theme dev, featuring TailwindCSS. Built ontop of [Theme Lab](https://github.com/uicrooks/shopify-theme-lab).

## Background
* With the release of [Online Store 2.0](https://www.shopify.com/partners/blog/shopify-online-store) and the new starter theme, [Dawn](https://github.com/Shopify/dawn), Shopify have really leaned into the idea of using [theme sections](https://shopify.dev/themes/architecture/sections) as individual components.
* Each section file in Dawn imports its own JS and CSS files. This means that the browser is only rendering the styles and scripts necessary for this section, improving not just site performance but also the customizer experience for merchants.
* The concept for this starter was to enable a similar **"section first"** approach to theme development. Each section has a corresponding JS and CSS file, which get compiled to the `/assets` directory. The minifyed assets are then imported into the section using the [asset_url](https://shopify.dev/api/liquid/filters/html-filters) filter.

## Getting Started
1. Ensure you have the following prerequisites installed:
    * [Ruby v2.7+](https://www.ruby-lang.org/en/)
    * [Shopify CLI v2+](https://shopify.dev/themes/tools/cli/installation)
    * [Node.js v14+](https://nodejs.org/en/)
2. Run `shopify login --store <your-store.myshopify.com>`
3. Clone this repo or enter the following command: `shopify theme init -u https://github.com/lilyfielding/shopify-cli-starter.git`
4. Run `npm install`
5. Run `npm run start`

## File Structure
```
shopify-cli-starter/
├─ .config/                   📁 development environment files and configs
│  ├─ webpack/                📁 webpack configs
│  │   ├─ webpack.common.js   📄 webpack shared config
│  │   ├─ webpack.dev.js      📄 webpack development config
│  │   └─ webpack.prod.js     📄 webpack production config
│  ├─ .browserslistrc         
│  ├─ .eslintrc.js            
│  ├─ .stylelintrc.js         
│  └─ postcss.config.js       
├─ shopify/                   📁 default Shopify theme structure
│  ├─ assets/                 📁 files outputted by webpack will be placed here
│  ├─ sections/               📁 sections outputted by webpack will be placed here (more below)
│  └─ ...
├─ src/                       📁 source files processed by webpack
│  ├─ css/                    📁 css directory – all global CSS goes here
│  ├─ js/                     📁 js directory – all global JS goes here
│  ├─ sections/
│  │  ├─ liquid/              📁 put the liquid code for each section here
│  │  │  └─ hero.liquid
│  │  ├─ schema/              📁 put the schema code for each section here
│  │  │  └─ hero.js
│  │  ├─ scripts/             📁 put the JS code for each section here
│  │  │  └─ hero.js
│  │  └─ styles/              📁 put the CSS code for each section here
│  │     └─ hero.css
│  ├─ global.css              📄 the global css file (imports tailwind stylesheets and all files in /css)
│  ├─ global.js               📄 the global js file (and entry point for webpack)
│  └─ tailwind.config.js      📄 customizable tailwind config
├─ .gitignore                 
├─ package.json
└─ ...
```

## Section Markup
* The starter is using the [Liquid Schema Plugin](https://github.com/davidwarrington/liquid-schema-plugin). This allows us to write the schema for each section in JS, so we can do things like repeat certain customizer fields across multiple sections without having to write the same code every time.
  * Please refer to [this blog post](https://ellodave.dev/blog/2020/10/14/building-shopify-section-schemas-with-javascript/) for more use-cases and capabilities.
* The plugin will look for section files in the `./src/sections/liquid` directory, and output these to `./shopify/sections`.
* The schema for each section is written in its own JS file in `./src/sections/schema` like so:
  ```
  // ./src/sections/schema/hero.js
  
  module.exports = {
    name: 'Hero Banner',
    settings: [
      {
        label: 'Title',
        id: 'title',
        type: 'text'
      }
    ]
  }
  ```
* We then import the schema into the section's liquid file like so:
  ```
  // ./src/sections/liquid/hero.liquid
    
  <div class="hero"></div>
    
  {% schema 'hero' %}
  ```
* The outputted section file will look like the following:
  ```
  // ./shopify/sections/hero.liquid
    
  <div class="hero"></div>
    
  {% schema %}
    {
      "name: "Hero Banner",
      "settings": [
        {
          "label": "Title",
          "id": "title",
          "type": "text"
        }
      ]
    }
  {% endschema %)
  ```
  
## Section Assets
* Each of the JS files in `./src/sections/scripts` will be minified by webpack and outputted to the `./shopify/assets` folder like so: `[file_name].section.js`
  * **Please Note:** The development server will need to be restarted every time you add a new script.
* Any CSS files included in the javascript will also be outputted to `./shopify/assets` like so: `[file_name].section.js`
  * Since Webpack is JS focussed, each CSS file will need to be imported into a JS file for this to work, even if there is no javascript associated with the section.
* The minified assets should then be included in each section like so:
  ```
  // ./src/sections/liquid/hero.liquid
  
  <div class="hero"></div>
  
  {% schema 'hero' %}
  {{ 'hero.section.css' | asset_url | stylesheet_tag }}
  {{ 'hero.section.js' | asset_url | script_tag }}
  ```
