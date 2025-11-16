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

/**
 * System prompt for bill/policy summarization
 * Optimized for cost reduction by requesting concise, token-efficient summaries
 */
export const system_prompt_bill_summarization = `You are an expert policy analyst specializing in Congressional bills and legislation. Your task is to provide extremely concise summaries that reduce token usage while maintaining critical information.

CRITICAL REQUIREMENTS FOR COST REDUCTION:
1. Keep summaries under 150 words
2. Use bullet points instead of paragraphs when possible
3. Focus only on: key provisions, affected industries, and potential positive and negative impact
4. Eliminate redundant phrases and filler words
5. Use abbreviations where appropriate (e.g., "HR" for House Resolution)
6. Prioritize actionable information over background context

Format your response as:
- **Key Provisions**: (2-3 bullet points)
- **Affected Industries**: (list)
- **Potential Impact**: (1–2 sentences, include positive/negative effects on companies within the listed industries)

Be precise, factual, and token-efficient.`;

/**
 * Formats the user message for bill summarization
 * @param billTitle - The title of the bill
 * @param billType - The bill type (HR, S, etc.)
 * @param billNumber - The bill number
 * @param congressId - The Congress ID
 * @param industries - Array of affected industries
 * @param billContent - Optional full bill content/text (if available)
 * 
 * @returns Formatted user message to pass to the AI
 *
 * @example
 * ```typescript
 * import { system_prompt_bill_summarization, formatBillSummarizationMessage } from "@/utils/constants";
 *
 * const userMessage = formatBillSummarizationMessage(
 *   "CHIPS Act",
 *   "HR",
 *   "4346",
 *   117,
 *   ["Semiconductors", "Manufacturing"]
 * );
 *
 * const response = await fetch("/api/prompt", {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify({
 *     system_prompt: system_prompt_bill_summarization,
 *     user_prompt: userMessage,
 *   }),
 * });
 *
 * const summary = await response.text();
 * ```
 */
export function formatBillSummarizationMessage(
  billTitle: string,
  billType: string,
  billNumber: string,
  congressId: number,
  industries: string[],
  billContent?: string
): string {
  let message = `Summarize the following Congressional bill in a concise, token-efficient manner:\n\n`;
  message += `Bill: ${billType} ${billNumber} - ${billTitle}\n`;
  message += `Congress: ${congressId}\n`;
  message += `Affected Industries: ${industries.join(", ")}\n`;

  if (billContent) {
    message += `\nBill Content:\n${billContent.substring(0, 2000)}...`; // Limit content to reduce tokens
  } else {
    message += `\nProvide a concise summary based on the bill title and affected industries, focusing on likely key provisions and potential market impact.`;
  }

  return message;
}

/**
 * System prompt for bill impact recommendations
 * Returns industries, companies, and percentages indicating how much each company is affected
 */
export const system_prompt_recommendations = `You are an investment advisor who receives information about bills from Congress and suggests which industries to invest in with company names and percentages for each company which indicates how much the company is affected by the bill.

Return ONLY a valid JSON array of objects with the following structure:
[
  {
    "industry_name": "Industry Name",
    "company_name": "Company Name",
    "percentage": 75
  }
]

Requirements:
- percentage should be a number between 0-100 indicating how much the company is affected
- Include companies from all relevant industries affected by the bill
- Focus on publicly traded companies where applicable
- Return only valid JSON, no additional text or markdown formatting`;

/**
 * Formats the user message for bill impact recommendations
 * @param billTitle - The title of the bill
 * @param billType - The bill type (HR, S, etc.)
 * @param billNumber - The bill number
 * @param congressId - The Congress ID
 * @param industries - Array of affected industries
 * 
 * @returns Formatted user message to pass to the AI
 */
export function formatRecommendationsMessage(
  billTitle: string,
  billType: string,
  billNumber: string,
  congressId: number | string,
  industries: string[]
): string {
  let message = `Analyze the following Congressional bill and provide investment recommendations:\n\n`;
  message += `Bill: ${billType} ${billNumber} - ${billTitle}\n`;
  message += `Congress: ${congressId}\n`;
  message += `Affected Industries: ${industries.join(", ")}\n\n`;
  message += `Based on this bill, provide a JSON array of recommendations with industry_name, company_name, and percentage (0-100) indicating how much each company is affected by this bill.`;

  return message;
}
