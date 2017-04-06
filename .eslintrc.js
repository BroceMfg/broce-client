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
      "no-unused-prop-types": 0, // https://github.com/yannickcr/eslint-plugin-react/issues/885
    },
    "env": {
      "browser": true
    }
};
