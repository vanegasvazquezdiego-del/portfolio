// Copy-paste snippets per language. Shown in the Snippets section with a copy button.
// Add your own: { id, lang, title, title_es, desc, desc_es, code }

export const snippetLangs = ['Python', 'JavaScript', 'TypeScript', 'C++', 'Go', 'Rust', 'Bash', 'Docker', 'SQL'];

export const snippets = [
  {
    id: 'py-http-json',
    lang: 'Python',
    title: 'GET JSON with stdlib only',
    title_es: 'GET JSON solo con stdlib',
    desc: 'No requests needed. Timeout + error handling included.',
    desc_es: 'Sin requests. Incluye timeout y manejo de errores.',
    code: `import json, urllib.request

def get_json(url, timeout=10):
    req = urllib.request.Request(url, headers={"User-Agent": "pyfetch/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as res:
        return json.load(res)

data = get_json("https://api.github.com/repos/python/cpython")
print(data["stargazers_count"])`
  },
  {
    id: 'py-cli',
    lang: 'Python',
    title: 'argparse CLI skeleton',
    title_es: 'Esqueleto CLI con argparse',
    desc: 'Subcommands, --json flag and proper exit codes.',
    desc_es: 'Subcomandos, flag --json y códigos de salida correctos.',
    code: `import argparse, json, sys

def cmd_greet(args):
    out = {"msg": f"Hello, {args.name}!"}
    print(json.dumps(out) if args.json else out["msg"])

def main(argv=None):
    p = argparse.ArgumentParser(prog="mycli")
    p.add_argument("--json", action="store_true")
    sub = p.add_subparsers(dest="cmd", required=True)
    g = sub.add_parser("greet"); g.add_argument("name")
    g.set_defaults(fn=cmd_greet)
    args = p.parse_args(argv)
    try:
        args.fn(args)
    except Exception as e:
        print(f"error: {e}", file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    raise SystemExit(main())`
  },
  {
    id: 'py-retry',
    lang: 'Python',
    title: 'Retry decorator with backoff',
    title_es: 'Decorador retry con backoff',
    desc: 'Retries flaky calls with exponential backoff.',
    desc_es: 'Reintenta llamadas inestables con backoff exponencial.',
    code: `import functools, time

def retry(tries=3, delay=1, backoff=2, exc=Exception):
    def deco(fn):
        @functools.wraps(fn)
        def wrap(*a, **k):
            d = delay
            for i in range(tries):
                try:
                    return fn(*a, **k)
                except exc:
                    if i == tries - 1:
                        raise
                    time.sleep(d)
                    d *= backoff
        return wrap
    return deco

@retry(tries=4)
def fetch():
    ...  # flaky call here`
  },
  {
    id: 'js-fetch-timeout',
    lang: 'JavaScript',
    title: 'fetch with timeout',
    title_es: 'fetch con timeout',
    desc: 'AbortController-based timeout. Works in browser + Node 18.',
    desc_es: 'Timeout con AbortController. Funciona en navegador y Node 18.',
    code: `async function fetchJson(url, { timeout = 8000, ...init } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

const user = await fetchJson("https://api.github.com/users/octocat");`
  },
  {
    id: 'js-debounce',
    lang: 'JavaScript',
    title: 'debounce helper',
    title_es: 'helper debounce',
    desc: 'For search inputs and resize handlers.',
    desc_es: 'Para inputs de búsqueda y handlers de resize.',
    code: `function debounce(fn, ms = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

input.addEventListener("input", debounce((e) => {
  search(e.target.value);
}, 250));`
  },
  {
    id: 'ts-fetch-result',
    lang: 'TypeScript',
    title: 'Typed fetch returning Result',
    title_es: 'fetch tipado que retorna Result',
    desc: 'No throws: success/error union your UI can match on.',
    desc_es: 'Sin throws: unión success/error fácil de manejar en UI.',
    code: `type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function fetchJson<T>(url: string, timeout = 8000): Promise<Result<T>> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return { ok: false, error: "HTTP " + res.status };
    return { ok: true, data: (await res.json()) as T };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  } finally {
    clearTimeout(t);
  }
}`
  },
  {
    id: 'ts-groupby',
    lang: 'TypeScript',
    title: 'groupBy utility',
    title_es: 'utilidad groupBy',
    desc: 'Groups an array by a key function, fully typed.',
    desc_es: 'Agrupa un array por función clave, totalmente tipado.',
    code: `function groupBy<T, K extends string | number>(
  arr: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

const byLang = groupBy(projects, (p) => p.lang);`
  },
  {
    id: 'cpp-read-file',
    lang: 'C++',
    title: 'Read whole file (C++17)',
    title_es: 'Leer archivo completo (C++17)',
    desc: 'One-liner with ifstream + stringstream.',
    desc_es: 'En una línea con ifstream + stringstream.',
    code: `#include <fstream>
#include <sstream>
#include <string>

std::string read_file(const std::string& path) {
    std::ifstream f(path);
    if (!f) throw std::runtime_error("cannot open " + path);
    std::ostringstream ss;
    ss << f.rdbuf();
    return ss.str();
}`
  },
  {
    id: 'cpp-split',
    lang: 'C++',
    title: 'Split string by delimiter',
    title_es: 'Split de string por delimitador',
    desc: 'Header-friendly split returning a vector.',
    desc_es: 'Split que retorna vector, listo para headers.',
    code: `#include <string>
#include <vector>

std::vector<std::string> split(const std::string& s, char delim) {
    std::vector<std::string> out;
    std::string cur;
    for (char c : s) {
        if (c == delim) { out.push_back(cur); cur.clear(); }
        else cur += c;
    }
    out.push_back(cur);
    return out;
}`
  },
  {
    id: 'cpp-timer',
    lang: 'C++',
    title: 'Scoped benchmark timer',
    title_es: 'Timer scoped para benchmarks',
    desc: 'RAII timer printing elapsed ms on destruction.',
    desc_es: 'Timer RAII que imprime ms al destruirse.',
    code: `#include <chrono>
#include <iostream>

struct Timer {
    std::chrono::steady_clock::time_point t0 =
        std::chrono::steady_clock::now();
    const char* name;
    explicit Timer(const char* n) : name(n) {}
    ~Timer() {
        auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(
            std::chrono::steady_clock::now() - t0).count();
        std::cout << name << ": " << ms << " ms\\n";
    }
};

// usage: { Timer t("parse"); /* ... */ }`
  },
  {
    id: 'go-http-json',
    lang: 'Go',
    title: 'GET JSON with timeout',
    title_es: 'GET JSON con timeout',
    desc: 'Context timeout + strict JSON decode.',
    desc_es: 'Timeout con context + decode JSON estricto.',
    code: `package main

import (
    "context"
    "encoding/json"
    "net/http"
    "time"
)

func GetJSON(url string, v any) error {
    ctx, cancel := context.WithTimeout(context.Background(), 8*time.Second)
    defer cancel()
    req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
    res, err := http.DefaultClient.Do(req)
    if err != nil {
        return err
    }
    defer res.Body.Close()
    return json.NewDecoder(res.Body).Decode(v)
}`
  },
  {
    id: 'go-mustenv',
    lang: 'Go',
    title: 'Required env vars',
    title_es: 'Variables de entorno requeridas',
    desc: 'Fail fast with a clear message when env is missing.',
    desc_es: 'Falla rápido con mensaje claro si falta el env.',
    code: `package main

import (
    "log"
    "os"
)

func MustEnv(key string) string {
    v := os.Getenv(key)
    if v == "" {
        log.Fatalf("missing required env var %s", key)
    }
    return v
}

var (
    Port   = MustEnv("PORT")
    DBUrl  = MustEnv("DATABASE_URL")
)`
  },
  {
    id: 'go-lines',
    lang: 'Go',
    title: 'Read file line by line',
    title_es: 'Leer archivo línea por línea',
    desc: 'bufio.Scanner with a bigger buffer for long lines.',
    desc_es: 'bufio.Scanner con buffer ampliado para líneas largas.',
    code: `package main

import (
    "bufio"
    "os"
)

func ForEachLine(path string, fn func(string) error) error {
    f, err := os.Open(path)
    if err != nil {
        return err
    }
    defer f.Close()
    s := bufio.NewScanner(f)
    s.Buffer(make([]byte, 1024*1024), 1024*1024)
    for s.Scan() {
        if err := fn(s.Text()); err != nil {
            return err
        }
    }
    return s.Err()
}`
  },
  {
    id: 'rs-read-file',
    lang: 'Rust',
    title: 'Read file with context',
    title_es: 'Leer archivo con contexto',
    desc: 'fs::read_to_string + map_err for friendly errors.',
    desc_es: 'fs::read_to_string + map_err para errores amables.',
    code: `use std::fs;

fn read_config(path: &str) -> Result<String, String> {
    fs::read_to_string(path)
        .map_err(|e| format!("cannot read {path}: {e}"))
}

fn main() -> Result<(), String> {
    let cfg = read_config("app.toml")?;
    println!("{cfg}");
    Ok(())
}`
  },
  {
    id: 'rs-wordcount',
    lang: 'Rust',
    title: 'Word count with HashMap',
    title_es: 'Contar palabras con HashMap',
    desc: 'Entry API + iterator pipeline.',
    desc_es: 'API entry + pipeline de iteradores.',
    code: `use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<&str, usize> {
    let mut map = HashMap::new();
    for word in text.split_whitespace() {
        *map.entry(word).or_insert(0) += 1;
    }
    map
}

fn main() {
    let counts = word_count("hello rust hello");
    println!("{counts:?}");
}`
  },
  {
    id: 'sh-strict',
    lang: 'Bash',
    title: 'Strict mode + log helpers',
    title_es: 'Modo estricto + helpers de log',
    desc: 'Paste at the top of every script.',
    desc_es: 'Pégalo al inicio de cada script.',
    code: `#!/usr/bin/env bash
set -euo pipefail

log()  { printf '[INFO]  %s\\n' "$*"; }
warn() { printf '[WARN]  %s\\n' "$*" >&2; }
die()  { printf '[ERROR] %s\\n' "$*" >&2; exit 1; }

command -v docker >/dev/null || die "docker not found"`
  },
  {
    id: 'sh-retry',
    lang: 'Bash',
    title: 'Retry a command',
    title_es: 'Reintentar un comando',
    desc: 'Retries with sleep between attempts.',
    desc_es: 'Reintenta con pausa entre intentos.',
    code: `retry() { # retry <tries> <sleep> <cmd...>
  local tries=$1 sleep_s=$2; shift 2
  local i
  for ((i = 1; i <= tries; i++)); do
    if "$@"; then return 0; fi
    echo "attempt $i/$tries failed, retrying in $sleep_s s..." >&2
    sleep "$sleep_s"
  done
  return 1
}

retry 5 2 curl -fsSL https://example.com/health`
  },
  {
    id: 'sh-confirm',
    lang: 'Bash',
    title: 'Confirm prompt',
    title_es: 'Prompt de confirmación',
    desc: 'Yes/no gate before destructive actions.',
    desc_es: 'Puerta sí/no antes de acciones destructivas.',
    code: `confirm() { # confirm "message?"
  local ans
  read -r -p "$1 [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]]
}

confirm "Delete ./dist?" || { echo "aborted"; exit 1; }
rm -rf ./dist`
  },
  {
    id: 'docker-node',
    lang: 'Docker',
    title: 'Node multistage Dockerfile',
    title_es: 'Dockerfile Node multietapa',
    desc: 'Small, cache-friendly production image.',
    desc_es: 'Imagen productiva pequeña y cache-friendly.',
    code: `# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- run ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]`
  },
  {
    id: 'docker-compose-svc',
    lang: 'Docker',
    title: 'Compose service template',
    title_es: 'Plantilla de servicio Compose',
    desc: 'Healthcheck + resource limits + restart policy.',
    desc_es: 'Healthcheck + límites + política de reinicio.',
    code: `services:
  api:
    build: ./api
    restart: unless-stopped
    env_file: .env
    ports:
      - "8080:8080"
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:8080/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 512M`
  },
  {
    id: 'sql-upsert',
    lang: 'SQL',
    title: 'Upsert (Postgres)',
    title_es: 'Upsert (Postgres)',
    desc: 'Insert or update the stars count on conflict.',
    desc_es: 'Inserta o actualiza el conteo en conflicto.',
    code: `INSERT INTO project_stats (repo, stars, updated_at)
VALUES ('octocat/hello', 100, now())
ON CONFLICT (repo) DO UPDATE SET
  stars      = EXCLUDED.stars,
  updated_at = EXCLUDED.updated_at;`
  },
  {
    id: 'sql-topn',
    lang: 'SQL',
    title: 'Top-N per group',
    title_es: 'Top-N por grupo',
    desc: 'Top 3 repos per language with ROW_NUMBER.',
    desc_es: 'Top 3 repos por lenguaje con ROW_NUMBER.',
    code: `SELECT lang, repo, stars FROM (
  SELECT lang, repo, stars,
         ROW_NUMBER() OVER (PARTITION BY lang ORDER BY stars DESC) AS rn
  FROM project_stats
) t
WHERE rn <= 3
ORDER BY lang, stars DESC;`
  }
];
