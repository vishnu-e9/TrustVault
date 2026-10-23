import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server.js";

describe("TrustVault API Security Tests", () => {
  it("should return 200 for the health check", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "TrustVault backend is running"
    );
  });

  it("should reject audit-log requests without authentication", async () => {
    const response = await request(app).get(
      "/api/documents/audit-logs"
    );

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should reject user-profile requests without authentication", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
  });

  it("should reject forgot-password requests without an email", async () => {
    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject reset-password requests without required fields", async () => {
    const response = await request(app)
      .post("/api/auth/reset-password")
      .send({ resetToken: "test_token" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject verify-mfa requests without tempToken", async () => {
    const response = await request(app)
      .post("/api/auth/verify-mfa")
      .send({ mfaCode: "123456" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
