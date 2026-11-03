// Builds src/data/iconCatalog.js from the official AWS, Azure and GCP icon
// packs (via @likec4/icons) plus common tech logos and generic system icons.
// Usage: npm run icons
import { readdirSync, writeFileSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const ROOT = fileURLToPath(new URL("../node_modules/@likec4/icons/", import.meta.url));
const OUTPUT = fileURLToPath(new URL("../src/data/iconCatalog.js", import.meta.url));
const INK = "#1e1e1e";

const ACRONYMS = new Set([
  "api", "aws", "gcp", "sql", "vm", "vpc", "iam", "dns", "cdn", "ai", "ml", "iot", "ec2", "ecs",
  "eks", "rds", "s3", "sqs", "sns", "ses", "kms", "waf", "vpn", "ssl", "tls", "ssh", "ide",
  "cpu", "gpu", "ssd", "hdd", "nosql", "sdk", "cli", "ci", "cd", "ebs", "efs", "elb", "msk",
  "mq", "db", "ip", "tcp", "http", "https", "ui", "ux", "ad", "hpc", "sap", "nat",
]);

const prettify = (slug) =>
  slug
    .split("-")
    .map((word) =>
      ACRONYMS.has(word) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

const GROUPS = [
  { dir: "aws", category: "AWS", prefix: "aws", words: "aws amazon cloud" },
  { dir: "azure", category: "Azure", prefix: "azure", words: "azure microsoft cloud" },
  { dir: "gcp", category: "GCP", prefix: "gcp", words: "gcp google cloud" },
];

const TECH = [
  "docker", "kubernetes", "nginx", "redis", "postgresql", "mysql", "mariadb", "mongodb", "sqlite",
  "cassandra", "couchdb-icon", "neo4j", "influxdb", "elasticsearch", "kibana", "logstash",
  "kafka", "rabbitmq", "nats", "memcached", "apache", "hadoop", "spark", "airflow",
  "terraform", "ansible", "helm", "argocd", "jenkins", "github", "gitlab", "git", "bitbucket",
  "grafana", "prometheus", "jaeger", "datadog", "sentry", "consul", "vault",
  "traefik-proxy", "cloudflare", "vercel", "netlify", "firebase", "supabase", "stripe", "snowflake",
  "nodejs", "express", "react", "nextjs", "angular", "typescript", "javascript", "python",
  "django", "flask", "fastapi-icon", "java", "spring", "go", "rust", "kotlin", "swift", "php",
  "laravel", "ruby", "ruby-on-rails", "csharp", "dotnet", "graphql", "linux", "ubuntu", "bash",
  "tensorflow", "pytorch", "openai", "anthropic", "postman", "slack", "jira", "figma", "npm",
  "yarn", "webpack", "vitejs", "tailwindcss", "redux",
];

const GENERIC = [
  ["person", "User", "user person human client customer"],
  ["people", "Users", "users people team group customers"],
  ["person-circle", "User Profile", "user profile account avatar"],
  ["person-badge", "Admin", "admin badge employee staff"],
  ["laptop", "Laptop", "laptop computer pc client device"],
  ["pc-display", "Desktop", "desktop computer pc monitor"],
  ["display", "Monitor", "monitor screen display"],
  ["phone", "Mobile", "mobile phone smartphone android ios app"],
  ["tablet", "Tablet", "tablet ipad device"],
  ["tv", "TV", "tv television screen"],
  ["watch", "Smart Watch", "watch wearable iot"],
  ["server", "Server", "server backend host machine"],
  ["hdd-rack", "Server Rack", "server rack datacenter hardware"],
  ["hdd-stack", "Storage Stack", "storage disks stack"],
  ["hdd-network", "NAS", "nas network storage"],
  ["device-ssd", "SSD", "ssd disk storage drive"],
  ["database", "Database", "database db sql data store"],
  ["cloud", "Cloud", "cloud internet saas"],
  ["cloud-arrow-up", "Cloud Upload", "cloud upload sync"],
  ["globe", "Internet", "internet globe web www dns"],
  ["globe2", "Web", "web globe network"],
  ["router", "Router", "router network gateway"],
  ["ethernet", "Ethernet", "ethernet network cable lan"],
  ["wifi", "WiFi", "wifi wireless network"],
  ["cpu", "CPU", "cpu processor compute"],
  ["memory", "Memory", "memory ram cache"],
  ["motherboard", "Motherboard", "motherboard hardware board"],
  ["shield-lock", "Security", "security shield protection auth"],
  ["shield-check", "Secure", "secure shield verified"],
  ["bricks", "Firewall", "firewall wall security waf"],
  ["lock", "Lock", "lock secure encrypt"],
  ["key", "API Key", "key api secret credentials"],
  ["fingerprint", "Auth", "fingerprint auth biometric login"],
  ["envelope", "Email", "email mail smtp message"],
  ["bell", "Notification", "notification bell alert push"],
  ["chat-dots", "Chat", "chat message websocket"],
  ["send", "Send", "send publish message"],
  ["gear", "Settings", "settings gear config worker"],
  ["gear-wide-connected", "Process", "process workflow worker cog"],
  ["code-slash", "Code", "code api programming developer"],
  ["braces", "JSON", "json braces api payload"],
  ["terminal", "Terminal", "terminal cli shell console"],
  ["bug", "Bug", "bug issue defect"],
  ["robot", "Bot", "bot robot ai automation"],
  ["diagram-3", "Diagram", "diagram tree hierarchy flow"],
  ["diagram-2", "Flow", "flow diagram tree"],
  ["layers", "Layers", "layers stack tiers"],
  ["boxes", "Containers", "containers boxes docker pods"],
  ["box-seam", "Package", "package box artifact deploy"],
  ["archive", "Archive", "archive backup cold storage"],
  ["folder", "Folder", "folder directory files"],
  ["file-earmark-text", "File", "file document text"],
  ["file-earmark-code", "Code File", "file code source"],
  ["file-earmark-zip", "Zip", "zip archive compress"],
  ["table", "Table", "table grid rows"],
  ["bar-chart", "Analytics", "analytics chart bar metrics dashboard"],
  ["graph-up", "Metrics", "metrics graph growth monitoring"],
  ["pie-chart", "Pie Chart", "pie chart report"],
  ["activity", "Monitoring", "monitoring activity heartbeat health"],
  ["clock-history", "History", "history logs time audit"],
  ["calendar", "Scheduler", "calendar schedule cron"],
  ["credit-card", "Payment", "payment credit card billing stripe"],
  ["cash-stack", "Money", "money cash billing revenue"],
  ["cart", "Cart", "cart shopping ecommerce order"],
  ["bank", "Bank", "bank finance"],
  ["building", "Company", "company building office organization"],
  ["house", "Home", "home house iot smart"],
  ["geo-alt", "Location", "location map pin gps"],
  ["truck", "Delivery", "delivery truck logistics shipping"],
  ["camera", "Camera", "camera photo image"],
  ["camera-video", "Video", "video camera streaming"],
  ["mic", "Microphone", "microphone audio voice"],
  ["speaker", "Speaker", "speaker audio sound"],
  ["printer", "Printer", "printer print"],
  ["qr-code-scan", "QR Code", "qr code scan"],
  ["lightning-charge", "Fast", "fast lightning cache speed serverless"],
  ["search", "Search", "search find query index"],
  ["plug", "Integration", "integration plug connector plugin"],
  ["share", "Share", "share fanout publish"],
  ["download", "Download", "download pull fetch"],
  ["upload", "Upload", "upload push"],
  ["window", "Browser", "browser window web app frontend"],
  ["window-stack", "Windows", "windows ui frontend tabs"],
];

// Hand-drawn system-design icons (stroke style, 64x64)
const stroke = (body) =>
  `<g fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;

const CUSTOM = [
  {
    id: "sd-load-balancer",
    name: "Load Balancer",
    keywords: "load balancer lb nginx haproxy traffic distribute",
    body: stroke(
      '<circle cx="12" cy="32" r="6"/><circle cx="52" cy="12" r="6"/><circle cx="52" cy="32" r="6"/><circle cx="52" cy="52" r="6"/><path d="M18 32 L46 12 M18 32 H46 M18 32 L46 52"/>'
    ),
  },
  {
    id: "sd-queue",
    name: "Message Queue",
    keywords: "queue message broker kafka sqs rabbitmq buffer pubsub",
    body: stroke(
      '<rect x="4" y="22" width="12" height="20" rx="2"/><rect x="20" y="22" width="12" height="20" rx="2"/><rect x="36" y="22" width="12" height="20" rx="2"/><path d="M52 32 H60 M56 28 L60 32 L56 36"/>'
    ),
  },
  {
    id: "sd-cache",
    name: "Cache",
    keywords: "cache redis memcached fast memory in-memory",
    body: stroke(
      '<rect x="8" y="8" width="48" height="48" rx="8"/><path d="M36 14 L22 34 H32 L28 50 L42 30 H32 Z"/>'
    ),
  },
  {
    id: "sd-microservice",
    name: "Microservice",
    keywords: "microservice service hexagon api component",
    body: stroke('<path d="M32 6 L55 19 V45 L32 58 L9 45 V19 Z"/><circle cx="32" cy="32" r="7"/>'),
  },
  {
    id: "sd-api-gateway",
    name: "API Gateway",
    keywords: "api gateway entry point proxy route",
    body: stroke(
      '<path d="M10 8 V56 M54 8 V56"/><path d="M10 20 H54 M10 44 H54"/><path d="M26 32 H38 M34 27 L39 32 L34 37"/>'
    ),
  },
  {
    id: "sd-cdn",
    name: "CDN",
    keywords: "cdn edge content delivery cloudfront cloudflare",
    body: stroke(
      '<circle cx="32" cy="32" r="22"/><ellipse cx="32" cy="32" rx="9" ry="22"/><path d="M10 32 H54 M14 20 H50 M14 44 H50"/>'
    ),
  },
  {
    id: "sd-client-server",
    name: "Client Server",
    keywords: "client server request response http",
    body: stroke(
      '<rect x="4" y="18" width="20" height="26" rx="3"/><rect x="40" y="12" width="20" height="40" rx="3"/><path d="M26 28 H38 M34 24 L38 28 L34 32 M38 38 H26 M30 34 L26 38 L30 42"/>'
    ),
  },
  {
    id: "sd-database-cylinder",
    name: "Database Cylinder",
    keywords: "database cylinder db sql storage",
    body: stroke(
      '<ellipse cx="32" cy="14" rx="20" ry="8"/><path d="M12 14 V50 C12 54.4 20.9 58 32 58 C43.1 58 52 54.4 52 50 V14"/><path d="M12 32 C12 36.4 20.9 40 32 40 C43.1 40 52 36.4 52 32"/>'
    ),
  },
];

const toSvg = (markup) => {
  const viewBox = markup.match(/viewBox="([\d.\s-]+)"/)?.[1]?.trim().split(/\s+/).map(Number);
  const [, , width, height] = viewBox ?? [0, 0, 64, 64];
  const svg = markup
    .replace(/currentColor/g, INK)
    .replace(/^<svg /, `<svg width="${width}" height="${height}" `);
  return { svg, width, height };
};

async function render(dir, file) {
  const mod = await import(pathToFileURL(path.join(ROOT, dir, `${file}.js`)).href);
  return toSvg(renderToStaticMarkup(createElement(mod.default)));
}

const catalog = [];
const add = (entry) => catalog.push(entry);

for (const { dir, category, prefix, words } of GROUPS) {
  const files = readdirSync(path.join(ROOT, dir))
    .filter((file) => file.endsWith(".js") && file !== "index.js")
    .map((file) => file.replace(/\.js$/, ""));
  for (const file of files) {
    const { svg, width, height } = await render(dir, file);
    add({
      id: `${prefix}-${file}`,
      name: prettify(file),
      category,
      keywords: `${words} ${file.replace(/-/g, " ")}`,
      width,
      height,
      svg,
    });
  }
}

for (const file of TECH) {
  try {
    const { svg, width, height } = await render("tech", file);
    add({
      id: `tech-${file}`,
      name: prettify(file.replace(/-icon$|-proxy$/, "")),
      category: "Tech",
      keywords: `tech logo ${file.replace(/-/g, " ")}`,
      width,
      height,
      svg,
    });
  } catch {
    console.warn(`skipped tech icon: ${file}`);
  }
}

for (const [file, name, keywords] of GENERIC) {
  try {
    const { svg, width, height } = await render("bootstrap", file);
    add({ id: `general-${file}`, name, category: "General", keywords, width, height, svg });
  } catch {
    console.warn(`skipped generic icon: ${file}`);
  }
}

for (const { id, name, keywords, body } of CUSTOM) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">${body}</svg>`;
  add({ id, name, category: "System Design", keywords, width: 64, height: 64, svg });
}

const order = ["System Design", "General", "AWS", "Azure", "GCP", "Tech"];
catalog.sort(
  (a, b) => order.indexOf(a.category) - order.indexOf(b.category) || a.name.localeCompare(b.name)
);

writeFileSync(OUTPUT, `export default ${JSON.stringify(catalog)};\n`);
const kb = Math.round(JSON.stringify(catalog).length / 1024);
console.log(`Wrote ${catalog.length} icons (${kb} KB) to src/data/iconCatalog.js`);