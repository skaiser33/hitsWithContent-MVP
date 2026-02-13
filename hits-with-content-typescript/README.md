# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

---

# HitsWithContent POC

## Get started

Create a .env file and populate the two variables with your app ID and search-only API key

```sh
VITE_ALGOLIA_ID=
VITE_ALGOLIA_SEARCH_KEY=
```

In the `src/App.tsx` file, you will then need to change:

- the `indexName` value in the `<InstantSearch/>` widget to reflect the name of your own index
- the `attribute` value in the `<RefinementList/>` widget to reflet the name of one of your index's attributes for faceting

Lastly, in `src/components/Hit.tsx`, you will need to modify any referenced attributes to reflect your own index's record structure.

---

To run this project locally, install the dependencies and run the local server:

```sh
npm install
npm start
```

Alternatively, you may use [Yarn](https://http://yarnpkg.com/):

```sh
yarn
yarn start
```

Open http://localhost:5173 to see your app.

---

### HitsWithContent Documentation

# Shows search results with non-record image content injected at specified positions.

---

```tsx Signature
<HitsWithContent
  // Optional props
  defaultContent={array of objects}
  injectionObject={object}
  ruleOverride={boolean}
  contentSpaces={integer}
/>
```

## About this widget

The `<HitsWithContent>` widget displays a list of results with non-record image content (ie: not indexed to Algolia) injected at specified positions. This could include banners, sponsored listings, etc.

This widget is compatible with `userData` values returned via Algolia rules (as described [here](https://www.algolia.com/doc/guides/managing-results/rules/merchandising-and-promoting/how-to/add-banners#create-a-rule-for-returning-custom-data)), but the consequence must be returned with a key of `"banners"` and a value of an array of objects that specifies the unique contentID, injection position, imageUrl, and targetUrl (if the user clicks on the image) for each content item. For example, the Custom JSON Data for the rule consequence could be:

```js JavaScript icon="code"
{
  "banners": [
    {
      contentId: 'myContent-01',
      position: 4,
      imageUrl: 'https://www.my-website.com/images/my-image-01.png',
      targetUrl: 'https://www.algolia.com/',
    },
    {
      contentId: 'myContent-02',
      position: 8,
      imageUrl: 'https://www.my-website.com/images/my-image-02.png',
      targetUrl: 'https://www.google.com/',
    },
  ]
}
```

## Examples

```tsx TypeScript
import { InstantSearch } from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';

import HitsWithContent from './components/HitsWithContent';

const searchClient = algoliasearch('YourApplicationID', 'YourSearchOnlyAPIKey');

function App() {
  return (
    <div className='container'>
      <InstantSearch searchClient={searchClient} indexName='demo_ecommerce'>
        <HitsWithContent
          defaultContent={myDefaultContent}
          injectionObject={myInjectionObject}
          ruleOverride={true}
          contentSpaces={2}
        />
      </InstantSearch>
    </div>
  );
}
```

## Props

**`defaultContent`**

type:
`{
    contentId: string; 
    position: number;
    imageUrl: string;
    targetUrl: string;
  }[]">`

An array of objects that specifies the unique contentID, injection position, imageUrl, and targetUrl (if the user clicks on the image) for each content item for any "default" query that does not (a) match a query in the `injectionObject` or (b) return `userData` via an Algolia rule.

When not provided, the widget displays the search results with no injected content for "default" / unmatched queries.

```tsx TypeScript icon="code"
const myDefaultContent: {
  contentId: string;
  position: number;
  imageUrl: string;
  targetUrl: string;
}[] = [
  {
    contentId: 'myContent-01',
    position: 4,
    imageUrl: 'https://www.my-website.com/images/my-image-01.png',
    targetUrl: 'https://www.algolia.com/',
  },
  {
    contentId: 'myContent-02',
    position: 8,
    imageUrl: 'https://www.my-website.com/images/my-image-02.png',
    targetUrl: 'https://www.google.com/',
  },
];
<HitsWithContent
  // ...
  defaultContent={myDefaultContent}
/>;
```

**`injectionObject`**

type:
`Record<
string,
{
contentId: string;
position: number;
imageUrl: string;
targetUrl: string;
}[]

> `

An object in which each key is a query string and a value is array of objects that specifies the unique contentID, injection position, imageUrl, and targetUrl (if the user clicks on the image) for each content item to be injected between hits when the end user enters that specific query.

By default, if one of the specified query strings returns `userData` via an Algolia rule, the `userData` values will be injected instead of the `injectionObject` content.

```tsx TypeScript icon="code"
const myInjectionObject: Record<
  string,
  {
    contentId: string;
    position: number;
    imageUrl: string;
    targetUrl: string;
  }[]
> = {
  iphone: [
    {
      contentId: 'iphone-01',
      position: 3,
      imageUrl: 'https://www.my-website.com/images/iphone-image-01.png',
      targetUrl: 'https://www.algolia.com/',
    },
    {
      contentId: 'iphone-02',
      position: 6,
      imageUrl: 'https://www.my-website.com/images/iphone-image-02.png',
      targetUrl: 'https://www.google.com/',
    },
  ],
  samsung: [
    {
      contentId: 'samsung-01',
      position: 4,
      imageUrl: 'https://www.my-website.com/images/samsung-image-01.png',
      targetUrl: 'https://www.algolia.com/',
    },
  ],
};
<HitsWithContent
  // ...
  injectionObject={myInjectionObject}
/>;
```

**`ruleOverride`**
type: `boolean` default:`true`

When set to `false`, content returned in `userData` via an Algolia rule will _not_ be injected in place of `injectionObject` or `defaultContent` content.

```tsx TypeScript icon="code"
<HitsWithContent
  // ...
  ruleOverride={false}
/>
```

**`contentSpaces`**
type: `integer` default:`1` maximum: `3` minimum: `1`

Compatible with the algolia-min.css theme.

When set to 2 or 3, the injected content will span the space of 2 or 3 hits respectively.

```tsx TypeScript icon="code"
<HitsWithContent
  // ...
  contentSpaces={2}
/>
```
