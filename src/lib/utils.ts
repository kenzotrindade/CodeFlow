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
