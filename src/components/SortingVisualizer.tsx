import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, BarChart3, Settings2 } from 'lucide-react';

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

    // Need a special check for the async loop break
    const isSortingRef = useRef(false);
    const checkIfSorting = () => isSortingRef.current;

    const handleSort = async () => {
        setIsSorting(true);
        isSortingRef.current = true;
        if (algorithm === 'bubble') await bubbleSort();
        else if (algorithm === 'selection') await selectionSort();
        else if (algorithm === 'quick') await quickSortHelper();
        else if (algorithm === 'merge') await mergeSortHelper();
        else if (algorithm === 'heap') await heapSortHelper();
        
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
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent dark:text-white"
                    >
                        <option value="bubble">Bubble Sort</option>
                        <option value="selection">Selection Sort</option>
                        <option value="quick">Quick Sort</option>
                        <option value="merge">Merge Sort</option>
                        <option value="heap">Heap Sort</option>
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
        </div>
    );
};

export default SortingVisualizer;
