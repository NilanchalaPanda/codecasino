import React from "react";

const PurchaseVP = () => {
  const vpPackages = [
    { vp: 1000, price: 4.99, bonus: 100 },
    { vp: 2500, price: 9.99, bonus: 500 },
    { vp: 5000, price: 19.99, bonus: 1500 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 mb-12">
      <h2 className="font-display text-3xl text-center mb-6">Need More VP?</h2>
      <p className="text-center text-gray-400 mb-8">
        Purchase VP points to unlock more powerful digital upgrades
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {vpPackages.map((pkg, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-lg p-4 bg-gray-900/80"
          >
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-orange-400">
                {pkg.vp} VP
              </div>
              {pkg.bonus > 0 && (
                <div className="text-sm text-yellow-400">
                  +{pkg.bonus} Bonus
                </div>
              )}
            </div>
            <div className="text-center mb-4 text-gray-400">
              ${pkg.price.toFixed(2)}
            </div>
            <button className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-lg">
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseVP;
