import React, { useState, useEffect } from 'react';
import { trackMasterMixInputMode } from '../utils/analytics';
import './MasterMixCalculator.css';

type InputMode = 'hemocytometer' | 'manual';

interface MasterMixCalculatorProps {
  cellConcentration: number; // cells/mL from hemocytometer counting
  viableCellConcentration: number; // viable cells/mL
}

const MasterMixCalculator: React.FC<MasterMixCalculatorProps> = ({ 
  cellConcentration, 
  viableCellConcentration 
}) => {
  // Load saved input mode from localStorage or default to hemocytometer
  const [inputMode, setInputMode] = useState<InputMode>(() => {
    const saved = localStorage.getItem('masterMixInputMode');
    return (saved === 'manual' || saved === 'hemocytometer') ? saved : 'hemocytometer';
  });
  const [manualViableCells, setManualViableCells] = useState<string>('');
  const [volumePerWell, setVolumePerWell] = useState<string>('100'); // μL
  const [cellsPerWell, setCellsPerWell] = useState<string>('10000'); // cells
  const [numberOfWells, setNumberOfWells] = useState<string>('24');
  const [additionalWells, setAdditionalWells] = useState<string>('2'); // 2 extra wells
  const [useViableCells, setUseViableCells] = useState<boolean>(true);

  // Calculated values
  const [results, setResults] = useState({
    stockVolumeNeeded: 0,
    totalVolumeNeeded: 0,
    mediumVolumeNeeded: 0,
    finalConcentration: 0
  });

  // Save input mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('masterMixInputMode', inputMode);
  }, [inputMode]);

  useEffect(() => {
    const volPerWell = parseFloat(volumePerWell) || 0;
    const cellsPerWellNum = parseFloat(cellsPerWell) || 0;
    const numWells = parseFloat(numberOfWells) || 0;
    const extraWells = parseFloat(additionalWells) || 0;
    
    // Use manual concentration if in manual mode, otherwise use hemocytometer values
    let concentration = 0;
    if (inputMode === 'manual') {
      concentration = parseFloat(manualViableCells) || 0;
    } else {
      concentration = useViableCells ? viableCellConcentration : cellConcentration;
    }
    
    if (volPerWell > 0 && cellsPerWellNum > 0 && numWells > 0 && concentration > 0) {
      // Total wells including safety wells
      const totalWells = numWells + extraWells;
      
      // Total volume needed for all wells including safety (in mL)
      const totalVolume = (volPerWell * totalWells) / 1000; // Convert μL to mL
      
      // Required concentration in final mix (cells/mL)
      const requiredConcentration = (cellsPerWellNum * 1000) / volPerWell; // cells/mL
      
      // Stock volume needed (mL)
      const stockVolume = (requiredConcentration * totalVolume) / concentration;
      
      // Medium volume needed (mL)  
      const mediumVolume = totalVolume - stockVolume;
      
      setResults({
        stockVolumeNeeded: stockVolume,
        totalVolumeNeeded: totalVolume,
        mediumVolumeNeeded: Math.max(0, mediumVolume),
        finalConcentration: requiredConcentration
      });
    } else {
      setResults({
        stockVolumeNeeded: 0,
        totalVolumeNeeded: 0,
        mediumVolumeNeeded: 0,
        finalConcentration: 0
      });
    }
  }, [volumePerWell, cellsPerWell, numberOfWells, additionalWells, cellConcentration, viableCellConcentration, useViableCells, inputMode, manualViableCells]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
        setter(value);
      }
    };

  const handleManualCellsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow scientific notation (e.g., 1.5e6)
    const scientificNotationRegex = /^[0-9]*\.?[0-9]*([eE][+-]?[0-9]*)?$/;
    if (value === '' || scientificNotationRegex.test(value)) {
      setManualViableCells(value);
    }
  };

  const validateManualInput = (): boolean => {
    const value = parseFloat(manualViableCells);
    return !isNaN(value) && value >= 1 && value <= 1e10;
  };

  const isManualInputInvalid = manualViableCells !== '' && !validateManualInput();

  return (
    <div className="mastermix-container">
      <div className="mastermix-header">
        <h2>🧪 Master Mix Calculator</h2>
        <p>Calculate required cell stock volume for preparing master mix</p>
      </div>

      <div className="input-mode-section">
        <h3>📊 Concentration Input Method</h3>
        <div className="input-mode-toggle">
          <button 
            className={`mode-btn ${inputMode === 'hemocytometer' ? 'active' : ''}`}
            onClick={() => {
              setInputMode('hemocytometer');
              trackMasterMixInputMode('hemocytometer');
            }}
            aria-label="Use hemocytometer count"
          >
            Use Hemocytometer Count
          </button>
          <button 
            className={`mode-btn ${inputMode === 'manual' ? 'active' : ''}`}
            onClick={() => {
              setInputMode('manual');
              trackMasterMixInputMode('manual');
            }}
            aria-label="Manual entry"
          >
            Manual Entry
          </button>
        </div>

        {inputMode === 'manual' && (
          <div className="manual-input-container">
            <label htmlFor="manual-viable-cells" className="manual-input-label">
              Enter your viable cell concentration:
            </label>
            <div className="manual-input-wrapper">
              <input
                id="manual-viable-cells"
                type="text"
                inputMode="decimal"
                value={manualViableCells}
                onChange={handleManualCellsChange}
                placeholder="e.g., 1.5e6"
                className={`manual-input ${isManualInputInvalid ? 'error' : ''}`}
                aria-label="Viable cells per mL"
                aria-invalid={isManualInputInvalid}
                aria-describedby={isManualInputInvalid ? "manual-input-error" : undefined}
              />
              <span className="input-unit">cells/mL</span>
            </div>
            {isManualInputInvalid && (
              <span id="manual-input-error" className="error-message" role="alert">
                Please enter a valid number between 1 and 1e10
              </span>
            )}
          </div>
        )}
      </div>

      <div className="concentration-display" style={{display: inputMode === 'hemocytometer' ? 'block' : 'none'}}>
        <div className="concentration-cards">
          <div className={`conc-card ${!useViableCells ? 'active' : ''}`}>
            <h3>Total Cell Concentration</h3>
            <div className="conc-value">{cellConcentration.toLocaleString()}</div>
            <div className="conc-unit">cells/mL</div>
          </div>
          <div className={`conc-card ${useViableCells ? 'active' : ''}`}>
            <h3>Viable Cell Concentration</h3>
            <div className="conc-value">{viableCellConcentration.toLocaleString()}</div>
            <div className="conc-unit">cells/mL</div>
          </div>
        </div>
        
        <div className="concentration-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={useViableCells}
              onChange={(e) => setUseViableCells(e.target.checked)}
            />
            <span className="toggle-text">Use viable cell concentration for calculations</span>
          </label>
        </div>
      </div>

      <div className="input-parameters">
        <h3>Experimental Parameters</h3>
        <div className="parameter-grid">
          <div className="param-group">
            <label htmlFor="volume-per-well">Volume per Well (μL)</label>
            <input
              id="volume-per-well"
              type="number"
              min="0"
              step="1"
              value={volumePerWell}
              onChange={handleInputChange(setVolumePerWell)}
              placeholder="100"
            />
          </div>

          <div className="param-group">
            <label htmlFor="cells-per-well">Cells per Well</label>
            <input
              id="cells-per-well"
              type="number"
              min="0"
              step="1000"
              value={cellsPerWell}
              onChange={handleInputChange(setCellsPerWell)}
              placeholder="10000"
            />
          </div>

          <div className="param-group">
            <label htmlFor="number-of-wells">Number of Wells</label>
            <input
              id="number-of-wells"
              type="number"
              min="1"
              step="1"
              value={numberOfWells}
              onChange={handleInputChange(setNumberOfWells)}
              placeholder="24"
            />
          </div>

          <div className="param-group">
            <label htmlFor="additional-wells">Additional Wells</label>
            <input
              id="additional-wells"
              type="number"
              min="0"
              max="50"
              step="1"
              value={additionalWells}
              onChange={handleInputChange(setAdditionalWells)}
              placeholder="2"
            />
            <small>Extra wells for safety/pipetting loss</small>
          </div>
        </div>
      </div>

      <div className="calculation-results">
        <h3>Master Mix Recipe</h3>
        <div className="results-grid">
          <div className="result-item stock">
            <div className="result-icon">🧪</div>
            <div className="result-content">
              <h4>Cell Stock Volume</h4>
              <div className="result-value">{results.stockVolumeNeeded.toFixed(3)} mL</div>
              <div className="result-value-alt">{(results.stockVolumeNeeded * 1000).toFixed(0)} μL</div>
            </div>
          </div>

          <div className="result-item medium">
            <div className="result-icon">💧</div>
            <div className="result-content">
              <h4>Medium Volume</h4>
              <div className="result-value">{results.mediumVolumeNeeded.toFixed(3)} mL</div>
              <div className="result-value-alt">{(results.mediumVolumeNeeded * 1000).toFixed(0)} μL</div>
            </div>
          </div>

          <div className="result-item total">
            <div className="result-icon">🔬</div>
            <div className="result-content">
              <h4>Total Mix Volume</h4>
              <div className="result-value">{results.totalVolumeNeeded.toFixed(3)} mL</div>
              <div className="result-value-alt">{(results.totalVolumeNeeded * 1000).toFixed(0)} μL</div>
            </div>
          </div>

          <div className="result-item concentration">
            <div className="result-icon">📊</div>
            <div className="result-content">
              <h4>Final Concentration</h4>
              <div className="result-value">{results.finalConcentration.toLocaleString()}</div>
              <div className="result-unit">cells/mL</div>
            </div>
          </div>
        </div>

        {results.stockVolumeNeeded > 0 && (
          <div className="recipe-summary">
            <h4>📋 Preparation Protocol:</h4>
            <ol>
              <li>Add <strong>{results.mediumVolumeNeeded.toFixed(3)} mL</strong> of medium to a sterile tube</li>
              <li>Add <strong>{results.stockVolumeNeeded.toFixed(3)} mL</strong> of cell stock</li>
              <li>Mix gently by pipetting or vortexing</li>
              <li>Dispense <strong>{volumePerWell} μL</strong> per well into {numberOfWells} wells</li>
              {parseInt(additionalWells) > 0 && (
                <li>Extra volume prepared for <strong>{additionalWells} additional wells</strong> (safety margin)</li>
              )}
              <li>Expected cell count: <strong>{parseFloat(cellsPerWell).toLocaleString()} cells/well</strong></li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterMixCalculator;