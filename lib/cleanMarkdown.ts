export function cleanAndFlattenBulletsGoogle(md: string): string {
  
  return md
    .trim()
    .replace(/^---\s*/g, '')
    .replace(/\s*---$/g, '')
    .replace(/\n\s*\n/g, '\n\n');
}