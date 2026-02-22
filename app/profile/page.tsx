"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Bottombar from "@/app/components/Bottombar";
import SchoolSearch from "@/app/components/SchoolSearch";

interface School {
  id: string;
  name: string;
  province: string;
  district: string;
  schoolType: string;
}

const gradeLevels = [
  { level: 1, label: "ม.1", color: "from-rose-500 to-pink-600" },
  { level: 2, label: "ม.2", color: "from-orange-500 to-amber-600" },
  { level: 3, label: "ม.3", color: "from-emerald-500 to-teal-600" },
  { level: 4, label: "ม.4", color: "from-cyan-500 to-blue-600" },
  { level: 5, label: "ม.5", color: "from-violet-500 to-purple-600" },
  { level: 6, label: "ม.6", color: "from-fuchsia-500 to-pink-600" },
];

const CONTACT_OPTIONS = [
  { value: "ig", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "line", label: "Line" },
  { value: "discord", label: "Discord" },
  { value: "x", label: "X (Twitter)" },
];

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Current school/grade info
  const [currentGrade, setCurrentGrade] = useState<number | null>(null);
  const [currentSchool, setCurrentSchool] = useState<{ id: string; name: string; province: string } | null>(null);

  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialIg, setSocialIg] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialLine, setSocialLine] = useState("");
  const [socialDiscord, setSocialDiscord] = useState("");
  const [socialX, setSocialX] = useState("");
  const [mainContact, setMainContact] = useState("");
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [saveSocialSuccess, setSaveSocialSuccess] = useState(false);

  // Username
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [saveUsernameSuccess, setSaveUsernameSuccess] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  // Fetch current school/grade and username on mount
  useEffect(() => {
    if (!session) return;
    fetch("/api/user/school").then(r => r.ok ? r.json() : null).then(data => {
      if (!data) return;
      setCurrentGrade(data.gradeLevel ?? null);
      setCurrentSchool(data.school ?? null);
    }).catch(() => {});
    fetch("/api/user/username").then(r => r.ok ? r.json() : null).then(data => {
      if (!data) return;
      setCurrentUsername(data.username ?? null);
    }).catch(() => {});
  }, [session]);

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = session.user;
  const displayImage = avatarUrl ?? user.image;

  const openSocialModal = async () => {
    setShowSocialModal(true);
    const res = await fetch("/api/user/social");
    if (res.ok) {
      const data = await res.json();
      setSocialIg(data.socialIg ?? "");
      setSocialFacebook(data.socialFacebook ?? "");
      setSocialLine(data.socialLine ?? "");
      setSocialDiscord(data.socialDiscord ?? "");
      setSocialX(data.socialX ?? "");
      setMainContact(data.mainContact ?? "");
    }
  };

  const handleSaveSocial = async () => {
    setIsSavingSocial(true);
    try {
      await fetch("/api/user/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ socialIg, socialFacebook, socialLine, socialDiscord, socialX, mainContact }),
      });
      setSaveSocialSuccess(true);
      setTimeout(() => {
        setSaveSocialSuccess(false);
        setShowSocialModal(false);
      }, 1200);
    } finally {
      setIsSavingSocial(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { imageUrl } = await res.json();
        setAvatarUrl(imageUrl);
      }
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleSaveInfo = async () => {
    if (!selectedSchool && !selectedGrade) return;
    setIsSaving(true);
    try {
      await fetch("/api/user/school", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId: selectedSchool?.id,
          gradeLevel: selectedGrade,
        }),
      });
      if (selectedGrade) setCurrentGrade(selectedGrade);
      if (selectedSchool) setCurrentSchool({ id: selectedSchool.id, name: selectedSchool.name, province: selectedSchool.province });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowEditModal(false);
      }, 1200);
    } catch {
      // silent
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = () => {
    setSelectedGrade(currentGrade);
    setSelectedSchool(currentSchool ? { id: currentSchool.id, name: currentSchool.name, province: currentSchool.province, district: "", schoolType: "" } : null);
    setShowEditModal(true);
  };

  const openUsernameModal = () => {
    setUsernameInput(currentUsername ?? "");
    setUsernameError("");
    setSaveUsernameSuccess(false);
    setShowUsernameModal(true);
  };

  const handleSaveUsername = async () => {
    setIsSavingUsername(true);
    setUsernameError("");
    try {
      const res = await fetch("/api/user/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput }),
      });
      if (res.status === 409) {
        setUsernameError("ชื่อผู้ใช้นี้ถูกใช้แล้ว");
        return;
      }
      setCurrentUsername(usernameInput.trim() || null);
      setSaveUsernameSuccess(true);
      setTimeout(() => {
        setSaveUsernameSuccess(false);
        setShowUsernameModal(false);
      }, 1200);
    } finally {
      setIsSavingUsername(false);
    }
  };

  const gradeLevelLabel = gradeLevels.find(g => g.level === currentGrade)?.label;

  return (
    <div>
      <Navbar />
      <Bottombar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8">
        {/* Header */}
        <div className="relative overflow-hidden p-12 px-4">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 -left-10 w-48 h-48 bg-cyan-300/20 rounded-full blur-2xl" />
          </div>
          <div className="relative flex flex-col items-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full ring-4 ring-white shadow-xl overflow-hidden bg-white">
                {isUploadingAvatar ? (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50">
                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : displayImage ? (
                  <Image
                    src={displayImage}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100">
                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-blue-50 transition-colors border border-gray-200 disabled:opacity-50"
                title="เปลี่ยนรูปโปรไฟล์"
              >
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-700">{user.name}</h1>
            {currentUsername && (
              <p className="text-blue-500 text-sm mt-0.5">@{currentUsername}</p>
            )}
            <p className="text-gray-400 text-sm mt-1">{user.email}</p>
            {/* Current grade/school badge */}
            {(gradeLevelLabel || currentSchool) && (
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {gradeLevelLabel && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">{gradeLevelLabel}</span>
                )}
                {currentSchool && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full truncate max-w-[200px]">{currentSchool.name}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Cards */}
        <div className="max-w-md mx-auto px-4 -mt-8 space-y-3">
          {/* Username */}
          <button
            onClick={openUsernameModal}
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all duration-200 text-left"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800">ชื่อผู้ใช้</p>
              <p className="text-sm text-gray-500 truncate">{currentUsername ? `@${currentUsername}` : "ยังไม่ได้ตั้ง"}</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* อัปเดตข้อมูล */}
          <button
            onClick={openEditModal}
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all duration-200 text-left"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800">อัปเดตข้อมูลส่วนตัว</p>
              <p className="text-sm text-gray-500 truncate">
                {gradeLevelLabel && currentSchool
                  ? `${gradeLevelLabel} · ${currentSchool.name}`
                  : gradeLevelLabel || (currentSchool ? currentSchool.name : "โรงเรียน, ระดับชั้น")}
              </p>
            </div>
            <svg className="w-5 h-5 text-gray-400 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={openSocialModal}
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all duration-200 text-left"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Social Media ของฉัน</p>
              <p className="text-sm text-gray-500">IG, Facebook, Line, Discord, X</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* ยันต์ฟรีด้อม */}
          <Link href="/freedom" className="block">
            <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all duration-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" viewBox="0 0 600 600" fill="none" stroke="currentColor" strokeWidth="30" strokeLinecap="round">
                  <rect x="50" y="50" width="500" height="500" />
                  <rect x="120" y="120" width="360" height="360" />
                  <rect x="200" y="200" width="200" height="200" transform="rotate(45 300 300)" />
                  <line x1="200" y1="200" x2="400" y2="400" />
                  <line x1="400" y1="200" x2="200" y2="400" />
                  <path d="M240 120 H360" /><path d="M240 120 Q300 160 360 120" />
                  <path d="M240 480 H360" /><path d="M240 480 Q300 440 360 480" />
                  <path d="M120 240 V360" /><path d="M120 240 Q160 300 120 360" />
                  <path d="M480 240 V360" /><path d="M480 240 Q440 300 480 360" />
                  <line x1="300" y1="50" x2="300" y2="80" /><line x1="300" y1="520" x2="300" y2="550" />
                  <line x1="50" y1="300" x2="80" y2="300" /><line x1="520" y1="300" x2="550" y2="300" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">ยันต์ฟรีด้อม</p>
                <p className="text-sm text-gray-500">บูชาแล้วสอบผ่านทุกวิชา</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </Link>

          {/* ติดต่อ IG */}
          <Link href="https://www.instagram.com/act.freedom" target="_blank" rel="noopener noreferrer" className="block">
            <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md hover:border-pink-200 transition-all duration-200">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-pink-600" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17" cy="7" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">ติดต่อเรา</p>
                <p className="text-sm text-gray-500">@act.freedom บน Instagram</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </Link>

          {/* ออกจากระบบ */}
          <button
            onClick={() => signOut().then(() => router.push("/"))}
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md hover:border-red-200 transition-all duration-200 text-left"
          >
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-red-500">ออกจากระบบ</p>
            </div>
          </button>
        </div>
      </main>

      {/* Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowUsernameModal(false)} />
          <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">ชื่อผู้ใช้</h2>
              <button onClick={() => setShowUsernameModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อผู้ใช้ (username)</label>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                <span className="px-3 py-2.5 text-gray-400 text-sm bg-gray-50 border-r border-gray-300">@</span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value.replace(/[^a-zA-Z0-9_.]/g, ""))}
                  placeholder="your_username"
                  className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
                  maxLength={30}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">ตัวอักษร a-z, 0-9, _ และ . เท่านั้น</p>
              {usernameError && <p className="text-xs text-red-500 mt-1">{usernameError}</p>}
            </div>
            <button
              onClick={handleSaveUsername}
              disabled={isSavingUsername}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200"
            >
              {saveUsernameSuccess ? "บันทึกแล้ว!" : isSavingUsername ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </div>
      )}

      {/* Edit Info Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">อัปเดตข้อมูลส่วนตัว</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <SchoolSearch onSelect={setSelectedSchool} selected={selectedSchool} />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">ระดับชั้น</label>
              <div className="grid grid-cols-3 gap-2">
                {gradeLevels.map((grade) => (
                  <button
                    key={grade.level}
                    onClick={() => setSelectedGrade(grade.level)}
                    className={`relative p-3 rounded-xl text-center font-bold text-sm transition-all duration-200 ${
                      selectedGrade === grade.level
                        ? `bg-gradient-to-br ${grade.color} text-white shadow-md scale-105`
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {grade.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveInfo}
              disabled={(!selectedSchool && !selectedGrade) || isSaving}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200"
            >
              {saveSuccess ? "บันทึกแล้ว!" : isSaving ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </div>
      )}

      {/* Social Media Modal */}
      {showSocialModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSocialModal(false)} />
          <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">Social Media ของฉัน</h2>
              <button onClick={() => setShowSocialModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <svg className="w-4 h-4 text-pink-500" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="17" cy="7" r="1.5" fill="currentColor"/>
                  </svg>
                  Instagram
                </label>
                <input type="text" value={socialIg} onChange={(e) => setSocialIg(e.target.value)} placeholder="username (ไม่ต้องใส่ @)" className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </label>
                <input type="text" value={socialFacebook} onChange={(e) => setSocialFacebook(e.target.value)} placeholder="ชื่อหรือ URL โปรไฟล์" className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                  </svg>
                  Line
                </label>
                <input type="text" value={socialLine} onChange={(e) => setSocialLine(e.target.value)} placeholder="Line ID" className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <svg className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.112 18.1.128 18.11a19.91 19.91 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Discord
                </label>
                <input type="text" value={socialDiscord} onChange={(e) => setSocialDiscord(e.target.value)} placeholder="username หรือ server invite link" className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <svg className="w-4 h-4 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X (Twitter)
                </label>
                <input type="text" value={socialX} onChange={(e) => setSocialX(e.target.value)} placeholder="username (ไม่ต้องใส่ @)" className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Main Contact Selector */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <label className="block text-sm font-medium text-gray-700 mb-1">ช่องทางติดต่อหลัก</label>
              <p className="text-xs text-gray-500 mb-3">ปุ่ม &quot;ติดต่อเจ้าของชีท&quot; จะใช้ช่องทางนี้</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setMainContact("")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${mainContact === "" ? "bg-gray-600 text-white" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"}`}
                >
                  ไม่ระบุ
                </button>
                {CONTACT_OPTIONS.filter(o => {
                  if (o.value === "ig") return socialIg.trim();
                  if (o.value === "facebook") return socialFacebook.trim();
                  if (o.value === "line") return socialLine.trim();
                  if (o.value === "discord") return socialDiscord.trim();
                  if (o.value === "x") return socialX.trim();
                  return false;
                }).map(o => (
                  <button
                    key={o.value}
                    onClick={() => setMainContact(o.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${mainContact === o.value ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-300 hover:bg-blue-50"}`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              {!socialIg.trim() && !socialFacebook.trim() && !socialLine.trim() && !socialDiscord.trim() && !socialX.trim() && (
                <p className="text-xs text-gray-400 mt-2">กรอก social media ด้านบนก่อนเพื่อเลือกช่องทางหลัก</p>
              )}
            </div>

            <button
              onClick={handleSaveSocial}
              disabled={isSavingSocial}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200"
            >
              {saveSocialSuccess ? "บันทึกแล้ว!" : isSavingSocial ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
