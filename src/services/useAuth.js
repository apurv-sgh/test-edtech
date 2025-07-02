import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useTeacherAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("token");
    console.log(token);

    // If URL contains token (first-time redirect)
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get("token");
    if (tokenFromURL) {
      localStorage.setItem("token", tokenFromURL);
      token = tokenFromURL;
    }

    if (!token) {
      alert("Unauthorized. Please login.");
      navigate("/login");
    }

    // Optional: verify token with backend
    // axios.get('/api/verify', { headers: { Authorization: `Bearer ${token}` } })

  }, []);
}
