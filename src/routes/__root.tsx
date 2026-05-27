import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
} from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-lg text-center">
        <div className="text-[120px] sm:text-[180px] font-black leading-none bg-gradient-to-br from-primary via-primary-glow to-primary-deep bg-clip-text text-transparent">
          404
        </div>
        <h2 className="mt-2 text-2xl font-bold">This ballot box is empty</h2>
        <p className="mt-3 text-muted-foreground">
          The page you're looking for has either moved, been removed, or never existed.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Go home
          </Link>
          <Link
            to="/candidates"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent"
          >
            View candidates
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { title: "Leadcity Voting App — Free. Fair. Verifiable." },
      {
        name: "description",
        content:
          "The official student election platform for Lead City University. Register, view candidates, and cast your vote securely.",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Layout />
    </>
  );
}
