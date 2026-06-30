/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { useState } from "react";
import { useIdentityStore } from "../identityStore";
import { useNavigate } from "react-router-dom";

export function useRegisterForm() {
  const navigate = useNavigate();
  const { register, isLoading } = useIdentityStore();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/catalog");
    } catch {
      // Handled in store
    }
  };

  return {
    form,
    onChange,
    isLoading,
    onSubmit,
  };
}
