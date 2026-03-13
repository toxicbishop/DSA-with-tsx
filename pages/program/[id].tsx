import { ProgramView, ProgramViewProps } from '../../src/views/ProgramView';
import { useRouter } from 'next/router';

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

  return (
    <ProgramView 
      completedPrograms={completedPrograms} 
      toggleProgramComplete={toggleProgramComplete} 
      selectedLanguage={selectedLanguage} 
      setSelectedLanguage={setSelectedLanguage} 
      darkMode={darkMode} 
    />
  );
}
