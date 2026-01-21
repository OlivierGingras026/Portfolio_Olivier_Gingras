import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../authentication/store/authStore';

// APIs
import { projectsAPI } from '../../projects/api/projectsAPI';
import { skillsAPI } from '../../skills/api/skillsAPI';
import { workExperienceAPI } from '../../workExperience/api/workExperienceAPI';
import { educationAPI } from '../../education/api/educationAPI';
import { hobbiesAPI } from '../../hobbies/api/hobbiesAPI';
import { authAPI } from '../../authentication/api/authAPI';

// Types
import type { Project } from '../../projects/types';
import type { Skill } from '../../skills/types';
import type { WorkExperience } from '../../workExperience/types';
import type { Education } from '../../education/types';
import type { Hobby } from '../../hobbies/types';

export const AdminDashboard = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'projects' | 'work' | 'education' | 'skills' | 'hobbies'>('projects');
  
  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [work, setWork] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [p, s, w, e, h] = await Promise.all([
          projectsAPI.getAllProjects(),
          skillsAPI.getAllSkills(),
          workExperienceAPI.getAllWorkExperiences(),
          educationAPI.getAllEducation(),
          hobbiesAPI.getAllHobbies()
        ]);
        setProjects(p);
        setSkills(s);
        setWork(w);
        setEducation(e);
        setHobbies(h);
      } catch (err) {
        console.error("Failed to load data", err);
        // If unauthorized, we can double check or logout
        try {
            const isValid = await authAPI.verifyToken();
            if(!isValid) throw new Error("Invalid token");
        } catch {
             logout();
             navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [logout, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'projects', label: 'Projects' },
    { id: 'work', label: 'Work Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'hobbies', label: 'Hobbies' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Admin Portal
          </h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                activeTab === tab.id
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <span className="font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
            <div>
                 <h2 className="text-2xl font-bold text-white mb-1">
                    {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-slate-500 text-sm">Manage your content here.</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all text-sm font-medium">
                + Add New
            </button>
        </header>

        {loading ? (
             <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
             </div>
        ) : (
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'projects' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(item => (
                                <Card key={item.projectId} title={item.title} subtitle={item.url}>
                                    <p className="line-clamp-3 text-sm text-slate-400">{item.description}</p>
                                </Card>
                            ))}
                        </div>
                    )}
                    {activeTab === 'skills' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {skills.map(item => (
                                <Card key={item.skillId} title={item.title}>
                                    <p className="text-xs text-slate-500">{item.description}</p>
                                </Card>
                            ))}
                        </div>
                    )}
                    {activeTab === 'work' && (
                        <div className="space-y-4">
                            {work.map(item => (
                                <div key={item.workExperienceId} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{item.position}</h3>
                                            <div className="text-blue-400 text-sm">{item.company}</div>
                                        </div>
                                        <div className="bg-slate-800 px-3 py-1 rounded text-xs text-slate-400">
                                            {item.startDate} - {item.isCurrent ? "Present" : item.endDate}
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'education' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {education.map(item => (
                                <Card key={item.educationId} title={item.school} subtitle={item.degree}>
                                    <p className="text-xs text-slate-500 mb-2">{item.startDate} - {item.isCurrentlyStudying ? 'Present' : item.endDate}</p>
                                    <p className="text-sm text-slate-400">{item.description}</p>
                                </Card>
                            ))}
                        </div>
                    )}
                    {activeTab === 'hobbies' && (
                       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {hobbies.map(item => (
                                <Card key={item.hobbyId} title={item.title}>
                                    <div className="aspect-square bg-slate-800 rounded-lg mb-3 overflow-hidden">
                                        {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <p className="text-xs text-slate-500">{item.description}</p>
                                </Card>
                            ))}
                       </div>
                    )}
                </motion.div>
            </AnimatePresence>
        )}
      </main>
    </div>
  );
};

const Card = ({ title, subtitle, children }: { title: string, subtitle?: string, children: ReactNode }) => (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors group">
        <div className="flex justify-between items-start mb-3">
             <div className="flex-1">
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{title}</h3>
                {subtitle && <div className="text-xs text-slate-500 font-mono mt-1">{subtitle}</div>}
             </div>
             <button className="text-slate-600 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
             </button>
        </div>
        <div>{children}</div>
    </div>
);
