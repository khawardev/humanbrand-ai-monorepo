export function cleanAndFlattenBulletsGoogle(md: string): string {
  const flattenRegex = /^(\s*[-*]\s+\*\*.+?:\*\*)\s*\n\s*/gm;
  
  return md
    .trim()
    .replace(/^---\s*/g, '')
    .replace(/\s*---$/g, '')
    .replace(flattenRegex, '$1 ')
    .replace(/^(\s*[-*]\s+\*\*[^:]+)\*\*:\s*/gm, '$1**: ')
    .replace(/\n\s*\n/g, '\n\n')
    .replace(/^(\s*[-*]\s+\*\*[^*]+\*\*)\s*:\s*/gm, '$1 ');
}


export function cleanAndFlattenBullets(md: string): string {
  const multiLineBulletRegex =
    /^(\s*[-*]\s+\*\*.+?:\*\*)\s*\n\s*(\S.*)/gm;

  return md
    .trim()
    .replace(multiLineBulletRegex, '$1 $2');
}