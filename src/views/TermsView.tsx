export const TermsView = () => (
  <section className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-800 dark:text-gray-200 min-h-screen">
    <h2 className="text-4xl font-bold mb-8 text-orange-500">
      Terms of Service
    </h2>
    <div className="space-y-6">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        By accessing or using DSA Study Hub, you agree to be bound by these
        Terms of Service.
      </p>
      <h3 className="text-2xl font-semibold">1. Use of License</h3>
      <p>
        This platform is licensed under the GNU General Public License v3.0. You
        are free to use, modify, and distribute the code in accordance with the
        license.
      </p>
      <h3 className="text-2xl font-semibold">2. Content Accuracy</h3>
      <p>
        The educational content and code examples provided are for informational
        purposes. While we strive for accuracy, we do not guarantee that the
        content is error-free.
      </p>
      <h3 className="text-2xl font-semibold">3. User Responsibility</h3>
      <p>
        You are responsible for maintaining the confidentiality of your account
        information and for all activities that occur under your account.
      </p>
      <h3 className="text-2xl font-semibold">4. Prohibited Conduct</h3>
      <p>
        You agree not to use the platform for any unlawful purpose or to
        interfere with its operation.
      </p>
    </div>
  </section>
);
