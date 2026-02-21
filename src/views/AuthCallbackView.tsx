import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { getCsrfToken } from "../utils/csrf";

export function AuthCallbackView() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetch(`${import.meta.env.VITE_API_URL}/api/auth/github`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-xsrf-token": getCsrfToken() || "",
        },
        body: JSON.stringify({ code }),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Ideally we'd set the user state here, but App.tsx will
            // pick it up on the next navigation/reload via /me or we can
            // just force a reload
            window.location.href = "/";
          } else {
            console.error(data.message);
            navigate("/");
          }
        })
        .catch((err) => {
          console.error("GitHub auth failed", err);
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Authenticating with GitHub...
      </h2>
      <Loader />
    </div>
  );
}
