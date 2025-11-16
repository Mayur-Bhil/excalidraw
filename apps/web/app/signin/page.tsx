"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function SigninPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/signin`, formData);
      
      if (response.data.success) {
        // Store token
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        
        // Redirect to home
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "black",
      color: "white"
    }}>
      <div style={{
        background: "#1a1a1a",
        padding: "40px",
        borderRadius: "8px",
        width: "400px"
      }}>
        <h1 style={{ marginBottom: "30px", textAlign: "center" }}>Sign In</h1>
        
        <form onSubmit={handleSignin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #333",
                background: "#2a2a2a",
                color: "white"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #333",
                background: "#2a2a2a",
                color: "white"
              }}
            />
          </div>

          {error && (
            <div style={{
              background: "#ff4444",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "20px"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Don't have an account?{" "}
          <a
            href="/signup"
            style={{ color: "#4CAF50", textDecoration: "none" }}
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}