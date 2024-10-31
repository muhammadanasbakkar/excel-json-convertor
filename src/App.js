// src/App.js
import React from 'react';
import ExcelToJsonConverter from './ExcelToJsonConverter';
import { Container } from '@mui/material';

function App() {
  return (
    <Container maxWidth="md">
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Excel and JSON Converter Tool</h1>
      <ExcelToJsonConverter />
    </Container>
  );
}

export default App;
