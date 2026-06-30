/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { useState, useEffect } from "react";
import { useIdentityStore } from "../identityStore";
import { settingsService } from "../../settings/settingsService";
import { useNavigate } from "react-router-dom";

export function useProfileGeneralForm(pendingPassword: any, clearPendingPassword: () => void) {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, uploadAvatar } = useIdentityStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    taxId: "",
    preferredLanguage: "",
  });

  const [languages, setLanguages] = useState<string[]>([]);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Session redirection and general data initialization
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    } else {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        taxId: user.taxId || "",
        preferredLanguage: user.preferredLanguage || "",
      });

      if (user.avatarFileId) {
        setPreviewUrl(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/storage/files/${user.avatarFileId}`
        );
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch languages list
  useEffect(() => {
    settingsService.getLanguages().then(setLanguages).catch(console.error);
  }, []);

  // Dropdown closing utility
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".lang-dropdown-container")) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { name: string; value: string }) => {
    const name = 'target' in e ? e.target.name : e.name;
    const value = 'target' in e ? e.target.value : e.value;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploading(true);

    try {
      if (!user) return;
      await uploadAvatar(user.id, file);
    } catch (err: any) {
      if (user?.avatarFileId) {
        setPreviewUrl(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/storage/files/${user.avatarFileId}`
        );
      } else {
        setPreviewUrl("");
      }
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateProfile({
        id: user.id,
        name: form.name,
        roles: user.roles,
        avatarFileId: user.avatarFileId || undefined,
        oldPassword: pendingPassword?.old,
        newPassword: pendingPassword?.new,
        phone: form.phone,
        taxId: form.taxId,
        preferredLanguage: form.preferredLanguage,
      });
      clearPendingPassword();
    } catch (err: any) {
      // Handled in store
    }
  };

  return {
    user,
    form,
    onChange,
    languages,
    isLangDropdownOpen,
    setIsLangDropdownOpen,
    previewUrl,
    setPreviewUrl,
    uploading,
    onAvatarChange,
    onSubmit,
  };
}
