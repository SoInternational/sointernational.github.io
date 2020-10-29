const development = process.env.NODE_ENV !== "production";

/** @type {import('@babel/core').ConfigFunction} */
module.exports = (api) => {
  api.cache(false);

  return {
    presets: [
      ["@babel/preset-env", { useBuiltIns: "usage", corejs: { version: 3, proposals: true }, modules: false }],
      ["@babel/preset-react", { development, runtime: "automatic" }],
      [
        "@babel/preset-typescript",
        {
          isTSX: true,
          allExtensions: true,
          allowNamespaces: true,
          allowDeclareFields: true,
          onlyRemoveTypeImports: true,
        },
      ],
    ],
    plugins: [["@babel/plugin-proposal-class-properties"], ["@babel/plugin-proposal-decorators", { legacy: true }]],
  };
};
