import Link from "next/link";

export default function CharitiesPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-14">
      <h1 className="text-4xl font-bold">Charity Directory</h1>
      <p className="text-zinc-300 mt-3">
        Browse active charities and choose where your subscription contribution goes.
      </p>
      <Link href="/signup" className="cta inline-block mt-8 px-5 py-3 rounded-xl">
        Join & Select Charity
      </Link>
    </main>
  );
}
