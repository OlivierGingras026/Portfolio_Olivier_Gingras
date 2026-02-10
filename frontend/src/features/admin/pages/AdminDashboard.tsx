import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../authentication/store/authStore';
import { LanguageSwitcher } from '../../../shared/components/LanguageSwitcher';
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
import { contactAPI, reachMeAPI, type ContactMessage, type ReachMeProfile } from '../../contact/api/contactAPI';
import { cvAPI, type CVFile } from '../../cv/api/cvAPI';
import { testimonialAPI, type Testimonial } from '../../testimonials/api/testimonialAPI';
import { authAPI } from '../../authentication/api/authAPI';
import { portfolioAPI } from '../../../shared/api/portfolioAPI';

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
import { EditCVModal } from '../../cv/components/EditCVModal';
import { DeleteCVModal } from '../../cv/components/DeleteCVModal';

export const AdminDashboard = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'projects' | 'work' | 'education' | 'skills' | 'hobbies' | 'contact' | 'reachme' | 'cv' | 'testimonials'>('projects');
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
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [profileData, setProfileData] = useState<ReachMeProfile | null>(null);
  const [reachmeEditForm, setReachmeEditForm] = useState({ email: '', basedIn: '', availabilityStatus: '', availabilityStatusFr: '' });
  const [isEditingReachme, setIsEditingReachme] = useState(false);
  const [allCVs, setAllCVs] = useState<CVFile[]>([]);
  const [editingCVId, setEditingCVId] = useState<string | null>(null);
  const [editingCVLanguage, setEditingCVLanguage] = useState(false);
  const [editingCVFile, setEditingCVFile] = useState<File | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pendingTestimonials, setPendingTestimonials] = useState<Testimonial[]>([]);
  const [cvFileInput, setCvFileInput] = useState<File | null>(null);
  const [cvFileInputIsFrench, setCvFileInputIsFrench] = useState(false);
  const [loading, setLoading] = useState(true);

  // Language-aware getter functions
  const getProjectTitle = (project: Project): string => {
    return i18n.language === 'fr' ? (project.titleFr || project.title) : project.title;
  };

  const getProjectDescription = (project: Project): string => {
    return i18n.language === 'fr' ? (project.descriptionFr || project.description) : project.description;
  };

  const getSkillTitle = (skill: Skill): string => {
    return i18n.language === 'fr' ? (skill.titleFr || skill.title) : skill.title;
  };

  const getSkillDescription = (skill: Skill): string => {
    return i18n.language === 'fr' ? (skill.descriptionFr || skill.description) : skill.description;
  };

  const getWorkPosition = (work: WorkExperience): string => {
    return i18n.language === 'fr' ? (work.positionFr || work.position) : work.position;
  };

  const getWorkCompany = (work: WorkExperience): string => {
    return i18n.language === 'fr' ? (work.companyFr || work.company) : work.company;
  };

  const getWorkDescription = (work: WorkExperience): string => {
    return i18n.language === 'fr' ? (work.descriptionFr || work.description) : work.description;
  };

  const getEducationSchool = (edu: Education): string => {
    return i18n.language === 'fr' ? (edu.schoolFr || edu.school) : edu.school;
  };

  const getEducationDegree = (edu: Education): string => {
    return i18n.language === 'fr' ? (edu.degreeFr || edu.degree) : edu.degree;
  };

  const getEducationDescription = (edu: Education): string => {
    return i18n.language === 'fr' ? (edu.descriptionFr || edu.description) : edu.description;
  };

  const getHobbyTitle = (hobby: Hobby): string => {
    return i18n.language === 'fr' ? (hobby.titleFr || hobby.title) : hobby.title;
  };

  const getHobbyDescription = (hobby: Hobby): string => {
    return i18n.language === 'fr' ? (hobby.descriptionFr || hobby.description) : hobby.description;
  };

  const getTestimonialTitle = (testimonial: Testimonial): string => {
    return i18n.language === 'fr' ? (testimonial.titleFr || testimonial.title) : testimonial.title;
  };

  const getTestimonialCompany = (testimonial: Testimonial): string | undefined => {
    return i18n.language === 'fr' ? (testimonial.companyFr || testimonial.company) : testimonial.company;
  };

  const getTestimonialMessage = (testimonial: Testimonial): string => {
    return i18n.language === 'fr' ? (testimonial.messageFr || testimonial.message) : testimonial.message;
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('[fetchAllData] Starting data fetch');
      const [p, s, w, e, h, msgs, prof] = await Promise.all([
        projectsAPI.getAllProjects(),
        skillsAPI.getAllSkills(),
        workExperienceAPI.getAllWorkExperiences(),
        educationAPI.getAllEducation(),
        hobbiesAPI.getAllHobbies(),
        contactAPI.getAllMessages(),
        reachMeAPI.getProfile()
      ]);
      console.log('[fetchAllData] Fetched data:', { projects: p.length, skills: s.length, work: w.length, education: e.length, hobbies: h.length, messages: msgs.length });
      setProjects(p);
      setSkills(s);
      setWork(w);
      setEducation(e);
      setHobbies(h);
      setMessages(msgs);
      setProfileData(prof);
      setReachmeEditForm({ email: prof.email, basedIn: prof.basedIn, availabilityStatus: prof.availabilityStatus, availabilityStatusFr: prof.availabilityStatusFr });
      
      // Fetch all CVs
      try {
        const cvs = await cvAPI.getAllCVs();
        setAllCVs(cvs);
      } catch {
        setAllCVs([]);
      }
      
      // Fetch testimonials
      try {
        const [pending, all] = await Promise.all([
          testimonialAPI.getPendingTestimonials(),
          testimonialAPI.getAllTestimonials()
        ]);
        setTestimonials(all);
        setPendingTestimonials(pending);
      } catch {
        setTestimonials([]);
        setPendingTestimonials([]);
      }
      console.log('[fetchAllData] Data update complete');
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

  const handleModalSuccess = async () => {
    console.log('[AdminDashboard] Modal success - starting data refresh');
    portfolioAPI.invalidateCache();
    await fetchAllData();
    console.log('[AdminDashboard] Data refresh complete - closing modal');
    handleCloseModal();
  };

  const tabs = [
    { id: 'projects', label: t('admin.projects') },
    { id: 'work', label: t('admin.experience') },
    { id: 'education', label: t('admin.education') },
    { id: 'skills', label: t('admin.skills') },
    { id: 'hobbies', label: t('admin.hobbies') },
    { id: 'contact', label: t('admin.messages') },
    { id: 'reachme', label: t('admin.profileTab') },
    { id: 'cv', label: t('admin.cvTab') },
    { id: 'testimonials', label: t('admin.testimonials') },
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

  const handleDeleteMessage = async (id: string) => {
    try {
      await contactAPI.deleteMessage(id);
      setMessages(messages.filter(m => m.messageId !== id));
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await contactAPI.markAsRead(id);
      setMessages(messages.map(m => m.messageId === id ? { ...m, isRead: true } : m));
    } catch (err) {
      console.error("Failed to mark message as read", err);
    }
  };

  const handleSaveReachme = async () => {
    try {
      await reachMeAPI.updateProfile({
        email: reachmeEditForm.email,
        basedIn: reachmeEditForm.basedIn,
        availabilityStatus: reachmeEditForm.availabilityStatus,
        availabilityStatusFr: reachmeEditForm.availabilityStatusFr
      });
      setIsEditingReachme(false);
      fetchAllData();
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleUploadCV = async () => {
    if (!cvFileInput) return;
    try {
      await cvAPI.uploadCV(cvFileInput, cvFileInputIsFrench);
      setCvFileInput(null);
      setCvFileInputIsFrench(false);
      fetchAllData();
    } catch (err) {
      console.error("Failed to upload CV", err);
    }
  };

  const handleApproveTestimonial = async (id: string) => {
    try {
      await testimonialAPI.approveTestimonial(id);
      fetchAllData();
    } catch (err) {
      console.error("Failed to approve testimonial", err);
    }
  };

  const handleRejectTestimonial = async (id: string) => {
    try {
      await testimonialAPI.rejectTestimonial(id);
      fetchAllData();
    } catch (err) {
      console.error("Failed to reject testimonial", err);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await testimonialAPI.deleteTestimonial(id);
      fetchAllData();
    } catch (err) {
      console.error("Failed to delete testimonial", err);
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">{t('admin.dashboard')}</h1>
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
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1e293b',
              color: '#fff',
              border: '1px solid #475569',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s',
              marginBottom: '0.5rem',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#334155';
              (e.target as HTMLElement).style.borderColor = '#64748b';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#1e293b';
              (e.target as HTMLElement).style.borderColor = '#475569';
            }}
          >
            {t('common.home')}
          </button>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#ef4444',
              color: '#fff',
              border: '1px solid #dc2626',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#dc2626';
              (e.target as HTMLElement).style.borderColor = '#991b1b';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#ef4444';
              (e.target as HTMLElement).style.borderColor = '#dc2626';
            }}
          >
            {t('common.logout')}
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
                <div className="admin-header-subtitle">{t('admin.manage')}</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <LanguageSwitcher />
              {activeTab !== 'contact' && activeTab !== 'reachme' && activeTab !== 'cv' && activeTab !== 'testimonials' && (
                  <button 
                    onClick={() => handleOpenModal()}
                    className="add-new-btn"
                  >
                      + {t('common.add')}
                  </button>
              )}
            </div>
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
                                  title={getProjectTitle(item)} 
                                  subtitle={item.url}
                                  onEdit={() => handleOpenModal(item.projectId)}
                                  onDelete={() => handleDeleteProject(item.projectId, getProjectTitle(item))}
                                >
                                    <p className="card-description">{getProjectDescription(item)}</p>
                                </AdminCard>
                            ))}
                            </>
                        )}
                        {activeTab === 'skills' && (
                            <>
                            {skills.map(item => (
                                <AdminCard 
                                  key={item.skillId} 
                                  title={getSkillTitle(item)}
                                  onEdit={() => handleOpenModal(item.skillId)}
                                  onDelete={() => handleDeleteSkill(item.skillId, getSkillTitle(item))}
                                >
                                    <p className="card-description">{getSkillDescription(item)}</p>
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
                                            <div className="card-title">{getWorkPosition(item)}</div>
                                            <div style={{ color: '#60a5fa', fontSize: '0.875rem' }}>{getWorkCompany(item)}</div>
                                        </div>
                                        <div className="card-actions">
                                            <button 
                                              className="card-action-btn edit"
                                              onClick={() => handleOpenModal(item.workExperienceId)}
                                              title={t('common.edit')}
                                            >
                                              {t('common.edit')}
                                            </button>
                                            <button 
                                              className="card-action-btn delete"
                                              onClick={() => handleDeleteWorkExperience(item.workExperienceId, getWorkPosition(item))}
                                              title={t('common.delete')}
                                            >
                                              {t('common.delete')}
                                            </button>
                                        </div>
                                    </div>
                                    <span className="card-meta">
                                        {item.startDate} - {item.isCurrent ? t('workexperiencesubdomain.present') : item.endDate}
                                    </span>
                                    <p className="card-description" style={{ marginTop: '0.5rem' }}>{getWorkDescription(item)}</p>
                                </div>
                            ))}
                            </>
                        )}
                        {activeTab === 'education' && (
                            <>
                            {education.map(item => (
                                <AdminCard 
                                  key={item.educationId} 
                                  title={getEducationSchool(item)} 
                                  subtitle={getEducationDegree(item)}
                                  onEdit={() => handleOpenModal(item.educationId)}
                                  onDelete={() => handleDeleteEducation(item.educationId, getEducationSchool(item))}
                                >
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                                      {item.startDate} - {item.isCurrentlyStudying ? t('workexperiencesubdomain.present') : item.endDate}
                                    </div>
                                    <p className="card-description">{getEducationDescription(item)}</p>
                                </AdminCard>
                            ))}
                            </>
                        )}
                        {activeTab === 'hobbies' && (
                            <>
                            {hobbies.map(item => (
                                <AdminCard 
                                  key={item.hobbyId} 
                                  title={getHobbyTitle(item)}
                                  onEdit={() => handleOpenModal(item.hobbyId)}
                                  onDelete={() => handleDeleteHobby(item.hobbyId, getHobbyTitle(item))}
                                >
                                    <div className="card-image">
                                        {item.imageUrl && <img src={item.imageUrl} alt={getHobbyTitle(item)} />}
                                    </div>
                                    <p className="card-description">{getHobbyDescription(item)}</p>
                                </AdminCard>
                            ))}
                            </>
                        )}
                        {activeTab === 'contact' && (
                            <>
                            {messages.length === 0 ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                    {t('admin.noMessagesYet')}
                                </div>
                            ) : (
                                messages.map(item => (
                                    <div key={item.messageId} className="card" style={{ gridColumn: '1 / -1' }}>
                                        <div className="card-header">
                                            <div style={{ flex: 1 }}>
                                                <div className="card-title">{item.name}</div>
                                                <span className="card-meta">{item.email}</span>
                                            </div>
                                            {!item.isRead && <span style={{ color: '#22c55e', fontSize: '0.75rem' }}>NEW</span>}
                                        </div>
                                        <p className="card-description" style={{ marginTop: '1rem', marginBottom: '1rem' }}>{item.message}</p>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>
                                            {new Date(item.createdAt).toLocaleString()}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {!item.isRead && (
                                                <button 
                                                    onClick={() => handleMarkAsRead(item.messageId)}
                                                    className="btn-secondary"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                                >
                                                    {t('admin.markAsRead')}
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDeleteMessage(item.messageId)}
                                                className="btn-secondary"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#ef4444' }}
                                            >
                                                {t('common.delete')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                            </>
                        )}
                        {activeTab === 'reachme' && profileData && (
                            <div className="card" style={{ gridColumn: '1 / -1' }}>
                                {!isEditingReachme ? (
                                    <>
                                        <div className="card-header">
                                            <h3 className="card-title">{t('admin.yourContactInformation')}</h3>
                                            <button 
                                                onClick={() => setIsEditingReachme(true)}
                                                className="btn-secondary"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                            >
                                                {t('common.edit')}
                                            </button>
                                        </div>
                                        <div style={{ marginTop: '1rem' }}>
                                            <div style={{ marginBottom: '1rem' }}>
                                                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{t('admin.email')}</label>
                                                <p style={{ color: '#fff' }}>{profileData.email}</p>
                                            </div>
                                            <div style={{ marginBottom: '1rem' }}>
                                                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{t('admin.location')}</label>
                                                <p style={{ color: '#fff' }}>{profileData.basedIn}</p>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{t('admin.availability')}</label>
                                                <p style={{ color: '#fff' }}>{profileData.availabilityStatus}</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="card-header">
                                            <h3 className="card-title">{t('admin.editProfile')}</h3>
                                        </div>
                                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t('admin.email')}</label>
                                                <input 
                                                    type="email"
                                                    value={reachmeEditForm.email}
                                                    onChange={(e) => setReachmeEditForm({ ...reachmeEditForm, email: e.target.value })}
                                                    style={{ width: '100%', padding: '0.5rem', backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '0.375rem' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t('admin.location')}</label>
                                                <input 
                                                    type="text"
                                                    value={reachmeEditForm.basedIn}
                                                    onChange={(e) => setReachmeEditForm({ ...reachmeEditForm, basedIn: e.target.value })}
                                                    style={{ width: '100%', padding: '0.5rem', backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '0.375rem' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t('admin.availability')}</label>
                                                <textarea 
                                                    value={reachmeEditForm.availabilityStatus}
                                                    onChange={(e) => setReachmeEditForm({ ...reachmeEditForm, availabilityStatus: e.target.value })}
                                                    style={{ width: '100%', padding: '0.5rem', backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '0.375rem', minHeight: '100px' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t('admin.availability')} (FR)</label>
                                                <textarea 
                                                    value={reachmeEditForm.availabilityStatusFr}
                                                    onChange={(e) => setReachmeEditForm({ ...reachmeEditForm, availabilityStatusFr: e.target.value })}
                                                    style={{ width: '100%', padding: '0.5rem', backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '0.375rem', minHeight: '100px' }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button 
                                                    onClick={handleSaveReachme}
                                                    className="btn-secondary"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#22c55e', color: '#000' }}
                                                >
                                                    Save
                                                </button>
                                                <button 
                                                    onClick={() => setIsEditingReachme(false)}
                                                    className="btn-secondary"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        {activeTab === 'cv' && (
                            <div className="card" style={{ gridColumn: '1 / -1' }}>
                                <div className="card-header">
                                    <h3 className="card-title">{t('admin.cvManagement')}</h3>
                                </div>
                                
                                {/* All CVs List */}
                                <div style={{ marginTop: '1rem' }}>
                                    <h4 style={{ color: '#fff', marginBottom: '1rem' }}>{t('admin.allCVs')}</h4>
                                    {allCVs.length > 0 ? (
                                        <div style={{ display: 'grid', gap: '1rem' }}>
                                            {allCVs.map(cv => (
                                                <div key={cv.cvId} style={{ padding: '1rem', backgroundColor: '#1e293b', borderRadius: '0.5rem', border: cv.isActive ? '2px solid #22c55e' : '1px solid #334155' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                                <p style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '500' }}>{cv.fileName}</p>
                                                                <span style={{ padding: '0.25rem 0.75rem', backgroundColor: cv.isFrench ? '#ef4444' : '#3b82f6', color: '#fff', fontSize: '0.75rem', borderRadius: '0.25rem' }}>
                                                                    {cv.isFrench ? t('admin.frenchVersion') : t('admin.englishVersion')}
                                                                </span>
                                                                {cv.isActive && (
                                                                    <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#22c55e', color: '#000', fontSize: '0.75rem', borderRadius: '0.25rem', fontWeight: '600' }}>
                                                                        {t('admin.activeCv')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{t('admin.fileSize')}: {(cv.fileSize / 1024).toFixed(2)} KB</p>
                                                            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{t('admin.uploaded')}: {new Date(cv.uploadedAt).toLocaleString()}</p>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                                                            {!cv.isActive && (
                                                                <button
                                                                    onClick={async () => {
                                                                        try {
                                                                            await cvAPI.activateCV(cv.cvId);
                                                                            fetchAllData();
                                                                        } catch (err) {
                                                                            console.error('Failed to activate CV:', err);
                                                                        }
                                                                    }}
                                                                    style={{
                                                                        padding: '0.4rem 0.8rem',
                                                                        fontSize: '0.75rem',
                                                                        backgroundColor: '#22c55e',
                                                                        color: '#000',
                                                                        border: 'none',
                                                                        borderRadius: '0.25rem',
                                                                        cursor: 'pointer',
                                                                        fontWeight: '600',
                                                                        whiteSpace: 'nowrap'
                                                                    }}
                                                                >
                                                                    {t('admin.activate')}
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => {
                                                                    setEditingCVId(cv.cvId);
                                                                    setEditingCVLanguage(cv.isFrench);
                                                                }}
                                                                style={{
                                                                    padding: '0.4rem 0.8rem',
                                                                    fontSize: '0.75rem',
                                                                    backgroundColor: '#f59e0b',
                                                                    color: '#000',
                                                                    border: 'none',
                                                                    borderRadius: '0.25rem',
                                                                    cursor: 'pointer',
                                                                    fontWeight: '600',
                                                                    whiteSpace: 'nowrap'
                                                                }}
                                                            >
                                                                {t('admin.editCv')}
                                                            </button>
                                                            <button
                                                                onClick={() => cvAPI.downloadCV(cv.cvId, cv.fileName)}
                                                                style={{
                                                                    padding: '0.4rem 0.8rem',
                                                                    fontSize: '0.75rem',
                                                                    backgroundColor: '#3b82f6',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    borderRadius: '0.25rem',
                                                                    cursor: 'pointer',
                                                                    whiteSpace: 'nowrap'
                                                                }}
                                                            >
                                                                {t('admin.download')}
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setModalType('delete');
                                                                    setEditingId(cv.cvId);
                                                                    setShowModal(true);
                                                                }}
                                                                style={{
                                                                    padding: '0.4rem 0.8rem',
                                                                    fontSize: '0.75rem',
                                                                    backgroundColor: '#ef4444',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    borderRadius: '0.25rem',
                                                                    cursor: 'pointer',
                                                                    whiteSpace: 'nowrap'
                                                                }}
                                                            >
                                                                {t('admin.deleteCv')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: '#94a3b8' }}>{t('admin.noActiveCvUploaded')}</p>
                                    )}
                                </div>

                                {/* Upload New CV Section */}
                                <div style={{ marginTop: '2rem', borderTop: '1px solid #334155', paddingTop: '1.5rem' }}>
                                    <h4 style={{ color: '#fff', marginBottom: '1rem' }}>{t('admin.uploadNewCv')}</h4>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <input 
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setCvFileInput(e.target.files?.[0] || null)}
                                            style={{ width: '100%', padding: '0.5rem', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '0.5rem' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="checkbox"
                                            id="cvFileInputIsFrench"
                                            checked={cvFileInputIsFrench}
                                            onChange={(e) => setCvFileInputIsFrench(e.target.checked)}
                                            style={{
                                                marginRight: '0.75rem',
                                                width: '18px',
                                                height: '18px',
                                                accentColor: '#3b82f6',
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <label htmlFor="cvFileInputIsFrench" style={{ color: '#94a3b8', cursor: 'pointer', userSelect: 'none' }}>
                                            {t('admin.frenchVersion')}
                                        </label>
                                    </div>
                                    <button 
                                        onClick={handleUploadCV}
                                        disabled={!cvFileInput}
                                        className="btn-secondary"
                                        style={{ 
                                            width: '100%',
                                            padding: '0.5rem 1rem', 
                                            fontSize: '0.875rem',
                                            backgroundColor: cvFileInput ? '#22c55e' : '#64748b',
                                            color: cvFileInput ? '#000' : '#94a3b8',
                                            cursor: cvFileInput ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        Upload
                                    </button>
                                </div>

                                {/* Edit CV Modal */}
                                {editingCVId && (
                                    <div style={{ 
                                        position: 'fixed', 
                                        top: 0, 
                                        left: 0, 
                                        right: 0, 
                                        bottom: 0, 
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 1000
                                    }}>
                                        <div style={{
                                            backgroundColor: '#1e293b',
                                            borderRadius: '0.5rem',
                                            padding: '1.5rem',
                                            maxWidth: '500px',
                                            width: '90%',
                                            border: '1px solid #334155'
                                        }}>
                                            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Edit CV</h3>
                                            
                                            <div style={{ marginBottom: '1rem' }}>
                                                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                                    Replace File (Optional)
                                                </label>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) => setEditingCVFile(e.target.files?.[0] || null)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        backgroundColor: '#0f172a',
                                                        color: '#fff',
                                                        border: '1px solid #334155',
                                                        borderRadius: '0.25rem'
                                                    }}
                                                />
                                                {editingCVFile && (
                                                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                                        Selected: {editingCVFile.name}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    id="editCVLanguage"
                                                    checked={editingCVLanguage}
                                                    onChange={(e) => setEditingCVLanguage(e.target.checked)}
                                                    style={{
                                                        marginRight: '0.75rem',
                                                        width: '18px',
                                                        height: '18px',
                                                        accentColor: '#3b82f6',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                                <label htmlFor="editCVLanguage" style={{ color: '#94a3b8', cursor: 'pointer', userSelect: 'none' }}>
                                                    Mark as French Version
                                                </label>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            if (editingCVFile) {
                                                                await cvAPI.updateCVFile(editingCVId, editingCVFile, editingCVLanguage);
                                                            } else {
                                                                await cvAPI.updateCVLanguage(editingCVId, editingCVLanguage);
                                                            }
                                                            setEditingCVId(null);
                                                            setEditingCVFile(null);
                                                            fetchAllData();
                                                        } catch (err) {
                                                            console.error('Failed to update CV:', err);
                                                        }
                                                    }}
                                                    style={{
                                                        flex: 1,
                                                        padding: '0.5rem 1rem',
                                                        backgroundColor: '#22c55e',
                                                        color: '#000',
                                                        border: 'none',
                                                        borderRadius: '0.25rem',
                                                        cursor: 'pointer',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingCVId(null);
                                                        setEditingCVFile(null);
                                                    }}
                                                    style={{
                                                        flex: 1,
                                                        padding: '0.5rem 1rem',
                                                        backgroundColor: '#334155',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '0.25rem',
                                                        cursor: 'pointer',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'testimonials' && (
                            <>
                                {pendingTestimonials.length > 0 && (
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <h3 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1rem' }}>{t('testimonialsubdomain.pendingTestimonials')}</h3>
                                        {pendingTestimonials.map(testimonial => (
                                            <div key={testimonial.testimonialId} className="card" style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                                                <div className="card-header">
                                                    <div style={{ flex: 1 }}>
                                                        <div className="card-title">{testimonial.name}</div>
                                                        <span className="card-meta">{getTestimonialTitle(testimonial)} {getTestimonialCompany(testimonial) && `at ${getTestimonialCompany(testimonial)}`}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        {[...Array(testimonial.rating)].map((_, i) => (
                                                            <span key={i} style={{ color: '#f59e0b' }}>★</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="card-description" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>{getTestimonialMessage(testimonial)}</p>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>
                                                    {new Date(testimonial.createdAt).toLocaleString()}
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button 
                                                        onClick={() => handleApproveTestimonial(testimonial.testimonialId)}
                                                        className="btn-secondary"
                                                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#22c55e', color: '#000' }}
                                                    >
                                                        {t('testimonialsubdomain.approve')}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleRejectTestimonial(testimonial.testimonialId)}
                                                        className="btn-secondary"
                                                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#ef4444' }}
                                                    >
                                                        {t('testimonialsubdomain.reject')}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {testimonials.length === 0 ? (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                        {t('testimonialsubdomain.noTestimonials')}
                                    </div>
                                ) : (
                                    <>
                                        {pendingTestimonials.length > 0 && <div style={{ gridColumn: '1 / -1', margin: '1.5rem 0', borderTop: '1px solid #334155' }} />}
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            {pendingTestimonials.length > 0 && <h3 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1rem', marginTop: '1.5rem' }}>{t('testimonialsubdomain.allTestimonials')}</h3>}
                                            {testimonials.map(testimonial => (
                                                <div key={testimonial.testimonialId} className="card" style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                                                    <div className="card-header">
                                                        <div style={{ flex: 1 }}>
                                                            <div className="card-title">{testimonial.name}</div>
                                                            <span className="card-meta">{getTestimonialTitle(testimonial)} {getTestimonialCompany(testimonial) && `at ${getTestimonialCompany(testimonial)}`}</span>
                                                            <span style={{ marginLeft: '1rem', fontSize: '0.75rem', color: testimonial.status === 'APPROVED' ? '#22c55e' : testimonial.status === 'REJECTED' ? '#ef4444' : '#f59e0b' }}>
                                                                {testimonial.status === 'APPROVED' ? t('admin.approvedStatus') : testimonial.status === 'REJECTED' ? t('admin.rejectedStatus') : t('admin.pendingStatus')}
                                                            </span>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                                <span key={i} style={{ color: '#f59e0b' }}>★</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="card-description" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>{getTestimonialMessage(testimonial)}</p>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>
                                                        {new Date(testimonial.createdAt).toLocaleString()}
                                                    </div>
                                                    <button 
                                                        onClick={() => handleDeleteTestimonial(testimonial.testimonialId)}
                                                        className="btn-secondary"
                                                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#ef4444' }}
                                                    >
                                                        {t('common.delete')}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
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
      {showModal && activeTab === 'cv' && modalType === 'edit' && (
        <EditCVModal
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}
      {showModal && activeTab === 'cv' && modalType === 'delete' && (
        <DeleteCVModal
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          fileName={allCVs.find(cv => cv.cvId === editingId)?.fileName || ''}
          cvId={editingId || ''}
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
}) => {
  const { t } = useTranslation();
  return (
    <div className="card">
        <div className="card-header">
             <div>
                <div className="card-title">{title}</div>
                {subtitle && <div className="card-subtitle">{subtitle}</div>}
             </div>
             <div className="card-actions">
                <button className="card-action-btn edit" onClick={onEdit} title={t('common.edit')}>{t('common.edit')}</button>
                <button className="card-action-btn delete" onClick={onDelete} title={t('common.delete')}>{t('common.delete')}</button>
             </div>
        </div>
        <div className="card-body">{children}</div>
    </div>
  );
};
