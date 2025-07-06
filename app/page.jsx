"use client";

import { useState } from "react";

export default function ForexCalculator() {
  const [pair, setPair] = useState("EUR/USD");
  const [accountSize, setAccountSize] = useState("");
  const [riskPercent, setRiskPercent] = useState("");
  const [stopLossPips, setStopLossPips] = useState("");
  const [takeProfitPips, setTakeProfitPips] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [result, setResult] = useState(null);

  // Price Level Calculator States
  const [showPriceHelper, setShowPriceHelper] = useState(false);
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");
  const [takeProfitPrice, setTakeProfitPrice] = useState("");

  const pipValues = {
    "EUR/USD": 10,
    "GBP/USD": 10,
    "USD/JPY": 9.13,
    "USD/CAD": 7.69,
    "GBP/JPY": 9.13,
    "XAU/USD": 1, // Gold: $1 per pip per lot (100 oz)
  };

  // Helper function to calculate pips from price levels
  const calculatePips = (entry, sl, tp, pair) => {
    if (!entry || !sl || !tp) return { slPips: 0, tpPips: 0 };

    const entryNum = Number.parseFloat(entry);
    const slNum = Number.parseFloat(sl);
    const tpNum = Number.parseFloat(tp);

    // Check if all values are valid numbers
    if (isNaN(entryNum) || isNaN(slNum) || isNaN(tpNum)) {
      return { slPips: 0, tpPips: 0 };
    }

    // Determine pip size based on pair
    let pipSize = 0.0001; // Default for most forex pairs (4 decimal places)
    if (pair.includes("JPY")) {
      pipSize = 0.01; // JPY pairs use 2 decimal places
    } else if (pair === "XAU/USD") {
      pipSize = 0.01; // Gold: 1 pip = $0.01 (2 decimal places)
    }

    const slPips = Math.abs(entryNum - slNum) / pipSize;
    const tpPips = Math.abs(tpNum - entryNum) / pipSize;

    return {
      slPips: Math.round(slPips * 10) / 10,
      tpPips: Math.round(tpPips * 10) / 10,
    };
  };

  // Handle price level calculation
  const handlePriceCalculation = () => {
    const { slPips, tpPips } = calculatePips(
      entryPrice,
      stopLossPrice,
      takeProfitPrice,
      pair
    );
    setStopLossPips(slPips.toString());
    setTakeProfitPips(tpPips.toString());
    setShowPriceHelper(false);
  };

  const handleCalculate = () => {
    const accountSizeNum = Number.parseFloat(accountSize) || 5000;
    const riskPercentNum = Number.parseFloat(riskPercent) || 1;
    const stopLossPipsNum = Number.parseFloat(stopLossPips) || 0;
    const takeProfitPipsNum = Number.parseFloat(takeProfitPips) || 0;
    const lotSizeNum = Number.parseFloat(lotSize) || 0.1;

    const pipValuePerLot = pipValues[pair] || 10;
    const pipValue = pipValuePerLot * lotSizeNum;
    const dollarRisk = pipValue * stopLossPipsNum;
    const potentialProfit = pipValue * takeProfitPipsNum;
    const maxRisk = (accountSizeNum * riskPercentNum) / 100;
    const riskRewardRatio = takeProfitPipsNum / stopLossPipsNum;
    const riskFeedback =
      dollarRisk <= maxRisk
        ? "✅ Risk is within your limit"
        : "⚠️ Risk exceeds your target";

    setResult({
      pipValue: pipValue.toFixed(2),
      dollarRisk: dollarRisk.toFixed(2),
      potentialProfit: potentialProfit.toFixed(2),
      maxAllowed: maxRisk.toFixed(2),
      riskRewardRatio: riskRewardRatio.toFixed(2),
      feedback: riskFeedback,
      isWithinLimit: dollarRisk <= maxRisk,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Forex & Gold Risk Calculator
          </h1>
          <p className="text-lg text-gray-600">Trading Risk Account Manager</p>
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mt-4">
            Account Balance: $
            {(Number.parseFloat(accountSize) || 5000).toLocaleString()}
          </div>
        </div>

        {/* Price Helper Modal */}
        {showPriceHelper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Price Level Calculator
                </h3>
                <button
                  onClick={() => setShowPriceHelper(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entry Price ({pair})
                  </label>
                  <input
                    type="number"
                    step={
                      pair.includes("JPY")
                        ? "0.001"
                        : pair === "XAU/USD"
                        ? "0.01"
                        : "0.00001"
                    }
                    placeholder={
                      pair === "XAU/USD"
                        ? "2045.50"
                        : pair.includes("JPY")
                        ? "150.123"
                        : "1.08500"
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stop Loss Price
                  </label>
                  <input
                    type="number"
                    step={
                      pair.includes("JPY")
                        ? "0.001"
                        : pair === "XAU/USD"
                        ? "0.01"
                        : "0.00001"
                    }
                    placeholder={
                      pair === "XAU/USD"
                        ? "2040.00"
                        : pair.includes("JPY")
                        ? "149.623"
                        : "1.08000"
                    }
                    className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    value={stopLossPrice}
                    onChange={(e) => setStopLossPrice(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Take Profit Price
                  </label>
                  <input
                    type="number"
                    step={
                      pair.includes("JPY")
                        ? "0.001"
                        : pair === "XAU/USD"
                        ? "0.01"
                        : "0.00001"
                    }
                    placeholder={
                      pair === "XAU/USD"
                        ? "2055.00"
                        : pair.includes("JPY")
                        ? "151.123"
                        : "1.09500"
                    }
                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    value={takeProfitPrice}
                    onChange={(e) => setTakeProfitPrice(e.target.value)}
                  />
                </div>

                {/* Live Preview */}
                {entryPrice && stopLossPrice && takeProfitPrice && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Preview:
                    </h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Stop Loss:</span>
                        <span className="font-medium text-red-600">
                          {
                            calculatePips(
                              entryPrice,
                              stopLossPrice,
                              takeProfitPrice,
                              pair
                            ).slPips
                          }{" "}
                          pips
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Take Profit:</span>
                        <span className="font-medium text-green-600">
                          {
                            calculatePips(
                              entryPrice,
                              stopLossPrice,
                              takeProfitPrice,
                              pair
                            ).tpPips
                          }{" "}
                          pips
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Risk:Reward:</span>
                        <span className="font-medium text-blue-600">
                          {(() => {
                            const { slPips, tpPips } = calculatePips(
                              entryPrice,
                              stopLossPrice,
                              takeProfitPrice,
                              pair
                            );
                            if (slPips === 0) return "Invalid SL";
                            if (tpPips === 0) return "Invalid TP";
                            return `1:${(tpPips / slPips).toFixed(2)}`;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowPriceHelper(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePriceCalculation}
                    disabled={!entryPrice || !stopLossPrice || !takeProfitPrice}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply Pips
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Calculator Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Trade Setup
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency Pair / Instrument
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  value={pair}
                  onChange={(e) => setPair(e.target.value)}
                >
                  <option value="EUR/USD">EUR/USD</option>
                  <option value="GBP/USD">GBP/USD</option>
                  <option value="USD/JPY">USD/JPY</option>
                  <option value="USD/CAD">USD/CAD</option>
                  <option value="GBP/JPY">GBP/JPY</option>
                  <option value="XAU/USD">XAU/USD (Gold) 🥇</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Size ($)
                </label>
                <input
                  type="number"
                  placeholder="5000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 bg-white"
                  value={accountSize}
                  onChange={(e) => setAccountSize(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Percentage (%)
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="2"
                  step="0.1"
                  placeholder="1.5"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 bg-white"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 1-2% for funded accounts
                </p>
              </div>

              {/* Pip Calculator Helper Button */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-900">💡 Price Level</h4>
                  <button
                    onClick={() => setShowPriceHelper(true)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Calculate from Prices
                  </button>
                </div>
                <p className="text-sm text-blue-700">
                  Have entry, stop loss, and take profit prices? Let us
                  calculate the pips for you!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stop Loss (pips)
                  </label>
                  <input
                    type="number"
                    placeholder="50"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 bg-white"
                    value={stopLossPips}
                    onChange={(e) => setStopLossPips(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Take Profit (pips)
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 bg-white"
                    value={takeProfitPips}
                    onChange={(e) => setTakeProfitPips(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lot Size {pair === "XAU/USD" ? "(Gold: 1 lot = 100 oz)" : ""}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.10"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 bg-white"
                  value={lotSize}
                  onChange={(e) => setLotSize(e.target.value)}
                />
              </div>

              <button
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium text-lg shadow-lg"
              >
                Calculate Risk & Profit
              </button>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Risk & Profit Analysis
              </h2>

              {result ? (
                <div className="space-y-4">
                  {/* Risk Status */}
                  <div
                    className={`p-4 rounded-lg border-2 ${
                      result.isWithinLimit
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="text-lg font-semibold mb-2 text-gray-900">
                      {result.feedback}
                    </div>
                  </div>

                  {/* Risk & Profit Metrics */}
                  <div className="grid gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Pip Value</div>
                      <div className="text-2xl font-bold text-gray-900">
                        ${result.pipValue}
                      </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="text-sm text-red-600">
                        Risk Amount (Loss)
                      </div>
                      <div className="text-2xl font-bold text-red-600">
                        -${result.dollarRisk}
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-sm text-green-600">
                        Potential Profit
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        +${result.potentialProfit}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-600">
                        Risk:Reward Ratio
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        1:{result.riskRewardRatio}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">
                        Maximum Allowed Risk
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        ${result.maxAllowed}
                      </div>
                    </div>
                  </div>

                  {/* Trade Summary */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3">
                      Trade Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-blue-700">Instrument:</div>
                      <div className="font-medium text-gray-900">{pair}</div>
                      <div className="text-blue-700">Lot Size:</div>
                      <div className="font-medium text-gray-900">
                        {lotSize || "0.10"}
                      </div>
                      <div className="text-blue-700">Stop Loss:</div>
                      <div className="font-medium text-gray-900">
                        {stopLossPips || "0"} pips
                      </div>
                      <div className="text-blue-700">Take Profit:</div>
                      <div className="font-medium text-gray-900">
                        {takeProfitPips || "0"} pips
                      </div>
                      <div className="text-blue-700">Risk %:</div>
                      <div className="font-medium text-gray-900">
                        {riskPercent || "1"}%
                      </div>
                    </div>
                  </div>

                  {/* Risk-Reward Analysis */}
                  <div
                    className={`p-4 rounded-lg border ${
                      Number.parseFloat(result.riskRewardRatio) >= 2
                        ? "bg-green-50 border-green-200"
                        : Number.parseFloat(result.riskRewardRatio) >= 1.5
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <h4 className="font-semibold mb-2 text-gray-900">
                      {Number.parseFloat(result.riskRewardRatio) >= 2
                        ? "🎯 Excellent Risk:Reward Ratio!"
                        : Number.parseFloat(result.riskRewardRatio) >= 1.5
                        ? "⚡ Good Risk:Reward Ratio"
                        : "⚠️ Low Risk:Reward Ratio"}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {Number.parseFloat(result.riskRewardRatio) >= 2
                        ? "This trade has an excellent risk-reward profile. You're risking $1 to potentially make $" +
                          result.riskRewardRatio
                        : Number.parseFloat(result.riskRewardRatio) >= 1.5
                        ? "Decent risk-reward ratio. Consider if this aligns with your trading strategy."
                        : "Consider increasing your take profit or reducing your stop loss for a better ratio."}
                    </p>
                  </div>

                  {/* Additional Tips */}
                  {!result.isWithinLimit && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">
                        💡 Risk Management Tips:
                      </h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>
                          • Reduce your lot size to{" "}
                          {(
                            (Number.parseFloat(result.maxAllowed) /
                              Number.parseFloat(result.dollarRisk)) *
                            (Number.parseFloat(lotSize) || 0.1)
                          ).toFixed(2)}
                        </li>
                        <li>
                          • Tighten your stop loss to{" "}
                          {Math.floor(
                            Number.parseFloat(result.maxAllowed) /
                              Number.parseFloat(result.pipValue)
                          )}{" "}
                          pips
                        </li>
                        <li>• Lower your risk percentage</li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-lg">
                    Enter your trade details and click "Calculate Risk & Profit"
                    to see your complete analysis
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
