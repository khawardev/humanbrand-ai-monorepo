export function cleanAndFlattenBullets(md: string): string {
  const multiLineBulletRegex =
    /^(\s*[-*]\s+\*\*.+?:\*\*)\s*\n\s*(\S.*)/gm;

  return md
    .trim()
    .replace(multiLineBulletRegex, '$1 $2');
}