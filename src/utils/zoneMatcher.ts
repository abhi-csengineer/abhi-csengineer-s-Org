export function matchCampusZone(filterZone: string, itemZone: string): boolean {
  if (!filterZone || filterZone === 'all') return true;
  if (filterZone.toLowerCase() === itemZone.toLowerCase()) return true;

  const f = filterZone.toLowerCase();
  const it = itemZone.toLowerCase();

  // Cross-mapping between short zone names and long official zone names
  if (f.includes('library') && it.includes('library')) return true;
  if ((f.includes('stem') || f.includes('quad') || f.includes('science')) && (it.includes('stem') || it.includes('quad') || it.includes('science'))) return true;
  if (f.includes('union') && it.includes('union')) return true;
  if (f.includes('athletic') && (it.includes('athletic') || it.includes('recreation'))) return true;
  if (f.includes('north') && it.includes('north')) return true;
  if (f.includes('south') && it.includes('south')) return true;
  if ((f.includes('residence') || f.includes('residential') || f.includes('dorm')) && (it.includes('residence') || it.includes('residential') || it.includes('dorm'))) return true;
  if ((f.includes('transit') || f.includes('parking')) && (it.includes('transit') || it.includes('parking') || it.includes('grounds'))) return true;

  return it.includes(f) || f.includes(it);
}
