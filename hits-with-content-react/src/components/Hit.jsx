import {
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
} from 'react-instantsearch';

export default function Hit({ hit, sendEvent }) {
  return (
    <div>
      <Highlight attribute='name' hit={hit} />
    </div>
  );
}
