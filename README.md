## Frontend

### Install

```bash
   yarn install
```

### Run Service (Development)
```bash
   yarn start-dev
```

### Run Service (Production)
```bash
   yarn start
```

## Contribution Guidelines

### Component Definition & Refactoring
- 🚫 For now, we have most components in their own directories.
- 🚫 Some components include several components in one directory.
- ✅ We recommend defining one component in one separate directory inside `src/components`, including `ComponentName.js`, `index.js`, and `styles.js`.
    1. `ComponentName.js` will include the implementation of the component detail.
    2. `index.js` will export the component by default.
    3. `styles.js` will include styles definition using styled components.
- ✅ We strongly recommend defining new components as functional components.
- ✅ When someone works on refactoring a class component, we recommend converting it into functional component.

### Styling
- 🚫 Most of the web app had been implemented using `Mui v4` and its styling system.
- ✅ We strongly recommend styling components using `Mui v5` styling system, which is using `emotion` or `sx` props.
