import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-16">
      <section className="w-full max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Math Lover
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Account settings
        </h1>
        <p className="mt-2 text-slate-600">
          Manage how you sign in to your account.
        </p>

        <Link
          href="/settings/security"
          className="mt-8 block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <h2 className="text-lg font-semibold text-slate-900">Set Password</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add password sign-in to a Google account while keeping Google
            sign-in available.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-indigo-700">
            Manage password
            <span aria-hidden="true"> &rarr;</span>
          </span>
        </Link>
      </section>
    </main>
  );
}
