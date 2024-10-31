// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import { Button, Typography, Select, MenuItem, InputLabel, FormControl, Box, Alert } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import DownloadIcon from '@mui/icons-material/Download';
// import { saveAs } from 'file-saver';

// const ExcelToJsonConverter = () => {
//   const [jsonData, setJsonData] = useState(null);
//   const [sheetNames, setSheetNames] = useState([]);
//   const [selectedSheet, setSelectedSheet] = useState('');
//   const [error, setError] = useState('');
//   const [jsonUploadError, setJsonUploadError] = useState(null);

//   // Excel to JSON file upload handler
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];

//     // Check if file is provided
//     if (!file) {
//       setError('No file uploaded. Please select an Excel file.');
//       return;
//     }

//     // Check if file is of valid type (.xlsx or .xls)
//     if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
//       setError('Please upload a valid Excel file (.xlsx or .xls).');
//       return;
//     }

//     setError(''); // Clear previous errors

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = e.target.result;

//       try {
//         // Read the Excel file
//         const workbook = XLSX.read(data, { type: 'binary' });

//         // Ensure that there are sheets in the file
//         if (workbook.SheetNames.length === 0) {
//           setError('The uploaded Excel file does not contain any sheets.');
//           return;
//         }

//         setSheetNames(workbook.SheetNames);
//         const firstSheet = workbook.SheetNames[0];
//         setSelectedSheet(firstSheet);

//         // Convert the first sheet to JSON by default
//         const sheet = workbook.Sheets[firstSheet];
//         const json = XLSX.utils.sheet_to_json(sheet);

//         // Validate if sheet has data
//         if (json.length === 0) {
//           setError('The selected sheet is empty.');
//           return;
//         }

//         setJsonData(json);
//       } catch (error) {
//         setError('Error processing the Excel file.');
//       }
//     };

//     reader.readAsBinaryString(file);
//   };

//   const handleSheetChange = (event) => {
//     const sheetName = event.target.value;
//     setSelectedSheet(sheetName);

//     const workbook = XLSX.read(jsonData, { type: 'binary' });
//     const sheet = workbook.Sheets[sheetName];
//     const json = XLSX.utils.sheet_to_json(sheet);
//     setJsonData(json);
//   };

//   // Download JSON file
//   const downloadJson = () => {
//     const element = document.createElement('a');
//     const file = new Blob([JSON.stringify(jsonData, null, 2)], {
//       type: 'application/json',
//     });
//     element.href = URL.createObjectURL(file);
//     element.download = `${selectedSheet}.json`;
//     document.body.appendChild(element);
//     element.click();
//   };

//   // JSON file upload handler
//   const handleJsonUpload = (event) => {
//     const file = event.target.files[0];

//     // Check if file is provided
//     if (!file) {
//       setJsonUploadError('No file uploaded. Please select a JSON file.');
//       return;
//     }

//     // Check if file is of valid type (.json)
//     if (!file.name.endsWith('.json')) {
//       setJsonUploadError('Please upload a valid JSON file.');
//       return;
//     }

//     setJsonUploadError(null); // Clear previous errors

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const json = JSON.parse(e.target.result);

//         // Validate if JSON data is an object or array
//         if (typeof json !== 'object' || json === null || Array.isArray(json) && json.length === 0) {
//           setJsonUploadError('Uploaded JSON file does not contain valid data.');
//           return;
//         }

//         setJsonData(json);
//       } catch (error) {
//         setJsonUploadError('Error reading or parsing JSON file.');
//       }
//     };

//     reader.readAsText(file);
//   };

//   // Convert JSON to Excel and download
//   const convertJsonToExcel = () => {
//     if (!jsonData || Object.keys(jsonData).length === 0) {
//       setJsonUploadError('Cannot convert empty or invalid JSON data to Excel.');
//       return;
//     }

//     const worksheet = XLSX.utils.json_to_sheet(jsonData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//     const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelFile], { type: 'application/octet-stream' });
//     saveAs(blob, 'converted_data.xlsx');
//   };

//   return (
//     <Box sx={{ padding: 4, maxWidth: '800px', margin: '0 auto' }}>
//       <Typography variant="h4" gutterBottom>
//         Excel and JSON Converter
//       </Typography>

//       {/* Upload Excel to JSON */}
//       <Typography variant="h6">Upload Excel File (Convert to JSON)</Typography>
//       <Button
//         variant="contained"
//         component="label"
//         startIcon={<CloudUploadIcon />}
//         sx={{ marginBottom: 2 }}
//       >
//         Upload Excel File
//         <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} hidden />
//       </Button>

//       {error && <Alert severity="error">{error}</Alert>}

//       {sheetNames.length > 0 && (
//         <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
//           <InputLabel id="sheet-select-label">Select Sheet</InputLabel>
//           <Select
//             labelId="sheet-select-label"
//             value={selectedSheet}
//             label="Select Sheet"
//             onChange={handleSheetChange}
//           >
//             {sheetNames.map((sheetName, index) => (
//               <MenuItem key={index} value={sheetName}>
//                 {sheetName}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       )}

//       {jsonData && (
//         <>
//           <pre
//             style={{
//               backgroundColor: '#f4f4f4',
//               padding: '10px',
//               borderRadius: '8px',
//               maxHeight: '400px',
//               overflow: 'auto',
//               fontSize: '14px',
//               textAlign: 'left',
//             }}
//           >
//             {JSON.stringify(jsonData, null, 2)}
//           </pre>

//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<DownloadIcon />}
//             onClick={downloadJson}
//             sx={{ marginTop: 2 }}
//           >
//             Download JSON
//           </Button>
//         </>
//       )}

//       {/* Upload JSON to Convert to Excel */}
//       <Box sx={{ marginTop: 4 }}>
//         <Typography variant="h6">Upload JSON File (Convert to Excel)</Typography>
//         <Button
//           variant="contained"
//           component="label"
//           startIcon={<CloudUploadIcon />}
//           sx={{ marginBottom: 2 }}
//         >
//           Upload JSON File
//           <input type="file" accept=".json" onChange={handleJsonUpload} hidden />
//         </Button>

//         {jsonUploadError && <Alert severity="error">{jsonUploadError}</Alert>}

//         {jsonData && (
//           <>
//             <pre
//               style={{
//                 backgroundColor: '#f4f4f4',
//                 padding: '10px',
//                 borderRadius: '8px',
//                 maxHeight: '400px',
//                 overflow: 'auto',
//                 fontSize: '14px',
//                 textAlign: 'left',
//               }}
//             >
//               {JSON.stringify(jsonData, null, 2)}
//             </pre>

//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<DownloadIcon />}
//               onClick={convertJsonToExcel}
//               sx={{ marginTop: 2 }}
//             >
//               Download Excel
//             </Button>
//           </>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default ExcelToJsonConverter;


import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button, Typography, Select, MenuItem, InputLabel, FormControl, Box, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { saveAs } from 'file-saver';

const ExcelToJsonConverter = () => {
  const [jsonData, setJsonData] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [error, setError] = useState('');
  const [jsonUploadError, setJsonUploadError] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');  // State to track copy success message

  // Excel to JSON file upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setError('No file uploaded. Please select an Excel file.');
      return;
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Please upload a valid Excel file (.xlsx or .xls).');
      return;
    }

    setError(''); // Clear previous errors

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;

      try {
        const workbook = XLSX.read(data, { type: 'binary' });

        if (workbook.SheetNames.length === 0) {
          setError('The uploaded Excel file does not contain any sheets.');
          return;
        }

        setSheetNames(workbook.SheetNames);
        const firstSheet = workbook.SheetNames[0];
        setSelectedSheet(firstSheet);

        const sheet = workbook.Sheets[firstSheet];
        const json = XLSX.utils.sheet_to_json(sheet);

        if (json.length === 0) {
          setError('The selected sheet is empty.');
          return;
        }

        setJsonData(json);
      } catch (error) {
        setError('Error processing the Excel file.');
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleSheetChange = (event) => {
    const sheetName = event.target.value;
    setSelectedSheet(sheetName);

    const workbook = XLSX.read(jsonData, { type: 'binary' });
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet);
    setJsonData(json);
  };

  const downloadJson = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedSheet}.json`;
    document.body.appendChild(element);
    element.click();
  };

  const handleJsonUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setJsonUploadError('No file uploaded. Please select a JSON file.');
      return;
    }

    if (!file.name.endsWith('.json')) {
      setJsonUploadError('Please upload a valid JSON file.');
      return;
    }

    setJsonUploadError(null); // Clear previous errors

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);

        if (typeof json !== 'object' || json === null || (Array.isArray(json) && json.length === 0)) {
          setJsonUploadError('Uploaded JSON file does not contain valid data.');
          return;
        }

        setJsonData(json);
      } catch (error) {
        setJsonUploadError('Error reading or parsing JSON file.');
      }
    };

    reader.readAsText(file);
  };

  const convertJsonToExcel = () => {
    if (!jsonData || Object.keys(jsonData).length === 0) {
      setJsonUploadError('Cannot convert empty or invalid JSON data to Excel.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelFile], { type: 'application/octet-stream' });
    saveAs(blob, 'converted_data.xlsx');
  };

  // Function to handle copying JSON data to clipboard
  const copyToClipboard = () => {
    if (jsonData) {
      navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))
        .then(() => setCopySuccess('Copied to clipboard!'))
        .catch(() => setCopySuccess('Failed to copy to clipboard.'));
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Excel and JSON Converter
      </Typography>

      {/* Upload Excel to JSON */}
      <Typography variant="h6">Upload Excel File (Convert to JSON)</Typography>
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ marginBottom: 2 }}
      >
        Upload Excel File
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} hidden />
      </Button>

      {error && <Alert severity="error">{error}</Alert>}

      {sheetNames.length > 0 && (
        <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
          <InputLabel id="sheet-select-label">Select Sheet</InputLabel>
          <Select
            labelId="sheet-select-label"
            value={selectedSheet}
            label="Select Sheet"
            onChange={handleSheetChange}
          >
            {sheetNames.map((sheetName, index) => (
              <MenuItem key={index} value={sheetName}>
                {sheetName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {jsonData && (
        <>
          <pre
            style={{
              backgroundColor: '#f4f4f4',
              padding: '10px',
              borderRadius: '8px',
              maxHeight: '400px',
              overflow: 'auto',
              fontSize: '14px',
              textAlign: 'left',
            }}
          >
            {JSON.stringify(jsonData, null, 2)}
          </pre>

          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={downloadJson}
            sx={{ marginTop: 2 }}
          >
            Download JSON
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<ContentCopyIcon />}
            onClick={copyToClipboard}
            sx={{ marginTop: 2, marginLeft: 2 }}
          >
            Copy to Clipboard
          </Button>

          {copySuccess && <Alert severity="success" sx={{ marginTop: 2 }}>{copySuccess}</Alert>}
        </>
      )}

      {/* Upload JSON to Convert to Excel */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6">Upload JSON File (Convert to Excel)</Typography>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{ marginBottom: 2 }}
        >
          Upload JSON File
          <input type="file" accept=".json" onChange={handleJsonUpload} hidden />
        </Button>

        {jsonUploadError && <Alert severity="error">{jsonUploadError}</Alert>}

        {jsonData && (
          <>
            <pre
              style={{
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '8px',
                maxHeight: '400px',
                overflow: 'auto',
                fontSize: '14px',
                textAlign: 'left',
              }}
            >
              {JSON.stringify(jsonData, null, 2)}
            </pre>

            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={convertJsonToExcel}
              sx={{ marginTop: 2 }}
            >
              Download Excel
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ExcelToJsonConverter;
