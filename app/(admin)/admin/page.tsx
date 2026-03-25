export default function AdminPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-4 mt-6">
        {["Total Users", "Active Subscribers", "Prize Pool", "Charity Total"].map((item) => (
          <div key={item} className="card p-5">
            <p className="text-zinc-400">{item}</p>
            <p className="text-3xl mt-2 font-semibold">--</p>
          </div>
        ))}
      </div>
    </main>
  );
}
