import { useHits, usePagination, useInstantSearch } from 'react-instantsearch';

import Hit from './Hit';
import Banner from './Banner';

type HitsWithContentProps = {
  defaultContent: {
    contentId: string;
    position: number;
    imageUrl: string;
    targetUrl: string;
  }[];
  injectionObject?: Record<
    string,
    {
      contentId: string;
      position: number;
      imageUrl: string;
      targetUrl: string;
    }[]
  >;
  ruleOverride?: boolean;
};

export default function HitsWithContent({
  defaultContent,
  injectionObject,
  ruleOverride = true,
}: HitsWithContentProps) {
  const { items } = useHits();
  const { currentRefinement: currentPage } = usePagination();
  const { indexUiState } = useInstantSearch(); // add uiState if you want to inspect hitsPerPage, etc.

  /**
   * Normalizes userQuery for matching against injectionObject.
   */
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
   * by minimally incrementing duplicates.
   */
  interface HasPosition {
    contentId: string;
    position: number;
    targetUrl: string;
    imageUrl: string;
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
          injectionObject?.[userQuery as keyof typeof injectionObject]
            ? injectionObject?.[userQuery as keyof typeof injectionObject]
            : defaultContent ?? []
        );

  const positionsArray = normalizedInjectionArray.map(
    (item) => item.position
  ) ?? [5, 10, 15];

  const contentArray =
    normalizedInjectionArray.map((item) => (
      <div key={item.contentId}>
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
  items.forEach((hit, idx) => {
    interleaved.push(
      <li key={hit.objectID} className='ais-Hits-item'>
        <Hit hit={hit} />
      </li>
    );

    const position = idx + 1;
    if (insertionAfter.has(position)) {
      const bannerKey = `banner-p${currentPage}-pos${position}`;

      interleaved.push(
        <li key={bannerKey} className='ais-Hits-item'>
          <Banner id={`banner-${position}`}>{contentArray.shift()}</Banner>
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
