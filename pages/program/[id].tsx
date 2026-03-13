import { ProgramView, ProgramViewProps } from '../../src/views/ProgramView';
import { useRouter } from 'next/router';
import { SEO } from '../../src/components/SEO';
import { programsData } from '../../src/data/programs';


export default function ProgramPage({ 
  completedPrograms, 
  toggleProgramComplete, 
  selectedLanguage, 
  setSelectedLanguage, 
  darkMode 
}: ProgramViewProps) {
  const router = useRouter();
  const { id } = router.query;
  
  if (!id) return null;

  const program = programsData.find(p => p.id === id);
  const title = program ? `${program.name} - ${program.category}` : "Program Details";
  const description = program 
    ? `Learn ${program.name} (${program.category}). Complexity: Time ${program.time}, Space ${program.space}. Difficulty: ${program.difficulty}.`
    : "Comprehensive implementation and explanation of this algorithm.";

  return (
    <>
      <SEO title={title} description={description} article />
      <ProgramView 
        completedPrograms={completedPrograms} 
        toggleProgramComplete={toggleProgramComplete} 
        selectedLanguage={selectedLanguage} 
        setSelectedLanguage={setSelectedLanguage} 
        darkMode={darkMode} 
      />
    </>
  );
}
