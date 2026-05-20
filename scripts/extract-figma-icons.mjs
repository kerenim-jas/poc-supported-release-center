#!/usr/bin/env node
/** Fetch Figma MCP SVG assets and emit inline path data for JFrogIcons.tsx */

const ICONS = {
  SearchIcon: 'https://www.figma.com/api/mcp/asset/a44f621d-6602-4d1b-b0a7-2a9a3f31381b',
  ChevronRightIcon: 'https://www.figma.com/api/mcp/asset/31b0df59-cf2f-40a6-b466-4468f5aedd2f',
  InfoIcon: 'https://www.figma.com/api/mcp/asset/056ffe32-e6bf-4f73-9674-f2ec0dd7d258',
  CloseIcon: 'https://www.figma.com/api/mcp/asset/d316dece-51a2-44e6-8949-52db93101a2e',
  FilterIcon: 'https://www.figma.com/api/mcp/asset/4dcfe47b-afeb-462d-8882-fca8f66afcb1',
  SeverityUnknownIcon: 'https://www.figma.com/api/mcp/asset/ac4ffa13-be7f-4e85-b5ac-f8e62d5ae74c',
};

function normalizeSvg(svg, viewBox = '0 0 16 16') {
  return svg
    .replace(/var\(--stroke-0,\s*[^)]+\)/g, 'currentColor')
    .replace(/var\(--fill-0,\s*[^)]+\)/g, 'currentColor')
    .replace(/stroke="#[^"]+"/g, 'stroke="currentColor"')
    .replace(/fill="#[^"]+"/g, (m) => (m.includes('none') ? m : 'fill="currentColor"'))
    .replace(/<svg[^>]*>/, `<svg width={size} height={size} viewBox="${viewBox}" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">`)
    .replace(/<g[^>]*>/g, '')
    .replace(/<\/g>/g, '')
    .replace(/id="[^"]*"/g, '')
    .trim();
}

async function fetchSvg(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.text();
}

function extractViewBox(svg) {
  const m = svg.match(/viewBox="([^"]+)"/);
  return m ? m[1] : '0 0 16 16';
}

function extractInner(svg) {
  const inner = svg.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '').trim();
  return inner;
}

const header = `/* Auto-generated from Figma LeapKit / Live Assessment canvas — v0.8 */
import type { SVGProps } from "react";

export type JFrogIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  className?: string;
};

function iconProps({ size = 16, className, ...rest }: JFrogIconProps) {
  return { width: size, height: size, className, "aria-hidden": true as const, ...rest };
}
`;

let body = '';
for (const [name, url] of Object.entries(ICONS)) {
  const svg = await fetchSvg(url);
  const viewBox = extractViewBox(svg);
  const inner = extractInner(svg)
    .replace(/stroke="var\(--stroke-0[^"]*"/g, 'stroke="currentColor"')
    .replace(/stroke="#[^"]+"/g, 'stroke="currentColor"');
  body += `
export function ${name}({ size = 16, className, ...rest }: JFrogIconProps) {
  return (
    <svg {...iconProps({ size, className, ...rest })} viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">
      ${inner}
    </svg>
  );
}
`;
}

console.log(header + body);
