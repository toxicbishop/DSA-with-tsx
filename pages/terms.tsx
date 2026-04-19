import { TermsView } from '../src/views/TermsView';
import { SEO } from '../src/components/SEO';


export default function TermsPage() {
  return (
    <>
      <SEO title="Terms of Service" description="Terms and conditions for using DSA Study Hub." />
      <section className="pt-32 pb-20 px-4 min-h-screen">
        <TermsView />
      </section>
    </>
  );
}
