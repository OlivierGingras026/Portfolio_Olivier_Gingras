import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../authentication/store/authStore';
import './AdminDashboard.css';

// Modal Components - Add
import { AddProjectModal } from '../../projects/components/AddProjectModal';
import { AddSkillModal } from '../../skills/components/AddSkillModal';
import { AddWorkExperienceModal } from '../../workExperience/components/AddWorkExperienceModal';
import { AddEducationModal } from '../../education/components/AddEducationModal';
import { AddHobbyModal } from '../../hobbies/components/AddHobbyModal';


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
import { EditProjectModal } from '../../projects/components/EditProjectModal';
import { DeleteProjectModal } from '../../projects/components/DeleteProjectModal';
import { EditSkillModal } from '../../skills/components/EditSkillModal';
import { DeleteSkillModal } from '../../skills/components/DeleteSkillModal';
import { EditWorkExperienceModal } from '../../workExperience/components/EditWorkExperienceModal';
import { DeleteWorkExperienceModal } from '../../workExperience/components/DeleteWorkExperienceModal';
import { EditEducationModal } from '../../education/components/EditEducationModal';
import { EditHobbyModal } from '../../hobbies/components/EditHobbyModal';
import { DeleteHobbyModal } from '../../hobbies/components/DeleteHobbyModal';
import { DeleteEducationModal } from '../../education/components/DeleteEducationModal';

export const AdminDashboard = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'projects' | 'work' | 'education' | 'skills' | 'hobbies'>('projects');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Record<string, unknown> | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingTitle, setDeletingTitle] = useState<string>('');
  
  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [work, setWork] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
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
      try {
        const isValid = await authAPI.verifyToken();
        if (!isValid) throw new Error("Invalid token");
      } catch {
        logout();
        navigate('/admin/login');
      }
    }
    setLoading(false);
  }, [logout, navigate]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleOpenModal = (id?: string) => {
    if (id) {
      setEditingId(id);
      setModalType('edit');
      // Fetch the specific item data for editing
      if (activeTab === 'projects') {
        const item = projects.find(p => p.projectId === id);
        setEditingData(item as unknown as Record<string, unknown>);
      } else if (activeTab === 'skills') {
        const item = skills.find(s => s.skillId === id);
        setEditingData(item as unknown as Record<string, unknown>);
      } else if (activeTab === 'work') {
        const item = work.find(w => w.workExperienceId === id);
        setEditingData(item as unknown as Record<string, unknown>);
      } else if (activeTab === 'education') {
        const item = education.find(e => e.educationId === id);
        setEditingData(item as unknown as Record<string, unknown>);
      } else if (activeTab === 'hobbies') {
        const item = hobbies.find(h => h.hobbyId === id);
        setEditingData(item as unknown as Record<string, unknown>);
      }
    } else {
      setEditingId(null);
      setEditingData(undefined);
      setModalType('add');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setEditingData(undefined);
    setDeletingId(null);
    setDeletingTitle('');
    setModalType('add');
  };

  const handleModalSuccess = () => {
    fetchAllData();
    handleCloseModal();
  };

  const tabs = [
    { id: 'projects', label: 'Projects' },
    { id: 'work', label: 'Work Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'hobbies', label: 'Hobbies' },
  ] as const;

  // CRUD Handlers
  const handleDeleteProject = async (id: string, title: string) => {
    setDeletingId(id);
    setDeletingTitle(title);
    setModalType('delete');
    setShowModal(true);
  };

  const handleDeleteSkill = async (id: string, title: string) => {
    setDeletingId(id);
    setDeletingTitle(title);
    setModalType('delete');
    setShowModal(true);
  };

  const handleDeleteWorkExperience = async (id: string, title: string) => {
    setDeletingId(id);
    setDeletingTitle(title);
    setModalType('delete');
    setShowModal(true);
  };

  const handleDeleteEducation = async (id: string, title: string) => {
    setDeletingId(id);
    setDeletingTitle(title);
    setModalType('delete');
    setShowModal(true);
  };

  const handleDeleteHobby = async (id: string, title: string) => {
    setDeletingId(id);
    setDeletingTitle(title);
    setModalType('delete');
    setShowModal(true);
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
              onClick={() => handleOpenModal()}
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
                                  onEdit={() => handleOpenModal(item.projectId)}
                                  onDelete={() => handleDeleteProject(item.projectId, item.title)}
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
                                  onEdit={() => handleOpenModal(item.skillId)}
                                  onDelete={() => handleDeleteSkill(item.skillId, item.title)}
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
                                              onClick={() => handleOpenModal(item.workExperienceId)}
                                            >
                                              ✏️
                                            </button>
                                            <button 
                                              className="card-action-btn delete"
                                              onClick={() => handleDeleteWorkExperience(item.workExperienceId, item.position)}
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
                                  onEdit={() => handleOpenModal(item.educationId)}
                                  onDelete={() => handleDeleteEducation(item.educationId, item.school)}
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
                                  onEdit={() => handleOpenModal(item.hobbyId)}
                                  onDelete={() => handleDeleteHobby(item.hobbyId, item.title)}
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

      {/* Projects Modals */}
      {showModal && activeTab === 'projects' && modalType === 'add' && (
        <AddProjectModal 
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}
      {showModal && activeTab === 'projects' && modalType === 'edit' && (
        <EditProjectModal 
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          editingId={editingId}
          existingData={editingData}
        />
      )}
      {showModal && activeTab === 'projects' && modalType === 'delete' && (
        <DeleteProjectModal 
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          deletingId={deletingId}
          deletingTitle={deletingTitle}
        />
      )}

      {/* Skills Modals */}
      {showModal && activeTab === 'skills' && modalType === 'add' && (
        <AddSkillModal 
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}
      {showModal && activeTab === 'skills' && modalType === 'edit' && (
        <EditSkillModal 
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          editingId={editingId}
          existingData={editingData}
        />
      )}
      {showModal && activeTab === 'skills' && modalType === 'delete' && (
        <DeleteSkillModal 
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          deletingId={deletingId}
          deletingTitle={deletingTitle}
        />
      )}

      {/* Work Experience Modals */}
      {showModal && activeTab === 'work' && modalType === 'add' && (
        <AddWorkExperienceModal 
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}
      {showModal && activeTab === 'work' && modalType === 'edit' && (
        <EditWorkExperienceModal 
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          editingId={editingId}
          existingData={editingData}
        />
      )}
      {showModal && activeTab === 'work' && modalType === 'delete' && (
        <DeleteWorkExperienceModal 
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          deletingId={deletingId}
          deletingTitle={deletingTitle}
        />
      )}

      {/* Education Modals */}
      {showModal && activeTab === 'education' && modalType === 'add' && (
        <AddEducationModal 
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}
      {showModal && activeTab === 'education' && modalType === 'edit' && (
        <EditEducationModal 
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          editingId={editingId}
          existingData={editingData}
        />
      )}
      {showModal && activeTab === 'education' && modalType === 'delete' && (
        <DeleteEducationModal 
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          deletingId={deletingId}
          deletingTitle={deletingTitle}
        />
      )}

      {/* Hobbies Modals */}
      {showModal && activeTab === 'hobbies' && modalType === 'add' && (
        <AddHobbyModal 
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}
      {showModal && activeTab === 'hobbies' && modalType === 'edit' && (
        <EditHobbyModal 
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          editingId={editingId}
          existingData={editingData}
        />
      )}
      {showModal && activeTab === 'hobbies' && modalType === 'delete' && (
        <DeleteHobbyModal 
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          deletingId={deletingId}
          deletingTitle={deletingTitle}
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
