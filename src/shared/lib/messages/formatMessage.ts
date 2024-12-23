export default function formatMessage(
  template: string,
  values: Record<string, string>
) {
  return template.replace(/{(\w+)}/g, (_, key) => {
    return values[key] !== undefined ? values[key] : `{${key}}`;
  });
}
