import path from 'node:path';
import dotenv from 'dotenv';

// Carrega .env do projeto
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Limpando banco de dados...');
  await prisma.cadernoRecipe.deleteMany();
  await prisma.caderno.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log('👨‍🍳 Criando usuários de exemplo...');
  const maria = await prisma.user.create({
    data: {
      name: 'Dona Maria Cozinha Afetiva',
      username: 'donamaria',
      email: 'donamaria@cadernodedelicias.com.br',
      bio: 'Cozinheira apaixonada por tradições de família, doces caseiros e memórias de infância.',
      image:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    },
  });

  const lucas = await prisma.user.create({
    data: {
      name: 'Lucas Chef Amador',
      username: 'lucas',
      email: 'lucas@cadernodedelicias.com.br',
      bio: 'Testando receitas do mundo todo e colecionando pratos favoritos no fim de semana.',
      image:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    },
  });

  console.log('🍲 Criando receitas...');
  const boloCenoura = await prisma.recipe.create({
    data: {
      title: 'Bolo de Cenoura com Cobertura Crocante de Brigadeiro',
      slug: 'bolo-de-cenoura-brigadeiro',
      description:
        'Massa super fofinha batida no liquidificador com aquela cobertura espessa de chocolate que estala ao cortar.',
      prepTimeMinutes: 20,
      cookTimeMinutes: 40,
      servings: 12,
      difficulty: Difficulty.FACIL,
      category: 'Doces & Sobremesas',
      coverImage:
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      tips: 'Não bata a farinha de trigo em excesso no liquidificador; misture delicadamente com um fouet para o bolo ficar bem leve e fofo.',
      ingredients: [
        {
          item: 'Cenouras médias descascadas e picadas',
          quantity: '3',
          unit: 'unidades',
        },
        { item: 'Ovos grandes', quantity: '4', unit: 'unidades' },
        { item: 'Óleo de girassol ou milho', quantity: '1/2', unit: 'xícara' },
        { item: 'Açúcar cristal', quantity: '2', unit: 'xícaras' },
        {
          item: 'Farinha de trigo peneirada',
          quantity: '2 e 1/2',
          unit: 'xícaras',
        },
        {
          item: 'Fermento químico em pó',
          quantity: '1',
          unit: 'colher de sopa',
        },
        {
          item: 'Chocolate em pó 50% cacau (para cobertura)',
          quantity: '4',
          unit: 'colheres de sopa',
        },
        { item: 'Leite condensado', quantity: '1', unit: 'lata' },
        { item: 'Manteiga sem sal', quantity: '1', unit: 'colher de sopa' },
      ],
      instructions: [
        {
          stepNumber: 1,
          title: 'Bater os líquidos',
          description:
            'No liquidificador, bata as cenouras, os ovos, o óleo e o açúcar por cerca de 4 minutos até virar um creme homogêneo e liso.',
        },
        {
          stepNumber: 2,
          title: 'Incorporar a farinha',
          description:
            'Despeje a mistura em uma tigela grande e incorpore a farinha de trigo aos poucos com um fouet. Por último, adicione o fermento delicadamente.',
        },
        {
          stepNumber: 3,
          title: 'Assar',
          description:
            'Leve ao forno pré-aquecido a 180°C em forma untada e enfarinhada por aproximadamente 40 a 45 minutos (faça o teste do palito).',
        },
        {
          stepNumber: 4,
          title: 'Preparar a calda crocante',
          description:
            'Em fogo baixo, cozinhe o leite condensado, o cacau e a manteiga até ponto de brigadeiro de colher. Despeje ainda quente sobre o bolo.',
        },
      ],
      userId: maria.id,
      isPublic: true,
    },
  });

  const paoQueijo = await prisma.recipe.create({
    data: {
      title: 'Pão de Queijo Tradicional Mineiro da Fazenda',
      slug: 'pao-de-queijo-mineiro-tradicional',
      description:
        'Receita legítima mineira com polvilho azedo e doce escaldados, queijo canastra meia cura e casquinha crocante.',
      prepTimeMinutes: 30,
      cookTimeMinutes: 25,
      servings: 30,
      difficulty: Difficulty.MEDIO,
      category: 'Pães & Lanches',
      coverImage:
        'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80',
      tips: 'Use queijo meia cura ou queijo minas padrão ralado no ralo grosso para formar aquelas bolsas de queijo derretido.',
      ingredients: [
        { item: 'Polvilho doce', quantity: '250', unit: 'g' },
        { item: 'Polvilho azedo', quantity: '250', unit: 'g' },
        { item: 'Leite integral', quantity: '1', unit: 'xícara' },
        { item: 'Óleo vegetal', quantity: '1/2', unit: 'xícara' },
        { item: 'Água', quantity: '1/2', unit: 'xícara' },
        { item: 'Sal refinado', quantity: '1', unit: 'colher de chá' },
        { item: 'Ovos caipiras', quantity: '2 ou 3', unit: 'unidades' },
        { item: 'Queijo canastra ralado', quantity: '300', unit: 'g' },
      ],
      instructions: [
        {
          stepNumber: 1,
          title: 'Escaldar o polvilho',
          description:
            'Ferva o leite, o óleo, a água e o sal. Despeje sobre a mistura de polvilhos em uma tigela e mexa bem para escaldar. Deixe amornar.',
        },
        {
          stepNumber: 2,
          title: 'Adicionar ovos e queijo',
          description:
            'Adicione os ovos um a um, sovando com as mãos. Em seguida, misture o queijo ralado até obter uma massa macia que não gruda nas mãos.',
        },
        {
          stepNumber: 3,
          title: 'Modelar e assar',
          description:
            'Faça bolinhas e coloque em assadeira. Asse a 200°C por cerca de 25 minutos até dourarem.',
        },
      ],
      userId: maria.id,
      isPublic: true,
    },
  });

  const mousseMaracuja = await prisma.recipe.create({
    data: {
      title: 'Mousse de Maracujá Cremoso com Calda Rústica',
      slug: 'mousse-de-maracuja-calda-rustica',
      description:
        'Sobremesa rápida e refrescante, equilibrando o doce do leite condensado com a acidez natural do maracujá fresco.',
      prepTimeMinutes: 15,
      cookTimeMinutes: 0,
      servings: 8,
      difficulty: Difficulty.FACIL,
      category: 'Doces & Sobremesas',
      coverImage:
        'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
      tips: 'A calda com sementes por cima dá um contraste visual lindo e crocância agradável.',
      ingredients: [
        { item: 'Leite condensado', quantity: '1', unit: 'lata' },
        { item: 'Creme de leite fresco', quantity: '1', unit: 'caixinha' },
        {
          item: 'Suco concentrado de maracujá (ou fruta natural coada)',
          quantity: '1',
          unit: 'xícara',
        },
        {
          item: 'Polpa de maracujá fresco com sementes (calda)',
          quantity: '1',
          unit: 'unidade',
        },
        { item: 'Açúcar (calda)', quantity: '2', unit: 'colheres de sopa' },
      ],
      instructions: [
        {
          stepNumber: 1,
          title: 'Bater o mousse',
          description:
            'Bata no liquidificador o leite condensado, o creme de leite e o suco por 5 minutos até ficar aerado e consistente.',
        },
        {
          stepNumber: 2,
          title: 'Fazer a calda',
          description:
            'Leve a polpa com as sementes e o açúcar ao fogo baixo por 3 minutos até engrossar levemente. Deixe esfriar.',
        },
        {
          stepNumber: 3,
          title: 'Montar e gelar',
          description:
            'Despeje o mousse em taças, cubra com a calda fria e leve à geladeira por no mínimo 4 horas.',
        },
      ],
      userId: maria.id,
      isPublic: true,
    },
  });

  console.log('📚 Criando Cadernos Originais (Públicos)...');
  const cadernoSobremesas = await prisma.caderno.create({
    data: {
      title: 'Doces & Sobremesas de Domingo',
      slug: 'doces-e-sobremesas-de-domingo',
      description:
        'Coletânea das melhores sobremesas para reunir a família depois do almoço de domingo.',
      coverColor: '#F59E0B',
      icon: 'cake',
      isPublic: true,
      userId: maria.id,
    },
  });

  // Vincular receitas ao caderno da Maria com ordem definida
  await prisma.cadernoRecipe.create({
    data: {
      cadernoId: cadernoSobremesas.id,
      recipeId: boloCenoura.id,
      position: 0,
    },
  });

  await prisma.cadernoRecipe.create({
    data: {
      cadernoId: cadernoSobremesas.id,
      recipeId: mousseMaracuja.id,
      position: 1,
    },
  });

  const cadernoClassicos = await prisma.caderno.create({
    data: {
      title: 'Clássicos da Cozinha Afetiva',
      slug: 'classicos-da-cozinha-afetiva',
      description: 'Receitas que aquecem o coração e têm cheiro de casa de vó.',
      coverColor: '#EA580C',
      icon: 'heart',
      isPublic: true,
      userId: maria.id,
    },
  });

  await prisma.cadernoRecipe.create({
    data: {
      cadernoId: cadernoClassicos.id,
      recipeId: paoQueijo.id,
      position: 0,
    },
  });

  await prisma.cadernoRecipe.create({
    data: {
      cadernoId: cadernoClassicos.id,
      recipeId: boloCenoura.id,
      position: 1,
    },
  });

  console.log('🌿 Criando Caderno Copiado/Forked pelo Lucas com Atribuição...');
  // O usuário Lucas copiou o caderno público da Dona Maria
  const cadernoCopiadoLucas = await prisma.caderno.create({
    data: {
      title: 'Sobremesas Favoritas da Maria (Meu Caderno)',
      slug: 'sobremesas-favoritas-maria',
      description:
        'Caderno copiado das deliciosas receitas da Dona Maria para eu praticar nos finais de semana.',
      coverColor: '#E11D48',
      icon: 'sparkles',
      isPublic: false, // Lucas optou por deixar o dele privado
      userId: lucas.id,
      originalCadernoId: cadernoSobremesas.id,
      originalAuthorName: 'Dona Maria Cozinha Afetiva',
      copiedAt: new Date(),
    },
  });

  // Copia as receitas mantendo a ordem exata do original
  await prisma.cadernoRecipe.create({
    data: {
      cadernoId: cadernoCopiadoLucas.id,
      recipeId: boloCenoura.id,
      position: 0,
    },
  });

  await prisma.cadernoRecipe.create({
    data: {
      cadernoId: cadernoCopiadoLucas.id,
      recipeId: mousseMaracuja.id,
      position: 1,
    },
  });

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
