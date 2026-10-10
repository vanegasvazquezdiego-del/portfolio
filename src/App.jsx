import { useState } from 'react';
import { SettingsProvider } from './hooks/useSettings';
import { ContentProvider } from './hooks/useContent';
import { MyProjectsProvider } from './hooks/useMyProjects';
import { MyCertificatesProvider } from './hooks/useMyCertificates';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import ProjectModal from './components/ProjectModal';
import ProjectForm from './components/ProjectForm';
import Skills from './components/Skills';
import Snippets from './components/Snippets';
import Certificates from './components/Certificates';
import CertificateForm from './components/CertificateForm';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SettingsDrawer from './components/SettingsDrawer';
import ContentEditor from './components/ContentEditor';

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState(null);
  const [certFormOpen, setCertFormOpen] = useState(false);
  const [certFormInitial, setCertFormInitial] = useState(null);
  const [selected, setSelected] = useState(null);

  return (
    <SettingsProvider>
      <ContentProvider>
        <MyProjectsProvider>
          <MyCertificatesProvider>
            <div className="min-h-screen transition-colors duration-300 dark:bg-[#05070f] dark:text-gray-200 bg-[#f6f7fb] text-gray-900">
              <Navbar onOpenSettings={() => setSettingsOpen(true)} />
              <main>
                <Hero />
                <About onEdit={() => setEditorOpen(true)} />
                <Projects
                  onSelect={setSelected}
                  onAdd={() => { setFormInitial(null); setFormOpen(true); }}
                  onEdit={(p) => { setFormInitial(p); setFormOpen(true); }}
                />
                <Skills />
                <Snippets />
                <Certificates
                  onAdd={() => { setCertFormInitial(null); setCertFormOpen(true); }}
                  onEdit={(c) => { setCertFormInitial(c); setCertFormOpen(true); }}
                />
                <Contact />
              </main>
              <Footer />
              <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
              <ContentEditor open={editorOpen} onClose={() => setEditorOpen(false)} />
              <ProjectForm open={formOpen} initial={formInitial} onClose={() => setFormOpen(false)} />
              <CertificateForm open={certFormOpen} initial={certFormInitial} onClose={() => setCertFormOpen(false)} />
              {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
            </div>
          </MyCertificatesProvider>
        </MyProjectsProvider>
      </ContentProvider>
    </SettingsProvider>
  );
}
