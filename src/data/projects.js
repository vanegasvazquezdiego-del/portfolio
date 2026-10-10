// Edit this file to add your real projects. Tags drive the filter bar.
// Supported tag suggestions: Python, C++, JavaScript, TypeScript, React, Web,
// Node.js, Docker, Linux, CLI, API, Postgres, Redis, ML, Rust, Go
// Spanish versions (_es) are shown when ES is selected; they fall back to English if empty.

export const profile = {
  name: 'Alex Dev',
  role: 'Software Engineer · Full-Stack & DevOps',
  role_es: 'Ingeniero de Software · Full-Stack y DevOps',
  tagline: 'I build fast, clean and reliable software — from CLIs to cloud microservices.',
  tagline_es: 'Creo software rápido, limpio y confiable — desde CLIs hasta microservicios en la nube.',
  location: 'Remote · UTC flexible',
  location_es: 'Remoto · horario UTC flexible',
  email: 'hello@example.com',
  github: 'https://github.com/your-username',
  linkedin: 'https://linkedin.com/in/your-username',
  resumeUrl: '#',
  avatarEmoji: '👨‍💻'
};

export const skills = [
  { group: 'Languages', items: ['Python', 'TypeScript', 'C++', 'Go', 'Rust', 'Bash'] },
  { group: 'Frontend', items: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'Framer Motion'] },
  { group: 'Backend', items: ['Node.js', 'FastAPI', 'Postgres', 'Redis', 'gRPC'] },
  { group: 'DevOps', items: ['Docker', 'Linux', 'GitHub Actions', 'Nginx', 'AWS'] }
];

export const projects = [
  {
    id: 'devpulse-dashboard',
    title: 'DevPulse — Engineering Metrics Dashboard',
    summary: 'Full-stack dashboard that aggregates GitHub, CI and deploy stats into one live view.',
    summary_es: 'Dashboard full-stack que agrega stats de GitHub, CI y deploys en una vista en vivo.',
    description:
      'DevPulse ingests GitHub webhooks, GitHub Actions runs and deploy events, stores them in Postgres and streams live aggregates over WebSockets. Includes team leaderboards, DORA metrics and a Docker Compose one-command deploy.',
    description_es:
      'DevPulse ingiere webhooks de GitHub, ejecuciones de Actions y eventos de deploy, los guarda en Postgres y emite agregados en vivo por WebSockets. Incluye rankings de equipo, métricas DORA y deploy con un comando vía Docker Compose.',
    tags: ['TypeScript', 'React', 'Node.js', 'Postgres', 'Docker', 'Web'],
    features: ['Live WebSocket updates', 'DORA metrics + charts', 'GitHub OAuth', 'Docker Compose deploy'],
    features_es: ['Actualizaciones en vivo por WebSocket', 'Métricas DORA + gráficas', 'OAuth con GitHub', 'Deploy con Docker Compose'],
    github: 'https://github.com/your-username/devpulse',
    demo: 'https://example.com',
    stars: 248,
    year: 2025,
    featured: true,
    gradient: 'from-emerald-500/30 to-cyan-500/10'
  },
  {
    id: 'pyfetch-cli',
    title: 'pyfetch — Neofetch-style System CLI',
    summary: 'Lightweight Python CLI that prints distro, kernel, packages and ASCII art in <50ms.',
    summary_es: 'CLI ligero en Python que muestra distro, kernel, paquetes y arte ASCII en <50ms.',
    description:
      'Single-file Python CLI with zero hard dependencies, plugin system for custom modules, JSON output for scripting, and AUR + pip distribution. Tested on Arch, Ubuntu, Fedora and WSL.',
    description_es:
      'CLI en Python de un solo archivo, sin dependencias obligatorias, con sistema de plugins, salida JSON para scripting y distribución por AUR + pip. Probado en Arch, Ubuntu, Fedora y WSL.',
    tags: ['Python', 'CLI', 'Linux'],
    features: ['Zero-dependency core', 'Plugin modules', '--json scripting output', 'pip + AUR packages'],
    features_es: ['Núcleo sin dependencias', 'Módulos plugin', 'Salida --json para scripts', 'Paquetes pip + AUR'],
    github: 'https://github.com/your-username/pyfetch',
    demo: '',
    stars: 512,
    year: 2024,
    featured: true,
    gradient: 'from-amber-500/30 to-rose-500/10'
  },
  {
    id: 'dockerswarm-shop',
    title: 'MicroShop — Dockerized Microservices',
    summary: 'E-commerce demo: 5 services (auth, catalog, cart, orders, gateway) on Docker + Redis.',
    summary_es: 'Demo e-commerce: 5 servicios (auth, catálogo, carrito, pedidos, gateway) con Docker + Redis.',
    description:
      'Reference microservices project with API gateway, JWT auth, Redis cart, Postgres persistence, health checks, Prometheus metrics and GitHub Actions multi-arch builds.',
    description_es:
      'Proyecto de referencia con API gateway, auth JWT, carrito en Redis, persistencia en Postgres, health checks, métricas Prometheus y builds multi-arquitectura en GitHub Actions.',
    tags: ['Docker', 'Go', 'Node.js', 'Redis', 'API', 'Linux'],
    features: ['5 independent services', 'JWT + API gateway', 'Prometheus metrics', 'Multi-arch images'],
    features_es: ['5 servicios independientes', 'JWT + API gateway', 'Métricas Prometheus', 'Imágenes multi-arquitectura'],
    github: 'https://github.com/your-username/microshop',
    demo: '',
    stars: 186,
    year: 2025,
    featured: true,
    gradient: 'from-violet-500/30 to-blue-500/10'
  },
  {
    id: 'cpp-lru-cache',
    title: 'cpp-lru — Lock-free LRU Cache',
    summary: 'Header-only C++17 LRU cache with benchmarks beating std::map + list by 3x.',
    summary_es: 'Caché LRU en C++17 header-only con benchmarks 3x mejores que std::map + list.',
    description:
      'Header-only C++17 library with O(1) get/put, optional thread-safe shard wrapper, Google Benchmark suite and CMake FetchContent support.',
    description_es:
      'Librería C++17 header-only con get/put O(1), wrapper thread-safe opcional, suite de benchmarks con Google Benchmark y soporte CMake FetchContent.',
    tags: ['C++', 'Linux', 'CLI'],
    features: ['Header-only, C++17', 'Thread-safe shard option', 'Benchmark suite', 'CMake install'],
    features_es: ['Header-only, C++17', 'Opción thread-safe por shards', 'Suite de benchmarks', 'Instalación con CMake'],
    github: 'https://github.com/your-username/cpp-lru',
    demo: '',
    stars: 97,
    year: 2023,
    featured: false,
    gradient: 'from-sky-500/30 to-indigo-500/10'
  },
  {
    id: 'logwatch-sh',
    title: 'logwatch.sh — Log Tailing Utility',
    summary: 'Bash + fzf log highlighter with regex presets for nginx, journald and Docker.',
    summary_es: 'Resaltador de logs en Bash + fzf con presets regex para nginx, journald y Docker.',
    description:
      '300-line Bash script that tails and colorizes logs, ships with presets for nginx, systemd and Docker Compose, plus alert hooks to Discord/Slack webhooks.',
    description_es:
      'Script Bash de 300 líneas que sigue y colorea logs, con presets para nginx, systemd y Docker Compose, más alertas a webhooks de Discord/Slack.',
    tags: ['Linux', 'CLI', 'Docker'],
    features: ['Regex presets', 'fzf interactive mode', 'Webhook alerts', 'Single-file install'],
    features_es: ['Presets regex', 'Modo interactivo fzf', 'Alertas por webhook', 'Instalación de un archivo'],
    github: 'https://github.com/your-username/logwatch-sh',
    demo: '',
    stars: 143,
    year: 2024,
    featured: false,
    gradient: 'from-lime-500/25 to-emerald-500/10'
  },
  {
    id: 'portgen-ai',
    title: 'PortGen — Markdown Portfolio Generator',
    summary: 'Python script that turns a YAML file into a deployed static portfolio in seconds.',
    summary_es: 'Script Python que convierte un YAML en un portafolio estático desplegado en segundos.',
    description:
      'Reads portfolio.yaml, renders Jinja templates, optimizes images and deploys to GitHub Pages via Actions. The tool that bootstrapped this very site’s content model.',
    description_es:
      'Lee portfolio.yaml, renderiza plantillas Jinja, optimiza imágenes y despliega a GitHub Pages con Actions. La herramienta que originó el modelo de contenido de este sitio.',
    tags: ['Python', 'Web', 'CLI'],
    features: ['YAML → static site', 'Themes + templates', 'Image optimization', 'GH Pages deploy'],
    features_es: ['YAML → sitio estático', 'Temas + plantillas', 'Optimización de imágenes', 'Deploy a GH Pages'],
    github: 'https://github.com/your-username/portgen',
    demo: 'https://example.com',
    stars: 74,
    year: 2023,
    featured: false,
    gradient: 'from-fuchsia-500/25 to-purple-500/10'
  }
];

export const allTags = ['All', ...Array.from(new Set(projects.flatMap((p) => p.tags))).sort()];

// Helper: pick localized field, e.g. pick(p, 'summary', 'es') → p.summary_es || p.summary
export function pick(obj, field, lang) {
  if (lang === 'es') {
    const v = obj[`${field}_es`];
    if (v) return v;
  }
  return obj[field];
}

// Helper: localized display date. Custom projects may carry a full
// ISO date (YYYY-MM-DD); built-ins only have a year.
export function projectDate(p, lang) {
  if (p.date) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(p.date);
    if (m) {
      const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      try {
        return new Intl.DateTimeFormat(lang === 'es' ? 'es' : 'en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }).format(d);
      } catch { /* fall through to year */ }
    }
  }
  return String(p.year || '');
}
