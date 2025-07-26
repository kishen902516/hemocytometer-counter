# 🔬 Hemocytometer Cell Counter

A modern, user-friendly web application for counting cells using a hemocytometer. Built with React and TypeScript for accurate laboratory cell counting with real-time calculations.

## Features

### 🎯 Core Functionality
- **Dual Input Modes**: 
  - **Grid-by-Grid Entry**: Visual 3×3 hemocytometer layout with selectable squares
  - **Total Count Entry**: Direct input of total viable/non-viable cell counts
- **Enhanced Grid UI**: Improved 3×3 grid alignment with professional styling and hover effects
- **Flexible Grid Selection**: Choose individual grids or use quick-select options (4 corners recommended)
- **Separate Cell Tracking**: Enter viable and non-viable cell counts with clear visual distinction
- **Real-time Calculations**: Instant totals, viability percentage, and concentration calculations

### 📊 Calculations
- **Real-time Results**: Instant calculation updates as you count
- **Standard Formulas**: Uses proper hemocytometer calculation formulas
- **Configurable Parameters**:
  - Dilution factor (1x, 2x, 10x, etc.)
  - Grid selection (automatically updates square count)
- **Multiple Metrics**:
  - Total cell count
  - Viable/Non-viable cell counts
  - Viability percentage
  - Cells per mL concentration
  - Viable cells per mL concentration

### 📱 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Touch-Friendly**: Optimized for touchscreen use in laboratory settings
- **Modern Interface**: Clean, professional design with intuitive controls
- **Export Options**: 
  - CSV export for data analysis
  - Print/PDF for laboratory records
  - Copy to clipboard for quick sharing
- **Master Mix Calculator**: 
  - Calculate required cell stock volume for experiments
  - Support for volume per well, cells per well, and number of wells
  - Automatic recipe generation with step-by-step protocol
  - Additional wells parameter for pipetting safety margin

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## How to Use

### Navigate Between Tabs
1. **🔬 Cell Counting**: Main hemocytometer counting interface
2. **🧪 Master Mix Calculator**: Experiment preparation tool (enabled after counting)

### Choose Input Method (Cell Counting Tab)
1. **Select input mode** using the toggle buttons:
   - **📊 Grid-by-Grid Entry**: For detailed per-grid counting
   - **🔢 Total Count Entry**: For quick total count input

### Grid-by-Grid Method
1. **Select grids** by clicking on the 3×3 grid layout (4 corners recommended)
2. **Enter counts** for each selected grid:
   - Viable cells in the blue-highlighted input
   - Non-viable cells in the red-highlighted input
3. **View real-time summaries** in the summary cards below

### Total Count Method
1. **Choose grid count** (1-5 grids, 4 recommended)
2. **Enter total counts** across all grids:
   - Total viable cells observed
   - Total non-viable cells observed
3. **See instant calculations** including viability percentage

### Setting Parameters
- **Input Mode**: Toggle between grid-by-grid and total count entry
- **Grid Selection**: Visual selection or radio button options
- **Dilution Factor**: Enter dilution ratio (default: 2)

### Master Mix Calculator (Master Mix Tab)
Once you have cell counts, switch to the Master Mix Calculator tab to:

1. **Choose cell type**: Toggle between total or viable cell concentration
2. **Set parameters**:
   - Volume per well (μL)
   - Cells per well (target count)
   - Number of wells
   - Additional wells (default 2 = extra wells for safety)
3. **Get recipe**: Automatic calculation of:
   - Required cell stock volume
   - Required medium volume
   - Step-by-step mixing protocol

### Exporting Results
- **CSV Export**: Download data for spreadsheet analysis
- **Print/PDF**: Generate printable laboratory report
- **Copy to Clipboard**: Quick text copy for documentation

## Calculation Formula

**Cells/mL = (Cell Count ÷ Squares Counted) × 10,000 × Dilution Factor**

## Technical Details

### Built With
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom styling with responsive design
