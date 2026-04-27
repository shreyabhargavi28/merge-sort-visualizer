// Merge Sort Algorithm Implementation
class MergeSortVisualizer {
    constructor(array, onStep) {
        this.originalArray = [...array];
        this.steps = [];
        this.currentStep = 0;
        this.onStep = onStep;
        this.generateSteps();
    }

    generateSteps() {
        this.steps = [];
        const arr = [...this.originalArray];
        
        // Initial state
        this.steps.push({
            array: [...arr],
            highlightIndices: [],
            phase: "initial",
            description: "Initial unsorted array",
            mergeProgress: 0
        });
        
        const temp = new Array(arr.length);
        this.mergeSortRecursive(arr, temp, 0, arr.length - 1);
    }

    mergeSortRecursive(arr, temp, left, right) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            
            // Divide phase
            this.steps.push({
                array: [...arr],
                highlightIndices: [left, right],
                phase: "divide",
                description: `Dividing range [${left}...${right}] at index ${mid}`,
                mergeProgress: this.calculateProgress(arr.length, left, right)
            });
            
            this.mergeSortRecursive(arr, temp, left, mid);
            this.mergeSortRecursive(arr, temp, mid + 1, right);
            this.merge(arr, temp, left, mid, right);
        }
    }

    merge(arr, temp, left, mid, right) {
        for (let i = left; i <= right; i++) {
            temp[i] = arr[i];
        }
        
        let i = left;
        let j = mid + 1;
        let k = left;
        const mergingIndices = [];
        
        while (i <= mid && j <= right) {
            mergingIndices.push(k);
            if (temp[i] <= temp[j]) {
                arr[k++] = temp[i++];
            } else {
                arr[k++] = temp[j++];
            }
        }
        
        while (i <= mid) {
            mergingIndices.push(k);
            arr[k++] = temp[i++];
        }
        
        while (j <= right) {
            mergingIndices.push(k);
            arr[k++] = temp[j++];
        }
        
        // Merge phase step
        this.steps.push({
            array: [...arr],
            highlightIndices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
            phase: "merge",
            description: `Merging [${left}...${mid}] and [${mid+1}...${right}] → sorted subarray`,
            mergeProgress: this.calculateProgress(arr.length, left, right)
        });
    }

    calculateProgress(totalLength, left, right) {
        const segmentSize = (right - left + 1) / totalLength;
        return Math.min(0.95, this.currentStep * 0.05 + segmentSize * 0.5);
    }

    getTotalSteps() {
        return this.steps.length;
    }

    getStep(index) {
        return this.steps[index];
    }

    reset(array) {
        this.originalArray = [...array];
        this.currentStep = 0;
        this.generateSteps();
    }
}


const codeSnippets = {
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
    
    javascript: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    
    return [...result, ...left.slice(i), ...right.slice(j)];
}`,

    java: `public static void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        int mid = (left + right) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

public static void merge(int[] arr, int left, int mid, int right) {
    int[] temp = new int[right - left + 1];
    int i = left, j = mid + 1, k = 0;
    
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
        }
    }
    
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    
    for (i = left; i <= right; i++) {
        arr[i] = temp[i - left];
    }
}`,

    cpp: `void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp(right - left + 1);
    int i = left, j = mid + 1, k = 0;
    
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
        }
    }
    
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    
    for (i = left; i <= right; i++) {
        arr[i] = temp[i - left];
    }
}`
};

java: `public class MergeSort {
    public static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }
    
    public static void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        int[] L = new int[n1];
        int[] R = new int[n2];
        
        for (int i = 0; i < n1; i++)
            L[i] = arr[left + i];
        for (int j = 0; j < n2; j++)
            R[j] = arr[mid + 1 + j];
        
        int i = 0, j = 0, k = left;
        
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }
        
        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }
        
        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }
    }
}`