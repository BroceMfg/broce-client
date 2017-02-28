module.exports = {
    "extends": "airbnb",
    "plugins": [
      "react",
      "jsx-a11y",
      "import"
    ],
    "rules": {
      "no-console": 0,
      "comma-dangle": 0,
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
      "no-multiple-empty-lines": [2, { "max": 1 }],
    },
    "env": {
      "browser": true
    }
};
