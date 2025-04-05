const canvas = document.getElementById('lumonMatrix');
const ctx = canvas.getContext('2d');

const lumonChars = '0123456789';
const fontSize = 28;
const gridSize = 3; // 3x3 clusters
const spacing = fontSize * 1.2;
let columns, rows;

const HIGHLIGHT_DURATION = 1500; // Longer duration (1.5 seconds)
const FADE_DURATION = 500; // Slower fade (0.5 seconds)
const BASE_OPACITY = 0.2; // Lower base opacity for regular numbers
const MAX_HIGHLIGHT_OPACITY = 0.8; // Increased for better visibility

const BASE_COLOR = 'rgba(230, 240, 255, 0.35)'; // Reduced base opacity
const HIGHLIGHT_COLOR = 'rgba(255, 255, 255, 0.8)'; // Slightly reduced highlight brightness
const GLOW_COLOR = 'rgba(214, 230, 241, 0.15)'; // Reduced glow
const HIGHLIGHT_GLOW = 'rgba(230, 240, 255, 0.3)'; // Reduced highlight glow

const CLUSTER_SPAWN_INTERVAL = 15000; // New cluster every 15 seconds
const MAX_CLUSTERS = 3; // Allow more concurrent clusters
const CLUSTER_LIFE_DURATION = 20000; // How long each cluster lives (20 seconds)

const HIGHLIGHT_FONT_SIZE = fontSize * 1.5; // 50% larger than base font

const MIN_CLUSTER_SPACING = spacing * 1.2;
const MAX_CLUSTER_SPACING = spacing * 2.5;

const SPACING_VARIATION_SPEED = 0.01; // How fast spacing changes
const MAX_SPACING_VARIATION = spacing * 0.3; // Maximum 30% variation from base spacing

let highlightOpacity = 0;
let fadeDirection = 1;

// Track all number positions and their properties
const grid = [];
let highlightedClusters = [];

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
                y: y * spacing,
                xOffset: 0,
                spacingDirection: Math.random() > 0.5 ? 1 : -1,
                spacingSpeed: Math.random() * SPACING_VARIATION_SPEED
            };
        }
    }
}

function createHighlightedCluster() {
    if (highlightedClusters.length >= MAX_CLUSTERS) return;
    
    const maxX = Math.floor(canvas.width / spacing) - gridSize;
    
    const cluster = {
        x: Math.floor(Math.random() * maxX) * spacing,
        y: 0,
        scrollY: 0,
        opacity: MAX_HIGHLIGHT_OPACITY,
        fadeDirection: 0, // Start with no fade
        createdAt: Date.now() // Track when cluster was created
    };
    
    highlightedClusters.push(cluster);
}

function drawCluster(startX, startY, highlight = false) {
    const clusterSize = 3;
    
    if (highlight) {
        // Make the clearing rectangle 90% transparent
        ctx.fillStyle = 'rgba(26, 35, 41, 0.1)'; // Changed from 1 to 0.1 opacity
        ctx.fillRect(
            startX - spacing,
            startY - spacing,
            (clusterSize + 1) * MAX_CLUSTER_SPACING,
            (clusterSize + 1) * MAX_CLUSTER_SPACING
        );
    }

    // Generate random offsets for this cluster
    const xOffsets = Array(clusterSize).fill(0).map(() => 
        Math.random() * (MAX_CLUSTER_SPACING - MIN_CLUSTER_SPACING) + MIN_CLUSTER_SPACING
    );
    const yOffsets = Array(clusterSize).fill(0).map(() => 
        Math.random() * (MAX_CLUSTER_SPACING - MIN_CLUSTER_SPACING) + MIN_CLUSTER_SPACING
    );

    // Keep track of current position
    let currentX = startX;
    let currentY = startY;

    for (let x = 0; x < clusterSize; x++) {
        currentY = startY; // Reset Y position for each column
        
        for (let y = 0; y < clusterSize; y++) {
            const char = lumonChars[Math.floor(Math.random() * lumonChars.length)];
            
            if (highlight) {
                ctx.fillStyle = HIGHLIGHT_COLOR;
                ctx.shadowBlur = 12;
                ctx.shadowColor = HIGHLIGHT_GLOW;
                ctx.font = `bold ${HIGHLIGHT_FONT_SIZE}px "Courier New", monospace`;
                
                // Adjust position to center larger characters
                const offsetX = (HIGHLIGHT_FONT_SIZE - fontSize) / 4;
                const offsetY = (HIGHLIGHT_FONT_SIZE - fontSize) / 4;
                ctx.fillText(char, currentX - offsetX, currentY + offsetY);
            } else {
                ctx.fillStyle = BASE_COLOR;
                ctx.shadowBlur = 1;
                ctx.shadowColor = GLOW_COLOR;
                ctx.font = `500 ${fontSize}px "Courier New", monospace`;
                ctx.fillText(char, currentX, currentY);
            }
            
            // Move to next Y position with random spacing
            currentY += yOffsets[y];
        }
        // Move to next X position with random spacing
        currentX += xOffsets[x];
    }
}

function draw() {
    // Darker background fade with reduced opacity
    ctx.fillStyle = 'rgba(26, 35, 41, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw base matrix effect
    for (let x = 0; x < columns * gridSize; x++) {
        for (let y = 0; y < rows; y++) {
            const cell = grid[x][y];
            cell.y += 0.2;
            
            // Update spacing variation
            cell.xOffset += cell.spacingDirection * cell.spacingSpeed;
            
            // Reverse direction if max variation reached
            if (Math.abs(cell.xOffset) >= MAX_SPACING_VARIATION) {
                cell.spacingDirection *= -1;
            }
            
            // Reset if off screen
            if (cell.y > canvas.height) {
                cell.y = 0;
                cell.char = lumonChars[Math.floor(Math.random() * lumonChars.length)];
                // Randomly reset spacing properties
                cell.xOffset = 0;
                cell.spacingDirection = Math.random() > 0.5 ? 1 : -1;
                cell.spacingSpeed = Math.random() * SPACING_VARIATION_SPEED;
            }
            
            ctx.fillStyle = BASE_COLOR;
            ctx.shadowBlur = 1;
            ctx.shadowColor = GLOW_COLOR;
            ctx.font = `500 ${fontSize}px "Courier New", monospace`;
            // Apply the spacing variation to the x position
            ctx.fillText(cell.char, (x * spacing) + cell.xOffset, cell.y);
        }
    }

    // Draw highlighted clusters
    highlightedClusters = highlightedClusters.filter(cluster => {
        // Update cluster position
        cluster.scrollY += 0.2;
        
        // Check if cluster should start fading
        const age = Date.now() - cluster.createdAt;
        if (age > CLUSTER_LIFE_DURATION && cluster.fadeDirection === 0) {
            cluster.fadeDirection = -1;
        }
        
        // Only change opacity if we're in fade out phase
        if (cluster.fadeDirection !== 0) {
            cluster.opacity += cluster.fadeDirection * (1 / FADE_DURATION);
        }
        
        if (cluster.opacity <= 0) {
            return false; // Remove cluster when fully faded
        }
        
        ctx.globalAlpha = cluster.opacity;
        drawCluster(
            cluster.x, 
            cluster.y + cluster.scrollY, 
            true
        );
        ctx.globalAlpha = 1;
        
        return (cluster.y + cluster.scrollY) <= canvas.height;
    });
}

initGrid();
setInterval(draw, 50);
setInterval(createHighlightedCluster, CLUSTER_SPAWN_INTERVAL);