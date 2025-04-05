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

const BASE_COLOR = 'rgba(230, 240, 255, 0.35)'; // Reduced base opacity
const HIGHLIGHT_COLOR = 'rgba(255, 255, 255, 0.8)'; // Slightly reduced highlight brightness
const GLOW_COLOR = 'rgba(214, 230, 241, 0.15)'; // Reduced glow
const HIGHLIGHT_GLOW = 'rgba(230, 240, 255, 0.3)'; // Reduced highlight glow

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
                ctx.fillStyle = HIGHLIGHT_COLOR;
                ctx.shadowBlur = 4; // Reduced highlight blur
                ctx.shadowColor = HIGHLIGHT_GLOW;
                ctx.font = `bold ${fontSize}px "Courier New", monospace`;
            } else {
                ctx.fillStyle = BASE_COLOR;
                ctx.shadowBlur = 1; // Reduced blur
                ctx.shadowColor = GLOW_COLOR;
                ctx.font = `500 ${fontSize}px "Courier New", monospace`;
            }
            
            ctx.fillText(grid[x][y].char, posX, posY);
        }
    }
}

function draw() {
    // Darker background fade with reduced opacity
    ctx.fillStyle = 'rgba(26, 35, 41, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all numbers except where highlight will be
    for (let x = 0; x < columns * gridSize; x++) {
        for (let y = 0; y < rows; y++) {
            const cell = grid[x][y];
            cell.y += 0.2;
            
            if (cell.y > canvas.height) {
                cell.y = 0;
                cell.char = lumonChars[Math.floor(Math.random() * lumonChars.length)];
            }

            // Skip drawing numbers that will be under the highlight
            if (highlightedCluster) {
                const highlightStartX = highlightedCluster.x;
                const highlightStartY = highlightedCluster.y + highlightedCluster.scrollY;
                const highlightEndX = highlightStartX + (gridSize * spacing);
                const highlightEndY = highlightStartY + (gridSize * spacing);
                
                const currentX = x * spacing;
                const currentY = cell.y;
                
                if (currentX >= highlightStartX && currentX < highlightEndX &&
                    currentY >= highlightStartY && currentY < highlightEndY) {
                    continue; // Skip drawing this number
                }
            }
            
            ctx.fillStyle = BASE_COLOR;
            ctx.shadowBlur = 1;
            ctx.shadowColor = GLOW_COLOR;
            ctx.font = `500 ${fontSize}px "Courier New", monospace`;
            ctx.fillText(cell.char, x * spacing, cell.y);
        }
    }

    // Draw highlight cluster last
    if (highlightedCluster) {
        // Update highlight position
        highlightedCluster.scrollY += 0.2; // Same speed as regular numbers
        
        // Reset highlight if it scrolls off screen
        if (highlightedCluster.y + highlightedCluster.scrollY > canvas.height) {
            highlightedCluster = null;
        } else {
            highlightOpacity += fadeDirection * (1 / FADE_DURATION);
            
            if (highlightOpacity >= MAX_HIGHLIGHT_OPACITY) {
                fadeDirection = -1;
            } else if (highlightOpacity <= 0) {
                fadeDirection = 1;
            }
            
            // Draw cluster at updated position
            ctx.shadowBlur = 4;
            drawCluster(
                highlightedCluster.x, 
                highlightedCluster.y + highlightedCluster.scrollY, 
                true
            );
        }
    }
}

initGrid();
setInterval(draw, 50);