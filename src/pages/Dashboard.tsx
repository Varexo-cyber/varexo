import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuth, MockUser } from '../services/mockAuth';
import { roleService } from '../services/roleService';
import { projectService, Project, Invoice, ProjectLog } from '../services/projectService';
import PageTransition from '../components/PageTransition';

const CustomerDashboard: React.FC = () => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'invoices'>('projects');
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectLogs, setProjectLogs] = useState<ProjectLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = mockAuth.onAuthChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (roleService.isAdmin(currentUser.email)) {
          // Admin will be handled by the main Dashboard component
          return;
        }
        loadCustomerData(currentUser.email);
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const openProjectDetails = async (project: Project) => {
    setSelectedProject(project);
    setLogsLoading(true);
    try {
      const logs = await projectService.getProjectLogsAsync(project.id);
      setProjectLogs(logs);
    } catch {
      setProjectLogs(projectService.getProjectLogs(project.id));
    }
    setLogsLoading(false);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
    setProjectLogs([]);
  };

  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-yellow-500';
    if (progress < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getLogTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return '🎯';
      case 'feature': return '✨';
      case 'bugfix': return '🐛';
      case 'design': return '🎨';
      case 'deployment': return '🚀';
      default: return '📝';
    }
  };

  const getLogTypeLabel = (type: string) => {
    switch (type) {
      case 'milestone': return 'Mijlpaal';
      case 'feature': return 'Nieuwe functie';
      case 'bugfix': return 'Bugfix';
      case 'design': return 'Design';
      case 'deployment': return 'Deployment';
      default: return 'Update';
    }
  };

  const loadCustomerData = async (email: string) => {
    try {
      const [p, i] = await Promise.all([
        projectService.getProjectsForCustomerAsync(email),
        projectService.getInvoicesForCustomerAsync(email)
      ]);
      setProjects(p);
      setInvoices(i);
    } catch {
      setProjects(projectService.getProjectsForCustomer(email));
      setInvoices(projectService.getInvoicesForCustomer(email));
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-dark-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Laden...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-dark-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Klantportaal</h1>
            <p className="text-gray-400 mt-1">Welkom terug, {user.displayName}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
              <div className="flex items-center">
                <div className="p-3 bg-primary-900 rounded-lg">
                  <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Actieve Projecten</p>
                  <p className="text-2xl font-bold text-white">{projects.filter(p => p.status === 'active').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
              <div className="flex items-center">
                <div className="p-3 bg-green-900 rounded-lg">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Voltooide Projecten</p>
                  <p className="text-2xl font-bold text-white">{projects.filter(p => p.status === 'completed').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-900 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Openstaande Facturen</p>
                  <p className="text-2xl font-bold text-white">{invoices.filter(i => i.status === 'sent').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-dark-700 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'projects'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Projecten ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'invoices'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Facturen ({invoices.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'projects' && (
            <div className="bg-dark-800 rounded-lg border border-dark-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Mijn Projecten</h2>
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-gray-400">Geen projecten gevonden</p>
                    <p className="text-gray-500 text-sm mt-2">De admin zal projecten voor je aanmaken</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                      <div 
                        key={project.id} 
                        onClick={() => openProjectDetails(project)}
                        className="bg-dark-900 p-4 rounded-lg border border-dark-700 hover:border-primary-500 cursor-pointer transition group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium text-white group-hover:text-primary-400 transition">{project.title}</h3>
                          <svg className="w-5 h-5 text-gray-500 group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Voortgang</span>
                            <span>{project.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-dark-700 rounded-full h-2">
                            <div 
                              className={`${getProgressColor(project.progress || 0)} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${project.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.status === 'active' ? 'bg-green-900 text-green-300' :
                            project.status === 'completed' ? 'bg-blue-900 text-blue-300' :
                            project.status === 'paused' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-gray-900 text-gray-300'
                          }`}>
                            {project.status === 'planning' ? 'Planning' :
                             project.status === 'active' ? 'Actief' :
                             project.status === 'completed' ? 'Voltooid' : 'Gepauzeerd'}
                          </span>
                          {project.deadline && (
                            <span className="text-xs text-gray-500">
                              {new Date(project.deadline).toLocaleDateString('nl-NL')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="bg-dark-800 rounded-lg border border-dark-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Mijn Facturen</h2>
                {invoices.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-400">Geen facturen gevonden</p>
                    <p className="text-gray-500 text-sm mt-2">De admin zal facturen voor je aanmaken</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-dark-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Factuur</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Project</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bedrag</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vervaldatum</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-700">
                        {invoices.map((invoice) => (
                          <tr key={invoice.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-white">{invoice.invoiceNumber}</div>
                                <div className="text-sm text-gray-400">{new Date(invoice.createdAt).toLocaleDateString('nl-NL')}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {invoice.projectTitle}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              €{invoice.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                invoice.status === 'paid' ? 'bg-green-900 text-green-300' :
                                invoice.status === 'sent' ? 'bg-blue-900 text-blue-300' :
                                invoice.status === 'overdue' ? 'bg-red-900 text-red-300' :
                                'bg-gray-900 text-gray-300'
                              }`}>
                                {invoice.status === 'draft' ? 'Concept' :
                                 invoice.status === 'sent' ? 'Verzonden' :
                                 invoice.status === 'paid' ? 'Betaald' : 'Te laat'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {new Date(invoice.dueDate).toLocaleDateString('nl-NL')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-lg border border-dark-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedProject.title}</h2>
                  <p className="text-gray-400">{selectedProject.description}</p>
                </div>
                <button onClick={closeProjectDetails} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress Section */}
              <div className="bg-dark-900 p-4 rounded-lg border border-dark-700 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-white">Voortgang</h3>
                  <span className="text-2xl font-bold text-primary-400">{selectedProject.progress || 0}%</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-3 mb-4">
                  <div 
                    className={`${getProgressColor(selectedProject.progress || 0)} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${selectedProject.progress || 0}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-dark-800 p-3 rounded">
                    <div className="text-xs text-gray-400">Status</div>
                    <div className="text-sm font-medium text-white">
                      {selectedProject.status === 'planning' ? 'Planning' :
                       selectedProject.status === 'active' ? 'Actief' :
                       selectedProject.status === 'completed' ? 'Voltooid' : 'Gepauzeerd'}
                    </div>
                  </div>
                  {selectedProject.deadline && (
                    <div className="bg-dark-800 p-3 rounded">
                      <div className="text-xs text-gray-400">Deadline</div>
                      <div className="text-sm font-medium text-white">
                        {new Date(selectedProject.deadline).toLocaleDateString('nl-NL')}
                      </div>
                    </div>
                  )}
                  {selectedProject.budget && (
                    <div className="bg-dark-800 p-3 rounded">
                      <div className="text-xs text-gray-400">Budget</div>
                      <div className="text-sm font-medium text-white">€{selectedProject.budget.toFixed(2)}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Logs */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Project Updates & Logs</h3>
                {logsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Updates laden...</p>
                  </div>
                ) : projectLogs.length === 0 ? (
                  <div className="bg-dark-900 p-6 rounded-lg border border-dark-700 text-center">
                    <p className="text-gray-400">Nog geen updates voor dit project.</p>
                    <p className="text-gray-500 text-sm mt-1">De admin zal hier updates plaatsen.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projectLogs.map((log) => (
                      <div key={log.id} className="bg-dark-900 p-4 rounded-lg border border-dark-700">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{getLogTypeIcon(log.logType)}</span>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <span className="text-xs font-medium text-primary-400 uppercase tracking-wide">
                                  {getLogTypeLabel(log.logType)}
                                </span>
                                <h4 className="text-white font-medium">{log.title}</h4>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(log.createdAt).toLocaleDateString('nl-NL')}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">{log.description}</p>
                            {log.createdBy && (
                              <p className="text-xs text-gray-500 mt-2">Door: {log.createdBy}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = mockAuth.onAuthChanged((currentUser) => {
      if (currentUser) {
        if (roleService.isAdmin(currentUser.email)) {
          // Redirect admin to admin panel
          navigate('/admin');
          return;
        }
        // Customer will stay on dashboard
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-dark-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Laden...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return <CustomerDashboard />;
};

export default Dashboard;
