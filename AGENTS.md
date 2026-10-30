# Project rules

- Keep flight-search queries in `src/lib/flight-search.ts`, with the page owning request and result state, so filters are testable and stale requests cannot replace current results.