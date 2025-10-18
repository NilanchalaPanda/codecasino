export default function StoreHero() {
  return (
    <div
      className="max-w-7xl mx-auto h-64 bg-cover bg-center flex flex-col justify-center items-start px-10"
      //   style={{ backgroundImage: "url('/store-banner.jpg')" }}
    >
      <h1 className="font-display text-4xl mb-2 text-cyan">Code Store</h1>
      <p className="text-lg max-w-lg text-gray-400">
        Enhance your coding arsenal with powerful digital upgrades
      </p>
      <div className="mt-4 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
        Your VP Balance:{" "}
        <span className="text-orange-accent font-bold">2,450</span>
      </div>
    </div>
  );
}
