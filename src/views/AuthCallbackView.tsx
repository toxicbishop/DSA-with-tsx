
export function AuthCallbackView() {
  // Only import/use router on client
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    // Dynamically import useRouter to avoid SSR issues
    import('next/router').then(({ useRouter }) => {
      const router = useRouter();
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        secureFetch(`${import.meta.env.VITE_API_URL}/api/auth/github`, {
          method: "POST",
          body: JSON.stringify({ code }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              window.location.href = "/";
            } else {
              console.error(data.message);
              router.push("/");
            }
          })
          .catch((err) => {
            console.error("GitHub auth failed", err);
            router.push("/");
          });
      } else {
        router.push("/");
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Authenticating with GitHub...
      </h2>
      <Loader />
    </div>
  );
}
