import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { ColorType, createChart } from 'lightweight-charts';

// Import the CSV file

const App = () => {
  const [candles, setCandles] = useState([]);
  const [error, setError] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [candlesticks, setCandlesticks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Load and parse the CSV file directly
  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch('/csv/complete.csv');
        const csvText = await response.text();
  
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setStockData(result.data);
          },
        });
      } catch (error) {
        console.error('Error fetching CSV:', error);
      }
    };
  
    fetchCSV();
  }, []);

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

        // Transform candles into the required format
        const formattedCandles = rawCandles
          .map((candle) => ({
            time: candle[0].split('T')[0], // Convert timestamp to YYYY-MM-DD
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4],
          }))
          .sort((a, b) => new Date(a.time) - new Date(b.time));

        console.log('Formatted Candle Data:', formattedCandles); // Update state with candle data
        setCandlesticks(formattedCandles);
        setCandles(rawCandles);
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

  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: 'white',
        },
      },
      width: 700,
      height: 500,
    });

    const newSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    newSeries.setData(candlesticks);

    return () => chart.remove();
  }, [candlesticks]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter stock data based on the search query
  const filteredStockData = stockData.filter((stock) =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '0 auto', maxWidth: '1200px', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#4CAF50' }}>Stock Data Fetcher</h1>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Search Stock:</label>
        <input
          type="search"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for a stock..."
          style={{
            padding: '10px',
            width: 'calc(100% - 100px)',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginBottom: '10px',
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Stock:</label>
        <select
          value={selectedStock}
          onChange={handleStockChange}
          style={{
            padding: '10px',
            width: 'calc(100% - 100px)',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        >
          <option value="">Select a stock</option>
          {filteredStockData
            .filter((stock) => stock.instrument_type === 'EQUITY' && !stock.name.includes('%'))
            .map((stock, index) => (
              <option key={index} value={stock.name}>
                {stock.name}
              </option>
            ))}
        </select>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {candles.length > 0 && (
          <div style={{ flex: 1, overflowX: 'auto' }}>
            <h2 style={{ textAlign: 'center', color: '#4CAF50' }}>Candle Data for {selectedStock}</h2>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #ddd',
                marginTop: '10px',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Timestamp</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Open</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>High</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Low</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Close</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Volume</th>
                </tr>
              </thead>
              <tbody>
                {candles.map((candle, index) => (
                  <tr key={index}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{candle[0].split('T')[0]}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{candle[1]}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{candle[2]}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{candle[3]}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{candle[4]}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{candle[5]}</td>
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
            border: '1px solid #ddd',
            borderRadius: '5px',
            padding: '10px',
            minHeight: '300px',
          }}
        >
          {/* Chart renders here */}
        </div>
      </div>
    </div>
  );
};

export default App;


























// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import Papa from 'papaparse';
// import { ColorType, createChart } from 'lightweight-charts';

// const App = () => {
//   const [candles, setCandles] = useState([]);
//   const [error, setError] = useState(null);
//   const [stockData, setStockData] = useState([]);
//   const [selectedStock, setSelectedStock] = useState('');
//   const [csvFile, setCsvFile] = useState(null);
//   const [candlesticks, setCandlesticks] = useState([]);

//   // Handle CSV file upload
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     setCsvFile(file);

//     if (file) {
//       Papa.parse(file, {
//         header: true,
//         skipEmptyLines: true,
//         complete: (result) => {
//           setStockData(result.data); // Set stock data from CSV
//         },
//         error: (error) => {
//             console.error('Error parsing CSV:', error);
//           },
//         });
//       }
//     };

//     // Handle stock selection and fetch data
//   const handleStockChange = async (event) => {
//     const stockName = event.target.value;
//     setSelectedStock(stockName);

//     // Find the corresponding instrument key based on stock selection
//     const stock = stockData.find((item) => item.name === stockName);
    
//     if (stock) {
//       const instrumentKey = stock.instrument_key;

//       // Call API with the corresponding instrument key
//       try {
//         const baseUrl = 'https://api.upstox.com/v2/historical-candle';
//         const interval = 'day';
//         const toDate = '2024-12-26';
//         const fromDate = '2023-01-01';

//         const response = await axios.get(
//           `${baseUrl}/${instrumentKey}/${interval}/${toDate}`,
//           {
//             params: {
//               from_date: fromDate,
//             },
//             headers: {
//               Accept: 'application/json',
//             },
//           }
//         );

//         console.log('API Response:', response.data);
//         const rawCandles = response.data.data.candles;
//         setCandles(response.data.data.candles);
//         // Transform candles into the required format
//       const formattedCandles = rawCandles.map((candle) => ({
//         time: candle[0].split('T')[0], // Convert timestamp to YYYY-MM-DD
//         open: candle[1],
//         high: candle[2],
//         low: candle[3],
//         close: candle[4],
//       })).sort((a, b) => new Date(a.time) - new Date(b.time));

//       console.log('Formatted Candle Data:', formattedCandles); // Update state with candle data
//       setCandlesticks(formattedCandles);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching data from Upstox API:', err.message);
//         setError(err.message);
//         if (err.response) {
//           console.error('Response data:', err.response.data);
//         }
//       }
//     }
//   };

//   const chartContainerRef = useRef()


//   useEffect(() => {
//     console.log("inside the use effect",candlesticks)
//         const chart = createChart(chartContainerRef.current,{
//           layout: {
//             background: {
//               type : ColorType.Solid, color:"white"
//             },
//           },
//           width:500,
//           height:300
//         })
//         // const newSeries = chart.addAreaSeries({
//         //   lineColor:"#2962FF",
//         //   topColor:"#2962FF",
//         //   bottomColor:"rgba(41,98,255,0.28)",
//         // })
//         const newSeries = chart.addCandlestickSeries({
//           upColor: '#26a69a', 
//           downColor: '#ef5350', 
//           borderVisible: false,
//           wickUpColor: '#26a69a', 
//           wickDownColor: '#ef5350',
//       })
//         newSeries.setData(candlesticks)
//         return () => [chart.remove()]
//       },[candlesticks])

//       return(
//         <div style={{ fontFamily: "Arial, sans-serif", margin: "0 auto", maxWidth: "1200px", padding: "20px" }}>
//           <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#4CAF50" }}>Stock Data Fetcher</h1>
          
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
//             <input
//               type="file"
//               accept=".csv"
//               onChange={handleFileUpload}
//               style={{
//                 padding: "10px",
//                 border: "1px solid #ccc",
//                 borderRadius: "5px",
//                 width: "45%",
//               }}
//             />
    
//             <div style={{ width: "45%" }}>
//               <label style={{ marginRight: "10px", fontWeight: "bold" }}>Select Stock:</label>
//               <select
//                 value={selectedStock}
//                 onChange={handleStockChange}
//                 style={{
//                   padding: "10px",
//                   width: "calc(100% - 100px)",
//                   borderRadius: "5px",
//                   border: "1px solid #ccc",
//                 }}
//               >
//                 <option value="">Select a stock</option>
//                 {stockData
//                   .filter((stock) => stock.instrument_type === "EQUITY" && !stock.name.includes("%"))
//                   .map((stock, index) => (
//                     <option key={index} value={stock.name}>
//                       {stock.name}
//                     </option>
//                   ))}
//               </select>
//             </div>
//           </div>
    
//           {error && <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>}
    
//           <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
//             {candles.length > 0 && (
//               <div style={{ flex: 1, overflowX: "auto" }}>
//                 <h2 style={{ textAlign: "center", color: "#4CAF50" }}>Candle Data for {selectedStock}</h2>
//                 <table
//                   style={{
//                     width: "100%",
//                     borderCollapse: "collapse",
//                     border: "1px solid #ddd",
//                     marginTop: "10px",
//                   }}
//                 >
//                   <thead>
//                     <tr style={{ backgroundColor: "#f2f2f2" }}>
//                       <th style={{ padding: "10px", border: "1px solid #ddd" }}>Timestamp</th>
//                       <th style={{ padding: "10px", border: "1px solid #ddd" }}>Open</th>
//                       <th style={{ padding: "10px", border: "1px solid #ddd" }}>High</th>
//                       <th style={{ padding: "10px", border: "1px solid #ddd" }}>Low</th>
//                       <th style={{ padding: "10px", border: "1px solid #ddd" }}>Close</th>
//                       <th style={{ padding: "10px", border: "1px solid #ddd" }}>Volume</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {candles.map((candle, index) => (
//                       <tr key={index}>
//                         <td style={{ padding: "8px", border: "1px solid #ddd" }}>{candle[0]}</td>
//                         <td style={{ padding: "8px", border: "1px solid #ddd" }}>{candle[1]}</td>
//                         <td style={{ padding: "8px", border: "1px solid #ddd" }}>{candle[2]}</td>
//                         <td style={{ padding: "8px", border: "1px solid #ddd" }}>{candle[3]}</td>
//                         <td style={{ padding: "8px", border: "1px solid #ddd" }}>{candle[4]}</td>
//                         <td style={{ padding: "8px", border: "1px solid #ddd" }}>{candle[5]}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
    
//             <div
//               ref={chartContainerRef}
//               style={{
//                 flex: 1,
//                 border: "1px solid #ddd",
//                 borderRadius: "5px",
//                 padding: "10px",
//                 minHeight: "300px",
//               }}
//             >
//               {/* Chart renders here */}
//             </div>
//           </div>
//         </div>
//       )
//     };
    
//     export default App;
    




















// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import Papa from 'papaparse';
// import { ColorType, createChart } from 'lightweight-charts';

// // Import the CSV file


// const App = () => {
//   const [candles, setCandles] = useState([]);
//   const [error, setError] = useState(null);
//   const [stockData, setStockData] = useState([]);
//   const [selectedStock, setSelectedStock] = useState('');
//   const [candlesticks, setCandlesticks] = useState([]);

//   // Load and parse the CSV file directly
//   useEffect(() => {
//     const fetchCSV = async () => {
//       try {
//         const response = await fetch('/csv/complete.csv');
//         const csvText = await response.text();
  
//         Papa.parse(csvText, {
//           header: true,
//           skipEmptyLines: true,
//           complete: (result) => {
//             setStockData(result.data);
//           },
//         });
//       } catch (error) {
//         console.error('Error fetching CSV:', error);
//       }
//     };
  
//     fetchCSV();
//   }, []);
//   // Handle stock selection and fetch data
//   const handleStockChange = async (event) => {
//     const stockName = event.target.value;
//     setSelectedStock(stockName);

//     // Find the corresponding instrument key based on stock selection
//     const stock = stockData.find((item) => item.name === stockName);

//     if (stock) {
//       const instrumentKey = stock.instrument_key;

//       // Call API with the corresponding instrument key
//       try {
//         const baseUrl = 'https://api.upstox.com/v2/historical-candle';
//         const interval = 'day';
//         const toDate = '2024-12-26';
//         const fromDate = '2023-01-01';

//         const response = await axios.get(
//           `${baseUrl}/${instrumentKey}/${interval}/${toDate}`,
//           {
//             params: {
//               from_date: fromDate,
//             },
//             headers: {
//               Accept: 'application/json',
//             },
//           }
//         );

//         console.log('API Response:', response.data);
//         const rawCandles = response.data.data.candles;

//         // Transform candles into the required format
//         const formattedCandles = rawCandles
//           .map((candle) => ({
//             time: candle[0].split('T')[0], // Convert timestamp to YYYY-MM-DD
//             open: candle[1],
//             high: candle[2],
//             low: candle[3],
//             close: candle[4],
//           }))
//           .sort((a, b) => new Date(a.time) - new Date(b.time));

//         console.log('Formatted Candle Data:', formattedCandles); // Update state with candle data
//         setCandlesticks(formattedCandles);
//         setCandles(rawCandles)
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching data from Upstox API:', err.message);
//         setError(err.message);
//         if (err.response) {
//           console.error('Response data:', err.response.data);
//         }
//       }
//     }
//   };

//   const chartContainerRef = useRef();

//   useEffect(() => {
//     const chart = createChart(chartContainerRef.current, {
//       layout: {
//         background: {
//           type: ColorType.Solid,
//           color: 'white',
//         },
//       },
//       width: 700,
//       height: 500,
//     });

//     const newSeries = chart.addCandlestickSeries({
//       upColor: '#26a69a',
//       downColor: '#ef5350',
//       borderVisible: false,
//       wickUpColor: '#26a69a',
//       wickDownColor: '#ef5350',
//     });

//     newSeries.setData(candlesticks);

//     return () => chart.remove();
//   }, [candlesticks]);

//   return (
//     <div style={{ fontFamily: 'Arial, sans-serif', margin: '0 auto', maxWidth: '1200px', padding: '20px' }}>
//       <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#4CAF50' }}>Stock Data Fetcher</h1>

//       <div style={{ marginBottom: '20px' }}>
//         <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Stock:</label>
//         <select
//           value={selectedStock}
//           onChange={handleStockChange}
//           style={{
//             padding: '10px',
//             width: 'calc(100% - 100px)',
//             borderRadius: '5px',
//             border: '1px solid #ccc',
//           }}
//         >
//           <option value="">Select a stock</option>
//           {stockData
//             .filter((stock) => stock.instrument_type === 'EQUITY' && !stock.name.includes('%'))
//             .map((stock, index) => (
//               <option key={index} value={stock.name}>
//                 {stock.name}
//               </option>
//             ))}
//         </select>
//       </div>

//       {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

//       <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
//         {candles.length > 0 && (
//           <div style={{ flex: 1, overflowX: 'auto' }}>
//             <h2 style={{ textAlign: 'center', color: '#4CAF50' }}>Candle Data for {selectedStock}</h2>
//             <table
//               style={{
//                 width: '100%',
//                 borderCollapse: 'collapse',
//                 border: '1px solid #ddd',
//                 marginTop: '10px',
//               }}
//             >
//               <thead>
//                 <tr style={{ backgroundColor: '#f2f2f2' }}>
//                   <th style={{ padding: '10px', border: '1px solid #ddd' }}>Timestamp</th>
//                   <th style={{ padding: '10px', border: '1px solid #ddd' }}>Open</th>
//                   <th style={{ padding: '10px', border: '1px solid #ddd' }}>High</th>
//                   <th style={{ padding: '10px', border: '1px solid #ddd' }}>Low</th>
//                   <th style={{ padding: '10px', border: '1px solid #ddd' }}>Close</th>
//                   <th style={{ padding: '10px', border: '1px solid #ddd' }}>Volume</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {candles.map((candle, index) => (
//                   <tr key={index}>
//                     <td style={{ padding: '8px', border: '1px solid #ddd' }}>{candle[0].split('T')[0]}</td>
//                     <td style={{ padding: '8px', border: '1px solid #ddd' }}>{candle[1]}</td>
//                     <td style={{ padding: '8px', border: '1px solid #ddd' }}>{candle[2]}</td>
//                     <td style={{ padding: '8px', border: '1px solid #ddd' }}>{candle[3]}</td>
//                     <td style={{ padding: '8px', border: '1px solid #ddd' }}>{candle[4]}</td>
//                     <td style={{ padding: '8px', border: '1px solid #ddd' }}>{candle[5]}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div
//           ref={chartContainerRef}
//           style={{
//             flex: 1,
//             border: '1px solid #ddd',
//             borderRadius: '5px',
//             padding: '10px',
//             minHeight: '300px',
//           }}
//         >
//           {/* Chart renders here */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;












