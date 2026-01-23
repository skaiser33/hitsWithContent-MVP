# HitsWithContent POC

## Get started

Create a .env file and populate the two variables with your app ID and search-only API key

```sh
VITE_ALGOLIA_ID=
VITE_ALGOLIA_SEARCH_KEY=
```

In the `src/App.jsx` file, you will then need to change:

- the `indexName` value in the `<InstantSearch/>` widget to reflect the name of your own index
- the `attribute` value in the `<RefinementList/>` widget to reflet the name of one of your index's attributes for faceting

Lastly, in `src/components/Hit.jsx`, you will need to modify any referenced attributes to reflect your own index's record structure.

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

Open http://localhost:3000 to see your app.
