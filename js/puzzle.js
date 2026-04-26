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

        // 🔥 Dynamic canvas size (fixes layout issue)
        this.resizeCanvas();

        // Image set
        this.imageSet = [
            'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=800',
            'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?w=800',
            'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?w=800',
            'https://images.pexels.com/photos/158063/pexels-photo-158063.jpeg?w=800',
            'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?w=800',
            'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?w=800',
            'https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?w=800',
            'https://images.pexels.com/photos/1089546/pexels-photo-1089546.jpeg?w=800',
            'https://images.pexels.com/photos/1097930/pexels-photo-1097930.jpeg?w=800',
            'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?w=800',
            'https://images.pexels.com/photos/6917104/pexels-photo-6917104.jpeg?w=800',
            'https://images.pexels.com/photos/5473265/pexels-photo-5473265.jpeg?w=800'
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
        // FIXED: Changed '&t=' to '?t=' for proper query parameter
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
        const canvas = document.createElement("canvas");
        canvas.width = 500;
        canvas.height = 500;
        const ctx = canvas.getContext("2d");

        const grad = ctx.createLinearGradient(0, 0, 500, 500);
        grad.addColorStop(0, "#7c3aed");
        grad.addColorStop(1, "#a855f7");

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 500, 500);

        // Add decorative elements
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        for(let i = 0; i < 100; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * 500, Math.random() * 500, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = "white";
        ctx.font = "bold 18px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✨ Merge Sort", 250, 240);
        ctx.font = "14px Inter, sans-serif";
        ctx.fillText("Puzzle-Based Learning", 250, 280);

        this.currentImage = canvas;
        this.loading = false;
        this.updatePuzzle();
    }

    async resetAndNewImage() {
        await this.loadRandomImage();
        this.progress = 0;
        this.updatePuzzle();
    }

    updateProgress(progress, arraySize = 8) {
        this.progress = Math.min(1, progress);

        // ✅ Balanced grid
        this.cols = Math.ceil(Math.sqrt(arraySize));
        this.rows = Math.ceil(arraySize / this.cols);

        this.updatePuzzle();
    }

    updatePuzzle() {
        if (!this.ctx) return;

        this.resizeCanvas();

        const sizeCanvas = this.canvas.width;

        this.ctx.clearRect(0, 0, sizeCanvas, sizeCanvas);

        // 🔄 Loading state
        if (this.loading) {
            this.ctx.fillStyle = "#f3e8ff";
            this.ctx.fillRect(0, 0, sizeCanvas, sizeCanvas);

            this.ctx.fillStyle = "#7c3aed";
            this.ctx.font = "16px Inter, sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("🔄 Loading image...", sizeCanvas / 2, sizeCanvas / 2);
            return;
        }

        if (!this.currentImage) return;

        const cols = this.cols || 4;
        const rows = this.rows || 4;

        const tileW = sizeCanvas / cols;
        const tileH = sizeCanvas / rows;

        const totalTiles = cols * rows;
        const revealedTiles = Math.floor(totalTiles * this.progress);

        // 🔥 Proper square crop (fixes image distortion)
        const imgW = this.currentImage.width;
        const imgH = this.currentImage.height;

        const squareSize = Math.min(imgW, imgH);
        const offsetX = (imgW - squareSize) / 2;
        const offsetY = (imgH - squareSize) / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const tileIndex = row * cols + col;
                const x = col * tileW;
                const y = row * tileH;

                if (tileIndex < revealedTiles) {
                    // Draw revealed tile from centered square crop
                    this.ctx.drawImage(
                        this.currentImage,
                        offsetX + col * (squareSize / cols),
                        offsetY + row * (squareSize / rows),
                        squareSize / cols,
                        squareSize / rows,
                        x,
                        y,
                        tileW,
                        tileH
                    );
                } else {
                    // Hidden tile with gradient
                    const gradient = this.ctx.createLinearGradient(x, y, x + tileW, y + tileH);
                    gradient.addColorStop(0, `rgba(124, 58, 237, ${0.4 + (1 - this.progress) * 0.3})`);
                    gradient.addColorStop(1, `rgba(168, 85, 247, ${0.3 + (1 - this.progress) * 0.3})`);
                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(x, y, tileW, tileH);

                    this.ctx.fillStyle = "rgba(255,255,255,0.4)";
                    this.ctx.font = `${Math.floor(tileW * 0.3)}px Inter, sans-serif`;
                    this.ctx.textAlign = "center";
                    this.ctx.textBaseline = "middle";
                    this.ctx.fillText("?", x + tileW / 2, y + tileH / 2);
                }

                this.ctx.strokeStyle = "rgba(255,255,255,0.4)";
                this.ctx.lineWidth = 1.5;
                this.ctx.strokeRect(x, y, tileW, tileH);
            }
        }

        // Progress UI
        const percent = Math.floor(this.progress * 100);

        const progressPercentElem = document.getElementById("progressPercent");
        const progressFillElem = document.getElementById("progressFill");
        const puzzleMessage = document.getElementById("puzzleMessage");

        if (progressPercentElem) progressPercentElem.textContent = percent;
        if (progressFillElem) progressFillElem.style.width = `${percent}%`;

        if (puzzleMessage) {
            if (percent === 100) {
                puzzleMessage.innerHTML = "🎉 Puzzle Complete! Image fully revealed! 🎉";
                puzzleMessage.style.background = "#10b981";
                puzzleMessage.style.color = "white";
            } else {
                const tilesRemaining = totalTiles - revealedTiles;
                puzzleMessage.innerHTML = `🧩 Building puzzle: ${revealedTiles}/${totalTiles} tiles revealed (${tilesRemaining} remaining)`;
                puzzleMessage.style.background = "#f3e8ff";
                puzzleMessage.style.color = "#7c3aed";
            }
        }
    }

    reset() {
        this.resetAndNewImage();
    }
}