export const PrivacyView = () => (
  <section className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-800 dark:text-gray-200 min-h-screen">
    <h2 className="text-4xl font-bold mb-8 text-orange-500">Privacy Policy</h2>
    <div className="space-y-6">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        At DSA Study Hub, we prioritize your privacy. This policy outlines how
        we handle your data.
      </p>
      <h3 className="text-2xl font-semibold">1. Information We Collect</h3>
      <p>
        <strong>Personal Data:</strong> We only collect personal information
        that you voluntarily provide, such as your name and email when you
        register via Google or GitHub.
      </p>
      <p>
        <strong>Usage Data:</strong> We store your progress (completed programs)
        and preferences (theme settings) to enhance your learning experience.
        This data is synced to our secure database if you are logged in.
      </p>
      <h3 className="text-2xl font-semibold">2. How We Use Information</h3>
      <p>
        Your data is used solely to provide and improve the services of DSA
        Study Hub, including personalizing your experience and managing your
        account.
      </p>
      <h3 className="text-2xl font-semibold">3. Information Sharing</h3>
      <p>
        We do not sell or share your personal information with third parties,
        except as required to provide our services (e.g., authentication
        providers) or by law.
      </p>
      <h3 className="text-2xl font-semibold">4. Security</h3>
      <p>
        We implement industry-standard security measures to protect your
        information. However, no method of transmission over the internet is
        100% secure.
      </p>
    </div>
  </section>
);
