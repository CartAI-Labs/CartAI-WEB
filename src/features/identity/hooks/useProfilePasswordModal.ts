/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";

export interface PendingPassword {
  old: string;
  new: string;
}

export function useProfilePasswordModal() {
  const { t: translate } = useTranslation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingPassword, setPendingPassword] = useState<PendingPassword | null>(null);

  const [form, setForm] = useState({
    old: "",
    new: "",
    repeat: "",
    error: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onOpenPasswordModal = () => {
    setShowPasswordModal(true);
  };

  const onClosePasswordModal = () => {
    setShowPasswordModal(false);
    setForm({ old: "", new: "", repeat: "", error: "" });
  };

  const onPasswordModalOk = () => {
    if (!form.old || !form.new || !form.repeat) {
      setForm((prev) => ({ ...prev, error: translate("profile.errorAllFields") }));
      return;
    }
    if (form.new !== form.repeat) {
      setForm((prev) => ({ ...prev, error: translate("profile.errorMismatch") }));
      return;
    }
    setPendingPassword({ old: form.old, new: form.new });
    onClosePasswordModal();
  };

  const clearPendingPassword = () => {
    setPendingPassword(null);
  };

  return {
    showPasswordModal,
    onOpenPasswordModal,
    onClosePasswordModal,
    pendingPassword,
    clearPendingPassword,
    form,
    onChange,
    onPasswordModalOk,
  };
}
