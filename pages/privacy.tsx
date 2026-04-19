import { PrivacyView } from '../src/views/PrivacyView';
import { SEO } from '../src/components/SEO';


export default function PrivacyPage() {
  return (
    <>
      <SEO title="Privacy Policy" description="Our privacy practices and how we handle your data." />
      <section className="pt-32 pb-20 px-4 min-h-screen">
        <PrivacyView />
      </section>
    </>
  );
}
