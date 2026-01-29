import {
  Configure,
  HitsPerPage,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
} from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';
import 'instantsearch.css/themes/satellite.css';

import './App.css';
import HitsWithContent from './components/HitsWithContent';

const algoliaAppId: string = import.meta.env.VITE_ALGOLIA_ID;
const algoliaSearchKey: string = import.meta.env.VITE_ALGOLIA_SEARCH_KEY;
const searchClient = algoliasearch(algoliaAppId, algoliaSearchKey);

function App() {
  return (
    <div className='container'>
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
            <HitsWithContent
            // contentTemplate={contentTemplate}
            // positions={positions}
            />
            <div className='pagination'>
              <Pagination />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}

export default App;
