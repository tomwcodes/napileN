# Appwrite Integration TODO List

Here are the next steps to fully integrate Appwrite and enhance the application:

    - [ ] Consider creating an "extended profiles" collection in Appwrite DB to store `bio`, `username` (if desired and unique), `publicationCount`, etc., and fetch/display this data.
- [ ] **Address Peer Dependency Warnings:** Investigate and potentially resolve the React/date-fns peer dependency warnings shown during `pnpm add appwrite`.
- [ ] **Error Handling:** Review and potentially enhance error handling across components interacting with Appwrite.
- [ ] **Loading States:** Improve loading state indicators (e.g., using skeletons) in components that fetch data asynchronously. (Basic skeleton added to profile page, review others).

- you may also like section algorithm
- deleting posts and users
- if no spaces text overlaps screen
- console log full log with sec concern