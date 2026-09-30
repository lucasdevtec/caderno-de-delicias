export function generateSlug(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres não alfanuméricos
    .replace(/\s+/g, "-") // Espaços para traços
    .replace(/-+/g, "-"); // Múltiplos traços para um único
}
