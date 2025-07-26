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
          <button 
            className="dark-mode-toggle"
            onClick={handleDarkModeToggle}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <p>Professional cell counting and master mix preparation tool for laboratory researchers and technicians. Calculate cell concentrations, viability, and prepare accurate master mix volumes.</p>
        
        <nav className="main-tabs" role="tablist" aria-label="Main application features">
          <button 
            className={`tab-btn ${activeTab === 'counting' ? 'active' : ''}`}
            onClick={() => handleTabChange('counting')}
            role="tab"
            aria-selected={activeTab === 'counting'}
            aria-controls="counting-panel"
          >
            🔬 Cell Counting
          </button>
          <button 
            className={`tab-btn ${activeTab === 'mastermix' ? 'active' : ''}`}
            onClick={() => handleTabChange('mastermix')}
            disabled={totalCells === 0}
            role="tab"
            aria-selected={activeTab === 'mastermix'}
            aria-controls="mastermix-panel"
          >
            🧪 Master Mix Calculator
          </button>
        </nav>

        {activeTab === 'counting' && (
          <div className="input-mode-toggle">
            <button 
              className={`mode-btn ${inputMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleInputModeChange('grid')}
            >
              📊 Grid-by-Grid Entry
            </button>
            <button 
              className={`mode-btn ${inputMode === 'total' ? 'active' : ''}`}
              onClick={() => handleInputModeChange('total')}
            >
              🔢 Total Count Entry
            </button>
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
