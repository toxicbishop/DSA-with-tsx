import SystemDesign from '../src/components/SystemDesign';
import { SEO } from '../src/components/SEO';


export default function SystemDesignPage() {
  return (
    <>
      <SEO 
        title="System Design Concepts" 
        description="Master high-level system design patterns, scalability, load balancing, and architectural trade-offs."
      />
      <section className="pt-32 pb-20 px-4 min-h-screen">
        <SystemDesign />
      </section>
    </>
  );
}
