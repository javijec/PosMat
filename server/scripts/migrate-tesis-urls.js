import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const publicSiteUrl = (process.env.PUBLIC_SITE_URL || "https://posmat.fi.mdp.edu.ar").replace(/\/$/, "");
const legacyUrlPattern = /^https?:\/\/posmat\.fi\.mdp\.edu\.ar\/(?:public\/)?(?:tesis\/)?(tesis-[a-zA-Z0-9-]+\.pdf)$/;

const main = async () => {
  const entries = await prisma.contentEntry.findMany({
    where: { collectionName: "tesis" },
  });

  const updates = entries.flatMap((entry) => {
    if (!entry.data || typeof entry.data !== "object" || Array.isArray(entry.data)) return [];

    const match = entry.data.url?.match(legacyUrlPattern);
    if (!match) return [];

    return [{
      id: entry.id,
      data: {
        ...entry.data,
        url: `${publicSiteUrl}/api/uploads/tesis/${match[1]}`,
      },
    }];
  });

  await prisma.$transaction(
    updates.map(({ id, data }) => prisma.contentEntry.update({ where: { id }, data: { data } }))
  );

  console.log(`URLs actualizadas: ${updates.length}.`);
};

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
