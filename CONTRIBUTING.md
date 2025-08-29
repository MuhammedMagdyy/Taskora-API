## Contributing to Taskora-API

Thanks for taking the time to contribute — your help makes this project better.

This document explains how to get the project running locally, the preferred workflow, and what we look for in pull requests.

---

### Quick start

1. Fork the repository and clone your fork.
2. Create a descriptive branch from `main`:

```
git checkout -b feature/awesome-feature
```

3. Make small, focused commits. Use clear messages (see Commit message style).
4. Push your branch and open a Pull Request against the `main` branch.

---


### Local development setup

- For setup the project locally, please refer to the [README](./README.md) file.

---

### Branch naming

Use clear prefixes:

- `feature/<short-description>` — new feature
- `fix/<short-description>` — bugfix
- `chore/<short-description>` — maintenance
- `docs/<short-description>` — documentation only

Keep branch names short, lowercase, and hyphen-separated.

--- 

### Commit message style

We prefer conventional, concise commit messages. Example:

```
feat(auth): add refresh token endpoint
fix(task): reject invalid due dates
docs(readme): clarify setup steps
```

Start with a type (feat, fix, docs, chore, refactor, test) followed by an optional scope and short description.

---

### Code style

- TypeScript code should follow the existing project conventions.
- Run `npm run format` before committing.
- Run `npm run lint` and address issues flagged by ESLint.
- Keep functions small and well-named. Add comments for non-obvious logic.

---

### Tests

- I'll add unit tests for existing/new logic under `__tests__` in the future insha'Allah, and you should too!

---

### Pull request checklist

When opening a PR, please include:

- A descriptive title and summary of changes.
- Link to any related issue (e.g. `Closes #123`).
- Steps to reproduce or validate the change.
- Notes on any environment changes.

[Reviewers](https://github.com/MuhammedMagdyy) will check tests, linting, and overall before merging.

---

### Reporting issues

- Open a new issue for bugs or feature requests. Provide steps to reproduce, expected vs actual behaviour, and any logs or stack traces.

---

### Security and sensitive data

- Don't commit secrets or environment variables. Use `.env` file and `.env.example` for reference.

---

🚀 Thank you for contributing — we appreciate your time and effort!