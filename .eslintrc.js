/** @type {import('eslint').Linter.Config} */
const js = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "prettier",
    "prettier/react",
  ],
  plugins: ["react", "prettier"],
  env: {
    node: true,
    browser: true,
    es2020: true,
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "latest",
    },
  },
  rules: {
    "react/prop-types": "off",
    // Disabled for the React 17 new JSX transform.
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
  },
};

/** @type {import('eslint').Linter.Config} */
const ts = {
  ...js,
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
    "prettier/react",
    "prettier/@typescript-eslint",
  ],
  plugins: ["react", "@typescript-eslint", "prettier"],
  parser: "@typescript-eslint/parser",
  rules: {
    ...js.rules,
  },
};

/** @type {import('eslint').Linter.Config} */
module.exports = {
  ...js,
  overrides: [{ files: ["**/*.ts", "**/*.tsx"], ...ts }],
};
