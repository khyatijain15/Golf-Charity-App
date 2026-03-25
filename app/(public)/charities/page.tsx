import Link from "next/link";

export default function CharitiesPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-14">
      <h1 className="text-4xl font-bold text-[var(--text-primary)]">Charity Directory</h1>
      <p className="text-[var(--text-secondary)] mt-4 text-lg">
        Browse active charities and choose where your subscription contribution goes.
      </p>
      <Link href="/signup" className="btn-accent inline-block mt-8">
        Join & Select Charity
      </Link>
    </main>
  );
}
