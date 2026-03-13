import { HomeView, HomeViewProps } from '../src/views/HomeView';
import { SEO } from '../src/components/SEO';


export default function Home({
  navigateTo,
  isNotesOpen,
  setIsNotesOpen,
  completedPrograms,
  handleProgramClick
}: HomeViewProps) {
  return (
    <>
      <SEO 
        title="Master Data Structures & Algorithms" 
        description="The ultimate platform to learn DSA with interactive visualizations, roadmaps, and practice questions."
      />
      <HomeView
      navigateTo={navigateTo}
      isNotesOpen={isNotesOpen}
      setIsNotesOpen={setIsNotesOpen}
      completedPrograms={completedPrograms}
      handleProgramClick={handleProgramClick}
    />
    </>
  );
}
