import React, { useState, useEffect } from 'react';
import './ManualGridInput.css';

interface GridData {
  viable: string;
  nonViable: string;
}

interface ManualGridInputProps {
  onCountChange: (totalCells: number, viableCells: number, selectedGrids: number) => void;
}

const ManualGridInput: React.FC<ManualGridInputProps> = ({ onCountChange }) => {
  const [gridData, setGridData] = useState<Record<string, GridData>>({
    'grid-1': { viable: '', nonViable: '' },
    'grid-2': { viable: '', nonViable: '' },
    'grid-3': { viable: '', nonViable: '' },
    'grid-4': { viable: '', nonViable: '' },
    'grid-5': { viable: '', nonViable: '' }
  });

  const [selectedGrids, setSelectedGrids] = useState<Set<string>>(new Set(['grid-1', 'grid-2', 'grid-3', 'grid-4']));

  const gridLabels = {
    'grid-1': 'Top Left',
    'grid-2': 'Top Right', 
    'grid-3': 'Center',
    'grid-4': 'Bottom Left',
    'grid-5': 'Bottom Right'
  };

  useEffect(() => {
    const totalViable = Array.from(selectedGrids).reduce((sum, gridId) => 
      sum + (parseInt(gridData[gridId].viable) || 0), 0
    );
    const totalNonViable = Array.from(selectedGrids).reduce((sum, gridId) => 
      sum + (parseInt(gridData[gridId].nonViable) || 0), 0
    );
    const totalCells = totalViable + totalNonViable;
    
    onCountChange(totalCells, totalViable, selectedGrids.size);
  }, [gridData, selectedGrids, onCountChange]);

  const handleGridToggle = (gridId: string) => {
    const newSelected = new Set(selectedGrids);
    if (newSelected.has(gridId)) {
      if (newSelected.size > 1) { // Ensure at least one grid is selected
        newSelected.delete(gridId);
      }
    } else {
      newSelected.add(gridId);
    }
    setSelectedGrids(newSelected);
  };

  const handleCellCountChange = (gridId: string, type: 'viable' | 'nonViable', value: string) => {
    setGridData(prev => ({
      ...prev,
      [gridId]: {
        ...prev[gridId],
        [type]: value
      }
    }));
  };

  const clearAll = () => {
    setGridData({
      'grid-1': { viable: '', nonViable: '' },
      'grid-2': { viable: '', nonViable: '' },
      'grid-3': { viable: '', nonViable: '' },
      'grid-4': { viable: '', nonViable: '' },
      'grid-5': { viable: '', nonViable: '' }
    });
  };

  const selectAllGrids = () => {
    setSelectedGrids(new Set(['grid-1', 'grid-2', 'grid-3', 'grid-4', 'grid-5']));
  };

  const selectCornerGrids = () => {
    setSelectedGrids(new Set(['grid-1', 'grid-2', 'grid-4', 'grid-5']));
  };

  return (
    <div className="manual-input-container">
      <div className="input-header">
        <h2>Manual Cell Count Entry</h2>
        <p>Enter cell counts for each grid square as observed under the microscope</p>
      </div>

      <div className="grid-selection-controls">
        <h3>Grid Selection</h3>
        <div className="selection-buttons">
          <button onClick={selectCornerGrids} className="selection-btn">
            Select 4 Corners (Recommended)
          </button>
          <button onClick={selectAllGrids} className="selection-btn">
            Select All 5 Grids
          </button>
        </div>
        <p className="selected-count">
          {selectedGrids.size} grid{selectedGrids.size !== 1 ? 's' : ''} selected
        </p>
      </div>

      <div className="hemocytometer-visual">
        <div className="grid-layout">
          {Object.entries(gridLabels).map(([gridId, label]) => {
            const isSelected = selectedGrids.has(gridId);
            const gridPosition = {
              'grid-1': 'top-left',
              'grid-2': 'top-right',
              'grid-3': 'center',
              'grid-4': 'bottom-left',
              'grid-5': 'bottom-right'
            }[gridId];

            return (
              <div 
                key={gridId}
                className={`grid-square ${gridPosition} ${isSelected ? 'selected' : 'unselected'}`}
                onClick={() => handleGridToggle(gridId)}
              >
                <div className="grid-label">{label}</div>
                {isSelected && (
                  <div className="cell-inputs">
                    <div className="input-group">
                      <label>Viable</label>
                      <input
                        type="number"
                        min="0"
                        value={gridData[gridId].viable}
                        onChange={(e) => handleCellCountChange(gridId, 'viable', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="input-group">
                      <label>Non-viable</label>
                      <input
                        type="number"
                        min="0"
                        value={gridData[gridId].nonViable}
                        onChange={(e) => handleCellCountChange(gridId, 'nonViable', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}
                {!isSelected && (
                  <div className="click-to-select">Click to select</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="summary-section">
        <div className="summary-cards">
          <div className="summary-card total">
            <h3>Total Cells</h3>
            <div className="count">
              {Array.from(selectedGrids).reduce((sum, gridId) => 
                sum + (parseInt(gridData[gridId].viable) || 0) + (parseInt(gridData[gridId].nonViable) || 0), 0
              )}
            </div>
          </div>
          <div className="summary-card viable">
            <h3>Viable Cells</h3>
            <div className="count">
              {Array.from(selectedGrids).reduce((sum, gridId) => 
                sum + (parseInt(gridData[gridId].viable) || 0), 0
              )}
            </div>
          </div>
          <div className="summary-card nonviable">
            <h3>Non-viable Cells</h3>
            <div className="count">
              {Array.from(selectedGrids).reduce((sum, gridId) => 
                sum + (parseInt(gridData[gridId].nonViable) || 0), 0
              )}
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

export default ManualGridInput;