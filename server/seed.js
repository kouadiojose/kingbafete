require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');

  // Admin user
  const adminExists = await prisma.adminUser.findFirst();
  if (!adminExists) {
    await prisma.adminUser.create({
      data: {
        email: 'fetekimpiobi01@gmail.com',
        password: bcrypt.hashSync('KingBafete2024!', 10),
        name: 'Admin King Bafété',
      },
    });
    console.log('Admin user created: fetekimpiobi01@gmail.com / KingBafete2024!');
  }

  // Site settings
  const settingsExist = await prisma.siteSettings.findFirst();
  if (!settingsExist) {
    await prisma.siteSettings.create({
      data: {
        siteName: 'Kingbafete',
        motto: 'Là où tu es semé, il te fleurira',
        heroTitle: "Dans l'Univers des Contes Africains",
        heroSubtitle: 'Voyagez à travers les cultures grâce aux contes',
        badgeYear: '2018',
        badgeText: "Chevalière de l'Ordre de la Pléiade",
        aboutIntro: "Madame Fété Ngira-Batware Kimpiobi a immigré au Canada en octobre 1999, en provenance de la R D Congo, son pays d'origine.",
        aboutText: "<p>Après un séjour de cinq ans et demi à Montréal, elle s'est installée à Welland, en Ontario. Dans son Congo natal, elle s'était imposée parmi les personnalités culturelles reconnues de Kinshasa, la capitale.</p><p>De nature hyperactive, elle a toujours mené de front plusieurs activités : directrice d'une multinationale de négoce internationale, exploitante d'une galerie d'art, mécène et éditrice de trois magazines.</p><p>En 2007, elle a co-fondé l'organisme <strong>SOFIFRAN</strong> (Solidarité des Femmes et Familles Interconnectées Francophones du Niagara) avec un groupe de femmes immigrantes francophones.</p>",
        contactEmail: 'fetekimpiobi01@gmail.com',
        contactAddress: 'Welland, Ontario, Canada',
        facebookUrl: 'https://www.facebook.com/fete.kimpiobingirabatware',
        booksDescription: "Explorez une collection de récits qui célèbrent la richesse des traditions orales du Congo et de l'Afrique, transmises de génération en génération.",
      },
    });
    console.log('Site settings created');
  }

  // Books
  const booksExist = await prisma.book.count();
  if (booksExist === 0) {
    await prisma.book.createMany({
      data: [
        {
          title: 'Devoir de Mémoire',
          author: 'Yvon Kimpiobi-Ninafiding Nki-Ekundi',
          description: "Un des acteurs privilégiés de la lutte anticoloniale et pionnière de l'indépendance du Congo, en harmonie avec la sagesse de ses ancêtres, a tenu avant de quitter cette terre, d'y restituer ce qu'il y avait reçu...\n\nCe « récit de vie » relaté à son gendre Clément Ngira-Batware, à l'âge de 84 ans alors qu'il était frappé de cécité, est une preuve de sa générosité et son sens aigu du devoir et du patriotisme.",
          publisher: "Les éditions L'Empreinte du Passant",
          subtitle: 'Autobiographie (Publié à titre posthume)',
          badge: 'Va bientôt paraître',
          featured: true,
          sortOrder: 0,
        },
        {
          title: 'Dias, Thérapeute et Homme léopard',
          description: "Grand-père Dias était un homme ordinaire, humble et sans histoire seulement en apparence, car il en circulait beaucoup, derrière son dos.",
          price: '$12.00',
          sortOrder: 1,
        },
        {
          title: 'Nyota, le secret de la plume',
          description: "Une histoire captivante qui révèle les secrets ancestraux transmis de génération en génération.",
          price: '$25.00',
          sortOrder: 2,
        },
        {
          title: 'Le Soleil, la Lune et les Étoiles',
          description: "Les contes de maman Fété : Le Soleil, la Lune et les Étoiles, le Coq, la Poule et les Poussins.",
          price: '$15.00',
          sortOrder: 3,
        },
        {
          title: "Mois d'Espoir - Mélanges pour l'Afrique",
          description: "Une compilation unique célébrant la richesse culturelle et l'espoir du continent africain.",
          price: '$15.00',
          sortOrder: 4,
        },
        {
          title: "Les acteurs de la coloniale et les pionniers de l'indépendance du Congo-Belge",
          description: "Un ouvrage historique retraçant les parcours des acteurs clés de la période coloniale et des pionniers de l'indépendance du Congo-Belge.",
          amazonUrl: 'https://www.amazon.ca/-/fr/acteurs-coloniale-pionniers-lindépendance-Congo-Belge/dp/B0C128P3HT',
          sortOrder: 5,
        },
      ],
    });
    console.log('Books created');
  }

  // Interviews
  const interviewsExist = await prisma.interview.count();
  if (interviewsExist === 0) {
    await prisma.interview.createMany({
      data: [
        {
          title: 'En conversation avec Fété Ngira-Batware Kimpiobi',
          youtubeUrl: 'https://www.youtube.com/watch?v=EwzxWynhULw',
          date: '2022',
          sortOrder: 0,
        },
        {
          title: 'Interview - Lkc4Dmc02wU',
          youtubeUrl: 'https://www.youtube.com/watch?v=Lkc4Dmc02wU',
          badge: '',
          sortOrder: 1,
        },
        {
          title: 'Interview - PwZra6F9wtg',
          youtubeUrl: 'https://www.youtube.com/watch?v=PwZra6F9wtg',
          badge: '',
          sortOrder: 2,
        },
      ],
    });
    console.log('Interviews created');
  }

  console.log('Seed completed!');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error('Seed error (non-fatal):', e.message);
});
