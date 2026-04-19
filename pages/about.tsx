import { AboutView } from '../src/views/AboutView';
import { SEO } from '../src/components/SEO';


export default function About() {
  return (
    <>
      <SEO 
        title="About Pranav Arun" 
        description="Learn more about the developer behind DSA Study Hub and explore my other projects and portfolio."
      />
      <AboutView />
    </>
  );
}
