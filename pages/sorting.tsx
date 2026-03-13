import SortingVisualizer from '../src/components/SortingVisualizer';
import { SEO } from '../src/components/SEO';


export default function SortingPage() {
  return (
    <>
      <SEO 
        title="Sorting Algorithms Visualizer" 
        description="Visualize Bubble Sort, Merge Sort, Quick Sort, and Heap Sort with real-time animations and step-by-step logic."
      />
      <section className="pt-32 pb-20 px-4 min-h-screen">
        <SortingVisualizer />
      </section>
    </>
  );
}
