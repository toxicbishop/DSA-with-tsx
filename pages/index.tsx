// Next.js page for Home
import { useState } from 'react';
import { HomeView } from '../src/views/HomeView';

export default function Home() {
  // Minimal state for required props
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [completedPrograms, setCompletedPrograms] = useState<string[]>([]);

  // Stub navigation and handler
  const navigateTo = (view: string) => {
    // For demo: just log or use router.push if needed
    // router.push(`/${view}`) if using next/router
    console.log('Navigate to:', view);
  };
  const handleProgramClick = (name: string) => {
    // For demo: just log
    console.log('Program clicked:', name);
  };

  return (
    <HomeView
      navigateTo={navigateTo}
      isNotesOpen={isNotesOpen}
      setIsNotesOpen={setIsNotesOpen}
      completedPrograms={completedPrograms}
      handleProgramClick={handleProgramClick}
    />
  );
}
