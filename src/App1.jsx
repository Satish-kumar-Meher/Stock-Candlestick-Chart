// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Chart as ChartJS, CategoryScale, LinearScale, CandleStickController, TimeScale, Title, Tooltip } from 'chart.js';
// import { FinancialChart } from 'react-chartjs-2';
// import './App.css';

// ChartJS.register(CategoryScale, LinearScale, CandleStickController, TimeScale, Title, Tooltip);

// const App = () => {
//   const [selectedStock, setSelectedStock] = useState('');
//   const [candlestickData, setCandlestickData] = useState([]);
//   const [error, setError] = useState('');

//   const stocks = [
//     { name: 'AAPL', key: 'apple' },
//     { name: 'GOOGL', key: 'google' },
//     { name: 'MSFT', key: 'microsoft' },
//     { name: 'TSLA', key: 'tesla' },
//     { name: 'AMZN', key: 'amazon' },
//   ];

//   const fetchCandlestickData = async () => {
//     if (!selectedStock) return;

//     const today = new Date();
//     const toDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
//     const fromDate = new Date(today.setFullYear(today.getFullYear() - 1))
//       .toISOString()
//       .split('T')[0]; // Last year's date

//     try {
//       const response = await axios.get(
//         `https://api.upstox.com/v2/historical-candle/${selectedStock}/day/${toDate}/${fromDate}`,
//         {
//           headers: {
//             Accept: 'application/json',
//           },
//         }
//       );

//       if (response.data.status === 'success') {
//         const formattedData = response.data.data.candles.map((candle) => ({
//           x: new Date(candle[0]), // Timestamp
//           o: candle[1], // Open
//           h: candle[2], // High
//           l: candle[3], // Low
//           c: candle[4], // Close
//         }));
//         setCandlestickData(formattedData);
//       } else {
//         setError('Failed to fetch data');
//       }
//     } catch (err) {
//       setError(err.message || 'Something went wrong');
//     }
//   };

//   useEffect(() => {
//     fetchCandlestickData();
//   }, [selectedStock]);

//   const chartData = {
//     labels: candlestickData.map((d) => d.x),
//     datasets: [
//       {
//         label: 'Candlestick Chart',
//         data: candlestickData,
//         borderColor: 'rgba(75, 192, 192, 1)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       title: {
//         display: true,
//         text: 'Candlestick Chart',
//       },
//     },
//     scales: {
//       x: {
//         type: 'time',
//         time: {
//           tooltipFormat: 'DD MMM YYYY',
//         },
//       },
//     },
//   };

//   return (
//     <div>
//       <h1>Stock Candlestick Viewer</h1>
//       <select onChange={(e) => setSelectedStock(e.target.value)}>
//         <option value="">Select a Stock</option>
//         {stocks.map((stock) => (
//           <option key={stock.key} value={stock.key}>
//             {stock.name}
//           </option>
//         ))}
//       </select>

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {candlestickData.length > 0 && (
//         <FinancialChart data={chartData} options={options} />
//       )}
//     </div>
//   );
// };

// export default App;




// import React, { useState, useEffect } from 'react';
// import { Chart } from 'chart.js';
// import { CandleStickController, FinancialDataSeries } from 'chartjs-chart-financial';
// import { Chart as ChartJS } from 'react-chartjs-2';
// import axios from 'axios';
// import './App.css';

// // Register Chart.js components and financial plugin
// Chart.register(CandleStickController, FinancialDataSeries);

// const App = () => {
//   const [stocks, setStocks] = useState([
//     { id: 'AAPL', name: 'Apple' },
//     { id: 'GOOGL', name: 'Google' },
//     { id: 'MSFT', name: 'Microsoft' },
//     { id: 'AMZN', name: 'Amazon' },
//     { id: 'TSLA', name: 'Tesla' },
//     // Add more stocks as needed
//   ]);
//   const [selectedStock, setSelectedStock] = useState('');
//   const [chartData, setChartData] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (selectedStock) {
//       fetchStockData(selectedStock);
//     }
//   }, [selectedStock]);

//   const fetchStockData = async (stockId) => {
//     try {
//       setError('');
//       const response = await axios.get(
//         `https://api.upstox.com/v2/historical-candle/${stockId}/day/2023-12-26/2023-01-01`, // Example endpoint
//         {
//           headers: {
//             Accept: 'application/json',
//           },
//         }
//       );

//       const candles = response.data.data.candles.map(([t, o, h, l, c]) => ({
//         t: new Date(t),
//         o,
//         h,
//         l,
//         c,
//       }));

//       setChartData({
//         datasets: [
//           {
//             label: `Candlestick Data for ${stockId}`,
//             data: candles,
//             borderColor: 'rgba(0, 123, 255, 0.8)',
//           },
//         ],
//       });
//     } catch (err) {
//       setError('Failed to fetch stock data. Please try again.');
//     }
//   };

//   const handleStockChange = (e) => {
//     setSelectedStock(e.target.value);
//   };

//   return (
//     <div>
//       <h1>Stock Candlestick Chart</h1>
//       <select onChange={handleStockChange} value={selectedStock}>
//         <option value="" disabled>
//           Select a Stock
//         </option>
//         {stocks.map((stock) => (
//           <option key={stock.id} value={stock.id}>
//             {stock.name}
//           </option>
//         ))}
//       </select>
//       {error && <p className="error">{error}</p>}
//       {chartData && (
//         <div className="chart-container">
//           <ChartJS type="candlestick" data={chartData} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;



// import React, { useState } from 'react';
// import axios from 'axios';

// const App = () => {
//   const [candles, setCandles] = useState([]);
//   const [error, setError] = useState(null);

//   const fetchCandleData = async () => {
//     const baseUrl = 'https://api.upstox.com/v2/historical-candle';
//     const instrumentKey = 'NSE_EQ|INE839G01010'; // Replace with a valid instrument key
//     const interval = 'day';
//     const toDate = '2024-12-26';
//     const fromDate = '2023-01-01'; // Optional

//     try {
//       const response = await axios.get(
//         `${baseUrl}/${instrumentKey}/${interval}/${toDate}`,
//         {
//           params: {
//             from_date: fromDate,
//           },
//           headers: {
//             Accept: 'application/json',
//           },
//         }
//       );

//       console.log('API Response:', response.data);
//       setCandles(response.data.data.candles); // Update state with candle data
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching data from Upstox API:', err.message);
//       setError(err.message);
//       if (err.response) {
//         console.error('Response data:', err.response.data);
//       }
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Test Upstox API</h1>
//       <button onClick={fetchCandleData} style={{ padding: '10px 20px', cursor: 'pointer' }}>
//         Fetch Candle Data
//       </button>

//       {error && <p style={{ color: 'red' }}>Error: {error}</p>}

//       {candles.length > 0 && (
//         <div>
//           <h2>Candle Data</h2>
//           <table border="1" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr>
//                 <th>Timestamp</th>
//                 <th>Open</th>
//                 <th>High</th>
//                 <th>Low</th>
//                 <th>Close</th>
//                 <th>Volume</th>
//               </tr>
//             </thead>
//             <tbody>
//               {candles.map((candle, index) => (
//                 <tr key={index}>
//                   <td>{candle[0]}</td>
//                   <td>{candle[1]}</td>
//                   <td>{candle[2]}</td>
//                   <td>{candle[3]}</td>
//                   <td>{candle[4]}</td>
//                   <td>{candle[5]}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;





import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { ColorType, createChart } from 'lightweight-charts';

const App1 = () => {
  const [candles, setCandles] = useState([]);
  const [error, setError] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [candlesticks, setCandlesticks] = useState([]);

  // Handle CSV file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);
    
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setStockData(result.data); // Set stock data from CSV
        },
        // complete: (result) => {
        //   // Filter stocks based on instrument_type
        //   const filteredStocks = result.data.filter((item) =>
        //     ['A', 'B', 'T', 'X', 'M', 'Z', 'XT', 'G', 'E', 'MT'].includes(item.instrument_type)
        //   );
        //   setStockData(filteredStocks); // Set stock data from CSV
        // },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        },
      });
    }
  };

  
  // Handle stock selection and fetch data
  const handleStockChange = async (event) => {
    const stockName = event.target.value;
    setSelectedStock(stockName);

    // Find the corresponding instrument key based on stock selection
    const stock = stockData.find((item) => item.name === stockName);
    
    if (stock) {
      const instrumentKey = stock.instrument_key;

      // Call API with the corresponding instrument key
      try {
        const baseUrl = 'https://api.upstox.com/v2/historical-candle';
        const interval = 'day';
        const toDate = '2024-12-26';
        const fromDate = '2023-01-01';

        const response = await axios.get(
          `${baseUrl}/${instrumentKey}/${interval}/${toDate}`,
          {
            params: {
              from_date: fromDate,
            },
            headers: {
              Accept: 'application/json',
            },
          }
        );

        console.log('API Response:', response.data);
        const rawCandles = response.data.data.candles;
        setCandles(response.data.data.candles);
        // Transform candles into the required format
      const formattedCandles = rawCandles.map((candle) => ({
        time: candle[0].split('T')[0], // Convert timestamp to YYYY-MM-DD
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
      })).sort((a, b) => new Date(a.time) - new Date(b.time));

      console.log('Formatted Candle Data:', formattedCandles); // Update state with candle data
      setCandlesticks(formattedCandles);
        setError(null);
      } catch (err) {
        console.error('Error fetching data from Upstox API:', err.message);
        setError(err.message);
        if (err.response) {
          console.error('Response data:', err.response.data);
        }
      }
    }
  };

  const chartContainerRef = useRef()


  useEffect(() => {
  //   const initialData = [
  //     { time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
  //     { time: '2018-12-23', open: 45.12, high: 53.90, low: 45.12, close: 48.09 },
  //     { time: '2018-12-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
  //     { time: '2018-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.50 },
  //     { time: '2018-12-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
  //     { time: '2018-12-27', open: 91.04, high: 121.40, low: 82.70, close: 111.40 },
  //     { time: '2018-12-28', open: 111.51, high: 142.83, low: 103.34, close: 131.25 },
  //     { time: '2018-12-29', open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
  //     { time: '2018-12-30', open: 106.33, high: 110.20, low: 90.39, close: 98.10 },
  //     { time: '2018-12-31', open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
  // ]
 console.log("inside the use effect",candlesticks)
    const chart = createChart(chartContainerRef.current,{
      layout: {
        background: {
          type : ColorType.Solid, color:"white"
        },
      },
      width:1000,
      height:500
    })
    // const newSeries = chart.addAreaSeries({
    //   lineColor:"#2962FF",
    //   topColor:"#2962FF",
    //   bottomColor:"rgba(41,98,255,0.28)",
    // })
    const newSeries = chart.addCandlestickSeries({
      upColor: '#26a69a', 
      downColor: '#ef5350', 
      borderVisible: false,
      wickUpColor: '#26a69a', 
      wickDownColor: '#ef5350',
  })
    newSeries.setData(candlesticks)
    return () => [chart.remove()]
  },[candlesticks])

  // return (
  //   <>
  //   <div style={{ padding: '20px',
  //    }}>
  //     <h1>Stock Data Fetcher</h1>

  //     <input
  //       type="file"
  //       accept=".csv"
  //       onChange={handleFileUpload}
  //       style={{ marginBottom: '20px' }}
  //     />

  //     <div>
  //       <label>Select Stock:</label>
  //       <select
  //         value={selectedStock}
  //         onChange={handleStockChange}
  //         style={{ marginLeft: '10px', padding: '5px' }}
  //       >
  //         <option value="">Select a stock</option>
  //         {/* {stockData.map((stock, index) => (
  //           <option key={index} value={stock.name}>
  //             {stock.name}
  //           </option>
  //         ))} */}
  //         {/* {stockData
  //   .filter((stock) =>
  //     ['EQUITY'].includes(stock.instrument_type)
  //   )
  //   .map((stock, index) => (
  //     <option key={index} value={stock.name}>
  //       {stock.name}
  //     </option>
  //   ))} */}
  //   {stockData
  // .filter(
  //   (stock) =>
  //     stock.instrument_type === 'EQUITY' && !stock.name.includes('%')
  // )
  // .map((stock, index) => (
  //   <option key={index} value={stock.name}>
  //     {stock.name}
  //   </option>
  // ))}
  //       </select>
  //     </div>

  //     {error && <p style={{ color: 'red' }}>Error: {error}</p>}

  //     {candles.length > 0 && (
  //       <div >
  //         <h2>Candle Data for {selectedStock}</h2>
  //         <table border="1" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
  //           <thead>
  //             <tr>
  //               <th>Timestamp</th>
  //               <th>Open</th>
  //               <th>High</th>
  //               <th>Low</th>
  //               <th>Close</th>
  //               <th>Volume</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {candles.map((candle, index) => (
  //               <tr key={index}>
  //                 <td>{candle[0]}</td>
  //                 <td>{candle[1]}</td>
  //                 <td>{candle[2]}</td>
  //                 <td>{candle[3]}</td>
  //                 <td>{candle[4]}</td>
  //                 <td>{candle[5]}</td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
          
  //       </div>
  //     )}
  //     <div ref={chartContainerRef}></div>
  //   </div>
    
  //   </>
  // );
  return(
    <div style={{ fontFamily: "Arial, sans-serif", margin: "0 auto", maxWidth: "1200px", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#4CAF50" }}>Stock Data Fetcher</h1>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "45%",
          }}
        />

        <div style={{ width: "45%" }}>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>Select Stock:</label>
          <select
            value={selectedStock}
            onChange={handleStockChange}
            style={{
              padding: "10px",
              width: "calc(100% - 100px)",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select a stock</option>
            {stockData
              .filter((stock) => stock.instrument_type === "EQUITY" && !stock.name.includes("%"))
              .map((stock, index) => (
                <option key={index} value={stock.name}>
                  {stock.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>}

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {candles.length > 0 && (
          <div style={{ flex: 1, overflowX: "auto" }}>
            <h2 style={{ textAlign: "center", color: "#4CAF50" }}>Candle Data for {selectedStock}</h2>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ddd",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Timestamp</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Open</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>High</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Low</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Close</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Volume</th>
                </tr>
              </thead>
              <tbody>
                {candles.map((candle, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{candle[0]}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{candle[1]}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{candle[2]}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{candle[3]}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{candle[4]}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{candle[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div
          ref={chartContainerRef}
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "10px",
            minHeight: "300px",
          }}
        >
          {/* Chart renders here */}
        </div>
      </div>
    </div>
  )
};

export default App1;
