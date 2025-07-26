import React, { useState } from 'react';
import './CellCalculations.css';

interface CellCalculationsProps {
  totalCells: number;
  viableCells: number;
  selectedGrids: number;
  onParametersChange: (dilutionFactor: number) => void;
}

const CellCalculations: React.FC<CellCalculationsProps> = ({ totalCells, viableCells, selectedGrids, onParametersChange }) => {
  const [dilutionFactor, setDilutionFactor] = useState<number>(2);

  const handleDilutionChange = (value: number) => {
    setDilutionFactor(value);
    onParametersChange(value);
  };

  const nonViableCells = totalCells - viableCells;
  const viabilityPercentage = totalCells > 0 ? (viableCells / totalCells * 100) : 0;
  
  const cellsPerML = totalCells > 0 ? (totalCells / selectedGrids) * 10000 * dilutionFactor : 0;
  const viableCellsPerML = viableCells > 0 ? (viableCells / selectedGrids) * 10000 * dilutionFactor : 0;

  return (
    <div className="calculations-container">
      <h2>Cell Count Results</h2>
      
      <div className="parameters">
        <div className="parameter-group">
          <label htmlFor="dilution">Dilution Factor:</label>
          <input
            id="dilution"
            type="number"
            min="1"
            step="1"
            value={dilutionFactor}
            onChange={(e) => handleDilutionChange(Number(e.target.value))}
            style={{ color: '#333' }}
          />
        </div>
        
        <div className="parameter-group">
          <label htmlFor="squares">Grids Selected:</label>
          <div className="squares-display">
            <span className="squares-value">{selectedGrids}</span>
            <span className="squares-label">
              {selectedGrids === 1 ? 'grid' : 'grids'} selected
            </span>
          </div>
        </div>
      </div>

      <div className="results-grid">
        <div className="result-card">
          <h3>Total Cells</h3>
          <div className="count">{totalCells}</div>
        </div>
        
        <div className="result-card viable">
          <h3>Viable Cells</h3>
          <div className="count">{viableCells}</div>
        </div>
        
        <div className="result-card nonviable">
          <h3>Non-viable Cells</h3>
          <div className="count">{nonViableCells}</div>
        </div>
        
        <div className="result-card viability">
          <h3>Viability</h3>
          <div className="count">{viabilityPercentage.toFixed(1)}%</div>
        </div>
        
        <div className="result-card concentration">
          <h3>Total Concentration</h3>
          <div className="count">{cellsPerML.toLocaleString()}</div>
          <div className="unit">cells/mL</div>
        </div>
        
        <div className="result-card viable-concentration">
          <h3>Viable Concentration</h3>
          <div className="count">{viableCellsPerML.toLocaleString()}</div>
          <div className="unit">cells/mL</div>
        </div>
      </div>

      <div className="formula-info">
        <h4>Calculation Formula:</h4>
        <p>Cells/mL = (Cell Count ÷ Squares Counted) × 10,000 × Dilution Factor</p>
        <p>Standard hemocytometer chamber depth: 0.1 mm</p>
        <p>Each large square volume: 0.1 μL (10⁻⁴ mL)</p>
      </div>
    </div>
  );
};

export default CellCalculations;