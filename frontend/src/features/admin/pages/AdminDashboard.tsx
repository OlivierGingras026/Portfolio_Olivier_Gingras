import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../authentication/store/authStore';
import './AdminDashboard.css';

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
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
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

  // CRUD Handlers
  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Delete this project?')) {
      try {
        await projectsAPI.deleteProject(id);
        setProjects(projects.filter(p => p.projectId !== id));
      } catch (err) {
        console.error('Failed to delete project', err);
      }
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (window.confirm('Delete this skill?')) {
      try {
        await skillsAPI.deleteSkill(id);
        setSkills(skills.filter(s => s.skillId !== id));
      } catch (err) {
        console.error('Failed to delete skill', err);
      }
    }
  };

  const handleDeleteWorkExperience = async (id: string) => {
    if (window.confirm('Delete this work experience?')) {
      try {
        await workExperienceAPI.deleteWorkExperience(id);
        setWork(work.filter(w => w.workExperienceId !== id));
      } catch (err) {
        console.error('Failed to delete work experience', err);
      }
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (window.confirm('Delete this education?')) {
      try {
        await educationAPI.deleteEducation(id);
        setEducation(education.filter(e => e.educationId !== id));
      } catch (err) {
        console.error('Failed to delete education', err);
      }
    }
  };

  const handleDeleteHobby = async (id: string) => {
    if (window.confirm('Delete this hobby?')) {
      try {
        await hobbiesAPI.deleteHobby(id);
        setHobbies(hobbies.filter(h => h.hobbyId !== id));
      } catch (err) {
        console.error('Failed to delete hobby', err);
      }
    }
  };

  const handleSave = async (data: Record<string, unknown>) => {
    // Placeholder for now - implement based on activeTab
    console.log('Saving:', data);
    setShowModal(false);
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Admin Portal</h1>
        </div>
        
        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span>{tab.label}</span>
              {activeTab === tab.id && <div className="nav-indicator"></div>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
            <div>
                 <div className="admin-header-title">
                    {tabs.find(t => t.id === activeTab)?.label}
                </div>
                <div className="admin-header-subtitle">Manage your content here.</div>
            </div>
            <button 
              onClick={() => {
                setEditingId(null);
                setShowModal(true);
              }}
              className="add-new-btn"
            >
                + Add New
            </button>
        </header>

        {loading ? (
             <div className="loading">
                <div className="spinner"></div>
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
                    <div className="content-container">
                        {activeTab === 'projects' && (
                            <>
                            {projects.map(item => (
                                <AdminCard 
                                  key={item.projectId} 
                                  title={item.title} 
                                  subtitle={item.url}
                                  onEdit={() => {
                                    setEditingId(item.projectId);
                                    setShowModal(true);
                                  }}
                                  onDelete={() => handleDeleteProject(item.projectId)}
                                >
                                    <p className="card-description">{item.description}</p>
                                </AdminCard>
                            ))}
                            </>
                        )}
                        {activeTab === 'skills' && (
                            <>
                            {skills.map(item => (
                                <AdminCard 
                                  key={item.skillId} 
                                  title={item.title}
                                  onEdit={() => {
                                    setEditingId(item.skillId);
                                    setShowModal(true);
                                  }}
                                  onDelete={() => handleDeleteSkill(item.skillId)}
                                >
                                    <p className="card-description">{item.description}</p>
                                </AdminCard>
                            ))}
                            </>
                        )}
                        {activeTab === 'work' && (
                            <>
                            {work.map(item => (
                                <div key={item.workExperienceId} className="card" style={{ gridColumn: '1 / -1' }}>
                                    <div className="card-header">
                                        <div style={{ flex: 1 }}>
                                            <div className="card-title">{item.position}</div>
                                            <div style={{ color: '#60a5fa', fontSize: '0.875rem' }}>{item.company}</div>
                                        </div>
                                        <div className="card-actions">
                                            <button 
                                              className="card-action-btn edit"
                                              onClick={() => {
                                                setEditingId(item.workExperienceId);
                                                setShowModal(true);
                                              }}
                                            >
                                              ✏️
                                            </button>
                                            <button 
                                              className="card-action-btn delete"
                                              onClick={() => handleDeleteWorkExperience(item.workExperienceId)}
                                            >
                                              🗑️
                                            </button>
                                        </div>
                                    </div>
                                    <span className="card-meta">
                                        {item.startDate} - {item.isCurrent ? "Present" : item.endDate}
                                    </span>
                                    <p className="card-description" style={{ marginTop: '0.5rem' }}>{item.description}</p>
                                </div>
                            ))}
                            </>
                        )}
                        {activeTab === 'education' && (
                            <>
                            {education.map(item => (
                                <AdminCard 
                                  key={item.educationId} 
                                  title={item.school} 
                                  subtitle={item.degree}
                                  onEdit={() => {
                                    setEditingId(item.educationId);
                                    setShowModal(true);
                                  }}
                                  onDelete={() => handleDeleteEducation(item.educationId)}
                                >
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                                      {item.startDate} - {item.isCurrentlyStudying ? 'Present' : item.endDate}
                                    </div>
                                    <p className="card-description">{item.description}</p>
                                </AdminCard>
                            ))}
                            </>
                        )}
                        {activeTab === 'hobbies' && (
                            <>
                            {hobbies.map(item => (
                                <AdminCard 
                                  key={item.hobbyId} 
                                  title={item.title}
                                  onEdit={() => {
                                    setEditingId(item.hobbyId);
                                    setShowModal(true);
                                  }}
                                  onDelete={() => handleDeleteHobby(item.hobbyId)}
                                >
                                    <div className="card-image">
                                        {item.imageUrl && <img src={item.imageUrl} alt={item.title} />}
                                    </div>
                                    <p className="card-description">{item.description}</p>
                                </AdminCard>
                            ))}
                            </>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        )}
      </main>

      {showModal && (
        <ModalForm
          activeTab={activeTab}
          editingId={editingId}
          onClose={() => {
            setShowModal(false);
            setEditingId(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const AdminCard = ({ 
  title, 
  subtitle, 
  children,
  onEdit,
  onDelete
}: { 
  title: string, 
  subtitle?: string, 
  children: ReactNode,
  onEdit: () => void,
  onDelete: () => void
}) => (
    <div className="card">
        <div className="card-header">
             <div>
                <div className="card-title">{title}</div>
                {subtitle && <div className="card-subtitle">{subtitle}</div>}
             </div>
             <div className="card-actions">
                <button className="card-action-btn edit" onClick={onEdit}>✏️</button>
                <button className="card-action-btn delete" onClick={onDelete}>🗑️</button>
             </div>
        </div>
        <div className="card-body">{children}</div>
    </div>
);

const ModalForm = ({ 
  activeTab, 
  editingId, 
  onClose, 
  onSave 
}: {
  activeTab: string,
  editingId: string | null,
  onClose: () => void,
  onSave: (data: Record<string, unknown>) => void
}) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>{editingId ? 'Edit' : 'Add New'} {activeTab}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="form-group">
          <label className="form-label">Title</label>
          <input 
            type="text"
            className="form-input"
            placeholder="Enter title"
            value={(formData.title as string) || ''}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            placeholder="Enter description"
            value={(formData.description as string) || ''}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="form-actions">
          <button className="form-btn form-btn-primary" onClick={() => onSave(formData)}>
            Save
          </button>
          <button className="form-btn form-btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
