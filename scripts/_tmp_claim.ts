import "dotenv/config";
import { prisma } from "@/lib/prisma";

// usage: bun run scripts/_tmp_claim.ts <handle> <email> [--apply]
const [handle, email] = process.argv.slice(2);
const APPLY = process.argv.includes("--apply");

const owner = await prisma.user.findUnique({ where: { email },
  select: { id: true, name: true, username: true, role: true, _count: { select: { sheets: true } } } });
if (!owner) { console.log(`*** no account for ${email} ***`); process.exit(1); }
console.log(`OWNER: ${owner.name} (@${owner.username ?? "-"}) role=${owner.role} sheets=${owner._count.sheets}`);

const sheets = await prisma.sheet.findMany({
  where: { title: { contains: `(by ${handle})` } },
  select: { id: true, title: true, level: true, examType: true, term: true, uploader: { select: { email: true } } },
});
const owners = new Map<string, number>();
for (const s of sheets) owners.set(s.uploader.email, (owners.get(s.uploader.email) ?? 0) + 1);
console.log(`\n(by ${handle}) -> ${sheets.length} sheets; current owners: ${JSON.stringify([...owners])}\n`);

for (const s of sheets) {
  const newTitle = s.title.replace(/\s*\(by\s+[^)]+\)\s*/i, " ").replace(/\s+/g, " ").trim();
  console.log(`  "${s.title}" -> "${newTitle}"  [${s.level} ${s.examType} ${s.term}]`);
  if (APPLY) await prisma.sheet.update({ where: { id: s.id }, data: { uploadedBy: owner.id, title: newTitle } });
}

if (APPLY) {
  if (owner.role === "user") {
    await prisma.user.update({ where: { id: owner.id }, data: { role: "publisher" } });
    console.log(`\nrole: user -> publisher`);
  }
  const after = await prisma.user.findUnique({ where: { id: owner.id }, select: { role: true, _count: { select: { sheets: true } } } });
  console.log(`\n${owner.name} (${after!.role}) now owns ${after!._count.sheets} sheets`);
  console.log(`remaining (by ${handle}):`, await prisma.sheet.count({ where: { title: { contains: handle } } }));
  console.log("total sheets:", await prisma.sheet.count());
} else console.log("\n-- dry run --");
