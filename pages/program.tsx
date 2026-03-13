// Next.js page for Program
import { ProgramView } from '../src/views/ProgramView';
export default function Program() {
  return <ProgramView completedPrograms={[]} toggleProgramComplete={function (id: string): void {
      throw new Error('Function not implemented.');
  } } selectedLanguage={''} setSelectedLanguage={function (lang: string): void {
      throw new Error('Function not implemented.');
  } } darkMode={false} />;
}
