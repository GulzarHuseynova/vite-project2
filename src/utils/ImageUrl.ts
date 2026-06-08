const API_ORIGIN = "http://161.97.154.119";

export const resolveImageUrl = (url?: string | null): string => {
  if (!url) return "";

  const trimmed = url.trim();
  if (trimmed === "") return "";

  if (/^(https?:)?\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("data:")) return trimmed;
  if (trimmed.startsWith("/")) return `${API_ORIGIN}${trimmed}`;

  return `${API_ORIGIN}/${trimmed}`;
};
