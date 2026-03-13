import PathfindingVisualizer from '../src/components/PathfindingVisualizer';
import { SEO } from '../src/components/SEO';


export default function VisualizerPage() {
  return (
    <>
      <SEO 
        title="Pathfinding Visualizer" 
        description="Explore graph traversal algorithms like BFS, DFS, and Dijkstra's with an interactive grid visualization tool."
      />
      <section className="pt-32 pb-20 px-4 min-h-screen">
        <PathfindingVisualizer />
      </section>
    </>
  );
}
