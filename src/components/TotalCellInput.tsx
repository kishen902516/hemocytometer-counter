import React, { useState, useEffect } from 'react';
import './TotalCellInput.css';

interface TotalCellInputProps {
  onCountChange: (totalCells: number, viableCells: number, selectedGrids: number) => void;
}

const TotalCellInput: React.FC<TotalCellInputProps> = ({ onCountChange }) => {
  const [viableCells, setViableCells] = useState<string>('');
  const [nonViableCells, setNonViableCells] = useState<string>('');
  const [gridCount, setGridCount] = useState<number>(4);

  useEffect(() => {
    const viable = parseInt(viableCells) || 0;
    const nonViable = parseInt(nonViableCells) || 0;
    const total = viable + nonViable;
    
    onCountChange(total, viable, gridCount);
  }, [viableCells, nonViableCells, gridCount, onCountChange]);

  const clearAll = () => {
    setViableCells('');
    setNonViableCells('');
  };

  const handleViableChange = (value: string) => {
    // Only allow positive numbers
    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setViableCells(value);
    }
  };

  const handleNonViableChange = (value: string) => {
    // Only allow positive numbers
    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setNonViableCells(value);
    }
  };

  return (
    <div className="total-input-container">
      <div className="input-header">
        <h2>Total Cell Count Entry</h2>
        <p>Enter the total counts of viable and non-viable cells observed across all grids</p>
      </div>

      <div className="grid-count-selection">
        <h3>Number of Grids Counted</h3>
        <div className="grid-count-options">
          {[1, 2, 3, 4, 5].map(count => (
            <label key={count} className="grid-count-option">
              <input
                type="radio"
                value={count}
                checked={gridCount === count}
                onChange={(e) => setGridCount(Number(e.target.value))}
              />
              <span className="grid-count-label">
                {count} Grid{count !== 1 ? 's' : ''}
                {count === 4 && <span className="recommended"> (Recommended)</span>}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="total-input-section">
        <div className="input-cards">
          <div className="input-card viable">
            <div className="card-header">
              <h3>Total Viable Cells</h3>
              <p>Live cells across all counted grids</p>
            </div>
            <div className="input-wrapper">
              <input
                type="number"
                min="0"
                placeholder="Enter viable cell count"
                value={viableCells}
                onChange={(e) => handleViableChange(e.target.value)}
                className="cell-input viable-input"
              />
            </div>
          </div>

          <div className="input-card nonviable">
            <div className="card-header">
              <h3>Total Non-viable Cells</h3>
              <p>Dead cells across all counted grids</p>
            </div>
            <div className="input-wrapper">
              <input
                type="number"
                min="0"
                placeholder="Enter non-viable cell count"
                value={nonViableCells}
                onChange={(e) => handleNonViableChange(e.target.value)}
                className="cell-input nonviable-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="summary-section">
        <div className="summary-cards">
          <div className="summary-card total">
            <h3>Total Cells</h3>
            <div className="count">
              {(parseInt(viableCells) || 0) + (parseInt(nonViableCells) || 0)}
            </div>
          </div>
          <div className="summary-card viable">
            <h3>Viable Cells</h3>
            <div className="count">
              {parseInt(viableCells) || 0}
            </div>
          </div>
          <div className="summary-card nonviable">
            <h3>Non-viable Cells</h3>
            <div className="count">
              {parseInt(nonViableCells) || 0}
            </div>
          </div>
          <div className="summary-card viability">
            <h3>Viability</h3>
            <div className="count">
              {((parseInt(viableCells) || 0) + (parseInt(nonViableCells) || 0)) > 0 
                ? (((parseInt(viableCells) || 0) / ((parseInt(viableCells) || 0) + (parseInt(nonViableCells) || 0))) * 100).toFixed(1)
                : '0.0'
              }%
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={clearAll} className="clear-button">
          Clear All Counts
        </button>
      </div>
    </div>
  );
};

export default TotalCellInput;