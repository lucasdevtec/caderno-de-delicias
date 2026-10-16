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

/**
 * Monta o identificador único na URL no formato `slug-id` (ex: `bolo-de-cenoura-cma12345`).
 */
export function getEntityUrlParam(item: { id: string; slug?: string | null }): string {
  if (!item.slug) return item.id;
  if (item.slug.endsWith(`-${item.id}`)) return item.slug;
  return `${item.slug}-${item.id}`;
}

/**
 * Extrai critérios de busca para resolver tanto o formato `slug-id` quanto `id` direto ou `slug` legado.
 */
export function buildEntityLookupOr(param: string): Array<{ id?: string; slug?: string }> {
  const criteria: Array<{ id?: string; slug?: string }> = [
    { id: param },
    { slug: param },
  ];

  const lastDashIndex = param.lastIndexOf("-");
  if (lastDashIndex > 0 && lastDashIndex < param.length - 1) {
    const possibleId = param.slice(lastDashIndex + 1);
    criteria.unshift({ id: possibleId });
  }

  return criteria;
}

