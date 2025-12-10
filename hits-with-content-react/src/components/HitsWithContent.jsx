import {
  Hits,
  useHits,
  usePagination,
  useInstantSearch,
  HitsPerPage,
} from 'react-instantsearch';

import Hit from './Hit';
import Banner from './Banner';

export default function HitsWithContent() {
  const { hits } = useHits();
  const { currentRefinement: currentPage } = usePagination();
  const { uiState } = useInstantSearch(); // available if you want to inspect hitsPerPage, etc.a

  const insertionAfter = new Set([5, 10, 15]); // 1-based positions
  const interleaved = [];

  hits.forEach((hit, idx) => {
    interleaved.push(
      <li key={hit.objectID} className='ais-Hits-item'>
        <Hit hit={hit} />
      </li>
    );

    const position = idx + 1;
    if (insertionAfter.has(position)) {
      const bannerKey = `banner-p${currentPage}-pos${position}`;
      const bannerId = position === 5 ? 'A' : position === 10 ? 'B' : 'C';

      interleaved.push(
        <li key={bannerKey} className='ais-Hits-item'>
          <Banner id={bannerId}>
            <div className=' text-sm'>
              <strong>Sponsored</strong> · Banner {bannerId} (after result{' '}
              {position})
            </div>
          </Banner>
        </li>
      );
    }
  });
  return (
    <>
      <div className='ais-Hits'>
        <ul className='ais-Hits-list'>{interleaved}</ul>
      </div>
    </>
  );
}
