import './PortfolioHome.css';
import { SkillsSection } from '../../skills/components/SkillsSection';
import { ProjectsSection } from '../../projects/components/ProjectsSection';
import { WorkExperienceSection } from '../../workExperience/components/WorkExperienceSection';
import { EducationSection } from '../../education/components/EducationSection';
import { HobbiesSection } from '../../hobbies/components/HobbiesSection';
import { ContactSection } from '../../contact/components/ContactSection';
import { PortfolioNavbar } from '../components/PortfolioNavbar';
import { HeroSection } from '../components/HeroSection';
import { ParticleBackground } from '../../../shared/components/ParticleBackground';

export const PortfolioHome = () => {
    return (
        <div className="bg-slate-950 min-h-screen text-white selection:bg-blue-500/30">
            <ParticleBackground />
            <PortfolioNavbar />
            
            <main style={{ position: 'relative', zIndex: 1 }}>
                <HeroSection />
                <SkillsSection />
                <ProjectsSection />
                
                {/* Experience and Education Side by Side */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '60px',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '60px 40px'
                }}>
                    <WorkExperienceSection />
                    <EducationSection />
                </div>
                
                <HobbiesSection />
                <ContactSection />
            </main>
        </div>
    );
};
