import { db } from "./index";
import { categories, products, reviews, users } from "./schema";
import { hashPassword } from "../lib/auth";
import { count } from "drizzle-orm";

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword || adminPassword.length < 12) {
    throw new Error("Set SEED_ADMIN_EMAIL and a SEED_ADMIN_PASSWORD of 12+ characters.");
  }
  const [userCount] = await db.select({ c: count() }).from(users);
  if (userCount.c > 0) {
    console.log("Seed já aplicado, pulando.");
    return;
  }

  await db.insert(users).values([
    {
      name: "Admin Dualemon",
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
      role: "admin",
    },
  ]);

  const cats = await db
    .insert(categories)
    .values([
      { name: "Burgers & Bratwurst", slug: "burgers", position: 1 },
      { name: "Combos da Casa", slug: "combos", position: 2 },
      { name: "Porções da Chapa", slug: "porcoes", position: 3 },
      { name: "Chopes & Bebidas", slug: "bebidas", position: 4 },
      { name: "Sobremesas Alemãs", slug: "sobremesas", position: 5 },
    ])
    .returning();

  const bySlug = Object.fromEntries(cats.map((c) => [c.slug, c.id])) as Record<string, number>;

  await db.insert(products).values([
    {
      categoryId: bySlug.burgers,
      name: "Pomerode Smash",
      description:
        "Dois smash de blend fresco 90g, queijo prato derretido, cebola caramelizada na cerveja preta e molho da casa no pão brioche selado na manteiga.",
      priceCents: 3890,
      imageUrl:
        "https://images.pexels.com/photos/28828554/pexels-photo-28828554.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      tag: "Mais pedido",
      featured: true,
    },
    {
      categoryId: bySlug.burgers,
      name: "Bratwurst Burger",
      description:
        "Salsicha bratwurst artesanal grelhada na chapa, mostarda escura de mel, chucrute refogado e queijo emmental no pão pretzel.",
      priceCents: 4200,
      imageUrl:
        "https://images.pexels.com/photos/12325009/pexels-photo-12325009.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      tag: "Tradição alemã",
      featured: true,
    },
    {
      categoryId: bySlug.burgers,
      name: "Eisbein Burger",
      description:
        "Joelho de porco desfiado e pururucado, maionese de raiz-forte, picles de pepino pomerano e agrião fresco.",
      priceCents: 4650,
      imageUrl:
        "https://images.pexels.com/photos/12325122/pexels-photo-12325122.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      tag: "Da Pomerânia",
    },
    {
      categoryId: bySlug.burgers,
      name: "Chucrute Bacon Duplo",
      description:
        "Blend 160g, bacon defumado em fatias grossas, chucrute, cheddar cremoso e molho mostarda-mel.",
      priceCents: 4400,
      imageUrl:
        "https://images.pexels.com/photos/6896381/pexels-photo-6896381.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      categoryId: bySlug.burgers,
      name: "Garten Veggie",
      description:
        "Hambúrguer de grão-de-bico e cogumelos, queijo minas grelhado, tomate confit e maionese de ervas do jardim.",
      priceCents: 3600,
      imageUrl:
        "https://images.pexels.com/photos/12325070/pexels-photo-12325070.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      tag: "Vegetariano",
    },
    {
      categoryId: bySlug.combos,
      name: "Combo Dualemon",
      description: "Pomerode Smash + batata rústica com cheddar e bacon + bebida 350ml à escolha.",
      priceCents: 5990,
      imageUrl:
        "https://images.pexels.com/photos/36554035/pexels-photo-36554035.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      tag: "Economize R$ 12",
      featured: true,
    },
    {
      categoryId: bySlug.combos,
      name: "Combo Bratwurst",
      description: "Bratwurst Burger + onion rings com mel de mostarda + chope colonial 300ml.",
      priceCents: 6490,
      imageUrl:
        "https://images.pexels.com/photos/36741809/pexels-photo-36741809.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      categoryId: bySlug.combos,
      name: "Combo Família Pomerode",
      description: "4 burgers clássicos + 2 porções grandes + refrigerante 1L. Serve 3 a 4 pessoas.",
      priceCents: 14900,
      imageUrl:
        "https://images.pexels.com/photos/12325122/pexels-photo-12325122.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      tag: "Serve 3–4",
    },
    {
      categoryId: bySlug.porcoes,
      name: "Batata Rústica Cheddar & Bacon",
      description: "Batatas rústicas com casca, cheddar cremoso da casa e bacon defumado crocante.",
      priceCents: 3200,
      imageUrl:
        "https://images.pexels.com/photos/1586942/pexels-photo-1586942.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      featured: true,
    },
    {
      categoryId: bySlug.porcoes,
      name: "Onion Rings com Mel de Mostarda",
      description: "Anéis de cebola empanados na cerveja, crocantes, com molho de mel e mostarda escura.",
      priceCents: 2800,
      imageUrl:
        "https://images.pexels.com/photos/6006652/pexels-photo-6006652.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      categoryId: bySlug.porcoes,
      name: "Bratwurst na Chapa",
      description: "Duas salsichas artesanais grelhadas, mostarda escura, chucrute e pão pretzel fatiado.",
      priceCents: 3900,
      imageUrl:
        "https://images.pexels.com/photos/24245659/pexels-photo-24245659.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      tag: "Clássico pomerano",
    },
    {
      categoryId: bySlug.bebidas,
      name: "Chope Colonial Pomerode 300ml",
      description: "Lager colonial refrescante, produzida em Pomerode, servida gelada na caneca congelada.",
      priceCents: 1400,
      imageUrl:
        "https://images.pexels.com/photos/5530256/pexels-photo-5530256.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      featured: true,
    },
    {
      categoryId: bySlug.bebidas,
      name: "Chope IPA Dualemon 500ml",
      description: "IPA artesanal da casa, amargor na medida e aroma cítrico, exclusiva da torneira.",
      priceCents: 2200,
      imageUrl:
        "https://images.pexels.com/photos/5530252/pexels-photo-5530252.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      tag: "Artesanal",
    },
    {
      categoryId: bySlug.bebidas,
      name: "Refrigerante Lata 350ml",
      description: "Coca-Cola, Guaraná ou Soda limão, sempre gelados.",
      priceCents: 800,
      imageUrl: null,
    },
    {
      categoryId: bySlug.bebidas,
      name: "Suco de Uva Colonial 400ml",
      description: "Suco integral de uva bordô das videiras do Vale, sem açúcar adicionado.",
      priceCents: 1200,
      imageUrl: null,
    },
    {
      categoryId: bySlug.sobremesas,
      name: "Apfelstrudel",
      description: "Strudel de maçã com canela, massa folhada crocante, sorvete de creme e calda de caramelo salgado.",
      priceCents: 2600,
      imageUrl:
        "https://images.pexels.com/photos/14093961/pexels-photo-14093961.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      tag: "Receita da Oma",
      featured: true,
    },
    {
      categoryId: bySlug.sobremesas,
      name: "Torta Rústica de Especiarias",
      description: "Massa amanteigada com especiarias pomeranas, servida morna com sorvete de creme.",
      priceCents: 2400,
      imageUrl:
        "https://images.pexels.com/photos/9589795/pexels-photo-9589795.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
  ]);

  await db.insert(reviews).values([
    {
      authorName: "Adson Brito",
      rating: 5,
      text: "Ambiente top, comida muito boa.",
      source: "google",
    },
    {
      authorName: "Fábio Mayko",
      rating: 4,
      text: "Ontem foi inauguração de sua filial Blumenau com rodízio de pizzas.",
      source: "google",
    },
    {
      authorName: "Erick Cabral",
      rating: 3,
      text: "É outra pessoa que faz bebidas toda hora colocar mão no cabelo.",
      source: "google",
    },
    {
      authorName: "Marina Klabunde",
      rating: 5,
      text: "O Bratwurst Burger é absurdo de bom. Chucrute no ponto, pão pretzel fresquinho e o chope colonial gelado de verdade. Virei cliente de toda sexta.",
      source: "site",
    },
    {
      authorName: "Carlos Zimmermann",
      rating: 5,
      text: "Melhor smash da região, sem discussão. Blend suculento, cebola caramelizada na cerveja preta é um detalhe que muda tudo. Atendimento rápido mesmo com casa cheia.",
      source: "site",
    },
    {
      authorName: "Juliana Wachholz",
      rating: 4,
      text: "Apfelstrudel com sorvete de creme fecha qualquer refeição. Só acho que podia ter mais opção de sobremesa no cardápio, mas o que tem é excelente.",
      source: "site",
    },
    {
      authorName: "Henrique Tiedt",
      rating: 4,
      text: "Casa com clima de galpão pomerano, música boa e porchetta... digo, Eisbein Burger surpreendente. Preço justo pelo tamanho das porções.",
      source: "site",
    },
  ]);

  console.log("Seed aplicado com sucesso.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
