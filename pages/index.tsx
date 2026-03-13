import { HomeView, HomeViewProps } from '../src/views/HomeView';

export default function Home({
  navigateTo,
  isNotesOpen,
  setIsNotesOpen,
  completedPrograms,
  handleProgramClick
}: HomeViewProps) {
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
