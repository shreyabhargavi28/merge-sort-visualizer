class PuzzleVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.progress = 0;
        this.cols = 0;
        this.rows = 0;

        this.currentImage = null;
        this.loading = false;
        this.lastIndex = -1;

        // 🔥 NEW: tile mapping for shuffled puzzle
        this.tiles = [];
        this.correctTiles = [];

        this.resizeCanvas();

        // 🆕 UPDATED IMAGE SET - Cute animals + Beautiful nature
        this.imageSet = [
    // 🌄 Nature
    'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?w=800',
    'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?w=800',
    'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?w=800',
    'https://images.pexels.com/photos/158063/pexels-photo-158063.jpeg?w=800',

    // 🌸 Flowers / macro
    'https://images.pexels.com/photos/36753/flower-purple-lical-blosso.jpg?w=800',
    'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?w=800',
    'https://images.pexels.com/photos/46216/sunflower-flowers-bright-yellow-46216.jpeg?w=800',

    // 🌌 Aesthetic / dreamy
    'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?w=800',
    'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=800',

    // 🏝 Minimal scenic
    'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?w=800',
    'https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg?w=800'
];

        window.addEventListener("resize", () => this.resizeCanvas());

        this.init();
    }

    resizeCanvas() {
        const size = Math.min(this.canvas.parentElement.clientWidth, 400);
        this.canvas.width = size;
        this.canvas.height = size;
    }

    async init() {
        await this.loadRandomImage();
    }

    getRandomImageUrl() {
        let index;
        do {
            index = Math.floor(Math.random() * this.imageSet.length);
        } while (index === this.lastIndex && this.imageSet.length > 1);

        this.lastIndex = index;
        return this.imageSet[index] + "?t=" + Date.now();
    }

    async loadRandomImage() {
        this.loading = true;
        this.updatePuzzle();

        const url = this.getRandomImageUrl();

        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";

            img.onload = () => {
                this.currentImage = img;
                this.loading = false;

                // 🔥 initialize tiles AFTER image loads
                this.initializeTiles();

                this.updatePuzzle();
                resolve();
            };

            img.onerror = () => {
                console.error("Failed to load image:", url);
                this.createFallbackImage();
                resolve();
            };

            img.src = url;
        });
    }

    createFallbackImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, 500, 500);
        grad.addColorStop(0, '#7c3aed');
        grad.addColorStop(1, '#a855f7');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 500, 500);

        ctx.fillStyle = "white";
        ctx.font = "bold 18px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✨ Merge Sort", 250, 240);
        ctx.font = "14px Inter, sans-serif";
        ctx.fillText("Puzzle-Based Learning", 250, 280);

        this.currentImage = canvas;
        this.loading = false;
        this.initializeTiles();
        this.updatePuzzle();
    }

    // 🔥 create shuffled puzzle
    initializeTiles() {
        const total = this.cols * this.rows || 16;

        this.correctTiles = Array.from({ length: total }, (_, i) => i);
        this.tiles = [...this.correctTiles];

        // shuffle tiles for initial scrambled look
        for (let i = this.tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
        }
    }

    // 🔥 progressively fix tiles (sorting effect)
    updateTiles(progress) {
        if (!this.tiles.length) return;
        
        const total = this.tiles.length;
        const correctCount = Math.floor(progress * total);

        for (let i = 0; i < correctCount; i++) {
            this.tiles[i] = this.correctTiles[i];
        }
    }

    async resetAndNewImage() {
        await this.loadRandomImage();
        this.progress = 0;
        this.updatePuzzle();
    }

    updateProgress(progress, arraySize = 8) {
        this.progress = Math.min(1, progress);

        this.cols = Math.ceil(Math.sqrt(arraySize));
        this.rows = Math.ceil(arraySize / this.cols);

        // Re-initialize tiles if dimensions changed
        if (!this.tiles.length || (this.cols * this.rows) !== this.tiles.length) {
            this.initializeTiles();
        }

        this.updateTiles(this.progress); // 🔥 progressively fixes puzzle

        this.updatePuzzle();
    }

    updatePuzzle() {
        if (!this.ctx) return;

        this.resizeCanvas();

        const sizeCanvas = this.canvas.width;
        this.ctx.clearRect(0, 0, sizeCanvas, sizeCanvas);

        if (this.loading) {
            this.ctx.fillStyle = "#f3e8ff";
            this.ctx.fillRect(0, 0, sizeCanvas, sizeCanvas);
            this.ctx.fillStyle = "#7c3aed";
            this.ctx.font = "16px Inter, sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("🔄 Loading beautiful image...", sizeCanvas / 2, sizeCanvas / 2);
            return;
        }

        if (!this.currentImage) return;

        const cols = this.cols || 4;
        const rows = this.rows || 4;

        const tileW = sizeCanvas / cols;
        const tileH = sizeCanvas / rows;

        const imgW = this.currentImage.width;
        const imgH = this.currentImage.height;

        const squareSize = Math.min(imgW, imgH);
        const offsetX = (imgW - squareSize) / 2;
        const offsetY = (imgH - squareSize) / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                
                // If tiles array exists, use shuffled positions
                let srcRow, srcCol;
                
                if (this.tiles && this.tiles.length > 0 && index < this.tiles.length) {
                    const tileValue = this.tiles[index];
                    srcRow = Math.floor(tileValue / cols);
                    srcCol = tileValue % cols;
                } else {
                    // Fallback to normal grid
                    srcRow = row;
                    srcCol = col;
                }

                const x = col * tileW;
                const y = row * tileH;

                this.ctx.drawImage(
                    this.currentImage,
                    offsetX + srcCol * (squareSize / cols),
                    offsetY + srcRow * (squareSize / rows),
                    squareSize / cols,
                    squareSize / rows,
                    x,
                    y,
                    tileW,
                    tileH
                );

                // Draw subtle border for puzzle effect
                this.ctx.strokeStyle = "rgba(255,255,255,0.3)";
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x, y, tileW, tileH);
            }
        }

        const percent = Math.floor(this.progress * 100);
        const progressPercentElem = document.getElementById("progressPercent");
        const progressFillElem = document.getElementById("progressFill");
        const puzzleMessage = document.getElementById("puzzleMessage");

        if (progressPercentElem) progressPercentElem.textContent = percent;
        if (progressFillElem) progressFillElem.style.width = `${percent}%`;

        if (puzzleMessage) {
            if (percent === 100) {
                puzzleMessage.innerHTML = "🎉 Puzzle Complete! Image fully assembled! 🎉";
                puzzleMessage.style.background = "#10b981";
                puzzleMessage.style.color = "white";
            } else {
                const sortedTiles = Math.floor(percent / 100 * (this.tiles.length || 1));
                const totalTiles = this.tiles.length || 1;
                puzzleMessage.innerHTML = `🧩 Sorting puzzle: ${sortedTiles}/${totalTiles} tiles in correct position`;
                puzzleMessage.style.background = "#f3e8ff";
                puzzleMessage.style.color = "#7c3aed";
            }
        }
    }

    reset() {
        this.resetAndNewImage();
    }
}