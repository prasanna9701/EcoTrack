import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const pageStyles = {
  minHeight: "100vh",
  margin: 0,
  padding: "0 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#ffffff",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
};

const cardStyles = {
  width: "100%",
  maxWidth: "420px",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "32px 28px 28px",
  boxShadow: "0 20px 44px rgba(15, 23, 42, 0.12)",
  color: "#0f172a",
};

const titleStyles = {
  fontSize: "24px",
  fontWeight: 600,
  marginBottom: "10px",
  color: "#0f172a",
  textAlign: "center",
};

const subtitleStyles = {
  fontSize: "14px",
  color: "#475569",
  textAlign: "center",
};

const formStyles = {
  marginTop: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const labelStyles = {
  fontSize: "13px",
  fontWeight: 500,
};

const inputStyles = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#ffffff",
  color: "#0f172a",
  fontSize: "14px",
  outline: "none",
};

const submitButtonStyles = {
  marginTop: "8px",
  width: "100%",
  padding: "11px",
  borderRadius: "999px",
  border: "none",
  background:
    "linear-gradient(135deg, #22c55e, #16a34a, #22c55e 60%, #4ade80 100%)",
  color: "#022c22",
  fontWeight: 600,
  fontSize: "14px",
  cursor: "pointer",
};

const backButtonStyles = {
  marginTop: "10px",
  width: "100%",
  padding: "10px",
  borderRadius: "999px",
  border: "1px solid rgba(148, 163, 184, 0.4)",
  background: "transparent",
  color: "#475569",
  fontWeight: 500,
  cursor: "pointer",
};

const errorStyles = {
  fontSize: "12px",
  color: "#f87171",
  textAlign: "center",
};

const rememberRowStyles = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "12px",
  color: "#475569",
};

const footerStyles = {
  marginTop: "18px",
  fontSize: "12px",
  color: "#64748b",
  textAlign: "center",
};

const REMEMBER_KEY = "ecotrack_remember_me";
const REMEMBERED_EMAIL_KEY = "ecotrack_remembered_email";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  /*
    AUTO REDIRECT IF USER ALREADY LOGGED IN
  */
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate("/home");
      }
    };

    checkSession();
  }, [navigate]);

  /*
    LOAD REMEMBERED EMAIL
  */
  useEffect(() => {
    const storedRemember = localStorage.getItem(REMEMBER_KEY);

    const shouldRemember =
      storedRemember === null ? true : storedRemember === "true";

    setRememberMe(shouldRemember);

    if (shouldRemember) {
      const rememberedEmail =
        localStorage.getItem(REMEMBERED_EMAIL_KEY);

      if (rememberedEmail) {
        setEmail(rememberedEmail);
      }
    }
  }, []);

  /*
    LOGIN HANDLER
  */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter email and password");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    /*
      SAVE REMEMBER STATE
    */
    localStorage.setItem(REMEMBER_KEY, String(rememberMe));

    if (rememberMe) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }

    navigate("/home");
  };

  return (
    <div style={pageStyles}>
      <div style={cardStyles}>
        <h1 style={titleStyles}>Sign in to EcoTrack</h1>

        <p style={subtitleStyles}>
          Welcome back. Enter your credentials to continue.
        </p>

        <form style={formStyles} onSubmit={handleSubmit}>
          <div>
            <label style={labelStyles}>Work email</label>

            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyles}
            />
          </div>

          <div>
            <label style={labelStyles}>Password</label>

            <input
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyles}
            />
          </div>

          <label style={rememberRowStyles}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: "#22c55e" }}
            />
            Keep me remembered
          </label>

          {errorMessage && (
            <div style={errorStyles}>{errorMessage}</div>
          )}

          <button
            type="submit"
            style={submitButtonStyles}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          <button
            type="button"
            style={backButtonStyles}
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </form>

        <div style={footerStyles}>
          Don’t have access yet? Contact your administrator.
        </div>
      </div>
    </div>
  );
};

export default Login;