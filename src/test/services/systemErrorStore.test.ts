/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useSystemErrorStore } from "../../services/systemErrorStore";

describe("useSystemErrorStore", () => {
  beforeEach(() => {
    // Reset state to default before each test
    useSystemErrorStore.setState({
      hasSystemError: false,
      pollingInterval: 10,
    });
  });

  it("should have correct initial state", () => {
    const state = useSystemErrorStore.getState();
    expect(state.hasSystemError).toBe(false);
    expect(state.pollingInterval).toBe(10);
  });

  it("should update hasSystemError state", () => {
    const store = useSystemErrorStore.getState();
    store.setSystemError(true);

    const updatedState = useSystemErrorStore.getState();
    expect(updatedState.hasSystemError).toBe(true);
  });

  it("should update pollingInterval state", () => {
    const store = useSystemErrorStore.getState();
    store.setPollingInterval(30);

    const updatedState = useSystemErrorStore.getState();
    expect(updatedState.pollingInterval).toBe(30);
  });
});
