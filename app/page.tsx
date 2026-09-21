import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, Heart, Sparkles, Upload, Users } from "lucide-react";
import Bottombar from "./components/Bottombar";
import Navbar from "./components/Navbar";
import Countdown from "./components/Countdown";
import HomeSheetSection from "./components/HomeSheetSection";
import CommunityUpdates from "./components/CommunityUpdates";
import { basePath } from "./components/config";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import styles from "./page.module.css";

const levels = [
  { grade: 1, title: "เริ่มต้นบทใหม่", text: "ค่อย ๆ ปูพื้นฐาน ไปด้วยกัน" },
  { grade: 2, title: "ต่อยอดความเข้าใจ", text: "ทบทวนให้แม่น พร้อมบทเรียนใหม่" },
  { grade: 3, title: "พร้อมก้าวต่อไป", text: "เก็บเนื้อหา ม.ต้น ให้ครบก่อนสอบ" },
  { grade: 4, title: "เปิดโลก ม.ปลาย", text: "วิชาใหม่แค่ไหน ก็เริ่มเข้าใจได้" },
  { grade: 5, title: "เก็บทุกบทสำคัญ", text: "เติมความมั่นใจ ทีละวิชา" },
  { grade: 6, title: "เข้าใกล้เป้าหมาย", text: "ทบทวนครั้งสำคัญ ก่อนก้าวต่อไป" },
];
const faqs = [
  ["เริ่มหาชีทสรุปได้จากตรงไหน?", "เลือกระดับชั้น ม.1–ม.6 ของคุณ แล้วเลือกเทอมและการสอบที่ต้องการ หรือเข้าไปที่ชีทจากชุมชนเพื่อค้นหาตามวิชาได้เลย"],
  ["ชีทสรุปอ่านฟรีไหม?", "ชีทในคลังสรุปของ Freedom เปิดให้ดาวน์โหลดฟรี ส่วนชีทจากชุมชนมีทั้งแบบฟรีและมีค่าใช้จ่าย โดยจะแสดงราคาไว้บนแต่ละชีท"],
  ["อยากแบ่งปันชีทของตัวเอง ต้องทำอย่างไร?", "เข้าสู่ระบบ แล้วไปที่หน้าอัปโหลดชีท หากยังไม่ได้เป็นผู้เผยแพร่ สามารถส่งคำขอผ่านระบบก่อนเริ่มแบ่งปันผลงานได้"],
];

export default async function Home() {
  await prefetch(trpc.settings.getCountdown.queryOptions());

  return (
    <HydrateClient>
      <div className={styles.landing}>
        <Navbar />
        <Bottombar />
        <main>
          <section className={styles.hero}>
            <div className={`${styles.container} ${styles.heroGrid}`}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}><span className={styles.dot} /> พื้นที่เล็ก ๆ ของคนอยากเรียนรู้</span>
                <h1>ฟรีด้อม<br /><span>พื้นที่แบ่งปัน</span></h1>
                <p className={styles.heroLead}>ชีทดี ๆ จากเพื่อน ถึงเพื่อน</p>
                <p className={styles.description}>รวมชีทสรุป ม.1–ม.6 และความรู้จากชุมชน Freedom<br className="hidden sm:block" /> ให้การทบทวนก่อนสอบง่ายขึ้น ในแบบของคุณ</p>
                <div className={styles.perks}>
                  {["ครบทั้ง ม.ต้น และ ม.ปลาย", "เลือกอ่านได้ทุกที่"].map(text => <span key={text}><Check size={15} />{text}</span>)}
                </div>
                <div className={styles.actions}>
                  <a href="#levels" className={styles.primary}>เริ่มหาชีทสรุป <ArrowDown size={18} /></a>
                  <Link href="/sheets" className={styles.secondary}>สำรวจชีทจากชุมชน <ArrowUpRight size={18} /></Link>
                </div>
              </div>
              <div className={styles.art}>
                <span className={styles.artLabel}>A LITTLE NOTE, A BIG DIFFERENCE.</span>
                <div className={styles.backSheet} aria-hidden="true" />
                <div className={styles.noteSheet}>
                  <div className={styles.noteTop}><BookOpen size={22} /><span>FREEDOM STUDY CLUB</span><Sparkles size={19} /></div>
                  <p className={styles.noteHeading}>เรื่องยาก ๆ<br /><span>เข้าใจได้ :)</span></p>
                  <div className={styles.noteLines} aria-hidden="true"><i /><i /><i /></div>
                  <div className={styles.subjects}><span>คณิตศาสตร์</span><span>วิทยาศาสตร์</span><span>ภาษาอังกฤษ</span></div>
                  <div className={styles.noteBottom}><span>สรุปไว้ให้แล้ว</span><ArrowUpRight size={24} /></div>
                </div>
                <div className={styles.sticker}><Sparkles size={17} /> อ่านนิด เข้าใจอีกหน่อย</div>
                <div className={styles.mascot}><Image src="/assets/img/freedom-avatar.png" alt="มาสคอต Freedom เพื่อนช่วยอ่านหนังสือ" width={190} height={190} priority /></div>
                <span className={styles.artCaption}>your next chapter starts here ↗</span>
              </div>
            </div>
          </section>

          <div className={styles.facts}>
            <div className={styles.container}>
              <div><strong>ม.1–ม.6</strong><span>เติบโตไปด้วยกันทุกชั้นปี</span></div>
              <div><strong>ทุกเทอม</strong><span>ทั้งกลางภาคและปลายภาค</span></div>
              <div><strong>เพื่อนช่วยเพื่อน</strong><span>ส่งต่อความรู้ผ่านชีทสรุป</span></div>
              <div><strong>ทุกที่ ทุกเวลา</strong><span>ทบทวนในจังหวะของคุณ</span></div>
            </div>
          </div>

          <section id="levels" className={`${styles.container} ${styles.section}`}>
            <div className={styles.sectionHead}>
              <div><span className={styles.kicker}>เริ่มจากห้องเรียนของคุณ</span><h2>วันนี้ อยากทบทวนอะไร?</h2><p>เลือกระดับชั้น แล้วไปเจอชีทที่ใช่กัน</p></div>
              <Link href="/select" className={styles.textLink}>ดูชีทสรุปทั้งหมด <ArrowUpRight size={18} /></Link>
            </div>
            <div className={styles.levelGrid}>
              {levels.map(({ grade, title, text }) => (
                <Link href={`/m${grade}/${basePath}`} key={grade} className={styles.levelCard}>
                  <div className={styles.cardTop}><span>0{grade}</span><ArrowUpRight size={20} /></div>
                  <span className={styles.grade}>ม.{grade}</span>
                  <div className={styles.cardFooter}>เปิดชีทสรุป <ArrowRight size={16} /></div>
                </Link>
              ))}
            </div>
          </section>

          <section className={styles.communityIntro}>
            <div className={styles.container}>
              <div className={styles.sectionHead}><div><span className={styles.kicker}>ความรู้ดีขึ้น เมื่อเราแบ่งปัน</span><h2>อ่านเองก็ได้ แบ่งปันยิ่งดี</h2><p>เป็นทั้งคนเรียนรู้ และคนที่ช่วยให้เพื่อนเข้าใจมากขึ้น</p></div><Users size={42} strokeWidth={1.3} /></div>
              <div className={styles.pathGrid}>
                <Link href="/sheets" className={styles.readerCard}><BookOpen size={28} /><span className={styles.pathLabel}>FOR THE LEARNERS</span><h3>เจอสรุปที่เข้าใจ<br />ในสไตล์ของคุณ</h3><p>ค้นพบมุมมองใหม่ ๆ จากชีทที่เพื่อนและพี่ ๆ ตั้งใจสรุปไว้</p><span className={styles.textLink}>สำรวจชีทจากชุมชน <ArrowRight size={18} /></span></Link>
                <Link href="/dashboard/publisher/sheets" className={styles.creatorCard}><Upload size={28} /><span className={styles.pathLabel}>FOR THE SHARERS</span><h3>สรุปที่คุณตั้งใจ<br />อาจช่วยใครได้อีกหลายคน</h3><p>ส่งต่อสิ่งที่รู้ แบ่งปันชีทของคุณให้ชุมชน Freedom</p><span className={styles.textLink}>เริ่มแบ่งปันชีท <ArrowRight size={18} /></span></Link>
              </div>
            </div>
          </section>
          <CommunityUpdates />
          <section className={`${styles.container} ${styles.exam}`}>
            <div><span className={styles.kicker}>ทีละบท ทีละนิด ก็พร้อมได้</span><h2>นับถอยหลังสู่วันสอบ</h2><p>วางแผนอ่านวันนี้ ให้วันสอบมั่นใจกว่าเดิม</p></div>
            <div className={styles.countdown}><Countdown /></div>
          </section>
          <HomeSheetSection />
          <section className={`${styles.container} ${styles.section} ${styles.faq}`}>
            <div><span className={styles.kicker}>เผื่อคุณกำลังสงสัย</span><h2>คำถามที่พบบ่อย</h2><p>เริ่มต้นกับ Freedom ได้ง่าย ๆ</p></div>
            <div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
          </section>
          <section className={styles.closing}><span className={styles.kicker}>LET’S GROW TOGETHER</span><h2>ก้าวต่อไป เริ่มจากชีทแรก</h2><p>หยิบสรุปที่ใช่ แล้วเริ่มเรียนรู้ไปด้วยกัน</p><Link href="/select" className={styles.primary}>ไปเลือกชีทกัน <ArrowRight size={18} /></Link></section>
        </main>
        <footer className={`${styles.container} ${styles.footer}`}><div><Link href="/" className={styles.wordmark}>freedom<span>®</span></Link><p>พื้นที่แบ่งปันความรู้ของพวกเรา</p></div><div><a href="https://www.instagram.com/act.freedom">Instagram <ArrowUpRight size={14} /></a><Link href="/donate">สนับสนุน Freedom <Heart size={14} /></Link></div><span>Made with care, shared with everyone.</span></footer>
      </div>
    </HydrateClient>
  );
}
