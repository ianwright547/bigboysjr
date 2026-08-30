import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const appSource = await readFile(join(projectRoot, "src/App.tsx"), "utf8");
const citiesSource = await readFile(join(projectRoot, "src/data/cities.ts"), "utf8");
const indexHtml = await readFile(join(projectRoot, "dist/index.html"), "utf8");

const explicitRoutes = [...appSource.matchAll(/<Route\s+path="([^"*]+)"/g)]
  .map((match) => match[1])
  .filter((route) => route !== "/");
const cityRoutes = [...citiesSource.matchAll(/^\s+slug:\s*"([^"]+)"/gm)]
  .map((match) => `/${match[1]}`);
const routes = [...new Set([...explicitRoutes, ...cityRoutes])];

await Promise.all(routes.map(async (route) => {
  const routeDirectory = join(projectRoot, "dist", route.replace(/^\//, ""));
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(join(routeDirectory, "index.html"), indexHtml);
}));

console.log(`Created static entrypoints for ${routes.length} application routes.`);
