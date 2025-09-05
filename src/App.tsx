import { useState, useEffect } from 'react'
import ManualGridInput from './components/ManualGridInput'
import TotalCellInput from './components/TotalCellInput'
import CellCalculations from './components/CellCalculations'
import ExportData from './components/ExportData'
import MasterMixCalculator from './components/MasterMixCalculator'
import { initGA, trackPageView, trackTabSwitch, trackModeSwitch, trackDarkModeToggle } from './utils/analytics'
import './App.css'

type InputMode = 'grid' | 'total';
type AppTab = 'counting' | 'mastermix';

function App() {
  const [inputMode, setInputMode] = useState<InputMode>('grid')
  const [activeTab, setActiveTab] = useState<AppTab>('counting')
  const [totalCells, setTotalCells] = useState(0)
  const [viableCells, setViableCells] = useState(0)
  const [selectedGrids, setSelectedGrids] = useState(4)
  const [dilutionFactor, setDilutionFactor] = useState(2)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Initialize Google Analytics
  useEffect(() => {
    initGA();
    trackPageView('/');
  }, []);

  // Track tab changes
  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    trackTabSwitch(tab);
  };

  // Track input mode changes
  const handleInputModeChange = (mode: InputMode) => {
    setInputMode(mode);
    trackModeSwitch(mode);
  };

  // Track dark mode toggle
  const handleDarkModeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    trackDarkModeToggle(newMode);
  };

  const handleCountChange = (total: number, viable: number, grids: number) => {
    setTotalCells(total)
    setViableCells(viable)
    setSelectedGrids(grids)
  }

  // Calculate cell concentrations for master mix calculator
  const cellsPerML = totalCells > 0 ? (totalCells / selectedGrids) * 10000 * dilutionFactor : 0;
  const viableCellsPerML = viableCells > 0 ? (viableCells / selectedGrids) * 10000 * dilutionFactor : 0;

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="app-content-wrapper">
        <header className="app-header">
        <div className="header-top">
          <h1>🔬 Hemocytometer Cell Counter</h1>
          <div className="header-actions">
            <a 
              href="https://coff.ee/kishensivalingam" 
              target="_blank" 
              rel="noopener noreferrer"
              className="coffee-link"
            >
              ☕ Buy me a coffee
            </a>
            <button 
              className="dark-mode-toggle"
              onClick={handleDarkModeToggle}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        <p>Professional cell counting and master mix preparation tool for laboratory researchers and technicians. Calculate cell concentrations, viability, and prepare accurate master mix volumes.</p>
        
        {activeTab === 'counting' && (
          <div className="help-text">
            <p>📋 <strong>Quick Start:</strong> {inputMode === 'grid' ? 'Select grid squares and enter cell counts for each quadrant' : 'Enter your total cell counts directly'}</p>
          </div>
        )}
        
        {activeTab === 'counting' && totalCells > 0 && (
          <div className="progress-indicator">
            <div className="progress-step completed">
              <span className="step-number">1</span>
              <span className="step-label">Count Cells</span>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step completed">
              <span className="step-number">2</span>
              <span className="step-label">View Results</span>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step">
              <span className="step-number">3</span>
              <span className="step-label">Master Mix</span>
            </div>
          </div>
        )}
        
        <nav className="main-tabs" role="tablist" aria-label="Main application features">
          <button 
            className={`tab-btn ${activeTab === 'counting' ? 'active' : ''}`}
            onClick={() => handleTabChange('counting')}
            role="tab"
            aria-selected={activeTab === 'counting'}
            aria-controls="counting-panel"
            id="counting-tab"
          >
            <span aria-hidden="true">🔬</span> Cell Counting
          </button>
          <button 
            className={`tab-btn ${activeTab === 'mastermix' ? 'active' : ''}`}
            onClick={() => handleTabChange('mastermix')}
            disabled={totalCells === 0}
            role="tab"
            aria-selected={activeTab === 'mastermix'}
            aria-controls="mastermix-panel"
            id="mastermix-tab"
            aria-describedby={totalCells === 0 ? "mastermix-disabled-help" : undefined}
          >
            <span aria-hidden="true">🧪</span> Master Mix Calculator
            {totalCells === 0 && <span className="disabled-badge">Complete counting first</span>}
          </button>
          {totalCells === 0 && (
            <div id="mastermix-disabled-help" className="sr-only">
              Complete cell counting first to enable master mix calculator
            </div>
          )}
        </nav>

        {activeTab === 'counting' && (
          <div className="input-mode-toggle" role="radiogroup" aria-label="Input method selection">
            <button 
              className={`mode-btn ${inputMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleInputModeChange('grid')}
              role="radio"
              aria-checked={inputMode === 'grid'}
              aria-describedby="grid-mode-help"
            >
              <span aria-hidden="true">📊</span> Grid-by-Grid Entry
            </button>
            <button 
              className={`mode-btn ${inputMode === 'total' ? 'active' : ''}`}
              onClick={() => handleInputModeChange('total')}
              role="radio"
              aria-checked={inputMode === 'total'}
              aria-describedby="total-mode-help"
            >
              <span aria-hidden="true">🔢</span> Total Count Entry
            </button>
            <div id="grid-mode-help" className="sr-only">
              Count cells in individual hemocytometer grid squares
            </div>
            <div id="total-mode-help" className="sr-only">
              Enter pre-counted total cell numbers directly
            </div>
          </div>
        )}
      </header>
      
      <main>
        <section 
          id="counting-panel" 
          role="tabpanel" 
          aria-labelledby="counting-tab"
          hidden={activeTab !== 'counting'}
        >
          {activeTab === 'counting' && (
            <>
              {inputMode === 'grid' ? (
                <ManualGridInput onCountChange={handleCountChange} />
              ) : (
                <TotalCellInput onCountChange={handleCountChange} />
              )}
              
              <CellCalculations 
                totalCells={totalCells} 
                viableCells={viableCells}
                selectedGrids={selectedGrids}
                onParametersChange={(dilution) => {
                  setDilutionFactor(dilution)
                }}
              />
              {totalCells > 0 && (
                <ExportData 
                  totalCells={totalCells}
                  viableCells={viableCells}
                  dilutionFactor={dilutionFactor}
                  squaresCounted={selectedGrids}
                />
              )}
            </>
          )}
        </section>
        
        <section 
          id="mastermix-panel" 
          role="tabpanel" 
          aria-labelledby="mastermix-tab"
          hidden={activeTab !== 'mastermix'}
        >
          {activeTab === 'mastermix' && (
            <MasterMixCalculator 
              cellConcentration={cellsPerML}
              viableCellConcentration={viableCellsPerML}
            />
          )}
        </section>
        </main>
        
        <footer className="app-footer">
          <p>Made with ❤️ by Kishen & Dr.Yuganthini</p>
        </footer>
      </div>
    </div>
  )
}

export default App
