import { useHits, usePagination, useInstantSearch } from 'react-instantsearch';

import Hit from './Hit';
import Banner from './Banner';

type HitsWithContentProps = {
  // contentTemplate: React.ReactNode;
  positions: readonly number[];
};

export default function HitsWithContent({}: // contentTemplate,
// positions,
HitsWithContentProps) {
  const { hits } = useHits();
  const { currentRefinement: currentPage } = usePagination();
  const { uiState, indexUiState } = useInstantSearch(); // uiState available if you want to inspect hitsPerPage, etc.

  // ***QUERY MATCHING WITHOUT RULES***
  const userQuery: string = (indexUiState.query ?? '').toLowerCase();

  // INJECTION OBJECT - to be refactored as prop
  // const injectionObject = {
  //   iphone: { bannerWord: 'iPhone' },
  //   samsung: { bannerWord: 'Samsung' },
  //   tv: { bannerWord: 'TV' },
  // };
  const injectionObject: Record<
    string,
    {
      key: string;
      position: number;
      imageUrl: string;
      targetUrl: string;
      bannerWord: string;
    }[]
  > = {
    default: [
      {
        key: 'default-01',
        position: 3,
        imageUrl: '../../../images/test-image-a.png',
        targetUrl: 'https://www.algolia.com/',
        bannerWord: 'default',
      },
    ],
    iphone: [
      {
        key: 'iphone-01',
        position: 3,
        imageUrl: '../../../images/test-image-a.png',
        targetUrl: 'https://www.algolia.com/',
        bannerWord: 'iPhone',
      },
      {
        key: 'iphone-02',
        position: 2,
        imageUrl: '../../../images/test-image-b.png',
        targetUrl: 'https://www.algolia.com/',
        bannerWord: 'More iPhone',
      },
    ],
    samsung: [
      {
        key: 'samsung-01',
        position: 4,
        imageUrl: '../../../images/test-image-b.png',
        targetUrl: 'https://www.google.com/',
        bannerWord: 'Samsung',
      },
    ],
  };

  interface HasPosition {
    position: number;
  }

  /**
   * Sorts objects by `position` and ensures positions are strictly increasing
   * by minimally incrementing duplicates (cascading increments handled).
   */
  function normalizePositions<T extends HasPosition>(items: readonly T[]): T[] {
    // Shallow clone to avoid mutating inputs
    const copy: T[] = items.map((item) => ({
      ...item,
      position: Math.floor(item.position),
    }));

    // Sort ascending by position
    copy.sort((a, b) => a.position - b.position);

    // Ensure strictly increasing positions
    for (let i = 1; i < copy.length; i++) {
      if (copy[i].position <= copy[i - 1].position) {
        copy[i].position = copy[i - 1].position + 1;
      }
    }

    return copy;
  }

  const normalizedInjectionArray = normalizePositions(
    injectionObject[userQuery as keyof typeof injectionObject]
      ? injectionObject[userQuery as keyof typeof injectionObject]
      : injectionObject['default'] ?? []
  );

  console.log('normalizedInjectionArray', normalizedInjectionArray);

  const positionsArray = normalizedInjectionArray.map(
    (item) => item.position
  ) ?? [5, 10, 15];

  // function sortAndDeduplicatePositions(positions: number[]) {
  //   if (!Array.isArray(positions)) return [5, 10, 15];

  //   // Step 1: sort ascending
  //   const sorted = [...positions].sort((a, b) => a - b);

  //   // Step 2: ensure strictly increasing
  //   for (let i = 1; i < sorted.length; i++) {
  //     if (sorted[i] <= sorted[i - 1]) {
  //       sorted[i] = sorted[i - 1] + 1;
  //     }
  //   }

  //   return sorted;
  // }

  // const positionsArray = sortAndDeduplicatePositions(
  //   positionsFromInjectionObject
  // );
  // const contentArray = injectionObject[
  //   userQuery as keyof typeof injectionObject
  // ]
  //   ? injectionObject[userQuery as keyof typeof injectionObject].map(
  //       (item) => ({ imageUrl: item.imageUrl })
  //     )
  //   : injectionObject['default'].map((item) => ({ imageUrl: item.imageUrl })) ??
  //     [];
  // const contentArray = injectionObject[
  //   userQuery as keyof typeof injectionObject
  // ]
  //   ? injectionObject[userQuery as keyof typeof injectionObject].map((item) => (
  //       <div>
  //         Banner_for_
  //         <strong>{item.bannerWord}</strong>{' '}
  //         <a href={item.targetUrl} rel='noopener noreferrer'>
  //           <img src={item.imageUrl} />
  //         </a>
  //       </div>
  //     ))
  //   : injectionObject['default'].map((item) => (
  //       <div>
  //         Banner_for_
  //         <strong>{item.bannerWord}</strong>{' '}
  //         <a href={item.targetUrl} rel='noopener noreferrer'>
  //           <img src={item.imageUrl} />
  //         </a>
  //       </div>
  //     )) ?? [];
  const contentArray =
    normalizedInjectionArray.map((item) => (
      <div>
        Banner_for_
        <strong>{item.bannerWord}</strong>{' '}
        <a href={item.targetUrl} rel='noopener noreferrer'>
          <img src={item.imageUrl} />
        </a>
      </div>
    )) ?? [];

  console.log('contentArray', contentArray);

  // const contentTemplate: React.ReactNode = (
  //   <div>
  //     Banner_for_
  //     <strong>
  //       {injectionObject[userQuery as keyof typeof injectionObject]?.[0]
  //         ?.bannerWord ?? injectionObject['default']?.[0]?.bannerWord}
  //     </strong>{' '}
  //     <a href='https://example.com' rel='noopener noreferrer'>
  //       <img src={'../../../images/test-image-a.png'} />
  //     </a>
  //   </div>
  // );
  // console.log('uiState', uiState);
  // console.log('index,UiState', indexUiState);

  // const insertionAfter = new Set(positions);
  const insertionAfter = new Set(positionsArray); // 1-based positions
  const interleaved: React.ReactNode[] = [];

  // handles edge case where positions contains a 0
  if (insertionAfter.has(0)) {
    const bannerKey = `banner-p${currentPage}-pos${0}`;
    const bannerId = '0';

    interleaved.push(
      <li key={bannerKey} className='ais-Hits-item'>
        {/* <Banner id={bannerId}>{contentTemplate}</Banner> */}
        <Banner id={bannerId}>{contentArray.shift()}</Banner>
      </li>
    );
  }
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
          <Banner id={bannerId}>{contentArray.shift()}</Banner>
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
