// Get all input elements
const monthlyInvestmentInput = document.getElementById('monthlyInvestment');
const returnRateInput = document.getElementById('returnRate');
const timePeriodInput = document.getElementById('timePeriod');

// Get all display elements
const investmentDisplay = document.getElementById('investmentDisplay');
const rateDisplay = document.getElementById('rateDisplay');
const periodDisplay = document.getElementById('periodDisplay');

// Get result elements
const totalInvestedEl = document.getElementById('totalInvested');
const estimatedReturnsEl = document.getElementById('estimatedReturns');
const totalValueEl = document.getElementById('totalValue');

// Format number with Indian currency format
function formatCurrency(num) {
    return num.toLocaleString('en-IN', {
        maximumFractionDigits: 0
    });
}

// Calculate SIP
function calculateSIP() {
    const monthlyInvestment = parseFloat(monthlyInvestmentInput.value);
    const annualRate = parseFloat(returnRateInput.value);
    const years = parseFloat(timePeriodInput.value);
    
    // Update display values
    investmentDisplay.textContent = formatCurrency(monthlyInvestment);
    rateDisplay.textContent = annualRate;
    periodDisplay.textContent = years;
    
    // Calculate total investment
    const totalMonths = years * 12;
    const totalInvested = monthlyInvestment * totalMonths;
    
    // Calculate future value using SIP formula
    // FV = P × ({[1 + i]^n – 1} / i) × (1 + i)
    const monthlyRate = annualRate / 12 / 100;
    
    let futureValue;
    if (monthlyRate === 0) {
        futureValue = monthlyInvestment * totalMonths;
    } else {
        futureValue = monthlyInvestment * 
            (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * 
            (1 + monthlyRate));
    }
    
    const estimatedReturns = futureValue - totalInvested;
    
    // Update results
    totalInvestedEl.textContent = formatCurrency(totalInvested);
    estimatedReturnsEl.textContent = formatCurrency(estimatedReturns);
    totalValueEl.textContent = formatCurrency(futureValue);
    
    // Update chart
    updateChart(totalInvested, estimatedReturns);
}

// Simple chart using canvas
function updateChart(invested, returns) {
    const canvas = document.getElementById('sipChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    
    const total = invested + returns;
    const investedPercentage = (invested / total) * 100;
    const returnsPercentage = (returns / total) * 100;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bars
    const barHeight = 60;
    const barY = (canvas.height - barHeight) / 2;
    
    // Invested bar (blue)
    const investedWidth = (canvas.width * investedPercentage) / 100;
    ctx.fillStyle = '#3498db';
    ctx.fillRect(0, barY, investedWidth, barHeight);
    
    // Returns bar (green)
    const returnsWidth = (canvas.width * returnsPercentage) / 100;
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(investedWidth, barY, returnsWidth, barHeight);
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    
    // Invested label
    if (investedWidth > 100) {
        ctx.fillStyle = 'white';
        ctx.fillText(`Invested: ${investedPercentage.toFixed(1)}%`, investedWidth / 2, barY + barHeight / 2 + 5);
    }
    
    // Returns label
    if (returnsWidth > 100) {
        ctx.fillStyle = 'white';
        ctx.fillText(`Returns: ${returnsPercentage.toFixed(1)}%`, investedWidth + returnsWidth / 2, barY + barHeight / 2 + 5);
    }
    
    // Legend
    ctx.textAlign = 'left';
    ctx.font = '12px Arial';
    
    // Invested legend
    ctx.fillStyle = '#3498db';
    ctx.fillRect(20, canvas.height - 30, 15, 15);
    ctx.fillStyle = '#333';
    ctx.fillText('Total Invested', 40, canvas.height - 18);
    
    // Returns legend
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(canvas.width / 2 + 20, canvas.height - 30, 15, 15);
    ctx.fillStyle = '#333';
    ctx.fillText('Estimated Returns', canvas.width / 2 + 40, canvas.height - 18);
}

// Add event listeners
monthlyInvestmentInput.addEventListener('input', calculateSIP);
returnRateInput.addEventListener('input', calculateSIP);
timePeriodInput.addEventListener('input', calculateSIP);

// Initial calculation
calculateSIP();

// Recalculate on window resize for chart
window.addEventListener('resize', calculateSIP);
