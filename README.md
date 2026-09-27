![FREEDOM BANNER](https://img2.pic.in.th/pic/github-image-banner2e179f89930d92ce.png)

<h2 align="center">ฟรีด้อม — พื้นที่แบ่งปันชีทสรุป ม.1–ม.6</h2>

<p align="center">
  ชีทดี ๆ จากเพื่อน ถึงเพื่อน · รวมชีทสรุปจากนักเรียนในชุมชน Freedom ทั้งฟรีและแบบมีค่าใช้จ่าย
</p>

<p align="center">
  <a href="https://www.instagram.com/act.freedom"><img src="https://img.shields.io/badge/Instagram-act.freedom-E4405F?style=flat-square&logo=instagram&logoColor=white" alt="Instagram act.freedom" /></a>
  <a href="https://poomp5.com"><img src="https://img.shields.io/badge/Developer-poomp5-2563EB?style=flat-square" alt="Developer poomp5" /></a>
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Deployed on Vercel" />
  <img src="https://img.shields.io/badge/Database-Neon-00E599?style=flat-square&logo=postgresql&logoColor=white" alt="Neon Postgres" />
</p>

---

## เกี่ยวกับโปรเจกต์

Freedom เริ่มจากเว็บแจกชีทสรุปของนักเรียนโรงเรียนอัสสัมชัญธนบุรี และกำลังเติบโตเป็นแพลตฟอร์มที่ใครก็แบ่งปันชีทสรุปได้

- **ค้นหาชีท** กรองตามระดับชั้น ม.1–ม.6 ประเภทสอบ (กลางภาค / ปลายภาค) เทอม และวิชา ได้ในหน้าเดียวที่ [`/sheets`](https://github.com/poomp5/freedom/tree/main/app/sheets)
- **เผยแพร่ชีทเองได้** สมัครสมาชิก แล้วส่งคำขอเป็นผู้เผยแพร่ เมื่อแอดมิน **approve บัญชี** แล้ว จะอัปโหลดชีทได้ทันทีจากแดชบอร์ด
- **ชีทฟรีหรือตั้งราคา** ผู้เผยแพร่เลือกได้ ผู้ซื้อโอนผ่านพร้อมเพย์และแนบสลิป ระบบตรวจสลิปอัตโนมัติ
- **โปรไฟล์ผู้จัดทำ** ทุกชีทลิงก์ไปหน้าโปรไฟล์ของเจ้าของ พร้อมช่องทางติดต่อและปุ่มโดเนทผ่านพร้อมเพย์
- **แดชบอร์ด** ดูสถิติการเข้าชม การโหลดชีท และการอัปโหลด

ปัจจุบันระบบรันบน **Vercel** และใช้ฐานข้อมูล **Neon (Serverless Postgres)** โปรเจกต์จะพัฒนาต่อไปเรื่อย ๆ

### เผยแพร่ชีทของคุณ

1. สมัครสมาชิก / เข้าสู่ระบบด้วย Google
2. ส่งคำขอเป็นผู้เผยแพร่
3. รอแอดมินตรวจสอบและ approve บัญชี
4. อัปโหลดชีทจาก **แดชบอร์ด → อัปโหลดชีท** ตั้งเป็นชีทฟรีหรือกำหนดราคาได้

## Tech Stack

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,prisma,postgres,vercel,cloudflare,bun&perline=9" alt="Tech stack icons" />
  </a>
</p>

| ส่วน | เทคโนโลยี |
| --- | --- |
| **Framework** | <img src="https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" /> <img src="https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" /> <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /> |
| **Styling / UI** | <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /> <img src="https://img.shields.io/badge/Flowbite-1C64F2?style=flat-square&logo=flowbite&logoColor=white" alt="Flowbite" /> <img src="https://img.shields.io/badge/Lucide_Icons-F56565?style=flat-square&logo=lucide&logoColor=white" alt="Lucide" /> <img src="https://img.shields.io/badge/Kanit_Font-4285F4?style=flat-square&logo=googlefonts&logoColor=white" alt="Kanit via Google Fonts" /> |
| **API / Data fetching** | <img src="https://img.shields.io/badge/tRPC_11-2596BE?style=flat-square&logo=trpc&logoColor=white" alt="tRPC" /> <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="TanStack Query" /> <img src="https://img.shields.io/badge/Zod_4-3E67B1?style=flat-square&logo=zod&logoColor=white" alt="Zod" /> |
| **Database / ORM** | <img src="https://img.shields.io/badge/Neon_Postgres-00E599?style=flat-square&logo=postgresql&logoColor=white" alt="Neon Postgres" /> <img src="https://img.shields.io/badge/Prisma_7-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" /> |
| **Auth** | <img src="https://img.shields.io/badge/Better_Auth-000000?style=flat-square" alt="Better Auth" /> <img src="https://img.shields.io/badge/Google_OAuth-4285F4?style=flat-square&logo=google&logoColor=white" alt="Google OAuth" /> |
| **File storage** | <img src="https://img.shields.io/badge/Cloudflare_R2-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare R2" /> <img src="https://img.shields.io/badge/pdf--lib-B31B1B?style=flat-square&logo=adobeacrobatreader&logoColor=white" alt="pdf-lib" /> |
| **Payments** | <img src="https://img.shields.io/badge/PromptPay_QR-1A3D8F?style=flat-square" alt="PromptPay" /> <img src="https://img.shields.io/badge/SlipOK_slip_verification-00A950?style=flat-square" alt="SlipOK" /> |
| **Notifications** | <img src="https://img.shields.io/badge/Discord_Webhook-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Discord Webhook" /> |
| **Hosting / Tooling** | <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" /> <img src="https://img.shields.io/badge/Bun-000000?style=flat-square&logo=bun&logoColor=white" alt="Bun" /> <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint" /> |

## เริ่มพัฒนาในเครื่อง

```bash
bun install        # ติดตั้ง dependencies (รัน prisma generate ให้อัตโนมัติ)
bun dev            # เปิด dev server ที่ http://localhost:3000
bun run build      # build สำหรับ production
bun run lint       # ตรวจโค้ดด้วย ESLint
```

สร้างไฟล์ `.env.local` แล้วกำหนดค่าต่อไปนี้

| ตัวแปร | ใช้ทำอะไร |
| --- | --- |
| `DATABASE_URL` | Connection string ของ Neon Postgres |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL` | ตั้งค่า Better Auth |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | เข้าสู่ระบบด้วย Google |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT`, `R2_PUBLIC_URL` | เก็บไฟล์ PDF / รูปบน Cloudflare R2 |
| `DISCORD_WEBHOOK` | แจ้งเตือนคำขอผู้เผยแพร่และข้อความติดต่อเข้า Discord |

> ⚠️ อย่าชี้ `DATABASE_URL` ในเครื่องไปที่ฐานข้อมูล production เวลารัน `prisma db push`

## ติดต่อ

- **โรงเรียนอื่นที่อยากใช้ระบบ Freedom** ติดต่อได้เลย! กรอกชื่อโรงเรียนและอีเมลในฟอร์ม "ติดต่อใช้ระบบ Freedom" ท้ายหน้าแรกของเว็บ หรือทักมาทาง Instagram
- **พบปัญหาหรือช่องโหว่ของเว็บไซต์** ติดต่อผู้พัฒนา [poonyapat_poom](https://www.instagram.com/poonyapat_poom/)
- ติดตามข่าวสาร [act.freedom](https://www.instagram.com/act.freedom)

## ลิขสิทธิ์

> โปรเจกต์นี้เปิดโค้ดเป็นสาธารณะ หากต้องการนำไปพัฒนาต่อสามารถนำไปใช้งานได้ 🩷
>
> ❌ สามารถเผยแพร่ไฟล์ PDF ต่อได้ เฉพาะที่มีโลโก้ฟรีด้อมในหน้าปกเท่านั้น นอกเหนือจากนั้นถือเป็นลิขสิทธิ์ของผู้เขียน ต้องขออนุญาตก่อน

<p align="center">พัฒนาโดย <a href="https://poomp5.com">poomp5</a> · Made with care, shared with everyone.</p>
