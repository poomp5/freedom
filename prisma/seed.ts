import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const MOE_API_URL =
  "https://exchange-api.moe.go.th/api/openv1/GetopenData49/2565/1";

interface MoeSchool {
  schoolID: string;
  schoolTypeName: string;
  provinceNameThai: string;
  districtNameThai: string;
  departmentNameThai: string;
}

async function main() {
  console.log("Fetching schools from MOE API...");
  const res = await fetch(MOE_API_URL);
  const data: MoeSchool[] = await res.json();
  console.log(`Fetched ${data.length} schools. Inserting into database...`);

  // Deduplicate by schoolID and clean data
  const seen = new Set<string>();
  const schools = data
    .filter((s) => {
      if (!s.schoolID || seen.has(s.schoolID)) return false;
      seen.add(s.schoolID);
      return true;
    })
    .map((s) => ({
      id: s.schoolID,
      name: s.schoolTypeName.trim(),
      province: s.provinceNameThai.trim(),
      district: s.districtNameThai.trim(),
      schoolType: s.departmentNameThai.trim(),
    }));

  // Batch insert in chunks of 500
  const BATCH_SIZE = 500;
  let inserted = 0;

  for (let i = 0; i < schools.length; i += BATCH_SIZE) {
    const batch = schools.slice(i, i + BATCH_SIZE);
    await prisma.school.createMany({
      data: batch,
      skipDuplicates: true,
    });
    inserted += batch.length;
    if (inserted % 5000 === 0 || inserted === schools.length) {
      console.log(`  ${inserted}/${schools.length} schools inserted...`);
    }
  }

  console.log(`Seeding complete. ${schools.length} schools processed.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
