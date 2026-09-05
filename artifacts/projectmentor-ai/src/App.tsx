import { useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useLocation, Router as WouterRouter } from 'wouter';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  Compass,
  Database,
  FileText,
  FlaskConical,
  GitBranch,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  Menu,
  MessageCircle,
  Moon,
  MoreHorizontal,
  Network,
  Plus,
  Rocket,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Target,
  Users,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';

type Project = {
  id: string;
  title: string;
  pitch: string;
  category: string;
  difficulty: string;
  duration: string;
  accent: string;
  icon: LucideIcon;
  score: number;
  tags: string[];
  description: string;
};

const demoProjects: Project[] = [
  {
    id: 'campus-copilot',
    title: 'Smart Campus Copilot',
    pitch: 'A grounded generative AI assistant that helps students find answers across campus services.',
    category: 'Generative AI',
    difficulty: 'Intermediate',
    duration: '12 weeks',
    accent: 'from-indigo-500 to-violet-500',
    icon: Bot,
    score: 94,
    tags: ['RAG', 'React', 'PostgreSQL'],
    description:
      'A source-aware campus assistant that combines retrieval-augmented generation with a helpful, human handoff when confidence is low.',
  },
  {
    id: 'crop-vision',
    title: 'CropGuard Vision',
    pitch: 'Early crop disease detection for small farms using lightweight computer vision.',
    category: 'Computer Vision',
    difficulty: 'Advanced',
    duration: '16 weeks',
    accent: 'from-emerald-500 to-teal-500',
    icon: FlaskConical,
    score: 91,
    tags: ['Python', 'TensorFlow', 'Mobile'],
    description:
      'A practical field tool that turns a phone photo into an explainable crop health assessment and recommended next steps.',
  },
  {
    id: 'energy-forecast',
    title: 'GridSense Forecast',
    pitch: 'Forecast building energy demand and turn insights into measurable savings.',
    category: 'Data Science',
    difficulty: 'Intermediate',
    duration: '10 weeks',
    accent: 'from-amber-500 to-orange-500',
    icon: Activity,
    score: 88,
    tags: ['Python', 'Forecasting', 'Charts'],
    description:
      'A forecasting workspace for facilities teams that makes energy patterns understandable and highlights the biggest efficiency opportunities.',
  },
  {
    id: 'resume-match',
    title: 'RoleSignal',
    pitch: 'A transparent resume-to-role matching engine for early-career candidates.',
    category: 'AI & ML',
    difficulty: 'Intermediate',
    duration: '12 weeks',
    accent: 'from-sky-500 to-cyan-500',
    icon: Target,
    score: 86,
    tags: ['NLP', 'Embeddings', 'Node.js'],
    description:
      'A career tool that explains why a role matches a candidate, surfaces skill gaps, and avoids black-box recommendations.',
  },
];

const navItems: { label: string; path: string; icon: LucideIcon }[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Generate ideas', path: '/generate', icon: Sparkles },
  { label: 'Explore', path: '/explore', icon: Compass },
  { label: 'My projects', path: '/projects', icon: BookOpen },
];

const workspaceItems: { label: string; path: string; icon: LucideIcon }[] = [
  { label: 'AI Mentor', path: '/mentor', icon: MessageCircle },
  { label: 'Roadmap', path: '/roadmap', icon: GitBranch },
  { label: 'Architecture', path: '/architecture', icon: Network },
  { label: 'Documentation', path: '/documentation', icon: FileText },
  { label: 'Viva Coach', path: '/viva', icon: GraduationCap },
];

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <RoutedErrorBoundary>
            <Workspace />
          </RoutedErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Workspace() {
  const [location, navigate] = useLocation();
  const [mobileNav, setMobileNav] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('projectmentor-saved');
      return stored ? JSON.parse(stored) : ['campus-copilot'];
    } catch {
      return ['campus-copilot'];
    }
  });
  const [selectedProject, setSelectedProject] = useState<Project>(demoProjects[0]);
  const [profileName, setProfileName] = useState(
    () => localStorage.getItem('projectmentor-name') || 'Arjun',
  );
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('projectmentor-theme') === 'dark',
  );

  const toggleSaved = (id: string) => {
    setSavedIds((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      localStorage.setItem('projectmentor-saved', JSON.stringify(next));
      return next;
    });
  };

  const openProject = (project: Project) => {
    setSelectedProject(project);
    navigate('/project');
    setMobileNav(false);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setMobileNav(false);
  };

  const page = location === '/project' ? (
    <ProjectDetails
      project={selectedProject}
      saved={savedIds.includes(selectedProject.id)}
      onSave={() => toggleSaved(selectedProject.id)}
      onNavigate={navigateTo}
    />
  ) : location === '/generate' ? (
    <GeneratePage onOpenProject={openProject} savedIds={savedIds} onSave={toggleSaved} />
  ) : location === '/projects' ? (
    <ProjectsPage
      savedIds={savedIds}
      onOpenProject={openProject}
      onSave={toggleSaved}
      onNavigate={navigateTo}
    />
  ) : location === '/mentor' ? (
    <MentorPage project={selectedProject} />
  ) : location === '/roadmap' ? (
    <RoadmapPage />
  ) : location === '/architecture' ? (
    <ArchitecturePage project={selectedProject} />
  ) : location === '/documentation' ? (
    <DocumentationPage project={selectedProject} />
  ) : location === '/viva' ? (
    <VivaPage project={selectedProject} />
  ) : location === '/explore' ? (
    <ExplorePage onOpenProject={openProject} />
  ) : location === '/settings' ? (
    <SettingsPage
      profileName={profileName}
      setProfileName={(name) => {
        setProfileName(name);
        localStorage.setItem('projectmentor-name', name);
      }}
      darkMode={darkMode}
      setDarkMode={(value) => {
        setDarkMode(value);
        localStorage.setItem('projectmentor-theme', value ? 'dark' : 'light');
      }}
    />
  ) : (
    <Dashboard
      profileName={profileName}
      savedCount={savedIds.length}
      onNavigate={navigateTo}
      onOpenProject={openProject}
    />
  );

  return (
    <div className={darkMode ? 'app-shell dark' : 'app-shell'}>
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="brand-name">ProjectMentor<span> AI</span></div>
            <div className="brand-kicker">Build with confidence</div>
          </div>
          <button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <div className="mode-pill">
          <span className="status-dot" />
          <span>Demo AI Mode</span>
          <CircleHelp size={14} className="muted-icon" />
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <div className="nav-label">Workspace</div>
          {navItems.map((item) => (
            <NavItem key={item.path} {...item} active={location === item.path} onClick={() => navigateTo(item.path)} />
          ))}
          <div className="nav-label nav-label-spaced">Build</div>
          {workspaceItems.map((item) => (
            <NavItem key={item.path} {...item} active={location === item.path} onClick={() => navigateTo(item.path)} />
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="mentor-mini">
            <div className="mentor-mini-icon"><Bot size={17} /></div>
            <div>
              <strong>Need a second brain?</strong>
              <button onClick={() => navigateTo('/mentor')}>Ask your mentor <ArrowRight size={13} /></button>
            </div>
          </div>
          <NavItem label="Settings" path="/settings" icon={Settings} active={location === '/settings'} onClick={() => navigateTo('/settings')} />
          <div className="profile-row">
            <div className="avatar">{profileName.slice(0, 2).toUpperCase()}</div>
            <div className="profile-meta">
              <strong>{profileName || 'Student'}</strong>
              <span>Final-year student</span>
            </div>
            <MoreHorizontal size={16} className="muted-icon" />
          </div>
        </div>
      </aside>
      {mobileNav && <button className="sidebar-scrim" onClick={() => setMobileNav(false)} aria-label="Close menu" />}
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={20} /></button>
          <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{pageTitle(location)}</strong></div>
          <div className="topbar-actions">
            <div className="search-shortcut"><Search size={16} /><span>Search</span><kbd>⌘ K</kbd></div>
            <button className="icon-button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <div className="notification-dot"><span /></div>
          </div>
        </header>
        <div className="page-wrap">{page}</div>
      </main>
    </div>
  );
}

function NavItem({ label, icon: Icon, active, onClick }: { label: string; path: string; icon: LucideIcon; active: boolean; onClick: () => void }) {
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <Icon size={17} strokeWidth={active ? 2.4 : 1.9} />
      <span>{label}</span>
      {label === 'My projects' && <span className="nav-count">1</span>}
    </button>
  );
}

function pageTitle(path: string) {
  if (path === '/') return 'Dashboard';
  return path.slice(1).split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}

function Dashboard({ profileName, savedCount, onNavigate, onOpenProject }: { profileName: string; savedCount: number; onNavigate: (path: string) => void; onOpenProject: (project: Project) => void }) {
  return (
    <div className="content-stack">
      <section className="welcome-row">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> Saturday, September 05</div>
          <h1>Build something you can <em>defend.</em></h1>
          <p className="lede">Good projects start with a clear direction. Let your AI mentor help you find yours, {profileName || 'there'}.</p>
        </div>
        <button className="primary-button" onClick={() => onNavigate('/generate')}><Sparkles size={17} /> Generate ideas <ArrowRight size={16} /></button>
      </section>

      <section className="hero-panel">
        <div className="hero-copy">
          <div className="hero-badge"><Zap size={13} /> Your project, your edge</div>
          <h2>From a blank page<br />to a <span>project worth shipping.</span></h2>
          <p>Personalized ideas, honest feasibility checks, and a plan you can actually finish.</p>
          <button className="text-button light" onClick={() => onNavigate('/generate')}>Start your project journey <ArrowRight size={15} /></button>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="orbit-core"><BrainCircuit size={36} /></div>
          <div className="orbit-node node-a"><Code2 size={15} /></div>
          <div className="orbit-node node-b"><Database size={15} /></div>
          <div className="orbit-node node-c"><Target size={15} /></div>
        </div>
      </section>

      <section className="stat-grid">
        <StatCard label="Ideas generated" value="12" change="+4 this week" icon={Lightbulb} />
        <StatCard label="Saved projects" value={String(savedCount)} change="Ready to explore" icon={Star} />
        <StatCard label="Roadmap progress" value="34%" change="6 tasks remaining" icon={BarChart3} progress={34} />
        <StatCard label="Mentor sessions" value="08" change="Keep the momentum" icon={MessageCircle} />
      </section>

      <section className="dashboard-grid">
        <div className="panel current-project">
          <div className="panel-heading"><div><div className="section-kicker">In progress</div><h3>Your current project</h3></div><button className="ghost-icon" aria-label="More options"><MoreHorizontal size={17} /></button></div>
          <div className="current-project-body">
            <div className="project-icon large indigo"><Bot size={23} /></div>
            <div className="current-project-title"><h4>Smart Campus Copilot</h4><p>Generative AI <span>•</span> Intermediate</p></div>
            <span className="progress-label">34%</span>
          </div>
          <div className="progress-track"><span style={{ width: '34%' }} /></div>
          <div className="next-task"><div className="task-check"><Check size={13} /></div><div><span>Next up</span><strong>Define your knowledge base</strong></div><button className="outline-button" onClick={() => onNavigate('/roadmap')}>Open roadmap</button></div>
        </div>
        <div className="panel activity-panel">
          <div className="panel-heading"><div><div className="section-kicker">Your workspace</div><h3>Quick actions</h3></div></div>
          <div className="quick-actions">
            <QuickAction icon={Sparkles} label="Generate ideas" detail="Find your best fit" onClick={() => onNavigate('/generate')} />
            <QuickAction icon={MessageCircle} label="Ask mentor" detail="Get unstuck faster" onClick={() => onNavigate('/mentor')} />
            <QuickAction icon={Network} label="View architecture" detail="See the big picture" onClick={() => onNavigate('/architecture')} />
            <QuickAction icon={FileText} label="Draft documentation" detail="Start your report" onClick={() => onNavigate('/documentation')} />
          </div>
        </div>
      </section>

      <section>
        <div className="section-row"><div><div className="section-kicker">Curated for you</div><h3 className="section-title">Projects worth exploring</h3></div><button className="text-button" onClick={() => onNavigate('/explore')}>View all <ArrowRight size={15} /></button></div>
        <div className="project-grid">{demoProjects.slice(0, 3).map((project) => <ProjectCard key={project.id} project={project} onOpen={() => onOpenProject(project)} compact />)}</div>
      </section>
    </div>
  );
}

function StatCard({ label, value, change, icon: Icon, progress }: { label: string; value: string; change: string; icon: LucideIcon; progress?: number }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className="stat-icon"><Icon size={16} /></div></div><div className="stat-value">{value}</div><div className="stat-change">{progress ? <div className="mini-progress"><span style={{ width: `${progress}%` }} /></div> : <span className="change-dot" />}{change}</div></div>;
}

function QuickAction({ icon: Icon, label, detail, onClick }: { icon: LucideIcon; label: string; detail: string; onClick: () => void }) {
  return <button className="quick-action" onClick={onClick}><span className="quick-icon"><Icon size={17} /></span><span><strong>{label}</strong><small>{detail}</small></span><ArrowRight size={15} className="quick-arrow" /></button>;
}

function GeneratePage({ onOpenProject, savedIds, onSave }: { onOpenProject: (project: Project) => void; savedIds: string[]; onSave: (id: string) => void }) {
  const [step, setStep] = useState(1);
  const [generated, setGenerated] = useState<Project[] | null>(null);
  const [name, setName] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(['Python', 'React', 'SQL']);
  const [interest, setInterest] = useState('Generative AI');
  const skills = ['Python', 'React', 'SQL', 'Machine Learning', 'Node.js', 'NLP', 'Computer Vision', 'Cloud'];
  const toggleSkill = (skill: string) => setSelectedSkills((items) => items.includes(skill) ? items.filter((item) => item !== skill) : [...items, skill]);
  const generate = () => {
    setGenerated(demoProjects.map((project, index) => ({ ...project, score: Math.max(78, project.score - index * 2), pitch: index === 0 && interest ? `${project.pitch} Tailored around ${interest.toLowerCase()}.` : project.pitch })));
  };
  if (generated) {
    return <div className="content-stack"><div className="results-header"><div><div className="eyebrow"><span className="eyebrow-line" /> AI recommendation engine</div><h1>Your next great project.</h1><p className="lede">Five directions shaped around your skills, interests, and the time you have.</p></div><button className="outline-button" onClick={() => setGenerated(null)}>Adjust profile</button></div><div className="ai-result-banner"><div className="ai-spark"><Sparkles size={18} /></div><div><strong>Personalized for {name || 'your profile'}</strong><span>Matched against {selectedSkills.length} skills, {interest}, and a 12-week timeline.</span></div><span className="match-pill">94% profile match</span></div><div className="project-grid results-grid">{generated.map((project) => <ProjectCard key={project.id} project={project} saved={savedIds.includes(project.id)} onSave={() => onSave(project.id)} onOpen={() => onOpenProject(project)} />)}</div></div>;
  }
  return <div className="content-stack"><div className="results-header"><div><div className="eyebrow"><span className="eyebrow-line" /> Find your direction</div><h1>Tell us what you want to build.</h1><p className="lede">A few thoughtful answers are all it takes to get ideas that feel like <em>you.</em></p></div><div className="step-count">0{step} <span>/ 03</span></div></div><div className="wizard"><div className="wizard-progress"><span style={{ width: `${(step / 3) * 100}%` }} /></div>{step === 1 && <div className="wizard-step"><div className="step-heading"><span className="step-number">01</span><div><h2>Make it personal</h2><p>We’ll use this to make every recommendation more relevant.</p></div></div><label>Your name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Arjun Sharma" /></label><label>Academic specialization<select defaultValue="Computer Science"><option>Computer Science</option><option>Artificial Intelligence & Machine Learning</option><option>Data Science</option><option>Software Engineering</option><option>Cyber Security</option></select></label><label>Career goal<select defaultValue="AI/ML Engineer"><option>AI/ML Engineer</option><option>Full Stack Developer</option><option>Data Scientist</option><option>Product Engineer</option><option>Researcher</option></select></label></div>}{step === 2 && <div className="wizard-step"><div className="step-heading"><span className="step-number">02</span><div><h2>Bring your strengths</h2><p>Choose the skills you want your project to showcase.</p></div></div><div className="chip-grid">{skills.map((skill) => <button key={skill} className={`choice-chip ${selectedSkills.includes(skill) ? 'selected' : ''}`} onClick={() => toggleSkill(skill)}>{selectedSkills.includes(skill) && <Check size={14} />}{skill}</button>)}</div><label>Anything you’re curious about?<input placeholder="e.g. climate tech, education, healthcare" /></label></div>}{step === 3 && <div className="wizard-step"><div className="step-heading"><span className="step-number">03</span><div><h2>Set your direction</h2><p>We’ll keep ideas ambitious, but realistic to finish.</p></div></div><label>Technical interest<select value={interest} onChange={(event) => setInterest(event.target.value)}><option>Generative AI</option><option>Healthcare</option><option>Education</option><option>FinTech</option><option>Sustainability</option><option>Cyber Security</option></select></label><div className="two-col"><label>Project duration<select defaultValue="3 months"><option>1 month</option><option>2 months</option><option>3 months</option><option>4–6 months</option></select></label><label>Difficulty<select defaultValue="Intermediate"><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Research-oriented</option></select></label></div><div className="budget-note"><ShieldCheck size={18} /><div><strong>Feasibility-first recommendations</strong><span>We’ll prioritize ideas that fit your budget, team size, and current skill level.</span></div></div></div>}<div className="wizard-actions">{step > 1 && <button className="text-button" onClick={() => setStep(step - 1)}>Back</button>}<button className="primary-button" onClick={() => step < 3 ? setStep(step + 1) : generate()}>{step < 3 ? 'Continue' : 'Generate my ideas'} <ArrowRight size={16} /></button></div></div></div>;
}

function ProjectCard({ project, onOpen, onSave, saved, compact = false }: { project: Project; onOpen: () => void; onSave?: () => void; saved?: boolean; compact?: boolean }) {
  const Icon = project.icon;
  return <article className={`project-card ${compact ? 'compact' : ''}`}><div className={`project-card-art bg-gradient-to-br ${project.accent}`}><div className="project-art-grid" /><div className="project-icon"><Icon size={20} /></div><span className="score-badge"><Sparkles size={11} /> {project.score}% match</span></div><div className="project-card-body"><div className="project-meta"><span>{project.category}</span><span>•</span><span>{project.difficulty}</span></div><h3>{project.title}</h3><p>{project.pitch}</p><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="project-card-footer"><span className="duration"><Clock3 size={14} /> {project.duration}</span><div className="card-actions">{onSave && <button className={`save-button ${saved ? 'saved' : ''}`} onClick={onSave} aria-label={saved ? 'Remove saved project' : 'Save project'}>{saved ? <Star size={16} fill="currentColor" /> : <Star size={16} />}</button>}<button className="outline-button small" onClick={onOpen}>View blueprint <ArrowRight size={14} /></button></div></div></div></article>;
}

function ProjectsPage({ savedIds, onOpenProject, onSave, onNavigate }: { savedIds: string[]; onOpenProject: (project: Project) => void; onSave: (id: string) => void; onNavigate: (path: string) => void }) {
  const saved = demoProjects.filter((project) => savedIds.includes(project.id));
  return <div className="content-stack"><div className="results-header"><div><div className="eyebrow"><span className="eyebrow-line" /> Your workspace</div><h1>My projects.</h1><p className="lede">Ideas you’ve saved, shaped into a plan you can take forward.</p></div><button className="primary-button" onClick={() => onNavigate('/generate')}><Plus size={17} /> New idea</button></div>{saved.length ? <div className="project-grid">{saved.map((project) => <ProjectCard key={project.id} project={project} saved onSave={() => onSave(project.id)} onOpen={() => onOpenProject(project)} />)}</div> : <div className="empty-state"><div className="empty-icon"><BookOpen size={25} /></div><h3>Your project shelf is empty</h3><p>Save an idea that feels right and it will show up here.</p><button className="primary-button" onClick={() => onNavigate('/generate')}>Generate ideas <ArrowRight size={16} /></button></div>}<div className="insight-banner"><BarChart3 size={20} /><div><strong>Small progress compounds.</strong><span>Students who define their first milestone are 2.4× more likely to finish on time.</span></div><button className="text-button" onClick={() => onNavigate('/roadmap')}>Open roadmap <ArrowRight size={14} /></button></div></div>;
}

function ProjectDetails({ project, saved, onSave, onNavigate }: { project: Project; saved: boolean; onSave: () => void; onNavigate: (path: string) => void }) {
  const Icon = project.icon;
  return <div className="content-stack"><button className="back-link" onClick={() => onNavigate('/explore')}>← Back to explore</button><section className="detail-hero"><div className={`detail-icon bg-gradient-to-br ${project.accent}`}><Icon size={28} /></div><div className="detail-heading"><div className="project-meta"><span>{project.category}</span><span>•</span><span>{project.difficulty}</span><span>•</span><span>{project.duration}</span></div><h1>{project.title}</h1><p>{project.pitch}</p><div className="detail-actions"><button className="primary-button" onClick={() => onNavigate('/roadmap')}><Rocket size={16} /> Start roadmap</button><button className={`outline-button ${saved ? 'saved-outline' : ''}`} onClick={onSave}>{saved ? <Star size={16} fill="currentColor" /> : <Star size={16} />} {saved ? 'Saved' : 'Save project'}</button><button className="outline-button" onClick={() => onNavigate('/mentor')}><MessageCircle size={16} /> Ask mentor</button></div></div><div className="detail-score"><span>Recommendation</span><strong>{project.score}%</strong><small>profile match</small></div></section><div className="detail-layout"><div className="detail-main"><DetailSection title="Why this project?" icon={Lightbulb}><p>{project.description}</p><p>This direction gives you a strong story for your final presentation: a real user, a measurable problem, a thoughtful technical decision, and room to show responsible AI practices.</p></DetailSection><DetailSection title="Blueprint at a glance" icon={Network}><div className="blueprint-grid"><BlueprintItem label="Frontend" value="React + TypeScript" /><BlueprintItem label="Backend" value="Node.js API" /><BlueprintItem label="Data layer" value="PostgreSQL + pgvector" /><BlueprintItem label="AI layer" value="Gemini + RAG" /></div></DetailSection><DetailSection title="The first three milestones" icon={GitBranch}><div className="milestone-list"><Milestone num="01" title="Validate the problem" time="3 days" /><Milestone num="02" title="Design your data flow" time="1 week" /><Milestone num="03" title="Ship a thin vertical slice" time="2 weeks" /></div></DetailSection></div><aside className="detail-aside"><div className="panel score-panel"><div className="section-kicker">Recommendation score</div><h3>Why it fits you</h3>{['Strong match for your skills', 'Achievable in your timeline', 'High resume value', 'Clear research potential'].map((item) => <div className="check-row" key={item}><CheckCircle2 size={16} />{item}</div>)}<div className="score-bar"><span style={{ width: `${project.score}%` }} /></div></div><div className="panel"><div className="section-kicker">Need a nudge?</div><h3>Make this idea yours.</h3><p className="panel-copy">Ask the mentor to make it more innovative, more feasible, or more research-ready.</p><button className="outline-button full" onClick={() => onNavigate('/mentor')}>Improve with AI <ArrowRight size={14} /></button></div></aside></div></div>;
}

function DetailSection({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return <section className="detail-section"><div className="detail-section-title"><span><Icon size={17} /> {title}</span><MoreHorizontal size={17} className="muted-icon" /></div>{children}</section>;
}

function BlueprintItem({ label, value }: { label: string; value: string }) {
  return <div className="blueprint-item"><span>{label}</span><strong>{value}</strong></div>;
}

function Milestone({ num, title, time }: { num: string; title: string; time: string }) {
  return <div className="milestone"><span className="milestone-num">{num}</span><div><strong>{title}</strong><span>{time}</span></div><ChevronRight size={16} className="muted-icon" /></div>;
}

function ExplorePage({ onOpenProject }: { onOpenProject: (project: Project) => void }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = ['All', 'AI & ML', 'Generative AI', 'Data Science', 'Computer Vision'];
  const filtered = demoProjects.filter((project) => (category === 'All' || project.category === category) && `${project.title} ${project.pitch}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="content-stack"><div className="results-header"><div><div className="eyebrow"><span className="eyebrow-line" /> Inspiration library</div><h1>Explore what’s possible.</h1><p className="lede">Browse directions that balance originality, feasibility, and a story worth telling.</p></div></div><div className="explore-controls"><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects..." /></div><div className="filter-row">{categories.map((item) => <button key={item} className={`filter-chip ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}</div></div><div className="project-grid">{filtered.map((project) => <ProjectCard key={project.id} project={project} onOpen={() => onOpenProject(project)} />)}</div></div>;
}

function MentorPage({ project }: { project: Project }) {
  const [messages, setMessages] = useState([{ from: 'ai', text: `I’m ready to help with ${project.title}. Ask me about your architecture, scope, implementation, or viva preparation.` }]);
  const [input, setInput] = useState('');
  const send = () => { if (!input.trim()) return; const question = input.trim(); setInput(''); setMessages((items) => [...items, { from: 'user', text: question }, { from: 'ai', text: 'Good question. Start with the smallest testable slice: define the user journey, write the data contract, and validate one real example before adding more AI complexity. I’ll help you turn that into a milestone.' }]); };
  return <div className="content-stack"><div className="results-header"><div><div className="eyebrow"><span className="eyebrow-line" /> Your AI co-pilot</div><h1>Ask your mentor.</h1><p className="lede">A calm second brain for the moments where your project gets messy.</p></div><div className="mentor-status"><span className="status-dot" /> Online in demo mode</div></div><div className="mentor-layout"><div className="panel chat-panel"><div className="chat-context"><div className="project-icon indigo"><Bot size={18} /></div><div><strong>{project.title}</strong><span>Mentor context is active</span></div><span className="match-pill">Context loaded</span></div><div className="chat-messages">{messages.map((message, index) => <div className={`chat-message ${message.from}`} key={`${message.from}-${index}`}><div className="chat-avatar">{message.from === 'ai' ? <Sparkles size={14} /> : 'A'}</div><div><span className="message-label">{message.from === 'ai' ? 'ProjectMentor AI' : 'You'}</span><p>{message.text}</p></div></div>)}</div><div className="suggestion-row">{['How do I start?', 'What database fits?', 'Make it more innovative'].map((suggestion) => <button key={suggestion} onClick={() => setInput(suggestion)}>{suggestion}</button>)}</div><div className="chat-input"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send()} placeholder="Ask anything about your project..." /><button onClick={send} aria-label="Send message"><Send size={17} /></button></div></div><aside className="mentor-aside"><div className="panel"><div className="section-kicker">Mentor guardrails</div><h3>Useful, not overconfident.</h3>{['Explains assumptions', 'Flags decisions to verify', 'Keeps scope realistic'].map((item) => <div className="check-row" key={item}><ShieldCheck size={16} />{item}</div>)}</div></aside></div></div>;
}

function RoadmapPage() {
  const [done, setDone] = useState([true, true, false, false, false, false, false, false]);
  const phases = ['Validate the problem', 'Choose your stack', 'Design the data model', 'Build the vertical slice', 'Add AI capabilities', 'Test with real users', 'Document decisions', 'Prepare your viva'];
  const progress = Math.round((done.filter(Boolean).length / phases.length) * 100);
  return <div className="content-stack"><div className="results-header"><div><div className="eyebrow"><span className="eyebrow-line" /> Project delivery</div><h1>Your roadmap.</h1><p className="lede">A finish line is easier to reach when you can see the next step.</p></div><div className="roadmap-progress"><strong>{progress}%</strong><span>complete</span></div></div><div className="roadmap-layout"><div className="panel roadmap-panel"><div className="roadmap-header"><div><div className="section-kicker">12 week plan</div><h3>Smart Campus Copilot</h3></div><span className="match-pill">On track</span></div>{phases.map((phase, index) => <button key={phase} className={`roadmap-row ${done[index] ? 'completed' : ''}`} onClick={() => setDone((items) => items.map((item, itemIndex) => itemIndex === index ? !item : item))}><span className="roadmap-check">{done[index] ? <Check size={14} /> : index + 1}</span><span className="roadmap-name"><strong>{phase}</strong><small>{done[index] ? 'Completed' : index === 2 ? 'Next up · 3 days' : 'Not started'}</small></span><span className="roadmap-type">{index < 3 ? 'Foundation' : index < 6 ? 'Build' : 'Finish'}</span><ChevronRight size={16} className="muted-icon" /></button>)}</div><aside className="panel roadmap-side"><div className="ring-progress"><span>{progress}%</span></div><h3>Keep going, {progress < 50 ? 'you’re building momentum' : 'you’re close' }.</h3><p className="panel-copy">Your next milestone is small enough to finish this week.</p><button className="primary-button full"><CheckCircle2 size={16} /> Mark next task done</button></aside></div></div>;
}

function ArchitecturePage({ project }: { project: Project }) {
  return <div className="content-stack"><div className="results-header"><div><div className="eyebrow"><span className="eyebrow-line" /> System design</div><h1>See the whole picture.</h1><p className="lede">A practical architecture for <strong>{project.title}</strong>, explained in plain language.</p></div><button className="outline-button"><Sparkles size={16} /> Regenerate</button></div><div className="architecture-board"><ArchitectureNode icon={Code2} title="Frontend" detail="React + TypeScript" tone="violet" /><div className="flow-arrow">↓</div><ArchitectureNode icon={GitBranch} title="Backend / API" detail="Node.js + Express" tone="blue" /><div className="flow-arrow">↓</div><ArchitectureNode icon={Database} title="Data layer" detail="PostgreSQL + pgvector" tone="teal" /><div className="flow-arrow">↓</div><ArchitectureNode icon={BrainCircuit} title="AI / ML layer" detail="Gemini + retrieval" tone="amber" /><div className="flow-arrow">↓</div><ArchitectureNode icon={Activity} title="Deployment" detail="Secure cloud runtime" tone="rose" /></div><div className="architecture-notes">{[['Frontend', 'The student-facing workspace where projects, plans, and mentor conversations come together.'], ['AI layer', 'Use retrieval and structured prompts so answers stay grounded in the project context.'], ['Data layer', 'Persist profiles, saved projects, roadmap state, and mentor sessions without exposing secrets.']].map(([title, copy]) => <div className="panel architecture-note" key={title}><div className="note-number">0{title === 'Frontend' ? 1 : title === 'AI layer' ? 2 : 3}</div><div><h3>{title}</h3><p>{copy}</p></div></div>)}</div></div>;
}

function ArchitectureNode({ icon: Icon, title, detail, tone }: { icon: LucideIcon; title: string; detail: string; tone: string }) {
  return <div className={`architecture-node ${tone}`}><div className="node-icon"><Icon size={20} /></div><div><strong>{title}</strong><span>{detail}</span></div><CheckCircle2 size={17} className="node-check" /></div>;
}

function DocumentationPage({ project }: { project: Project }) {
  const [active, setActive] = useState('Abstract');
  const docs: Record<string, string> = { Abstract: `This draft presents ${project.title}, a student-focused system designed to make a meaningful problem easier to understand and act on. The proposed solution combines a clear user workflow with responsible AI assistance, measurable outcomes, and an architecture that can grow from a final-year prototype into a reliable product.`, 'Problem statement': 'Students and campus teams often have the right information scattered across disconnected sources. Existing support is difficult to search, inconsistent to access, and rarely explains the reasoning behind an answer.', Methodology: 'Begin with user interviews and a small representative dataset. Define a measurable success criterion, build a thin vertical slice, evaluate the system against known examples, and document both successful and uncertain outputs.', 'Future scope': 'Future iterations can add multilingual support, richer campus integrations, offline-friendly experiences, and a feedback loop that improves retrieval quality without compromising student privacy.' };
  return <div className="content-stack"><div className="results-header"><div><div className="eyebrow"><span className="eyebrow-line" /> Report builder</div><h1>Start your documentation.</h1><p className="lede">A structured first draft for <strong>{project.title}</strong>. Verify and make it yours.</p></div><button className="primary-button"><FileText size={16} /> Export draft</button></div><div className="documentation-layout"><div className="panel doc-nav">{Object.keys(docs).map((doc) => <button className={active === doc ? 'active' : ''} key={doc} onClick={() => setActive(doc)}><FileText size={15} />{doc}<ChevronRight size={15} /></button>)}<div className="doc-divider" /><div className="draft-note"><ShieldCheck size={16} /><span>AI-generated draft<br /><strong>Verify before submission</strong></span></div></div><div className="panel doc-editor"><div className="doc-editor-top"><span className="draft-label"><span /> Draft content</span><button className="ghost-icon"><MoreHorizontal size={17} /></button></div><h2>{active}</h2><p className="doc-copy">{docs[active]}</p><p className="doc-copy muted-copy">This section is a starting point, not a citation or a claim of experimental results. Add your own sources, observations, and measured outcomes before submission.</p><div className="editor-footer"><span>Last generated just now · Demo AI Mode</span><button className="text-button">Copy section <ArrowRight size={14} /></button></div></div></div></div>;
}

function VivaPage({ project }: { project: Project }) {
  const questions = [{ category: 'Architecture', question: `Why did you choose this architecture for ${project.title}?`, answer: 'Because it separates the user experience, business logic, data, and AI concerns. That makes the system easier to test, explain, and extend.' }, { category: 'AI / ML', question: 'How will you evaluate whether the AI is useful?', answer: 'Use a small verified evaluation set, measure groundedness and task completion, and combine those metrics with structured feedback from target users.' }, { category: 'Testing', question: 'What happens when the model is uncertain?', answer: 'The system should say what it does not know, show the source context where possible, and offer a fallback path instead of inventing an answer.' }]; const [active, setActive] = useState(0); return <div className="content-stack"><div className="results-header"><div><div className="eyebrow"><span className="eyebrow-line" /> Presentation prep</div><h1>Practice with confidence.</h1><p className="lede">The questions your panel may ask, with answers that sound like <em>you.</em></p></div><button className="primary-button"><GraduationCap size={16} /> Start mock viva</button></div><div className="viva-layout"><div className="panel question-list">{questions.map((item, index) => <button className={index === active ? 'active' : ''} key={item.question} onClick={() => setActive(index)}><span className="question-index">0{index + 1}</span><span><small>{item.category}</small><strong>{item.question}</strong></span></button>)}</div><div className="panel answer-card"><div className="section-kicker">{questions[active].category} question</div><h2>{questions[active].question}</h2><div className="suggested-answer"><div className="answer-label"><Sparkles size={14} /> Suggested answer</div><p>{questions[active].answer}</p></div><div className="key-points"><strong>Key points to remember</strong><div><span>01</span>Explain the decision, not just the tool.</div><div><span>02</span>Connect it back to the user problem.</div><div><span>03</span>Be honest about what you would improve next.</div></div></div></div></div>;
}

function SettingsPage({ profileName, setProfileName, darkMode, setDarkMode }: { profileName: string; setProfileName: (name: string) => void; darkMode: boolean; setDarkMode: (value: boolean) => void }) {
  return <div className="content-stack"><div className="results-header"><div><div className="eyebrow"><span className="eyebrow-line" /> Preferences</div><h1>Make it yours.</h1><p className="lede">Tune your workspace so the guidance feels like it was made for you.</p></div><button className="primary-button" onClick={() => localStorage.setItem('projectmentor-name', profileName)}>Save changes <Check size={16} /></button></div><div className="settings-grid"><div className="panel settings-panel"><div className="panel-heading"><div><div className="section-kicker">Profile</div><h3>Your student profile</h3></div></div><label>Display name<input value={profileName} onChange={(event) => setProfileName(event.target.value)} /></label><label>University<input defaultValue="National Institute of Technology" /></label><label>Specialization<select defaultValue="Computer Science"><option>Computer Science</option><option>Artificial Intelligence & Machine Learning</option><option>Data Science</option><option>Software Engineering</option></select></label></div><div className="panel settings-panel"><div className="panel-heading"><div><div className="section-kicker">Preferences</div><h3>How ProjectMentor feels</h3></div></div><div className="setting-toggle"><div><strong>Dark mode</strong><span>Use a deeper workspace at night.</span></div><button className={`toggle ${darkMode ? 'on' : ''}`} onClick={() => setDarkMode(!darkMode)}><span /></button></div><div className="setting-toggle"><div><strong>Practical recommendations</strong><span>Prioritize ideas within your time and budget.</span></div><button className="toggle on"><span /></button></div><div className="setting-toggle"><div><strong>Mentor nudges</strong><span>Get reminders when your roadmap stalls.</span></div><button className="toggle"><span /></button></div></div></div></div>;
}

export default App;
