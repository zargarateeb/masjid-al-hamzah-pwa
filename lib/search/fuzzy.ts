/** Levenshtein distance — how many character edits to turn a into b. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const prev = new Array(b.length + 1).fill(0);
  const curr = new Array(b.length + 1).fill(0);

  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,       // insertion
        prev[j] + 1,           // deletion
        prev[j - 1] + cost     // substitution
      );
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }

  return prev[b.length];
}

/**
 * Score how well `query` matches `text`. Higher = better.
 * - 100+: exact substring match
 * - 50-99: fuzzy match on individual words
 * - 0: no match
 * Case-insensitive. Tolerates typos proportional to word length.
 */
export function fuzzyScore(query: string, text: string): number {
  if (!query || !text) return 0;
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();

  // Exact substring — highest score
  if (t.includes(q)) {
    // Bonus if it starts with the query
    return t.startsWith(q) ? 150 : 120;
  }

  // Word-by-word fuzzy
  const qWords = q.split(/\s+/).filter(Boolean);
  const tWords = t.split(/\s+/).filter(Boolean);

  let totalScore = 0;
  for (const qw of qWords) {
    let bestWordScore = 0;
    for (const tw of tWords) {
      // Tolerate 1 typo per 3 chars, minimum 1
      const tolerance = Math.max(1, Math.floor(qw.length / 3));
      const dist = levenshtein(qw, tw);
      if (dist <= tolerance) {
        const score = 100 - dist * 15;
        if (score > bestWordScore) bestWordScore = score;
      }
    }
    totalScore += bestWordScore;
  }

  return totalWordsMatched(qWords, totalScore) ? totalScore / qWords.length : 0;
}

function totalWordsMatched(qWords: string[], _score: number): boolean {
  // Require at least one word to match, not necessarily all
  return qWords.length > 0;
}