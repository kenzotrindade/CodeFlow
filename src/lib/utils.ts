// #################################
// ### Utilities
// #################################

export function fillTemplate(template: string, values: Record<string, string>) {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}

export function parseAIResponse<T>(content: string): T | null {
  try {
    const cleaned = content
      .replaceAll('```json', "")
      .replaceAll('```', "")
      .trim();
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error("AI Parsing Error:", error);
    return null;
  }
}
