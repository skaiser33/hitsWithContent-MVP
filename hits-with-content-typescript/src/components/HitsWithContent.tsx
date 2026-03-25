import { useHits, useInstantSearch } from 'react-instantsearch';

import Hit from './Hit';
import Banner from './Banner';
import normalizePositions from '../logic/normalizePositions';

type HitsWithContentProps = {
  defaultContent?: {
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
  contentSpaces?: 1 | 2 | 3;
};

/**
 * Detects userData returned from Rule.
 */
function useUserData() {
  const { results } = useInstantSearch();
  return results?.userData ?? [];
}

export default function HitsWithContent({
  defaultContent,
  injectionObject,
  ruleOverride = true,
  contentSpaces = 1, // Default value set to 1
}: HitsWithContentProps) {
  const { items } = useHits();
  const { indexUiState, results } = useInstantSearch(); // add uiState if you want to inspect hitsPerPage, etc.
  /**
   * Normalizes userQuery for matching against injectionObject.
   */
  const userQuery: string = (indexUiState.query ?? '').toLowerCase();

  const userData = useUserData();

  // TODO: WHAT VALIDATION STEPS DO WE NEED HERE FOR THE USERDATA? AND HOW DO WE COMMUNICATE THEM TO THE CUSTOMER?

  /**
   * Sorts objects by `position` and ensures positions are strictly increasing
   * by minimally incrementing duplicates.
   */
  const normalizedInjectionArray =
    ruleOverride && userData.length && userData[0].banners.length > 0
      ? normalizePositions(userData[0].banners)
      : normalizePositions(
          injectionObject?.[userQuery as keyof typeof injectionObject]
            ? injectionObject?.[userQuery as keyof typeof injectionObject]
            : (defaultContent ?? []),
        );

  const positionsArray = normalizedInjectionArray.map(
    (item) => item.position,
  ) ?? [5, 10, 15];

  const contentArray =
    normalizedInjectionArray.map((item) => (
      <a key={item.contentId} href={item.targetUrl} rel='noopener noreferrer'>
        <img
          src={item.imageUrl}
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            display: 'block',
            margin: '0 auto',
          }}
        />
      </a>
    )) ?? [];

  const insertionAfter = new Set(positionsArray); // 1-based positions
  const interleaved: React.ReactNode[] = [];

  // handles edge case where positions contains a 0
  if (insertionAfter.has(0)) {
    const bannerKey = `banner-p${results.page}-pos${0}`;
    const bannerId = '0';

    interleaved.push(
      <li
        key={bannerKey}
        className='ais-Injection-item'
        style={{
          width: `calc(${25 * contentSpaces}% - 1rem)`,
          height: '150px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Banner id={bannerId}>{contentArray.shift()}</Banner>
      </li>,
    );
  }
  items.forEach((hit, idx) => {
    interleaved.push(
      <li key={hit.objectID} className='ais-Hits-item'>
        <Hit hit={hit} />
      </li>,
    );

    const position = idx + 1;
    if (insertionAfter.has(position)) {
      const bannerKey = `banner-p${results.page}-pos${position}`;

      interleaved.push(
        <li
          key={bannerKey}
          className='ais-Injection-item'
          style={{
            width: `calc(${25 * contentSpaces}% - 1rem)`, // Adjust span based on contentSpaces
            height: '150px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Banner id={`banner-${position}`}>{contentArray.shift()}</Banner>
        </li>,
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
