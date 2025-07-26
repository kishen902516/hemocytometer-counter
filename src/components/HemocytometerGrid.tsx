import React, { useState, useRef } from 'react';
import './HemocytometerGrid.css';

interface CellPosition {
  x: number;
  y: number;
  id: string;
  isViable: boolean;
}

interface HemocytometerGridProps {
  onCountChange: (totalCells: number, viableCells: number) => void;
}

const HemocytometerGrid: React.FC<HemocytometerGridProps> = ({ onCountChange }) => {
  const [cells, setCells] = useState<CellPosition[]>([]);
  const [countingMode, setCountingMode] = useState<'total' | 'viable' | 'nonviable'>('total');
  const gridRef = useRef<HTMLDivElement>(null);

  const handleGridClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newCell: CellPosition = {
      x,
      y,
      id: Date.now().toString(),
      isViable: countingMode !== 'nonviable'
    };

    const updatedCells = [...cells, newCell];
    setCells(updatedCells);
    
    const viableCells = updatedCells.filter(cell => cell.isViable).length;
    const totalCells = updatedCells.length;
    onCountChange(totalCells, viableCells);
  };

  const handleCellClick = (cellId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedCells = cells.filter(cell => cell.id !== cellId);
    setCells(updatedCells);
    
    const viableCells = updatedCells.filter(cell => cell.isViable).length;
    const totalCells = updatedCells.length;
    onCountChange(totalCells, viableCells);
  };

  const clearAll = () => {
    setCells([]);
    onCountChange(0, 0);
  };

  return (
    <div className="hemocytometer-container">
      <div className="controls">
        <div className="counting-mode">
          <label>
            <input
              type="radio"
              value="total"
              checked={countingMode === 'total'}
              onChange={(e) => setCountingMode(e.target.value as 'total')}
            />
            Count All Cells
          </label>
          <label>
            <input
              type="radio"
              value="viable"
              checked={countingMode === 'viable'}
              onChange={(e) => setCountingMode(e.target.value as 'viable')}
            />
            Count Viable (Blue)
          </label>
          <label>
            <input
              type="radio"
              value="nonviable"
              checked={countingMode === 'nonviable'}
              onChange={(e) => setCountingMode(e.target.value as 'nonviable')}
            />
            Count Non-viable (Red)
          </label>
        </div>
        <button onClick={clearAll} className="clear-button">
          Clear All
        </button>
      </div>
      
      <div 
        ref={gridRef}
        className="hemocytometer-grid"
        onClick={handleGridClick}
      >
        <div className="grid-overlay">
          {/* Main 3x3 grid */}
          {Array.from({ length: 4 }, (_, i) => (
            <div key={`v-${i}`} className="grid-line vertical" style={{ left: `${i * 33.33}%` }} />
          ))}
          {Array.from({ length: 4 }, (_, i) => (
            <div key={`h-${i}`} className="grid-line horizontal" style={{ top: `${i * 33.33}%` }} />
          ))}
          
          {/* Corner squares subdivision */}
          <div className="corner-grid top-left">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`tl-v-${i}`} className="sub-grid-line vertical" style={{ left: `${i * 20}%` }} />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`tl-h-${i}`} className="sub-grid-line horizontal" style={{ top: `${i * 20}%` }} />
            ))}
          </div>
          
          <div className="corner-grid top-right">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`tr-v-${i}`} className="sub-grid-line vertical" style={{ left: `${i * 20}%` }} />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`tr-h-${i}`} className="sub-grid-line horizontal" style={{ top: `${i * 20}%` }} />
            ))}
          </div>
          
          <div className="corner-grid bottom-left">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`bl-v-${i}`} className="sub-grid-line vertical" style={{ left: `${i * 20}%` }} />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`bl-h-${i}`} className="sub-grid-line horizontal" style={{ top: `${i * 20}%` }} />
            ))}
          </div>
          
          <div className="corner-grid bottom-right">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`br-v-${i}`} className="sub-grid-line vertical" style={{ left: `${i * 20}%` }} />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`br-h-${i}`} className="sub-grid-line horizontal" style={{ top: `${i * 20}%` }} />
            ))}
          </div>
        </div>

        {/* Render counted cells */}
        {cells.map((cell) => (
          <div
            key={cell.id}
            className={`cell-marker ${cell.isViable ? 'viable' : 'nonviable'}`}
            style={{
              left: cell.x - 8,
              top: cell.y - 8,
            }}
            onClick={(e) => handleCellClick(cell.id, e)}
          />
        ))}
      </div>
    </div>
  );
};

export default HemocytometerGrid;