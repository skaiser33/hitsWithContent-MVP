import {
  Configure,
  Highlight,
  Hits,
  HitsPerPage,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
} from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';

import './App.css';
import HitsWithContent from './components/HitsWithContent';

const algoliaAppId = import.meta.env.VITE_ALGOLIA_ID;
const algoliaSearchKey = import.meta.env.VITE_ALGOLIA_SEARCH_KEY;
const searchClient = algoliasearch(
  // 'B1G2GM9NG0',
  algoliaAppId,
  algoliaSearchKey
);

function App() {
  return (
    <div className='container'>
      {/* <HitsWithComponent /> */}
      <InstantSearch
        searchClient={searchClient}
        indexName='demo_ecommerce'
        insights={true}
      >
        <Configure hitsPerPage={20} />
        <div className='search-panel'>
          <div className='search-panel__filters'>
            <RefinementList attribute='brand' />
          </div>

          <div className='search-panel__results'>
            <SearchBox className='searchbox' placeholder='Search' />
            <HitsPerPage
              items={[
                { label: '20 per page', value: 20, default: true },
                { label: '40 per page', value: 40 },
              ]}
            />
            <HitsWithContent />
            {/* <Hits hitComponent={Hit} /> */}
            <div className='pagination'>
              <Pagination />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}

function Hit({ hit, sendEvent }) {
  return (
    <div>
      <Highlight attribute='name' hit={hit} />
      <button
        type='button'
        onClick={() => {
          sendEvent('click', hit, 'Product Added');
        }}
      >
        Add to cart
      </button>
      <button
        type='button'
        onClick={() => {
          sendEvent('conversion', hit, 'Product Ordered');
        }}
      >
        Order
      </button>
    </div>
  );
}

export default App;
