import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { redirect } from "next/navigation";

import { env } from "@/env";
import type { SessionRole } from "@/types";

export const SESSION_COOKIE_NAME = "travel_session";

const secret = new TextEncoder().encode(env.sessionSecret);

export const createSessionToken = async (role: SessionRole) =>
  new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secret);

export const verifySessionToken = async (token: string) => {
  const result = await jwtVerify(token, secret);
  const role = result.payload.role;

  if (role !== "traveler" && role !== "admin") {
    throw new Error("Invalid session role");
  }

  return role;
};

export const getSessionRole = async (): Promise<SessionRole | null> => {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
};

export const requireTraveler = async () => {
  const role = await getSessionRole();
  if (!role) {
    redirect("/login");
  }

  return role;
};

export const requireAdmin = async () => {
  const role = await getSessionRole();
  if (role !== "admin") {
    redirect("/login?error=admin");
  }

  return role;
};

export const validatePasscode = (passcode: string): SessionRole | null => {
  if (passcode === env.adminPasscode) {
    return "admin";
  }

  if (passcode === env.travelerPasscode) {
    return "traveler";
  }

  return null;
};
