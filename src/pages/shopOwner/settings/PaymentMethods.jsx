import { useState } from "react";
import {
  MdCreditCard,
  MdPayments,
  MdAttachMoney,
  MdQrCode,
  MdPhoneAndroid,
  MdSecurity,
  MdCheckCircle,
  MdAdd,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdSwapVert,
  MdSync,
  MdReceipt,
  MdAccountBalance,
  MdAccountBalanceWallet,
  MdShowChart
} from "react-icons/md";

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      name: "Stripe",
      type: "credit_card",
      icon: "💳",
      status: "active",
      fee: 2.9,
      feeType: "percentage",
      minAmount: 0.5,
      maxAmount: 10000,
      processingTime: "instant",
      transactions: 1245,
      volume: 45230.50,
      color: "#635BFF"
    },
    {
      id: 2,
      name: "PayPal",
      type: "digital_wallet",
      icon: "💰",
      status: "active",
      fee: 3.4,
      feeType: "percentage",
      minAmount: 1,
      maxAmount: 10000,
      processingTime: "instant",
      transactions: 892,
      volume: 28950.75,
      color: "#0070BA"
    },
    {
      id: 3,
      name: "Bank Transfer",
      type: "bank",
      icon: "🏦",
      status: "active",
      fee: 0.5,
      feeType: "fixed",
      minAmount: 10,
      maxAmount: 50000,
      processingTime: "1-3 days",
      transactions: 456,
      volume: 187500.00,
      color: "#00C897"
    },
    {
      id: 4,
      name: "Cash on Delivery",
      type: "cash",
      icon: "💵",
      status: "active",
      fee: 0,
      feeType: "none",
      minAmount: 0,
      maxAmount: 500,
      processingTime: "on_delivery",
      transactions: 1567,
      volume: 32450.25,
      color: "#FF6B6B"
    },
    {
      id: 5,
      name: "Mobile Money",
      type: "mobile",
      icon: "📱",
      status: "pending",
      fee: 1.5,
      feeType: "percentage",
      minAmount: 0.1,
      maxAmount: 1000,
      processingTime: "instant",
      transactions: 234,
      volume: 5678.90,
      color: "#4CD964"
    },
    {
      id: 6,
      name: "Cryptocurrency",
      type: "crypto",
      icon: "₿",
      status: "inactive",
      fee: 1.0,
      feeType: "percentage",
      minAmount: 10,
      maxAmount: 100000,
      processingTime: "5-30 min",
      transactions: 45,
      volume: 12500.00,
      color: "#FF9500"
    }
  ]);

  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
  const [showMethodForm, setShowMethodForm] = useState(false);
  const [methodForm, setMethodForm] = useState({
    name: "",
    type: "credit_card",
    fee: "",
    feeType: "percentage",
    status: "active"
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const toggleMethodStatus = (id) => {
    setPaymentMethods(methods =>
      methods.map(method =>
        method.id === id
          ? { 
              ...method, 
              status: method.status === "active" ? "inactive" : "active" 
            }
          : method
      )
    );
  };

  const addPaymentMethod = () => {
    const newMethod = {
      id: paymentMethods.length + 1,
      ...methodForm,
      icon: "🆕",
      transactions: 0,
      volume: 0,
      color: "#" + Math.floor(Math.random()*16777215).toString(16),
      minAmount: 0,
      maxAmount: 10000,
      processingTime: "instant"
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    setShowMethodForm(false);
    setMethodForm({
      name: "",
      type: "credit_card",
      fee: "",
      feeType: "percentage",
      status: "active"
    });
  };

  const paymentStats = {
    totalMethods: paymentMethods.length,
    activeMethods: paymentMethods.filter(m => m.status === "active").length,
    totalVolume: paymentMethods.reduce((sum, m) => sum + m.volume, 0),
    totalTransactions: paymentMethods.reduce((sum, m) => sum + m.transactions, 0),
    avgFee: paymentMethods.reduce((sum, m) => sum + m.fee, 0) / paymentMethods.length
  };

  const getTypeIcon = (type) => {
    const icons = {
      credit_card: <MdCreditCard />,
      digital_wallet: <MdPayments />,
      bank: <MdAccountBalance />,
      cash: <MdAttachMoney />,
      mobile: <MdPhoneAndroid />,
      crypto: <MdShowChart />
    };
    return icons[type] || <MdPayments />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-6">
      {/* Header */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Payment Methods
              </h1>
              <p className="text-indigo-100 text-lg">
                Manage payment gateways, fees, and transactions
              </p>
            </div>
            <button
              onClick={() => setShowMethodForm(true)}
              className="mt-4 md:mt-0 px-6 py-3 bg-white text-indigo-600 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold shadow-lg"
            >
              <MdAdd className="text-xl" /> Add Payment Method
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Active Methods</p>
                  <p className="text-2xl font-bold text-white">{paymentStats.activeMethods}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-xl">
                  <MdCheckCircle className="text-xl text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Volume</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(paymentStats.totalVolume)}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-xl">
                  <MdReceipt className="text-xl text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Transactions</p>
                  <p className="text-2xl font-bold text-white">{paymentStats.totalTransactions}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-xl">
                  <MdSwapVert className="text-xl text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Avg Fee</p>
                  <p className="text-2xl font-bold text-white">{paymentStats.avgFee.toFixed(2)}%</p>
                </div>
                <div className="p-2 bg-white/20 rounded-xl">
                  <MdAttachMoney className="text-xl text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Payment Methods</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition">
                  <MdSync />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                    selectedMethod.id === method.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: method.color + "20", color: method.color }}
                      >
                        {method.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{method.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getTypeIcon(method.type)}
                          <span className="text-sm text-gray-500 capitalize">
                            {method.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMethodStatus(method.id);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        method.status === "active"
                          ? "bg-green-100 text-green-800"
                          : method.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {method.status}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Fee</p>
                      <p className="font-bold">
                        {method.fee === 0 ? "Free" : `${method.fee}%`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Volume</p>
                      <p className="font-bold">{formatCurrency(method.volume)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium">
                      <MdEdit className="inline mr-1" /> Edit
                    </button>
                    <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium">
                      <MdVisibility className="inline mr-1" /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Method Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Method Details</h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <MdEdit />
                </button>
              </div>
            </div>

            {selectedMethod && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: selectedMethod.color + "20", color: selectedMethod.color }}
                  >
                    {selectedMethod.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedMethod.name}</h3>
                    <p className="text-gray-500">{selectedMethod.type.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Processing Fee</span>
                      <span className="font-bold text-lg" style={{ color: selectedMethod.color }}>
                        {selectedMethod.fee === 0 ? "Free" : `${selectedMethod.fee}%`}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedMethod.feeType === "percentage" ? "Percentage fee per transaction" : "Fixed fee per transaction"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Min Amount</p>
                      <p className="font-bold">{formatCurrency(selectedMethod.minAmount)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Max Amount</p>
                      <p className="font-bold">{formatCurrency(selectedMethod.maxAmount)}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Processing Time</p>
                    <p className="font-bold">{selectedMethod.processingTime}</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Total Transactions</p>
                        <p className="font-bold">{selectedMethod.transactions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Volume</p>
                        <p className="font-bold">{formatCurrency(selectedMethod.volume)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Security & Compliance */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <MdSecurity className="text-2xl" />
              <h3 className="text-lg font-bold">Security & Compliance</h3>
            </div>
            <p className="text-indigo-100 mb-4">
              All payment methods are PCI DSS compliant and secured with 256-bit SSL encryption.
            </p>
            <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl transition flex items-center justify-center gap-2 font-medium">
              <MdSecurity /> View Security Details
            </button>
          </div>
        </div>
      </div>

      {/* Add Method Modal */}
      {showMethodForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Add Payment Method</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Method Name"
                value={methodForm.name}
                onChange={(e) => setMethodForm({ ...methodForm, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <select
                value={methodForm.type}
                onChange={(e) => setMethodForm({ ...methodForm, type: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="credit_card">Credit Card</option>
                <option value="digital_wallet">Digital Wallet</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="mobile">Mobile Money</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Fee (%)"
                  value={methodForm.fee}
                  onChange={(e) => setMethodForm({ ...methodForm, fee: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
                <select
                  value={methodForm.feeType}
                  onChange={(e) => setMethodForm({ ...methodForm, feeType: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowMethodForm(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={addPaymentMethod}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition text-white font-medium"
                >
                  Add Method
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}