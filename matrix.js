const canvas = document.getElementById('lumonMatrix');
const ctx = canvas.getContext('2d');

const lumonChars = '0123456789';
const fontSize = 28;
const gridSize = 3; // 3x3 clusters
const spacing = fontSize * 1.2;
let columns, rows;

const HIGHLIGHT_DURATION = 200; // Longer duration for more subtle effect
const FADE_DURATION = 45; // Slower fade
const BASE_OPACITY = 0.2; // Lower base opacity for regular numbers
const MAX_HIGHLIGHT_OPACITY = 0.6; // Reduced max highlight brightness

let highlightOpacity = 0;
let fadeDirection = 1;

// Track all number positions and their properties
const grid = [];
let highlightedCluster = null;
let highlightTimer = 0;

// Update canvas size to use viewport units
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / (spacing * gridSize));
    rows = Math.floor(canvas.height / spacing);
    initGrid();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initialize grid
function initGrid() {
    for (let x = 0; x < columns * gridSize; x++) {
        grid[x] = [];
        for (let y = 0; y < rows; y++) {
            grid[x][y] = {
                char: lumonChars[Math.floor(Math.random() * lumonChars.length)],
                opacity: Math.random() * 0.3 + BASE_OPACITY, // Reduced opacity range
                y: y * spacing
            };
        }
    }
}

function drawCluster(startX, startY, highlight = false) {
    const clusterSize = 3;
    for (let x = 0; x < clusterSize; x++) {
        for (let y = 0; y < clusterSize; y++) {
            const posX = startX + (x * spacing);
            const posY = startY + (y * spacing);
            
            if (highlight) {
                ctx.fillStyle = `rgba(214, 230, 241, ${highlightOpacity * MAX_HIGHLIGHT_OPACITY})`; // Reduced brightness
                ctx.shadowBlur = 4; // Reduced glow
                ctx.shadowColor = `rgba(214, 230, 241, ${highlightOpacity * 0.3})`; // Reduced glow opacity
            } else {
                ctx.fillStyle = `rgba(214, 230, 241, ${grid[x][y].opacity * 0.5})`; // Dimmer base numbers
                ctx.shadowBlur = 0;
                ctx.shadowColor = 'transparent';
            }
            
            ctx.fillText(grid[x][y].char, posX, posY);
        }
    }
}

function draw() {
    // Slow fade effect
    ctx.fillStyle = 'rgba(26, 35, 41, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `500 ${fontSize}px "Courier New", monospace`; // Changed to less bold
    
    // Draw all numbers
    for (let x = 0; x < columns * gridSize; x++) {
        for (let y = 0; y < rows; y++) {
            const cell = grid[x][y];
            cell.y += 0.2; // Slower scroll speed
            
            if (cell.y > canvas.height) {
                cell.y = 0;
                cell.char = lumonChars[Math.floor(Math.random() * lumonChars.length)];
            }
            
            ctx.fillStyle = `rgba(214, 230, 241, ${cell.opacity})`;
            ctx.shadowBlur = 3;
            ctx.shadowColor = 'rgba(214, 230, 241, 0.3)';
            ctx.fillText(cell.char, x * spacing, cell.y);
        }
    }
    
    // Handle highlight animation
    if (!highlightedCluster || highlightTimer++ > HIGHLIGHT_DURATION) {
        highlightTimer = 0;
        highlightOpacity = 0;
        fadeDirection = 1;
        
        if (Math.random() < 0.05) { // Increased chance of new highlight
            highlightedCluster = {
                x: Math.floor(Math.random() * (columns - 3)) * spacing,
                y: Math.floor(Math.random() * (rows - 3)) * spacing
            };
        } else {
            highlightedCluster = null;
        }
    }
    
    // Fade animation
    if (highlightedCluster) {
        // Update opacity based on fade direction
        highlightOpacity += fadeDirection * (1 / FADE_DURATION);
        
        // Change direction or reset when limits reached
        if (highlightOpacity >= 1) {
            fadeDirection = -1;
        } else if (highlightOpacity <= 0) {
            fadeDirection = 1;
        }
        
        drawCluster(highlightedCluster.x, highlightedCluster.y, true);
    }
}

initGrid();
setInterval(draw, 50);