import './PortfolioHome.css';
import { SkillsSection } from '../../skills/components/SkillsSection';
import { ProjectsSection } from '../../projects/components/ProjectsSection';
import { WorkExperienceSection } from '../../workExperience/components/WorkExperienceSection';
import { EducationSection } from '../../education/components/EducationSection';
import { HobbiesSection } from '../../hobbies/components/HobbiesSection';
import { PortfolioNavbar } from '../components/PortfolioNavbar';
import { HeroSection } from '../components/HeroSection';

export const PortfolioHome = () => {
    return (
        <div className="bg-slate-950 min-h-screen text-white selection:bg-blue-500/30">
            <PortfolioNavbar />
            
            <main>
                <HeroSection />
                <SkillsSection />
                <ProjectsSection />
                <WorkExperienceSection />
                <EducationSection />
                <HobbiesSection />
                
                {/* Contact Footer */}
                <footer id="contact" className="py-20 bg-black border-t border-slate-900">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-8">Let's Connect</h2>
                        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                        </p>
                        <a 
                            href="mailto:contact@oliviergingras.com" 
                            className="inline-block px-8 py-3 bg-blue-600 rounded-full font-medium hover:bg-blue-700 transition-colors"
                        >
                            Say Hello
                        </a>
                        <div className="mt-12 text-slate-600 text-sm">
                            © {new Date().getFullYear()} Olivier Gingras. All rights reserved.
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};
