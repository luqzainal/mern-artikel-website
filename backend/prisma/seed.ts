import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Full system access',
      permissions: JSON.stringify([
        'read', 'create', 'update', 'delete',
        'publish', 'review', 'manage_users', 'manage_roles'
      ]),
    },
  });

  await prisma.role.upsert({
    where: { name: 'Reviewer' },
    update: {},
    create: {
      name: 'Reviewer',
      description: 'Can review and approve articles',
      permissions: JSON.stringify(['read', 'review', 'comment']),
    },
  });

  const authorRole = await prisma.role.upsert({
    where: { name: 'Author' },
    update: {},
    create: {
      name: 'Author',
      description: 'Can write and manage own articles',
      permissions: JSON.stringify(['read', 'create', 'update', 'comment']),
    },
  });

  await prisma.role.upsert({
    where: { name: 'Translator' },
    update: {},
    create: {
      name: 'Translator',
      description: 'Can translate articles',
      permissions: JSON.stringify(['read', 'translate', 'comment']),
    },
  });

  await prisma.role.upsert({
    where: { name: 'Reader' },
    update: {},
    create: {
      name: 'Reader',
      description: 'Can read and comment on articles',
      permissions: JSON.stringify(['read', 'comment']),
    },
  });

  console.log('Roles created');

  // Create categories
  const categories = [
    {
      nameEn: 'Aqidah',
      nameMy: 'Akidah',
      slug: 'aqidah',
      description: 'Articles about Islamic beliefs and theology',
    },
    {
      nameEn: 'Fiqh',
      nameMy: 'Fiqh',
      slug: 'fiqh',
      description: 'Islamic jurisprudence and rulings',
    },
    {
      nameEn: 'Seerah',
      nameMy: 'Sirah',
      slug: 'seerah',
      description: 'Biography of Prophet Muhammad (PBUH)',
    },
    {
      nameEn: 'Tafsir',
      nameMy: 'Tafsir',
      slug: 'tafsir',
      description: 'Quranic interpretation and commentary',
    },
    {
      nameEn: 'Hadith',
      nameMy: 'Hadis',
      slug: 'hadith',
      description: 'Prophetic traditions and their explanations',
    },
    {
      nameEn: 'Akhlaq',
      nameMy: 'Akhlak',
      slug: 'akhlaq',
      description: 'Islamic ethics and character',
    },
    {
      nameEn: 'Contemporary Issues',
      nameMy: 'Isu Semasa',
      slug: 'contemporary-issues',
      description: 'Modern Islamic perspectives on current affairs',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('Categories created');

  // Create tags
  const tags = [
    { nameEn: 'Tawhid', nameMy: 'Tauhid', slug: 'tawhid' },
    { nameEn: 'Prayer', nameMy: 'Solat', slug: 'prayer' },
    { nameEn: 'Zakat', nameMy: 'Zakat', slug: 'zakat' },
    { nameEn: 'Fasting', nameMy: 'Puasa', slug: 'fasting' },
    { nameEn: 'Hajj', nameMy: 'Haji', slug: 'hajj' },
    { nameEn: 'Marriage', nameMy: 'Perkahwinan', slug: 'marriage' },
    { nameEn: 'Family', nameMy: 'Keluarga', slug: 'family' },
    { nameEn: 'Women', nameMy: 'Wanita', slug: 'women' },
    { nameEn: 'Youth', nameMy: 'Belia', slug: 'youth' },
    { nameEn: 'Education', nameMy: 'Pendidikan', slug: 'education' },
    { nameEn: 'Science', nameMy: 'Sains', slug: 'science' },
    { nameEn: 'Technology', nameMy: 'Teknologi', slug: 'technology' },
    { nameEn: 'Economy', nameMy: 'Ekonomi', slug: 'economy' },
    { nameEn: 'Politics', nameMy: 'Politik', slug: 'politics' },
    { nameEn: 'Environment', nameMy: 'Alam Sekitar', slug: 'environment' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }

  console.log('Tags created');

  // Create demo admin user with password
  const hashedAdminPassword = await bcrypt.hash('AdminPass123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@qalamailm.com' },
    update: {},
    create: {
      email: 'admin@qalamailm.com',
      name: 'Admin User',
      password: hashedAdminPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  });

  console.log('Demo admin user created with email: admin@qalamailm.com, password: AdminPass123');

  // Create demo author user
  const authorUser = await prisma.user.upsert({
    where: { email: 'author@islamicarticles.com' },
    update: {},
    create: {
      email: 'author@islamicarticles.com',
      name: 'Author User',
      roleId: authorRole.id,
      isActive: true,
    },
  });

  console.log('Demo author user created');

  // Create sample article
  const aqidahCategory = await prisma.category.findUnique({
    where: { slug: 'aqidah' },
  });

  const tawhidTag = await prisma.tag.findUnique({
    where: { slug: 'tawhid' },
  });

  if (aqidahCategory && tawhidTag) {
    const sampleArticle = await prisma.article.create({
      data: {
        authorId: authorUser.id,
        categoryId: aqidahCategory.id,
        slug: 'understanding-tawhid',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        translations: {
          create: [
            {
              language: 'EN',
              title: 'Understanding Tawhid: The Oneness of Allah',
              excerpt: 'Tawhid is the fundamental concept of Islamic monotheism, representing the belief in the absolute oneness and uniqueness of Allah.',
              content: `# Understanding Tawhid: The Oneness of Allah

## Introduction

Tawhid (Arabic: توحيد) is the defining doctrine of Islam, representing the absolute oneness and uniqueness of Allah (God). It is the central tenet upon which the entire Islamic faith is built, and understanding it is essential for every Muslim.

## The Three Categories of Tawhid

Islamic scholars have traditionally divided Tawhid into three categories:

### 1. Tawhid ar-Rububiyyah (Oneness of Lordship)

This refers to the belief that Allah alone is the Creator, Sustainer, and Controller of everything in existence. He has no partners in His dominion.

### 2. Tawhid al-Uluhiyyah (Oneness of Worship)

This means that all worship must be directed to Allah alone. No one else deserves to be worshipped alongside Him.

### 3. Tawhid al-Asma was-Sifat (Oneness of Names and Attributes)

This affirms that Allah's names and attributes are unique to Him. We must believe in all of Allah's names and attributes as they are mentioned in the Quran and authentic Hadith.

## Conclusion

Understanding and implementing Tawhid is the key to success in this life and the Hereafter. It is not merely a theoretical concept but a practical reality that should guide every aspect of a Muslim's life.

## References

- Ibn Taymiyyah. (n.d.). Kitab al-Tawhid.
- Al-Ghazali, A. H. (1096). Ihya Ulum al-Din.`,
            },
            {
              language: 'MY',
              title: 'Memahami Tauhid: Keesaan Allah',
              excerpt: 'Tauhid adalah konsep asas monoteisme Islam, mewakili kepercayaan terhadap keesaan dan keunikan mutlak Allah.',
              content: `# Memahami Tauhid: Keesaan Allah

## Pengenalan

Tauhid (Arab: توحيد) adalah doktrin penentu Islam, mewakili keesaan dan keunikan mutlak Allah. Ia adalah pegangan utama di mana keseluruhan agama Islam dibina, dan memahaminya adalah penting bagi setiap Muslim.

## Tiga Kategori Tauhid

Ulama Islam secara tradisinya membahagikan Tauhid kepada tiga kategori:

### 1. Tauhid ar-Rububiyyah (Keesaan Ketuhanan)

Ini merujuk kepada kepercayaan bahawa Allah sahaja Pencipta, Pemelihara, dan Pengawal segala yang wujud. Dia tidak mempunyai sekutu dalam kekuasaan-Nya.

### 2. Tauhid al-Uluhiyyah (Keesaan Penyembahan)

Ini bermakna semua ibadah mesti ditujukan kepada Allah sahaja. Tiada siapa yang layak disembah bersama-Nya.

### 3. Tauhid al-Asma was-Sifat (Keesaan Nama dan Sifat)

Ini menegaskan bahawa nama dan sifat Allah adalah unik kepada-Nya. Kita mesti percaya kepada semua nama dan sifat Allah sebagaimana yang disebutkan dalam al-Quran dan Hadis sahih.

## Kesimpulan

Memahami dan mengamalkan Tauhid adalah kunci kejayaan di dunia dan akhirat. Ia bukan sekadar konsep teori tetapi realiti praktikal yang harus membimbing setiap aspek kehidupan seorang Muslim.

## Rujukan

- Ibn Taymiyyah. (n.d.). Kitab al-Tawhid.
- Al-Ghazali, A. H. (1096). Ihya Ulum al-Din.`,
            },
          ],
        },
        tags: {
          create: {
            tagId: tawhidTag.id,
          },
        },
      },
    });

    console.log('Sample article created:', sampleArticle.id);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
