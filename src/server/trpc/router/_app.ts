import { router } from "../trpc";
import { noteRouter } from "./note";
import { teamRouter } from "./team";
export const appRouter = router({
  team: teamRouter,
  note: noteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
