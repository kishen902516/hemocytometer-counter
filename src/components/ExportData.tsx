import React from 'react';
import './ExportData.css';

interface ExportDataProps {
  totalCells: number;
  viableCells: number;
  dilutionFactor: number;
  squaresCounted: number;
}

const ExportData: React.FC<ExportDataProps> = ({ 
  totalCells, 
  viableCells, 
  dilutionFactor, 
  squaresCounted 
}) => {
  const nonViableCells = totalCells - viableCells;
  const viabilityPercentage = totalCells > 0 ? (viableCells / totalCells * 100) : 0;
  const cellsPerML = totalCells > 0 ? (totalCells / squaresCounted) * 10000 * dilutionFactor : 0;
  const viableCellsPerML = viableCells > 0 ? (viableCells / squaresCounted) * 10000 * dilutionFactor : 0;

  const exportToCSV = () => {
    const timestamp = new Date().toISOString();
    const csvData = [
      ['Hemocytometer Cell Count Results'],
      ['Timestamp', timestamp],
      [''],
      ['Parameter', 'Value'],
      ['Total Cell Count', totalCells],
      ['Viable Cell Count', viableCells],
      ['Non-viable Cell Count', nonViableCells],
      ['Viability (%)', viabilityPercentage.toFixed(1)],
      ['Dilution Factor', dilutionFactor],
      ['Squares Counted', squaresCounted],
      ['Total Concentration (cells/mL)', cellsPerML.toFixed(0)],
      ['Viable Concentration (cells/mL)', viableCellsPerML.toFixed(0)],
      [''],
      ['Formula: Cells/mL = (Cell Count ÷ Squares Counted) × 10,000 × Dilution Factor']
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hemocytometer_count_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const timestamp = new Date().toLocaleString();
    const printContent = `
      <html>
        <head>
          <title>Hemocytometer Cell Count Results</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .header { background-color: #4285f4; color: white; }
            .timestamp { text-align: center; color: #666; margin-bottom: 30px; }
            .formula { background-color: #f8f9fa; padding: 15px; margin-top: 20px; border-left: 4px solid #4285f4; }
          </style>
        </head>
        <body>
          <h1>Hemocytometer Cell Count Results</h1>
          <div class="timestamp">Generated on: ${timestamp}</div>
          
          <table>
            <tr class="header">
              <th>Parameter</th>
              <th>Value</th>
            </tr>
            <tr><td>Total Cell Count</td><td>${totalCells}</td></tr>
            <tr><td>Viable Cell Count</td><td>${viableCells}</td></tr>
            <tr><td>Non-viable Cell Count</td><td>${nonViableCells}</td></tr>
            <tr><td>Viability</td><td>${viabilityPercentage.toFixed(1)}%</td></tr>
            <tr><td>Dilution Factor</td><td>${dilutionFactor}</td></tr>
            <tr><td>Squares Counted</td><td>${squaresCounted}</td></tr>
            <tr><td>Total Concentration</td><td>${cellsPerML.toLocaleString()} cells/mL</td></tr>
            <tr><td>Viable Concentration</td><td>${viableCellsPerML.toLocaleString()} cells/mL</td></tr>
          </table>
          
          <div class="formula">
            <h3>Calculation Formula:</h3>
            <p>Cells/mL = (Cell Count ÷ Squares Counted) × 10,000 × Dilution Factor</p>
            <p>Standard hemocytometer chamber depth: 0.1 mm</p>
            <p>Each large square volume: 0.1 μL (10⁻⁴ mL)</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const copyToClipboard = async () => {
    const timestamp = new Date().toLocaleString();
    const textData = `Hemocytometer Cell Count Results
Generated on: ${timestamp}

Total Cell Count: ${totalCells}
Viable Cell Count: ${viableCells}
Non-viable Cell Count: ${nonViableCells}
Viability: ${viabilityPercentage.toFixed(1)}%
Dilution Factor: ${dilutionFactor}
Squares Counted: ${squaresCounted}
Total Concentration: ${cellsPerML.toLocaleString()} cells/mL
Viable Concentration: ${viableCellsPerML.toLocaleString()} cells/mL

Formula: Cells/mL = (Cell Count ÷ Squares Counted) × 10,000 × Dilution Factor`;

    try {
      await navigator.clipboard.writeText(textData);
      alert('Results copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      alert('Failed to copy to clipboard. Please try again.');
    }
  };

  return (
    <div className="export-container">
      <h3>Export Results</h3>
      <div className="export-buttons">
        <button onClick={exportToCSV} className="export-btn csv">
          📊 Export CSV
        </button>
        <button onClick={exportToPDF} className="export-btn pdf">
          📄 Print/PDF
        </button>
        <button onClick={copyToClipboard} className="export-btn copy">
          📋 Copy to Clipboard
        </button>
      </div>
    </div>
  );
};

export default ExportData;