interface HasPosition {
  position: number;
  targetUrl: string;
  imageUrl: string;
  contentId: string;
}

export default function normalizePositions<T extends HasPosition>(
  items: readonly T[]
): T[] {
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
