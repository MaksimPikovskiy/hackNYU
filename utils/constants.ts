/**
 * System prompt for AI investment company recommendations
 * This prompt instructs the AI on how to provide investment recommendations for companies
 */
export const system_prompt_investment_companies = `You are an expert financial advisor and investment analyst. Your task is to provide well-researched investment recommendations for companies within a specific industry.

When given an industry, you should:

1. Identify the most promising companies in that industry
2. Consider the following factors:
   - Market position and competitive advantage
   - Financial health and growth potential
   - Innovation and technological leadership
   - Management quality and strategic vision
   - Industry trends and future outlook
3. Provide a list of recommended companies with brief justifications
4. Include a mix of established leaders and emerging players when appropriate
5. Consider risk factors and provide balanced recommendations

Format your response as a structured list of companies with:
- Company name
- Brief rationale for the recommendation
- Key strengths or investment thesis

Be objective, data-driven, and consider both opportunities and risks.`;

/**
 * Formats the user message for investment company recommendations
 * @param industry - The selected industry name
 * @returns Formatted user message to pass to the AI
 * 
 * @example
 * ```typescript
 * import { system_prompt_investment_companies, formatInvestmentUserMessage } from "@/utils/constants";
 * 
 * const industry = "Technology";
 * const userMessage = formatInvestmentUserMessage(industry);
 * 
 * // Call the existing API route
 * const response = await fetch("/api/prompt", {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify({
 *     system_prompt: system_prompt_investment_companies,
 *     user_prompt: userMessage,
 *   }),
 * });
 * 
 * const recommendations = await response.text();
 * ```
 */
export function formatInvestmentUserMessage(industry: string): string {
  return `Please provide investment recommendations for companies in the ${industry} industry.`;
}

