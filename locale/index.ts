// language.ts
import * as fs from "fs";
import * as path from "path";

const DEFAULT_LANGUAGE = "en";

function loadLanguageFile(language) {
  const filePath = path.join(__dirname, "../..", `${language}.json`);
  const defaultPath = path.join(__dirname, "../..", `en.json`);
  console.log(filePath, filePath);
  const data = fs.readFileSync(filePath ? filePath : defaultPath, "utf-8");
  return JSON.parse(data);
}

export function getLanguageStrings(language) {
  if (!language) {
    return loadLanguageFile(DEFAULT_LANGUAGE);
  }

  try {
    return loadLanguageFile(language);
  } catch (e) {
    console.warn(
      `Failed to load language file for language "${language}", using default language.`
    );
    return loadLanguageFile(DEFAULT_LANGUAGE);
  }
}
