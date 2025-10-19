import { ArrowUp, ArrowDown, Trophy, ShoppingBag, Gift } from "lucide-react";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  description: string;
}

interface VPTransactionsProps {
  transactions: Transaction[];
}

export default function VPTransactions({ transactions }: VPTransactionsProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowUp className="text-green-400 h-5 w-5" />;
      case "withdrawal":
        return <ArrowDown className="text-red-400 h-5 w-5" />;
      case "prize":
        return <Trophy className="text-yellow-400 h-5 w-5" />;
      case "purchase":
        return <ShoppingBag className="text-cyan h-5 w-5" />;
      default:
        return <Gift className="text-purple-400 h-5 w-5" />;
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-xl text-cyan">VP Transactions</h2>
        <button className="px-4 py-2 bg-cyan/20 text-cyan rounded-lg text-sm hover:bg-cyan/30 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {getTransactionIcon(transaction.type)}
              <div>
                <div className="font-semibold">{transaction.description}</div>
                <div className="text-gray-400 text-xs">{transaction.date}</div>
              </div>
            </div>
            <div
              className={`font-mono ${
                transaction.amount > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {transaction.amount > 0 ? "+" : ""}
              {transaction.amount} VP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
