import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, BarChart3, Settings2 } from 'lucide-react';
import ComplexityChart from './ComplexityChart';

const SortingVisualizer: React.FC = () => {
    const [array, setArray] = useState<number[]>([]);
    const [isSorting, setIsSorting] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [algorithm, setAlgorithm] = useState('bubble');
    const [comparisons, setComparisons] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        resetArray();
    }, []);

    const resetArray = () => {
        if (isSorting) return;
        const width = containerRef.current?.offsetWidth || 800;
        const numBars = Math.floor(width / (width < 600 ? 8 : 12)); // Responsive bar count
        const newArray = [];
        for (let i = 0; i < numBars; i++) {
            newArray.push(randomIntFromInterval(5, 500));
        }
        setArray(newArray);
        setComparisons(0);
        
        // Reset colors
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < bars.length; i++) {
            bars[i].style.backgroundColor = '#6366f1'; // Default Indigo
        }
    };

    const randomIntFromInterval = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // --- ALGORITHMS ---

    const bubbleSort = async () => {
        const arr = [...array];
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
        
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (!isSorting && !checkIfSorting()) return; // Stop if reset

                // Highlight comparison
                bars[j].style.backgroundColor = '#ec4899'; // Pink
                bars[j + 1].style.backgroundColor = '#ec4899';
                
                await sleep(100 - speed);

                if (arr[j] > arr[j + 1]) {
                    let temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    setArray([...arr]);
                    setComparisons(prev => prev + 1);
                }

                // Reset color
                bars[j].style.backgroundColor = '#6366f1';
                bars[j + 1].style.backgroundColor = '#6366f1';
            }
            // Mark as sorted
            bars[arr.length - i - 1].style.backgroundColor = '#10b981'; // Green
        }
        // Mark remaining as sorted
        for(let i=0; i<arr.length; i++) bars[i].style.backgroundColor = '#10b981';
        setIsSorting(false);
    };

    const selectionSort = async () => {
        const arr = [...array];
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;

        for (let i = 0; i < arr.length; i++) {
            let minIdx = i;
            bars[i].style.backgroundColor = '#ec4899'; // Current Pivot

            for (let j = i + 1; j < arr.length; j++) {
                 if (!isSorting && !checkIfSorting()) return;
                 bars[j].style.backgroundColor = '#eab308'; // Scanning
                 await sleep(100 - speed);

                 if (arr[j] < arr[minIdx]) {
                     if (minIdx !== i) bars[minIdx].style.backgroundColor = '#6366f1'; // Unmark old min
                     minIdx = j;
                     bars[minIdx].style.backgroundColor = '#ec4899'; // New Min
                 } else {
                     bars[j].style.backgroundColor = '#6366f1';
                 }
                 setComparisons(prev => prev + 1);
            }

            if (minIdx !== i) {
                let temp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = temp;
                setArray([...arr]);
            }
            bars[minIdx].style.backgroundColor = '#6366f1';
            bars[i].style.backgroundColor = '#10b981'; // Sorted
        }
        setIsSorting(false);
    };

    const insertionSort = async () => {
        const arr = [...array];
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
        
        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            
            bars[i].style.backgroundColor = '#ec4899'; // Current element
            await sleep(100 - speed);

            while (j >= 0 && arr[j] > key) {
                if (!isSortingRef.current) return;
                
                bars[j].style.backgroundColor = '#eab308';
                setComparisons(prev => prev + 1);
                
                arr[j + 1] = arr[j];
                setArray([...arr]);
                await sleep(100 - speed);
                
                bars[j].style.backgroundColor = '#6366f1';
                j = j - 1;
            }
            arr[j + 1] = key;
            setArray([...arr]);
            
            for (let k = 0; k <= i; k++) {
                bars[k].style.backgroundColor = '#10b981';
            }
        }
        setIsSorting(false);
    };

    const cocktailSort = async () => {
        const arr = [...array];
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
        let swapped = true;
        let start = 0;
        let end = arr.length - 1;

        while (swapped) {
            swapped = false;
            for (let i = start; i < end; i++) {
                if (!isSortingRef.current) return;
                bars[i].style.backgroundColor = '#ec4899';
                bars[i + 1].style.backgroundColor = '#ec4899';
                await sleep(100 - speed);
                
                setComparisons(prev => prev + 1);
                if (arr[i] > arr[i + 1]) {
                    let temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    setArray([...arr]);
                    swapped = true;
                }
                bars[i].style.backgroundColor = '#6366f1';
                bars[i + 1].style.backgroundColor = '#6366f1';
            }
            if (!swapped) break;
            swapped = false;
            bars[end].style.backgroundColor = '#10b981';
            end--;

            for (let i = end - 1; i >= start; i--) {
                if (!isSortingRef.current) return;
                bars[i].style.backgroundColor = '#ec4899';
                bars[i + 1].style.backgroundColor = '#ec4899';
                await sleep(100 - speed);
                
                setComparisons(prev => prev + 1);
                if (arr[i] > arr[i + 1]) {
                    let temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    setArray([...arr]);
                    swapped = true;
                }
                bars[i].style.backgroundColor = '#6366f1';
                bars[i + 1].style.backgroundColor = '#6366f1';
            }
            bars[start].style.backgroundColor = '#10b981';
            start++;
        }
        for (let i = 0; i < arr.length; i++) bars[i].style.backgroundColor = '#10b981';
        setIsSorting(false);
    };

    const combSort = async () => {
        const arr = [...array];
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
        let gap = arr.length;
        let shrink = 1.3;
        let sorted = false;

        while (!sorted) {
            gap = Math.floor(gap / shrink);
            if (gap <= 1) {
                gap = 1;
                sorted = true;
            }

            for (let i = 0; i + gap < arr.length; i++) {
                if (!isSortingRef.current) return;
                
                bars[i].style.backgroundColor = '#ec4899';
                bars[i + gap].style.backgroundColor = '#ec4899';
                await sleep(100 - speed);

                setComparisons(prev => prev + 1);
                if (arr[i] > arr[i + gap]) {
                    let temp = arr[i];
                    arr[i] = arr[i + gap];
                    arr[i + gap] = temp;
                    setArray([...arr]);
                    sorted = false;
                }
                bars[i].style.backgroundColor = '#6366f1';
                bars[i + gap].style.backgroundColor = '#6366f1';
            }
        }
        for (let i = 0; i < arr.length; i++) bars[i].style.backgroundColor = '#10b981';
        setIsSorting(false);
    };

    const shellSort = async () => {
        const arr = [...array];
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
        let n = arr.length;

        for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / n > 2 ? gap / 2.2 : gap / 2)) {
            if (gap === 0) gap = 1;
            for (let i = gap; i < n; i += 1) {
                if (!isSortingRef.current) return;
                let temp = arr[i];
                let j;

                bars[i].style.backgroundColor = '#ec4899';
                await sleep(100 - speed);

                for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                    if (!isSortingRef.current) return;
                    bars[j - gap].style.backgroundColor = '#eab308';
                    setComparisons(prev => prev + 1);
                    arr[j] = arr[j - gap];
                    setArray([...arr]);
                    await sleep(100 - speed);
                    bars[j - gap].style.backgroundColor = '#6366f1';
                }
                arr[j] = temp;
                setArray([...arr]);
                bars[i].style.backgroundColor = '#6366f1';
            }
        }
        for (let i = 0; i < arr.length; i++) bars[i].style.backgroundColor = '#10b981';
        setIsSorting(false);
    };

    const bogoSort = async () => {
        const arr = [...array];
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
        
        const isSorted = (a: number[]) => {
            for (let i = 0; i < a.length - 1; i++) {
                if (a[i] > a[i + 1]) return false;
            }
            return true;
        };

        const shuffle = (a: number[]) => {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
        };

        while (!isSorted(arr)) {
            if (!isSortingRef.current) return;
            shuffle(arr);
            setArray([...arr]);
            setComparisons(prev => prev + arr.length);
            await sleep(100 - speed);
        }
        
        for (let i = 0; i < arr.length; i++) bars[i].style.backgroundColor = '#10b981';
        setIsSorting(false);
    };

    const radixSort = async () => {
        const arr = [...array];
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
        
        const getMax = (a: number[]) => {
            let max = a[0];
            for (let i = 1; i < a.length; i++) if (a[i] > max) max = a[i];
            return max;
        };

        const countingSort = async (a: number[], exp: number) => {
            let output = new Array(a.length);
            let count = new Array(10).fill(0);

            for (let i = 0; i < a.length; i++) {
                count[Math.floor(a[i] / exp) % 10]++;
            }

            for (let i = 1; i < 10; i++) count[i] += count[i - 1];

            for (let i = a.length - 1; i >= 0; i--) {
                if (!isSortingRef.current) return;
                let digit = Math.floor(a[i] / exp) % 10;
                output[count[digit] - 1] = a[i];
                count[digit]--;
            }

            for (let i = 0; i < a.length; i++) {
                if (!isSortingRef.current) return;
                arr[i] = output[i];
                setArray([...arr]);
                bars[i].style.backgroundColor = '#ec4899';
                await sleep(100 - speed);
                bars[i].style.backgroundColor = '#6366f1';
            }
        };

        let max = getMax(arr);
        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            await countingSort(arr, exp);
        }

        for (let i = 0; i < arr.length; i++) bars[i].style.backgroundColor = '#10b981';
        setIsSorting(false);
    };

    const bucketSort = async () => {
        let arr = [...array];
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
        const n = arr.length;
        if (n <= 0) return;

        let maxVal = Math.max(...arr);
        let minVal = Math.min(...arr);
        let bucketCount = 5;
        let buckets: number[][] = Array.from({ length: bucketCount }, () => []);

        let range = (maxVal - minVal) / bucketCount;

        for (let i = 0; i < n; i++) {
            let bucketIdx = Math.floor((arr[i] - minVal) / range);
            if (bucketIdx === bucketCount) bucketIdx--;
            buckets[bucketIdx].push(arr[i]);
            bars[i].style.backgroundColor = '#eab308';
            await sleep(100 - speed);
            bars[i].style.backgroundColor = '#6366f1';
        }

        let currentIdx = 0;
        for (let i = 0; i < bucketCount; i++) {
            buckets[i].sort((a, b) => a - b);
            for (let j = 0; j < buckets[i].length; j++) {
                if (!isSortingRef.current) return;
                arr[currentIdx] = buckets[i][j];
                setArray([...arr]);
                bars[currentIdx].style.backgroundColor = '#ec4899';
                await sleep(100 - speed);
                bars[currentIdx].style.backgroundColor = '#10b981';
                currentIdx++;
            }
        }
        setIsSorting(false);
    };

    // Need a special check for the async loop break
    const isSortingRef = useRef(false);
    const checkIfSorting = () => isSortingRef.current;

    const handleSort = async () => {
        setIsSorting(true);
        isSortingRef.current = true;
        if (algorithm === 'bubble') await bubbleSort();
        else if (algorithm === 'selection') await selectionSort();
        else if (algorithm === 'insertion') await insertionSort();
        else if (algorithm === 'quick') await quickSortHelper();
        else if (algorithm === 'merge') await mergeSortHelper();
        else if (algorithm === 'heap') await heapSortHelper();
        else if (algorithm === 'radix') await radixSort();
        else if (algorithm === 'bucket') await bucketSort();
        else if (algorithm === 'cocktail') await cocktailSort();
        else if (algorithm === 'comb') await combSort();
        else if (algorithm === 'shell') await shellSort();
        else if (algorithm === 'bogo') await bogoSort();
        
        setIsSorting(false);
        isSortingRef.current = false;
    };

    // --- QUICK SORT ---
    const quickSortHelper = async () => {
        const arr = [...array];
        await quickSort(arr, 0, arr.length - 1);
        
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
        for(let i=0; i<arr.length; i++) bars[i].style.backgroundColor = '#10b981';
    }

    const quickSort = async (arr: number[], low: number, high: number) => {
        if (low < high) {
            let pi = await partition(arr, low, high);
            await quickSort(arr, low, pi - 1);
            await quickSort(arr, pi + 1, high);
        }
    };

    const partition = async (arr: number[], low: number, high: number) => {
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
        let pivot = arr[high];
        bars[high].style.backgroundColor = '#ec4899'; // Pivot
        
        let i = (low - 1);
        for (let j = low; j <= high - 1; j++) {
            if (!isSortingRef.current) return i;
            bars[j].style.backgroundColor = '#eab308'; // Scanning
            await sleep(100 - speed);

            setComparisons(prev => prev + 1);
            if (arr[j] < pivot) {
                i++;
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                setArray([...arr]);
            }
            bars[j].style.backgroundColor = '#6366f1';
        }
        let temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        setArray([...arr]);
        
        bars[high].style.backgroundColor = '#6366f1';
        bars[i + 1].style.backgroundColor = '#10b981'; // Pivot Locked
        return (i + 1);
    };

    // --- MERGE SORT ---
    const mergeSortHelper = async () => {
        let arr = [...array];
        await mergeSort(arr, 0, arr.length - 1);
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
        for(let i=0; i<arr.length; i++) bars[i].style.backgroundColor = '#10b981';
    };

    const mergeSort = async (arr: number[], l: number, r: number) => {
        if (l >= r) return;
        const m = l + Math.floor((r - l) / 2);
        await mergeSort(arr, l, m);
        await mergeSort(arr, m + 1, r);
        await merge(arr, l, m, r);
    };

    const merge = async (arr: number[], l: number, m: number, r: number) => {
        const n1 = m - l + 1;
        const n2 = r - m;
        let L = new Array(n1);
        let R = new Array(n2);

        for (let i = 0; i < n1; i++) L[i] = arr[l + i];
        for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

        let i = 0, j = 0, k = l;
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;

        while (i < n1 && j < n2) {
            if (!isSortingRef.current) return;
            
            // Visualize Comparison
            bars[l + i].style.backgroundColor = '#ec4899';
            bars[m + 1 + j].style.backgroundColor = '#ec4899';
            await sleep(100 - speed);
            
            setComparisons(prev => prev + 1);
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            // Visualize Update
            setArray([...arr]);
            bars[l + i - 1]?.setAttribute('style', `background-color: #6366f1; height: ${arr[l+i-1]/5}%`); // Restore
            bars[m + 1 + j - 1]?.setAttribute('style', `background-color: #6366f1; height: ${arr[m+1+j-1]/5}%`); // Restore
            
            bars[k].style.backgroundColor = '#10b981'; // Merged part
            k++;
        }

        while (i < n1) {
             if (!isSortingRef.current) return;
             await sleep(100 - speed);
             arr[k] = L[i];
             setArray([...arr]);
             bars[k].style.backgroundColor = '#10b981';
             i++;
             k++;
        }
        while (j < n2) {
             if (!isSortingRef.current) return;
             await sleep(100 - speed);
             arr[k] = R[j];
             setArray([...arr]);
             bars[k].style.backgroundColor = '#10b981';
             j++;
             k++;
        }
    };

    // --- HEAP SORT ---
    const heapSortHelper = async () => {
        let arr = [...array];
        let n = arr.length;
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
            await heapify(arr, n, i);

        for (let i = n - 1; i > 0; i--) {
            if (!isSortingRef.current) return;
            
            // Move current root to end
            let temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            setArray([...arr]);
            
            bars[i].style.backgroundColor = '#10b981'; // Sorted
            await sleep(100 - speed);

            await heapify(arr, i, 0);
        }
        bars[0].style.backgroundColor = '#10b981';
    };

    const heapify = async (arr: number[], n: number, i: number) => {
        if (!isSortingRef.current) return;
        const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
        let largest = i; 
        let l = 2 * i + 1; 
        let r = 2 * i + 2; 

        if (l < n) {
             setComparisons(prev => prev + 1);
             if(arr[l] > arr[largest]) largest = l;
        }

        if (r < n) {
             setComparisons(prev => prev + 1);
             if(arr[r] > arr[largest]) largest = r;
        }

        if (largest !== i) {
            bars[i].style.backgroundColor = '#ec4899';
            bars[largest].style.backgroundColor = '#ec4899';
            await sleep(100 - speed);

            let swap = arr[i];
            arr[i] = arr[largest];
            arr[largest] = swap;
            setArray([...arr]);

            bars[i].style.backgroundColor = '#6366f1';
            bars[largest].style.backgroundColor = '#6366f1';

            await heapify(arr, n, largest);
        }
    };


    return (
        <div className="flex flex-col items-center w-full max-w-7xl mx-auto p-4 animate-fade-in" ref={containerRef}>
            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-8 items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full">
                <div className="flex items-center gap-2">
                    <BarChart3 className="text-indigo-500" />
                    <select 
                        value={algorithm} 
                        onChange={(e) => setAlgorithm(e.target.value)}
                        disabled={isSorting}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                        <option value="bubble">Bubble Sort (O(n²))</option>
                        <option value="selection">Selection Sort (O(n²))</option>
                        <option value="insertion">Insertion Sort (O(n²))</option>
                        <option value="cocktail">Cocktail Sort (O(n²))</option>
                        <option value="quick">Quick Sort (O(n log n))</option>
                        <option value="merge">Merge Sort (O(n log n))</option>
                        <option value="heap">Heap Sort (O(n log n))</option>
                        <option value="radix">Radix Sort (O(nk))</option>
                        <option value="bucket">Bucket Sort (O(n+k))</option>
                        <option value="comb">Comb Sort (O(n log n))</option>
                        <option value="shell">Shell Sort (O(n log² n))</option>
                        <option value="bogo">Bogo Sort (O(n·n!))</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <Settings2 className="text-gray-500" size={18} />
                    <input 
                        type="range" 
                        min="10" 
                        max="90" 
                        value={speed} 
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        disabled={isSorting}
                        className="w-24 accent-indigo-500"
                    />
                    <span className="text-xs text-gray-500">Speed</span>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={handleSort}
                        disabled={isSorting}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold text-white transition-all ${isSorting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'}`}
                    >
                        <Play size={18} />
                        <span>Sort</span>
                    </button>
                    <button 
                        onClick={resetArray}
                        disabled={isSorting}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-gray-200"
                    >
                        <RotateCcw size={18} />
                        <span>Reset</span>
                    </button>
                </div>

                <div className="ml-auto px-4 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-mono">
                    Comparisons: <span className="font-bold text-indigo-500">{comparisons}</span>
                </div>
            </div>

            {/* Bars Container */}
            <div className="flex items-end justify-center w-full h-[60vh] gap-[2px] bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                {array.map((value, idx) => (
                    <div 
                        key={idx}
                        className="array-bar bg-indigo-500 rounded-t-sm transition-all duration-75"
                        style={{ 
                            height: `${(value / 500) * 100}%`,
                            width: `${Math.min(20, 800 / array.length)}px`
                        }}
                    ></div>
                ))}
            </div>

            {/* Complexity Analysis */}
            <ComplexityChart algorithm={algorithm} />
        </div>
    );
};

export default SortingVisualizer;
