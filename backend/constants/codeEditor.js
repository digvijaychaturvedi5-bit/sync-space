const SUPPORTED_CODE_LANGUAGES = ["javascript", "python", "cpp"];
const DEFAULT_CODE_LANGUAGE = "javascript";

const DEFAULT_CODE_TEMPLATES = {
  javascript: `function syncSpaceWelcome() {
  const teammates = ["Alice", "Bob"];
  return teammates.map((name) => \`Welcome, \${name}!\`);
}

console.log(syncSpaceWelcome());`,
  python: `def sync_space_welcome():
    teammates = ["Alice", "Bob"]
    return [f"Welcome, {name}!" for name in teammates]


print(sync_space_welcome())`,
  cpp: `#include <iostream>
#include <vector>
#include <string>

int main() {
  std::vector<std::string> teammates = {"Alice", "Bob"};

  for (const auto& name : teammates) {
    std::cout << "Welcome, " << name << "!" << std::endl;
  }

  return 0;
}`
};

const normalizeCodeLanguage = (language) =>
  SUPPORTED_CODE_LANGUAGES.includes(language) ? language : DEFAULT_CODE_LANGUAGE;

const getDefaultCodeTemplate = (language = DEFAULT_CODE_LANGUAGE) =>
  DEFAULT_CODE_TEMPLATES[normalizeCodeLanguage(language)];

module.exports = {
  DEFAULT_CODE_LANGUAGE,
  SUPPORTED_CODE_LANGUAGES,
  getDefaultCodeTemplate,
  normalizeCodeLanguage
};
