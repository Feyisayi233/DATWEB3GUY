/**
 * Parse HTML participation steps into structured data
 */

export interface ParsedStep {
  index: number;
  title: string;
  content: string;
  html: string;
}

/**
 * Parse participationSteps HTML into an array of steps
 */
export function parseParticipationSteps(html: string): ParsedStep[] {
  if (!html || html.trim().length === 0) {
    return [];
  }

  const steps: ParsedStep[] = [];
  
  // Server-side parsing (regex-based approach)
  // Try to extract list items from ordered lists
  // Use a more robust regex that handles nested tags and images
  const orderedListRegex = /<ol[^>]*>([\s\S]*?)<\/ol>/gi;
  const olMatch = orderedListRegex.exec(html);
  if (olMatch) {
    // Match list items, including nested content (images, links, etc.)
    // This regex handles nested tags by matching everything between <li> and </li>
    const listItemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let match;
    let index = 0;
    
    while ((match = listItemRegex.exec(olMatch[1])) !== null) {
      // Get the full HTML content (including images and nested tags)
      const htmlContent = match[1].trim();
      // Get text content for title (strip HTML tags for title only)
      const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
      if (textContent || htmlContent.trim()) {
        steps.push({
          index: index++,
          title: textContent.split('\n')[0].substring(0, 50) + (textContent.length > 50 ? '...' : '') || `Step ${index}`,
          content: textContent,
          html: htmlContent, // Preserve full HTML including images
        });
      }
    }
    if (steps.length > 0) return steps;
  }

  // Try unordered lists
  const unorderedListRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;
  const ulMatch = unorderedListRegex.exec(html);
  if (ulMatch) {
    // Match list items, including nested content (images, links, etc.)
    const listItemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let match;
    let index = 0;
    
    while ((match = listItemRegex.exec(ulMatch[1])) !== null) {
      // Get the full HTML content (including images and nested tags)
      const htmlContent = match[1].trim();
      // Get text content for title (strip HTML tags for title only)
      const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
      if (textContent || htmlContent.trim()) {
        steps.push({
          index: index++,
          title: textContent.split('\n')[0].substring(0, 50) + (textContent.length > 50 ? '...' : '') || `Step ${index}`,
          content: textContent,
          html: htmlContent, // Preserve full HTML including images
        });
      }
    }
    if (steps.length > 0) return steps;
  }

  // Try paragraphs with numbers
  const paragraphRegex = /<p[^>]*>(.*?)<\/p>/gi;
  let pMatch;
  let pIndex = 0;
  
  while ((pMatch = paragraphRegex.exec(html)) !== null) {
    // Get the full HTML content (including images)
    const htmlContent = pMatch[1];
    // Get text content for title (strip HTML tags for title only)
    const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
    if (textContent && (/^\d+[\.\)]\s/.test(textContent) || /^Step\s+\d+/i.test(textContent))) {
      steps.push({
        index: pIndex++,
        title: textContent.split('\n')[0].substring(0, 50) + (textContent.length > 50 ? '...' : ''),
        content: textContent,
        html: htmlContent, // Preserve full HTML including images
      });
    }
  }

  // If no structured format found, try extracting any list items
  if (steps.length === 0) {
    // Match list items, including nested content (images, links, etc.)
    const listItemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let match;
    let index = 0;
    
    while ((match = listItemRegex.exec(html)) !== null) {
      // Get the full HTML content (including images and nested tags)
      const htmlContent = match[1].trim();
      // Get text content for title (strip HTML tags for title only)
      const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
      if (textContent || htmlContent.trim()) {
        steps.push({
          index: index++,
          title: textContent.split('\n')[0].substring(0, 50) + (textContent.length > 50 ? '...' : '') || `Step ${index}`,
          content: textContent,
          html: htmlContent, // Preserve full HTML including images
        });
      }
    }
  }

  // Last resort: split by common separators
  if (steps.length === 0) {
    const lines = html
      .replace(/<[^>]*>/g, '\n')
      .split(/\n+/)
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.length > 10); // Filter out very short lines

    lines.forEach((line, idx) => {
      if (line.length > 0) {
        steps.push({
          index: idx,
          title: line.substring(0, 50) + (line.length > 50 ? '...' : ''),
          content: line,
          html: line,
        });
      }
    });
  }

  return steps;
}
