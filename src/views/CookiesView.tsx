export const CookiesView = () => (
  <section className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-800 dark:text-gray-200 min-h-screen">
    <h2 className="text-4xl font-bold mb-8 text-orange-500">Cookie Policy</h2>
    <div className="space-y-6">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        DSA Study Hub uses cookies and similar technologies to provide a better
        experience.
      </p>
      <h3 className="text-2xl font-semibold">1. What are Cookies?</h3>
      <p>
        Cookies are small text files stored on your device that help us
        recognize you and remember your preferences.
      </p>
      <h3 className="text-2xl font-semibold">2. Types of Cookies We Use</h3>
      <p>
        <strong>Essential Cookies:</strong> These are required for the platform
        to function correctly (e.g., authentication and security).
      </p>
      <p>
        <strong>Preference Cookies:</strong> We use local storage to remember
        settings like your theme preference (Dark/Light mode).
      </p>
      <h3 className="text-2xl font-semibold">3. Third-Party Cookies</h3>
      <p>
        We may use services like Google Analytics or authentication providers
        that may set their own cookies on your device.
      </p>
    </div>
  </section>
);
