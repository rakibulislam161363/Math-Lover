import Link from "next/link";
import CircuitBackground from "./CircuitBackground";

export default function Home() {
  return (
    <main className="relative isolate flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#02090e] px-6 py-16 text-white">
      <CircuitBackground />
      <section className="relative z-10 w-full max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Math Lover
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
          Account settings
        </h1>
        <p className="mt-2 text-slate-300">
          Manage how you sign in to your account.
        </p>

        <Link
          href="/settings/security"
          className="mt-8 block rounded-2xl border border-cyan-200/20 bg-slate-950/75 p-6 shadow-[0_0_30px_rgba(34,211,238,0.08)] backdrop-blur-sm transition hover:border-cyan-200/50 hover:bg-slate-950/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        >
          <h2 className="text-lg font-semibold text-white">Set Password</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Add password sign-in to a Google account while keeping Google
            sign-in available.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-cyan-200">
            Manage password
            <span aria-hidden="true"> &rarr;</span>
          </span>
        </Link>
      </section>
    </main>
  );
}
