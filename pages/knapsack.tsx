import KnapsackVisualizer from '../src/components/KnapsackVisualizer';
import { SEO } from '../src/components/SEO';


export default function KnapsackPage() {
  return (
    <>
      <SEO 
        title="Knapsack DP Visualizer" 
        description="Learn Dynamic Programming by visualizing the 0/1 Knapsack problem with an interactive step-by-step table builder."
      />
      <section className="pt-32 pb-20 px-4 min-h-screen">
        <KnapsackVisualizer />
      </section>
    </>
  );
}
