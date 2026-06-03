function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function splitLines(text: string, maxChars: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length <= maxChars || currentLine.length === 0) {
      currentLine = nextLine;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.slice(0, 3);
}

export function createRecommendationArt({
  title,
  subtitle,
  accent,
  background,
}: {
  title: string;
  subtitle: string;
  accent: string;
  background: string;
}) {
  const lines = splitLines(title, 15);
  const titleTspans = lines
    .map(
      (line, index) =>
        `<tspan x="24" dy="${index === 0 ? 0 : 20}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="440" viewBox="0 0 320 440" fill="none">
      <rect width="320" height="440" rx="28" fill="${background}"/>
      <rect x="20" y="20" width="280" height="400" rx="22" fill="rgba(255,255,255,0.72)" stroke="rgba(154,140,110,0.18)" stroke-width="2"/>
      <circle cx="262" cy="58" r="24" fill="${accent}" fill-opacity="0.18"/>
      <circle cx="52" cy="386" r="34" fill="${accent}" fill-opacity="0.12"/>
      <path d="M38 118C72 90 111 76 155 76C210 76 250 96 282 128" stroke="${accent}" stroke-opacity="0.55" stroke-width="6" stroke-linecap="round"/>
      <text x="24" y="64" fill="#9a8c6e" font-family="Georgia, serif" font-size="16" font-weight="700" letter-spacing="2">RUH COMPASS</text>
      <text x="24" y="192" fill="#111111" font-family="Georgia, serif" font-size="30" font-weight="700">${titleTspans}</text>
      <text x="24" y="340" fill="#6b7280" font-family="Arial, sans-serif" font-size="18" font-weight="600">${escapeXml(subtitle)}</text>
      <rect x="24" y="360" width="120" height="4" rx="2" fill="${accent}" fill-opacity="0.65"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
