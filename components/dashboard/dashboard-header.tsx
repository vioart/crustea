"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react";
import { clearAuth } from "@/lib/auth";
import { useLanguage } from "@/components/language/language-provider";

type DashboardHeaderProps = {
  onMenuClick?: () => void;
};

const languages = [
  {
    code: "id" as const,
    name: "Indonesia",
    flag: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Indonesia.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
  },
  {
    code: "en" as const,
    name: "English",
    flag: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
  },
];

const translations = {
  id: {
    dashboard: "Dashboard",
    notification: "Notifikasi",
    selectLanguage: "Pilih bahasa",
    profile: "Profil",
    settings: "Pengaturan",
    logout: "Keluar",
    logoutTitle: "Keluar Dari Akun?",
    logoutDescription: "Apakah Anda yakin ingin keluar dari akun saat ini?",
    cancel: "Batal",
    confirmLogout: "Ya, Keluar",
  },
  en: {
    dashboard: "Dashboard",
    notification: "Notifications",
    selectLanguage: "Select language",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    logoutTitle: "Log Out of Account?",
    logoutDescription:
      "Are you sure you want to log out of your current account?",
    cancel: "Cancel",
    confirmLogout: "Yes, Log Out",
  },
};

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const router = useRouter();

  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const [profileOpen, setProfileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLanguageChange = (value: "id" | "en") => {
    setLanguage(value);
    setLanguageOpen(false);
  };

  const handleLogoutClick = () => {
    setProfileOpen(false);
    setLogoutModalOpen(true);
  };

  const handleLogout = () => {
    clearAuth();

    setLogoutModalOpen(false);

    router.replace("/portal/login");
  };

  return (
    <>
      <header className="sticky top-0 z-[100] h-16 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left */}
          <div className="flex items-center gap-5">
            {/* Sidebar Toggle */}
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-dark shadow-[0_3px_10px_rgba(0,0,0,0.08)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] active:scale-95"
              aria-label="Toggle sidebar"
            >
              <Menu className="size-5" strokeWidth={2.2} />
            </button>

            {/* Header Title */}
            <p className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              {t.dashboard}
            </p>
          </div>

          {/* Right */}
          <div className="ml-auto flex items-center gap-2">
            {/* Notification */}
            <button
              type="button"
              className="relative inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={t.notification}
            >
              <Bell className="size-[18px]" />

              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
            </button>

            {/* Language */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLanguageOpen((value) => !value);
                  setProfileOpen(false);
                }}
                className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-expanded={languageOpen}
                aria-haspopup="menu"
                aria-label={t.selectLanguage}
              >
                <img
                  src={languages.find((item) => item.code === language)?.flag}
                  alt=""
                  className="h-4 w-6 rounded-[2px] object-cover"
                />

                <span className="text-xs font-semibold">
                  {language.toUpperCase()}
                </span>
              </button>

              {languageOpen && (
                <>
                  {/* Click Outside */}
                  <button
                    type="button"
                    aria-label="Tutup pilihan bahasa"
                    onClick={() => setLanguageOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />

                  {/* Language Dropdown */}
                  <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-40 overflow-hidden rounded-xl border border-border bg-background p-1.5 shadow-lg">
                    {languages.map((item) => {
                      const active = language === item.code;

                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => handleLanguageChange(item.code)}
                          className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
                            active
                              ? "bg-muted font-semibold text-foreground"
                              : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <img
                            src={item.flag}
                            alt=""
                            className="h-4 w-6 shrink-0 rounded-[2px] object-cover"
                          />

                          <span className="flex-1 text-left">{item.name}</span>

                          {active && (
                            <Check className="size-4 text-brand-dark" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            <div className="relative ml-2 border-l border-border pl-3">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((value) => !value);
                  setLanguageOpen(false);
                }}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                aria-label="Buka menu profil"
              >
                {/* Avatar */}
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-dark text-xs font-semibold text-white">
                  V
                </div>

                {/* User Info */}
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold text-foreground">Vio</p>

                  <p className="text-[11px] text-muted-foreground">
                    Administrator
                  </p>
                </div>

                {/* Chevron */}
                <ChevronDown
                  className={`hidden size-4 text-muted-foreground transition-transform duration-200 sm:block ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <>
                  {/* Click Outside */}
                  <button
                    type="button"
                    aria-label="Tutup menu profil"
                    onClick={() => setProfileOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />

                  <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[230px] overflow-hidden rounded-xl border border-border bg-background shadow-lg">
                    {/* Profile Header */}
                    <div className="border-b border-border px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-dark text-sm font-semibold text-white">
                          V
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            Vio
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            Administrator
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="p-2">
                      <Link
                        href="/portal/profile"
                        onClick={() => setProfileOpen(false)}
                        className="group flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <User className="size-[17px] text-muted-foreground transition-colors group-hover:text-foreground" />

                        <span>{t.profile}</span>
                      </Link>

                      <Link
                        href="/portal/settings"
                        onClick={() => setProfileOpen(false)}
                        className="group flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Settings className="size-[17px] text-muted-foreground transition-colors group-hover:text-foreground" />

                        <span>{t.settings}</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-border p-2">
                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="group flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <LogOut className="size-[17px]" />

                        <span>{t.logout}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logout Modal */}
      {logoutModalOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setLogoutModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Icon */}
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <LogOut className="size-7" />
            </div>

            {/* Content */}
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-foreground">
                {t.logoutTitle}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t.logoutDescription}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="flex h-11 items-center justify-center rounded-lg border border-border text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
              >
                {t.cancel}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-red-500 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                <LogOut className="size-4" />
                {t.confirmLogout}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
