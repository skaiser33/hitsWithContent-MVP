import { useHits, usePagination, useInstantSearch } from 'react-instantsearch';

import Hit from './Hit';
import Banner from './Banner';

type HitsWithContentProps = {
  injectionObject: Record<
    string,
    {
      key: string;
      position: number;
      imageUrl: string;
      targetUrl: string;
    }[]
  >;
  ruleOverride?: boolean;
};

export default function HitsWithContent({
  injectionObject,
  ruleOverride = true,
}: HitsWithContentProps) {
  const { hits } = useHits();
  const { currentRefinement: currentPage } = usePagination();
  const { uiState, indexUiState } = useInstantSearch(); // uiState available if you want to inspect hitsPerPage, etc.

  // ***QUERY MATCHING WITHOUT RULES***
  const userQuery: string = (indexUiState.query ?? '').toLowerCase();

  /**
   * Detects userData returned from Rule.
   */
  function useUserData() {
    const { results } = useInstantSearch();

    return results?.userData ?? [];
  }

  const userData = useUserData();

  /**
   * Sorts objects by `position` and ensures positions are strictly increasing
   * by minimally incrementing duplicates (cascading increments handled).
   */
  interface HasPosition {
    position: number;
  }
  function normalizePositions<T extends HasPosition>(items: readonly T[]): T[] {
    const copy: T[] = items.map((item) => ({
      ...item,
      position: Math.floor(item.position),
    }));

    copy.sort((a, b) => a.position - b.position);

    for (let i = 1; i < copy.length; i++) {
      if (copy[i].position <= copy[i - 1].position) {
        copy[i].position = copy[i - 1].position + 1;
      }
    }

    return copy;
  }

  // TODO: WHAT VALIDATION STEPS DO WE NEED HERE FOR THE USERDATA? AND HOW DO WE COMMUNICATE THEM TO THE CUSTOMER?
  const normalizedInjectionArray =
    ruleOverride && userData.length && userData[0].banners.length > 0
      ? normalizePositions(userData[0].banners)
      : normalizePositions(
          injectionObject[userQuery as keyof typeof injectionObject]
            ? injectionObject[userQuery as keyof typeof injectionObject]
            : injectionObject['default'] ?? []
        );

  const positionsArray = normalizedInjectionArray.map(
    (item) => item.position
  ) ?? [5, 10, 15];

  const contentArray =
    normalizedInjectionArray.map((item) => (
      <div>
        {/* Banner_for_ */}
        {/* <strong>{item.bannerWord}</strong>{' '} */}
        <a href={item.targetUrl} rel='noopener noreferrer'>
          <img src={item.imageUrl} />
        </a>
      </div>
    )) ?? [];

  const insertionAfter = new Set(positionsArray); // 1-based positions
  const interleaved: React.ReactNode[] = [];

  // handles edge case where positions contains a 0
  if (insertionAfter.has(0)) {
    const bannerKey = `banner-p${currentPage}-pos${0}`;
    const bannerId = '0';

    interleaved.push(
      <li key={bannerKey} className='ais-Hits-item'>
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
