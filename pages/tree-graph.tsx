import TreeGraphVisualizer from '../src/components/TreeGraphVisualizer';
import { SEO } from '../src/components/SEO';


export default function TreeGraphPage() {
  return (
    <>
      <SEO 
        title="Trees & Graphs Visualizer" 
        description="Visualize tree structures and graph traversals in real-time. Understand BFS, DFS, and Tree rotations visually."
      />
      <section className="pt-32 pb-20 px-4 min-h-screen">
        <TreeGraphVisualizer />
      </section>
    </>
  );
}
