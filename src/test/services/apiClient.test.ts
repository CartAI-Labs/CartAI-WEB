/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import axios from "axios";
import { apiClient } from "../../services/apiClient";
import { useSystemErrorStore } from "../../services/systemErrorStore";

describe("apiClient response interceptor", () => {
  let rejectHandler: any;

  beforeEach(() => {
    // Reset system error store
    useSystemErrorStore.setState({
      hasSystemError: false,
    });

    // Find the interceptor's reject handler
    // Axios store handlers in an array. We search for the handlers registered.
    const handlers = (apiClient.interceptors.response as any).handlers;
    const lastHandler = handlers[handlers.length - 1];
    rejectHandler = lastHandler.rejected;

    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("should set system error on network/connection error (no response)", async () => {
    const mockError = {
      message: "Network Error",
      isAxiosError: true,
      response: undefined,
    };

    // Trigger the reject handler
    await expect(rejectHandler(mockError)).rejects.toEqual(mockError);

    // Verify it set the system error state to true
    expect(useSystemErrorStore.getState().hasSystemError).toBe(true);
  });

  it("should set system error on 5xx server errors", async () => {
    const mockError = {
      isAxiosError: true,
      response: {
        status: 500,
        statusText: "Internal Server Error",
        data: {},
      },
    };

    await expect(rejectHandler(mockError)).rejects.toEqual(mockError);
    expect(useSystemErrorStore.getState().hasSystemError).toBe(true);
  });

  it("should not set system error on 4xx client errors", async () => {
    const mockError = {
      isAxiosError: true,
      response: {
        status: 404,
        statusText: "Not Found",
        data: {},
      },
    };

    await expect(rejectHandler(mockError)).rejects.toEqual(mockError);
    expect(useSystemErrorStore.getState().hasSystemError).toBe(false);
  });

  it("should not set system error on canceled requests", async () => {
    // Mock axios.isCancel to return true
    const isCancelSpy = vi.spyOn(axios, "isCancel").mockReturnValue(true);

    const mockError = {
      message: "canceled",
    };

    await expect(rejectHandler(mockError)).rejects.toEqual(mockError);
    expect(useSystemErrorStore.getState().hasSystemError).toBe(false);

    isCancelSpy.mockRestore();
  });
});
