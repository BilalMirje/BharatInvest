import type { AiFeedback } from '../types';
import { normalizeKeys } from './normalizeKeys';

/**
 * Parse raw AI feedback string (possibly wrapped in markdown code blocks) into AiFeedback object.
 */
export function parseFeedback(raw: string | null | undefined): AiFeedback | null {
  if (!raw) return null;
  try {
    let text = raw.trim();
    if (text.startsWith('```json')) text = text.slice(7);
    else if (text.startsWith('```')) text = text.slice(3);
    if (text.endsWith('```')) text = text.slice(0, -3);
    text = text.trim();
    if (!text.startsWith('{')) {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) text = m[0];
    }
    return normalizeKeys(JSON.parse(text)) as AiFeedback;
  } catch {
    return null;
  }
}

/**
 * Check if parsed feedback has meaningful content worth displaying.
 */
export function hasFeedbackContent(fb: AiFeedback | null): boolean {
  if (!fb) return false;
  return (
    typeof fb.overallScore === 'number' ||
    (fb.strengths?.length > 0) ||
    (fb.improvements?.length > 0) ||
    (fb.summary?.length > 0)
  );
}

const SECTION_TAGS = ['SUMMARY', 'STRENGTHS', 'IMPROVEMENTS', 'INVESTOR_QUESTIONS', 'PITCH_TIPS', 'MARKET_INSIGHTS', 'FINANCIAL_NOTES'] as const;

/**
 * Extract only human-readable text from feedback, tagged with section markers for translation.
 */
export function extractDisplayText(fb: AiFeedback): string {
  const parts: string[] = [];
  if (fb.summary) parts.push(`[SUMMARY]\n${fb.summary}`);
  if (fb.strengths?.length) parts.push(`[STRENGTHS]\n${fb.strengths.join('\n')}`);
  if (fb.improvements?.length) parts.push(`[IMPROVEMENTS]\n${fb.improvements.join('\n')}`);
  if (fb.investorQuestions?.length) parts.push(`[INVESTOR_QUESTIONS]\n${fb.investorQuestions.join('\n')}`);
  if (fb.pitchTips?.length) parts.push(`[PITCH_TIPS]\n${fb.pitchTips.join('\n')}`);
  if (fb.marketInsights) parts.push(`[MARKET_INSIGHTS]\n${fb.marketInsights}`);
  if (fb.financialData?.notes) parts.push(`[FINANCIAL_NOTES]\n${fb.financialData.notes}`);
  return parts.join('\n\n');
}

/**
 * Parse translated text back into sections keyed by tag name.
 */
export function parseTranslated(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  for (const tag of SECTION_TAGS) {
    const regex = new RegExp(`\\[${tag}\\]\\n([\\s\\S]*?)(?=\\n\\n\\[|$)`);
    const m = text.match(regex);
    if (m) sections[tag] = m[1].trim();
  }
  return sections;
}
