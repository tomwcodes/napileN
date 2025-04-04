# Code Quality and AI Guidance

- 🧠 Think step by step before coding.
- ✅ Apply KISS (Keep It Simple, Stupid) and DRY (Don't Repeat Yourself) at all times.
- 🚫 Avoid over-engineering unless necessary for scalability or extensibility.
- 🧪 Prioritize writing testable code; if a feature is hard to test, it's probably too complex.
- 🔁 Prefer composition over inheritance.
- 🛠️ Use dependency injection where applicable to keep code decoupled and testable.
- 🔍 When faced with a tradeoff, choose readability and maintainability over cleverness.
- 🧹 Every module should do **one thing well**. If it feels like it's doing too much, split it.

# Code Review Prompts (AI or Human)
Before approving or merging any code:
- Are edge cases handled?
- Can this logic be tested easily?
- Can any part be simplified?
- Are there unnecessary dependencies?
- Are function names and variable names self-explanatory?