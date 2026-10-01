import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://cadernodedelicias.com.br').replace(/\/$/, '');

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/descobrir`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/doar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/termos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  let recipeRoutes: MetadataRoute.Sitemap = [];
  try {
    const recipes = await prisma.recipe.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 5000,
    });

    recipeRoutes = recipes.map((recipe) => ({
      url: `${baseUrl}/receitas/${recipe.slug || recipe.id}`,
      lastModified: recipe.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Erro ao gerar sitemap de receitas:', error);
  }

  let cadernoRoutes: MetadataRoute.Sitemap = [];
  try {
    const cadernos = await prisma.caderno.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 5000,
    });

    cadernoRoutes = cadernos.map((caderno) => ({
      url: `${baseUrl}/cadernos/${caderno.slug || caderno.id}`,
      lastModified: caderno.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Erro ao gerar sitemap de cadernos:', error);
  }

  return [...staticRoutes, ...recipeRoutes, ...cadernoRoutes];
}
