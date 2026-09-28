import { GoogleGenAI } from '@google/genai';
import { Item, SmartMatchResult } from '../types';

// Check if Gemini key is available in environment
const apiKey =
  (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
  import.meta.env?.VITE_GEMINI_API_KEY ||
  '';

/**
 * Heuristic fallback matching algorithm
 * Computes semantic similarity, location closeness, and date alignment
 */
export function calculateLocalMatch(lost: Item, found: Item): SmartMatchResult | null {
  if (lost.status === 'resolved' || found.status === 'resolved') {
    return null;
  }

  // 1. Category check
  const sameCategory = lost.category === found.category;
  if (!sameCategory && !(lost.category === 'Electronics' && found.category === 'Electronics')) {
    // Check if both might be bags or accessories
    const isLooseMatch =
      (lost.category === 'Clothing & Accessories' && found.category === 'Other') ||
      (lost.category === 'IDs & Cards' && found.category === 'Other');
    if (!isLooseMatch) return null;
  }

  // 2. Keyword extraction & token overlap
  const stopWords = new Set(['the', 'and', 'with', 'for', 'left', 'found', 'near', 'from', 'this', 'that', 'have', 'small', 'blue', 'black']);
  const extractTokens = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));

  const lostTokens = new Set([...extractTokens(lost.title), ...extractTokens(lost.description)]);
  const foundTokens = new Set([...extractTokens(found.title), ...extractTokens(found.description)]);

  const commonTokens: string[] = [];
  lostTokens.forEach((t) => {
    if (foundTokens.has(t)) {
      commonTokens.push(t);
    }
  });

  // Key tokens carrying heavy weight
  const brandKeywords = ['macbook', 'apple', 'airpods', 'pro', 'wallet', 'hydroflask', 'flask', 'keys', 'fob', 'calculator', 'ray-ban', 'glasses', 'backpack', 'borealis'];
  const matchedBrands = commonTokens.filter((t) => brandKeywords.includes(t));

  // 3. Zone and location overlap
  const sameZone = lost.campusZone === found.campusZone;
  const locationKeywordMatch = extractTokens(lost.location).some((t) => extractTokens(found.location).includes(t));

  // 4. Date difference (in days)
  const lostDate = new Date(lost.date).getTime();
  const foundDate = new Date(found.date).getTime();
  const diffDays = Math.abs(foundDate - lostDate) / (1000 * 3600 * 24);

  // Scoring
  let score = 0;
  const matchedAttributes: string[] = [];

  if (sameCategory) {
    score += 25;
    matchedAttributes.push(`Same Category (${lost.category})`);
  }

  if (matchedBrands.length > 0) {
    score += Math.min(35, matchedBrands.length * 15);
    matchedAttributes.push(`Shared identifiers: "${matchedBrands.join(', ')}"`);
  } else if (commonTokens.length >= 2) {
    score += Math.min(25, commonTokens.length * 8);
    matchedAttributes.push(`Matching terms: "${commonTokens.slice(0, 3).join(', ')}"`);
  }

  if (sameZone) {
    score += 20;
    matchedAttributes.push(`Same Zone (${lost.campusZone})`);
  } else if (locationKeywordMatch) {
    score += 10;
    matchedAttributes.push('Related Campus Location');
  }

  // Color alignment
  if (lost.primaryColor && found.primaryColor) {
    if (lost.primaryColor.toLowerCase() === found.primaryColor.toLowerCase()) {
      score += 15;
      matchedAttributes.push(`Matching Color Finish (${lost.primaryColor})`);
    }
  }

  if (diffDays <= 2) {
    score += 20;
    matchedAttributes.push('Reported within 48 hours');
  } else if (diffDays <= 5) {
    score += 10;
    matchedAttributes.push('Reported within 5 days');
  }

  // Bonus for identifying features
  if (lost.identifyingFeatures && found.description) {
    const featureTokens = extractTokens(lost.identifyingFeatures);
    const foundText = found.description.toLowerCase();
    const hit = featureTokens.find((t) => t.length > 3 && foundText.includes(t));
    if (hit) {
      score += 15;
      matchedAttributes.push(`Distinguishing feature correlation ("${hit}")`);
    }
  }

  const confidence = Math.min(98, Math.max(10, score));

  if (confidence < 50) {
    return null;
  }

  let matchGrade: 'High' | 'Medium' | 'Potential' = 'Potential';
  if (confidence >= 80) matchGrade = 'High';
  else if (confidence >= 65) matchGrade = 'Medium';

  const reasoning = generateExplanation(lost, found, matchedAttributes, confidence);

  return {
    id: `match-${lost.id}-${found.id}`,
    lostItem: lost,
    foundItem: found,
    confidence,
    matchGrade,
    reasoning,
    matchedAttributes,
  };
}

function generateExplanation(lost: Item, found: Item, attrs: string[], confidence: number): string {
  if (confidence >= 80) {
    return `Strong semantic alignment detected between lost "${lost.title}" and found "${found.title}". Both items share the ${lost.category} classification, were logged around ${lost.campusZone}, and match distinguishing physical descriptors.`;
  }
  if (confidence >= 65) {
    return `Moderate correlation: Both records reference similar ${lost.category} belongings in the ${lost.campusZone} corridor within a close timeframe (${attrs.join(', ')}).`;
  }
  return `Potential match based on shared category (${lost.category}) and campus vicinity. Verify serial numbers or physical details.`;
}

/**
 * Scan all active lost and found items to find matches
 */
export async function runSmartMatchScanner(items: Item[]): Promise<SmartMatchResult[]> {
  const lostItems = items.filter((i) => i.type === 'lost' && i.status === 'active');
  const foundItems = items.filter((i) => i.type === 'found' && i.status === 'active');

  const matches: SmartMatchResult[] = [];

  for (const lost of lostItems) {
    for (const found of foundItems) {
      const result = calculateLocalMatch(lost, found);
      if (result) {
        matches.push(result);
      }
    }
  }

  // Sort by highest confidence
  return matches.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Deep Gemini analysis for a single pair of items
 */
export async function analyzePairWithGemini(lost: Item, found: Item): Promise<SmartMatchResult> {
  // If API key is present, invoke Gemini
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a campus lost-and-found matching engine for a major university.
Analyze whether the following Lost Item and Found Item are likely the exact same belonging.

LOST ITEM:
Title: ${lost.title}
Category: ${lost.category}
Location: ${lost.location} (Zone: ${lost.campusZone})
Date: ${lost.date}
Description: ${lost.description}
Identifying Features: ${lost.identifyingFeatures || 'None specified'}

FOUND ITEM:
Title: ${found.title}
Category: ${found.category}
Location: ${found.location} (Zone: ${found.campusZone})
Date: ${found.date}
Description: ${found.description}
Identifying Features: ${found.identifyingFeatures || 'None specified'}

Respond in valid JSON format only, with no markdown wrappers or other text:
{
  "confidence": <integer from 10 to 99>,
  "matchGrade": <"High" | "Medium" | "Potential">,
  "reasoning": <concise 2-sentence explanation of why they match or differ>,
  "matchedAttributes": [<array of short attribute strings e.g. "Same Building", "Matching Color">]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        id: `match-${lost.id}-${found.id}`,
        lostItem: lost,
        foundItem: found,
        confidence: parsed.confidence || 75,
        matchGrade: parsed.matchGrade || 'Medium',
        reasoning: parsed.reasoning || 'Evaluated by Gemini AI based on campus locations and item specifics.',
        matchedAttributes: parsed.matchedAttributes || ['Semantic Keyword Correlation'],
      };
    } catch (err) {
      console.warn('Gemini API call failed, using heuristic match engine', err);
    }
  }

  // Fallback to local heuristic
  const local = calculateLocalMatch(lost, found);
  if (local) return local;

  return {
    id: `match-${lost.id}-${found.id}`,
    lostItem: lost,
    foundItem: found,
    confidence: 45,
    matchGrade: 'Potential',
    reasoning: 'Lower probability match based on common category, requiring manual verification of unique markings.',
    matchedAttributes: [`Category (${lost.category})`],
  };
}
