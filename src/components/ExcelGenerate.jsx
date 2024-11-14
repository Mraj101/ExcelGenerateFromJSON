// This code block is generating excel file from api data


// import { useState } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";

// const DataExport = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get("https://fakestoreapi.com/products");
//       setData(response.data);
//       return response.data;
//     } catch (err) {
//       setError("Failed to fetch data. Please try again.");
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportToExcel = (data) => {
//     try {
//         const formattedData = data.map(item => ({
//             ...item,
//             ratingCount: item.rating ? item.rating.count : null // Add `ratingCount` from `rating.count`
//           }));
//       const worksheet = XLSX.utils.json_to_sheet(formattedData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
//       XLSX.writeFile(workbook, "exported_data.xlsx");
//     } catch (err) {
//       setError("Failed to export data. Please try again.");
//       console.error("Error exporting data:", err);
//     }
//   };
  
//   const click = async () => {
//     setError(null);
//     try {
//       const res = await fetchData();
  
//       if (res && res.length > 0) {
//         exportToExcel(res);
//       }
//     } catch (error) {
//       console.error("Error exporting data:", error);
//       setError("Error exporting data. Please try again.");
//     }
//   };
  

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <div className="mb-6 flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-800">
//           Data Export Dashboard
//         </h1>
//         <button
//           onClick={click}
//           disabled={loading}
//           className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//         >
//           <span className="material-icons text-xl">⬇️</span>
//           Export to Excel
//         </button>
//       </div>

//       {loading && (
//         <div className="flex items-center justify-center p-8">
//           <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full mr-2"></div>
//           <span>Loading data...</span>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {!loading && !error && data.length > 0 && (
//         <div className="overflow-x-scroll w-full overflow-y-scroll h-96">
//           <table className="min-w-full bg-white border border-gray-200">
//             <thead>
//               <tr className="bg-gray-50">
//                 {Object.keys(data[0]).map((header) => (
//                   <th
//                     key={header}
//                     className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((row, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   {Object.values(row).map((cell, cellIndex) => (
//                     <td
//                       key={cellIndex}
//                       className="px-6 py-4 border-b text-sm text-gray-500"
//                     >
//                       {String(cell)}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DataExport;


//end of code block






//this code block generates excel from .json file
import React, { useState } from "react";
import * as XLSX from "xlsx";

const DataExport = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

//   Transform MongoDB JSON data and select specific fields
  const transformData = (data) => {
    return data.map(item => ({
    // complaintDate: item.creationDate ? new Date(item.creationDate.$date).toLocaleDateString() : "",
    // complainType: item.complainType || '',
    // victimName: item.victimName || "",
    // victimPhoneNumber: item.victimPhoneNumber || "",
    // organizationName: item.accusedOrganizationName || "",
    // organizationAddress: item.accusedOrgaziationAddress || "",
    // OrganizationDistrict: item.bnDistrict || "",                       
    // Complete:item.complete || ""

    // write your own custom columns
    }));
  };

  


  // Apply formatting to worksheet
  const formatWorksheet = (worksheet) => {
    // customize column widths
    worksheet['!cols'] = [
        { wch: 15 }, // Complaint Date
        { wch: 15 }, // Complaint Type
        { wch: 20 }, // Victim Name
        { wch: 15 }, // Victim Phone
        { wch: 25 }, // Organization Name
        { wch: 25 }, // Organization Address
        { wch: 15 }, // Organization District
        { wch: 10 }  // Complete
      ];

    // Get the range of the sheet
    const range = XLSX.utils.decode_range(worksheet['!ref']);

    // Apply center alignment and wrap text to each cell
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = worksheet[cellRef];
        
        if (cell) {
          if (!worksheet[cellRef].s) worksheet[cellRef].s = {};
          worksheet[cellRef].s = {
            ...worksheet[cellRef].s,
            alignment: {
              horizontal: "center",
              vertical: "center",
              wrapText: true
            }
          };
        }
      }
    }

    return worksheet;
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const exportToExcel = () => {
    if (!file) {
      setError("Please upload a JSON file first.");
      return;
    }

    setLoading(true);
    setError(null);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        // Parse the JSON data
        const jsonData = JSON.parse(e.target.result);
        
        // Transform and format the data
        const transformedData = transformData(jsonData);

        // Convert to worksheet
        const worksheet = XLSX.utils.json_to_sheet(transformedData);

        // Apply formatting
        const formattedWorksheet = formatWorksheet(worksheet);

        // Create workbook and append worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, formattedWorksheet, "Data");

        // Write to Excel file
        XLSX.writeFile(workbook, "exported_data.xlsx");
        
        setLoading(false);
      } catch (err) {
        console.error("Error processing file:", err);
        setError("Failed to process JSON file. Please ensure it's valid JSON data.");
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file.");
      setLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">MongoDB Data Export</h1>
      
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Upload JSON File
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <button
          onClick={exportToExcel}
          disabled={loading || !file}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent 
            rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
              Processing...
            </>
          ) : (
            'Export to Excel'
          )}
        </button>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataExport;