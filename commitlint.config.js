module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "core",
        "global",
        "website",
        "wrapper",
        "dashboard",
        "daemon"
      ],
    ],
  },
};
