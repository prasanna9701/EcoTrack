import React from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      setSession(data.session);
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) return null;

  if (!session) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
