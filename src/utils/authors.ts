import people from '@data/people.json';

interface ResolvedAuthor {
  name: string;
  url: string | null;
  isSelf: boolean;
}

const peopleData = people as Record<string, { name: string; url: string | null; role: string }>;

export type AuthorRef = string | { name: string; url?: string };

export function resolveAuthor(ref: AuthorRef): ResolvedAuthor {
  // Inline object — use directly
  if (typeof ref !== 'string') {
    return { name: ref.name, url: ref.url ?? null, isSelf: false };
  }

  // String ID — look up in people.json
  if (ref in peopleData) {
    const person = peopleData[ref];
    return {
      name: person.name,
      url: person.url,
      isSelf: person.role === 'self',
    };
  }

  // Unknown ID — derive name from kebab-case
  const name = ref.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return { name, url: null, isSelf: false };
}
