// Optional seed: creates a demo user with a completed profile.
// Run with: npm run db:push && node prisma/seed.mjs
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@fitcoach12.app";
  const passwordHash = await bcrypt.hash("demo1234", 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Demo Operator",
      passwordHash,
      profile: {
        create: {
          name: "Demo Operator",
          age: 30,
          heightCm: 178,
          weightKg: 74,
          gender: "MALE",
          activityLevel: "moderate",
          goalBodyFat: 12,
          foodWindowStart: "07:00",
          foodWindowEnd: "17:00",
          tdee: 2600,
          targetKcal: 2130,
          proteinG: 163,
          carbsG: 210,
          fatG: 59,
          onboardingDone: true,
        },
      },
    },
  });
  console.log("Seeded demo user:", user.email, "(password: demo1234)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
