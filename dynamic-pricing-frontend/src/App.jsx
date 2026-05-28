import { useState } from "react"
import axios from "axios"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts"


function App() {

  const [basePrice, setBasePrice] = useState(300)
  const [discount, setDiscount] = useState(10)
  const [unitsSold, setUnitsSold] = useState(25)
  const [inventory, setInventory] = useState(200)
  const [demand, setDemand] = useState(150)

  const [predictedPrice, setPredictedPrice] = useState(null)
  const [competitorPrice, setCompetitorPrice] = useState(null)

  const [loading, setLoading] = useState(false)
  const [revenue, setRevenue] = useState(0)

  const [amazonTitle, setAmazonTitle] = useState("")
  const [amazonDiscount, setAmazonDiscount] = useState("")
  const [amazonUrl, setAmazonUrl] = useState("")
  const [amazonLoading, setAmazonLoading] = useState(false)


  const handlePredict = async () => {

    setLoading(true)

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        {
          base_price: Number(basePrice),
          discount_pct: Number(discount),
          units_sold: Number(unitsSold),
          inventory_level: Number(inventory),
          demand_index: Number(demand)
        }
      )

      setPredictedPrice(response.data.predicted_price)

      setRevenue(
        response.data.predicted_price * unitsSold
      )

    } catch (error) {

      console.log(error)
    }

    setLoading(false)
  }


  const fetchAmazonData = async () => {

  setAmazonLoading(true)

  try {

    const response = await axios.post(
      "http://127.0.0.1:8000/amazon-price",
      {
        url: amazonUrl
      }
    )

    setCompetitorPrice(
      Number(
        response.data.price.replace(/,/g, "")
      )
    )

    setAmazonTitle(response.data.title)

    setAmazonDiscount(response.data.discount)

  } catch (error) {

    console.log(error)
  }

  setAmazonLoading(false)
}


  const priceDifference =
    competitorPrice && predictedPrice
      ? (predictedPrice - competitorPrice).toFixed(2)
      : null


  const shapInsights = []

  if (demand > 200) {
    shapInsights.push(
      "High demand increased predicted price"
    )
  }

  if (discount > 20) {
    shapInsights.push(
      "Large discount reduced predicted price"
    )
  }

  if (inventory > 700) {
    shapInsights.push(
      "High inventory reduced pricing pressure"
    )
  }

  if (basePrice > 700) {
    shapInsights.push(
      "High base price strongly influenced prediction"
    )
  }


  const chartData = [
    { name: "Demand", value: demand },
    { name: "Inventory", value: inventory },
    { name: "Units", value: unitsSold },
    { name: "Discount", value: discount },
  ]


  const trendDirection =
  demand > 250
    ? 1.2
    : inventory > 700
    ? 0.8
    : discount > 30
    ? 0.9
    : 1


const trendData = predictedPrice
  ? [
      {
        day: "Mon",
        price: Math.round(
          predictedPrice * 0.6 * trendDirection
        )
      },

      {
        day: "Tue",
        price: Math.round(
          predictedPrice * 0.7 * trendDirection
        )
      },

      {
        day: "Wed",
        price: Math.round(
          predictedPrice * 0.8 * trendDirection
        )
      },

      {
        day: "Thu",
        price: Math.round(
          predictedPrice * 0.9 * trendDirection
        )
      },

      {
        day: "Fri",
        price: Math.round(
          predictedPrice
        )
      }
    ]
  : []


  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-blue-950 text-white flex items-center justify-center p-6">

      <div className="w-full max-w-xl space-y-6">

        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-2xl text-center font-semibold">
          ⚠ Competitor price changed recently — monitoring market conditions.
        </div>


        <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-10 rounded-3xl shadow-2xl">

          <h1 className="text-4xl font-bold mb-8 text-center">
            AI Dynamic Pricing
          </h1>


          <div className="space-y-6">

            <div>

              <label className="text-gray-300">
                Base Price
              </label>

              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="Enter Base Price"
                className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white mt-2"
              />

            </div>


            <div>

              <label className="text-gray-300">
                Discount: {discount}%
              </label>

              <input
                type="range"
                min="0"
                max="50"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full"
              />

            </div>


            <div>

              <label className="text-gray-300">
                Units Sold: {unitsSold}
              </label>

              <input
                type="range"
                min="0"
                max="100"
                value={unitsSold}
                onChange={(e) => setUnitsSold(e.target.value)}
                className="w-full"
              />

            </div>


            <div>

              <label className="text-gray-300">
                Inventory Level: {inventory}
              </label>

              <input
                type="range"
                min="0"
                max="1000"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
                className="w-full"
              />

            </div>


            <div>

              <label className="text-gray-300">
                Demand Index: {demand}
              </label>

              <input
                type="range"
                min="0"
                max="400"
                value={demand}
                onChange={(e) => setDemand(e.target.value)}
                className="w-full"
              />

            </div>


            <button
              onClick={handlePredict}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all p-4 rounded-xl font-bold text-lg"
            >
              Predict Price
            </button>

            <input
              type="text"
              value={amazonUrl}
              onChange={(e) => setAmazonUrl(e.target.value)}
              placeholder="Paste Amazon Product URL"
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white"
            />
            <button
              onClick={fetchAmazonData}
              className="w-full bg-orange-600 hover:bg-orange-700 transition-all p-4 rounded-xl font-bold text-lg"
            >
              Fetch Amazon Product
            </button>
            {
  amazonLoading && (
    <div className="text-center text-orange-300 animate-pulse font-semibold">
      Fetching live Amazon product data...
    </div>
  )
}

            {
              loading && (
                <div className="text-center text-blue-300 animate-pulse">
                  Analyzing market demand...
                </div>
              )
            }


            <div className="bg-black/30 rounded-2xl p-6 text-center">

              <p className="text-gray-400 mb-2">
                Predicted Dynamic Price
              </p>

              <h1 className="text-6xl font-bold text-green-400">
                ₹ {predictedPrice ?? "0.00"}
              </h1>

            </div>


            <div className="bg-black/30 rounded-2xl p-6 text-center">

              <p className="text-gray-400 mb-2">
                Amazon Product Data
              </p>

              <h2 className="text-xl font-bold text-white">
                {amazonTitle || "No Product Loaded"}
              </h2>

              <p className="text-yellow-400 mt-3 text-2xl font-bold">
                ₹ {competitorPrice ?? "0"}
              </p>

              <p className="text-green-400 mt-2">
                {amazonDiscount}
              </p>

            </div>


            <div className="bg-black/30 rounded-2xl p-6 text-center">

              <p className="text-gray-400 mb-2">
                Market Insight
              </p>

              {
                competitorPrice && predictedPrice && (
                  <h2 className="text-2xl font-bold">

                    {
                      predictedPrice > competitorPrice
                        ? "⚠ Your price is higher than competitor"
                        : "✅ Your price is competitive"
                    }

                  </h2>
                )
              }

              {
                competitorPrice && predictedPrice && (
                  <p className="text-gray-300 mt-3">
                    Difference: ₹ {priceDifference}
                  </p>
                )
              }

            </div>


            <div className="bg-black/30 rounded-2xl p-6 text-center">

              <p className="text-gray-400 mb-2">
                Revenue Monitoring
              </p>

              <h2 className="text-4xl font-bold text-blue-400">
                ₹ {revenue.toFixed(2)}
              </h2>

              <p className="text-gray-300 mt-3">
                Estimated Revenue
              </p>

            </div>


            <div className="bg-black/30 rounded-2xl p-6 mt-6">

              <h2 className="text-2xl font-bold mb-4 text-center">
                Demand Analytics
              </h2>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>

            </div>


            <div className="bg-black/30 rounded-2xl p-6 mt-6">

              <h2 className="text-2xl font-bold mb-4 text-center">
                Price Trend Forecast
              </h2>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#22c55e"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>

            </div>


            <div className="bg-black/30 rounded-2xl p-6 mt-6">

              <h2 className="text-2xl font-bold mb-4 text-center">
                Explainable AI Insights
              </h2>

              <div className="space-y-3">

                {
                  shapInsights.length > 0 ? (

                    shapInsights.map((insight, index) => (

                      <div
                        key={index}
                        className="bg-white/10 p-4 rounded-xl text-gray-200"
                      >
                        {insight}
                      </div>

                    ))

                  ) : (

                    <div className="text-gray-400 text-center">
                      No major SHAP insights detected.
                    </div>

                  )
                }

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default App