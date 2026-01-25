import './PortfolioHome.css';
import { SkillsSection } from '../../skills/components/SkillsSection';
import { ProjectsSection } from '../../projects/components/ProjectsSection';
import { WorkExperienceSection } from '../../workExperience/components/WorkExperienceSection';
import { EducationSection } from '../../education/components/EducationSection';
import { HobbiesSection } from '../../hobbies/components/HobbiesSection';
import { ContactSection } from '../../contact/components/ContactSection';
import { CVSection } from '../../cv/components/CVSection';
import { TestimonialsSection } from '../../testimonials/components/TestimonialsSection';
import { PortfolioNavbar } from '../components/PortfolioNavbar';
import { HeroSection } from '../components/HeroSection';
import { ParticleBackground } from '../../../shared/components/ParticleBackground';

export const PortfolioHome = () => {
    return (
        <div className="bg-slate-950 min-h-screen text-white selection:bg-blue-500/30">
            <ParticleBackground />
            <PortfolioNavbar />
            
            <main style={{ position: 'relative', zIndex: 1 }}>
                <div id="home">
                    <HeroSection />
                </div>
                <div id="skills">
                    <SkillsSection />
                </div>
                <div id="projects">
                    <ProjectsSection />
                </div>
                
                {/* Experience and Education Side by Side */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '60px',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '60px 40px'
                }}>
                    <div id="experience">
                        <WorkExperienceSection />
                    </div>
                    <div id="education">
                        <EducationSection />
                    </div>
                </div>
                
                <div id="hobbies">
                    <HobbiesSection />
                </div>
                <div id="testimonials">
                    <TestimonialsSection />
                </div>
                <div id="cv">
                    <CVSection />
                </div>
                <div id="contact">
                    <ContactSection />
                </div>
            </main>
        </div>
    );
};
