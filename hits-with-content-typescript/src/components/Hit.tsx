import { Highlight } from 'react-instantsearch';

import type { Hit } from 'instantsearch.js';

type HitProps = {
  hit: Hit;
};

export default function Hit({ hit }: HitProps) {
  return (
    <div>
      <Highlight attribute='name' hit={hit} />
    </div>
  );
}
