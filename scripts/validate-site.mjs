import { access, readFile } from "node:fs/promises";
import path from "node:path";

const repositoryRoot = process.cwd();
const docsRoot = path.join(repositoryRoot, "docs");
const htmlFiles = ["index.html", "projects.html", "experience.html"];
const failures = [];

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function localPathForReference(pagePath, reference) {
  if (reference.startsWith("/static/")) {
    return path.join(docsRoot, reference.slice(1));
  }

  if (reference === "/favicon.ico") {
    return path.join(docsRoot, "favicon.ico");
  }

  if (!reference.startsWith("/") && !/^[a-z][a-z0-9+.-]*:/i.test(reference)) {
    return path.resolve(path.dirname(pagePath), reference.split("#")[0].split("?")[0]);
  }

  return null;
}

for (const fileName of htmlFiles) {
  const pagePath = path.join(docsRoot, fileName);

  if (!(await fileExists(pagePath))) {
    failures.push(`${fileName}: page does not exist`);
    continue;
  }

  const html = await readFile(pagePath, "utf8");
  const references = html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi);

  for (const [, reference] of references) {
    const referencedPath = localPathForReference(pagePath, reference);

    if (referencedPath && !(await fileExists(referencedPath))) {
      failures.push(`${fileName}: missing local asset ${reference}`);
    }
  }
}

const scripts = await readFile(path.join(docsRoot, "scripts.js"), "utf8");
const slideshowFiles = scripts.match(/"([^"]+\.(?:jpg|jpeg|png|webp|avif|svg))"/gi) ?? [];

for (const match of slideshowFiles) {
  const fileName = match.slice(1, -1);
  const referencedPath = path.join(docsRoot, "static", "coverphotos", fileName);

  if (!(await fileExists(referencedPath))) {
    failures.push(`scripts.js: missing slideshow asset /static/coverphotos/${fileName}`);
  }
}

if (failures.length > 0) {
  console.error("Site validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Site validation passed: ${htmlFiles.length} pages and their local assets are present.`);
}
