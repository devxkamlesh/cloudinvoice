"use client";

import { createAuthClient } from "better-auth/react";

// Use NEXT_PUBLIC_APP_URL if available, otherwise use window.location.origin
// This ensures the client always has the correct base URL in production
const baseURL = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

export const authClient = createAuthClient({ baseURL });
