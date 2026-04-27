
let mergeSortVisualizer;
let puzzleVisualizer;
let currentSteps = [];
let currentStepIndex = 0;
let isPlaying = false;
let playInterval = null;
let currentArray = [];

// DOM Elements
const arrayContainer = document.getElementById('arrayContainer');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stepBackBtn = document.getElementById('stepBackBtn');
const stepForwardBtn = document.getElementById('stepForwardBtn');
const resetBtn = document.getElementById('resetBtn');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const sizeSlider = document.getElementById('sizeSlider');
const sizeValue = document.getElementById('sizeValue');
const customArrayInput = document.getElementById('customArray');
const applyCustomBtn = document.getElementById('applyCustomBtn');
const phaseLabel = document.getElementById('phaseLabel');
const showCodeBtn = document.getElementById('showCodeBtn');
const codeSection = document.getElementById('codeSection');

// 🔥 Speed inversion helper - Left = Slow, Right = Fast
function getAdjustedSpeed() {
    const min = parseInt(speedSlider.min) || 100;
    const max = parseInt(speedSlider.max) || 1000;
    const value = parseInt(speedSlider.value);
    
    
    return max - value + min;
}

// Initialize
async function init() {
    puzzleVisualizer = new PuzzleVisualizer('puzzleCanvas');
    generateRandomArray(8);
    initEventListeners();
    initCodeTabs();
    
    // Initialize speed display
    updateSpeedDisplay();
}

function updateSpeedDisplay() {
    if (speedSlider && speedValue) {
        const adjusted = getAdjustedSpeed();
        const actualSliderValue = parseInt(speedSlider.value);
        
        if (actualSliderValue <= 200) {
            speedValue.textContent = adjusted + 'ms ⚡⚡ (Fast)';
        } else if (actualSliderValue <= 400) {
            speedValue.textContent = adjusted + 'ms ⚡ (Medium-Fast)';
        } else if (actualSliderValue <= 600) {
            speedValue.textContent = adjusted + 'ms (Medium)';
        } else if (actualSliderValue <= 800) {
            speedValue.textContent = adjusted + 'ms 🐢 (Medium-Slow)';
        } else {
            speedValue.textContent = adjusted + 'ms 🐢🐢 (Slow)';
        }
    }
}

function generateRandomArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 70) + 15);
    }
    currentArray = arr;
    initializeVisualizer(arr);
}

function initializeVisualizer(array) {
    mergeSortVisualizer = new MergeSortVisualizer(array, null);
    currentSteps = mergeSortVisualizer.steps;
    currentStepIndex = 0;
    
    updateDisplay();
    updatePuzzleProgress();
}

function updateDisplay() {
    if (!currentSteps.length) return;
    
    const step = currentSteps[currentStepIndex];
    renderArray(step.array, step.highlightIndices);
    
    // Phase UI
    if (step.phase === 'divide') {
        phaseLabel.innerHTML = '🔍 DIVIDE PHASE';
        phaseLabel.style.background = 'linear-gradient(135deg, #fef3c7, #fde68a)';
        phaseLabel.style.color = '#d97706';
    } else if (step.phase === 'merge') {
        phaseLabel.innerHTML = '🔄 MERGE PHASE';
        phaseLabel.style.background = 'linear-gradient(135deg, #d1fae5, #a7f3d0)';
        phaseLabel.style.color = '#059669';
    } else {
        phaseLabel.innerHTML = '✅ READY';
        phaseLabel.style.background = 'linear-gradient(135deg, #f3e8ff, #e9d5ff)';
        phaseLabel.style.color = '#7c3aed';
    }
    
    const sortingMessage = document.getElementById('puzzleMessage');
    if (sortingMessage && step.description) {
        
    }
}

function renderArray(array, highlightIndices = []) {
    if (!arrayContainer) return;
    arrayContainer.innerHTML = '';
    const maxVal = Math.max(...array, 1);
    
    array.forEach((value, idx) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        
        const heightPercent = (value / maxVal) * 200;
        bar.style.height = `${Math.max(40, heightPercent)}px`;
        bar.style.width = `${Math.min(70, 500 / array.length)}px`;
        bar.textContent = value;
        
        if (highlightIndices.includes(idx)) {
            bar.classList.add('merge-highlight');
        }
        
        arrayContainer.appendChild(bar);
    });
}

function updatePuzzleProgress() {
    if (!puzzleVisualizer || !currentSteps.length) return;
    
    const progress = currentStepIndex / (currentSteps.length - 1);
    puzzleVisualizer.updateProgress(progress, currentArray.length);
}

function nextStep() {
    if (currentStepIndex < currentSteps.length - 1) {
        currentStepIndex++;
        updateDisplay();
        updatePuzzleProgress();
    } else if (isPlaying) {
        stopPlaying();
    }
}

function prevStep() {
    if (currentStepIndex > 0) {
        currentStepIndex--;
        updateDisplay();
        updatePuzzleProgress();
    }
}

async function resetSort() {
    stopPlaying();
    
    // New image on reset
    if (puzzleVisualizer) {
        await puzzleVisualizer.resetAndNewImage();
    }
    
    const size = parseInt(sizeSlider.value);
    generateRandomArray(size);
}


function startPlaying() {
    if (isPlaying) return;
    
    isPlaying = true;
    
    function step() {
        if (!isPlaying) return;
        
        if (currentStepIndex < currentSteps.length - 1) {
            nextStep();
            const speed = getAdjustedSpeed();
            playInterval = setTimeout(step, speed);
        } else {
            stopPlaying();
        }
    }
    
    if (playInterval) clearTimeout(playInterval);
    playInterval = setTimeout(step, getAdjustedSpeed());
}

function stopPlaying() {
    isPlaying = false;
    
    if (playInterval) {
        clearTimeout(playInterval);
        playInterval = null;
    }
}

function applyCustomArray() {
    const input = customArrayInput.value.trim();
    if (!input) return;
    
    const values = input.split(',').map(v => parseInt(v.trim()));
    
    if (values.some(isNaN) || values.length < 3) {
        alert('Enter valid numbers like: 64, 25, 12, 22');
        return;
    }
    
    stopPlaying();
    currentArray = values;
    sizeSlider.value = values.length;
    sizeValue.textContent = values.length;
    initializeVisualizer(values);
}

function initEventListeners() {
    if (playBtn) playBtn.addEventListener('click', startPlaying);
    if (pauseBtn) pauseBtn.addEventListener('click', stopPlaying);
    if (stepBackBtn) stepBackBtn.addEventListener('click', prevStep);
    if (stepForwardBtn) stepForwardBtn.addEventListener('click', nextStep);
    if (resetBtn) resetBtn.addEventListener('click', resetSort);
    
    
    if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
            updateSpeedDisplay();
            
            if (isPlaying) {
                stopPlaying();
                startPlaying();
            }
        });
    }
    
    if (sizeSlider) {
        sizeSlider.addEventListener('input', (e) => {
            sizeValue.textContent = e.target.value;
            stopPlaying();
            generateRandomArray(parseInt(e.target.value));
        });
    }
    
    if (applyCustomBtn) applyCustomBtn.addEventListener('click', applyCustomArray);
    
    
    if (showCodeBtn && codeSection) {
        showCodeBtn.addEventListener('click', () => {
            codeSection.classList.toggle('expanded');
            showCodeBtn.textContent =
                codeSection.classList.contains('expanded')
                    ? '📄 Hide Code'
                    : '📄 Show Code';
        });
    }
}

function initCodeTabs() {
    const tabs = document.querySelectorAll('.lang-tab');
    const codeBlock = document.getElementById('codeBlock');
    
    if (!codeBlock) return;
    
    if (typeof codeSnippets !== 'undefined' && codeSnippets.python) {
        codeBlock.textContent = codeSnippets.python;
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const lang = tab.dataset.lang;
            if (typeof codeSnippets !== 'undefined' && codeSnippets[lang]) {
                codeBlock.textContent = codeSnippets[lang];
            }
        });
    });
}

// Start app
init();


document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowRight':
            e.preventDefault();
            nextStep();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            prevStep();
            break;
        case ' ':
            e.preventDefault();
            isPlaying ? stopPlaying() : startPlaying();
            break;
        case 'r':
        case 'R':
            e.preventDefault();
            resetSort();
            break;
        case 'c':
        case 'C':
            e.preventDefault();
            if (showCodeBtn && codeSection) {
                codeSection.classList.toggle('expanded');
                showCodeBtn.textContent = codeSection.classList.contains('expanded') ? '📄 Hide Code' : '📄 Show Code';
            }
            break;
    }
});