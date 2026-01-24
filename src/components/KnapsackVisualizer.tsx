import React, { useState } from 'react';
import { Package, Play, Plus, Trash2, Info, RotateCcw } from 'lucide-react';

interface Item {
    id: number;
    weight: number;
    value: number;
}

const KnapsackVisualizer: React.FC = () => {
    const [items, setItems] = useState<Item[]>([
        { id: 1, weight: 2, value: 3 },
        { id: 2, weight: 3, value: 4 },
        { id: 3, weight: 4, value: 5 },
        { id: 4, weight: 5, value: 6 },
    ]);
    const [capacity, setCapacity] = useState(8);
    const [method, setMethod] = useState<'01' | 'greedy'>('01');
    const [dpTable, setDpTable] = useState<number[][]>([]);
    const [currentStep, setCurrentStep] = useState<{ i: number; j: number } | null>(null);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [speed] = useState(500);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [greedyResult, setGreedyResult] = useState<{ item: Item; fraction: number }[]>([]);

    const resetVisualizer = () => {
        setDpTable([]);
        setCurrentStep(null);
        setIsVisualizing(false);
        setSelectedItems([]);
        setGreedyResult([]);
    };

    const addItem = () => {
        if (items.length >= 6) return;
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        setItems([...items, { id: newId, weight: 1, value: 1 }]);
        resetVisualizer();
    };

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
        resetVisualizer();
    };

    const updateItem = (id: number, field: 'weight' | 'value', val: number) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: Math.max(1, val) } : item));
        resetVisualizer();
    };

    const visualize01 = async () => {
        setIsVisualizing(true);
        const n = items.length;
        const table = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
        setDpTable(table);

        for (let i = 1; i <= n; i++) {
            for (let j = 0; j <= capacity; j++) {
                setCurrentStep({ i, j });
                await new Promise(resolve => setTimeout(resolve, speed));

                if (items[i - 1].weight <= j) {
                    table[i][j] = Math.max(
                        items[i - 1].value + table[i - 1][j - items[i - 1].weight],
                        table[i - 1][j]
                    );
                } else {
                    table[i][j] = table[i - 1][j];
                }
                setDpTable([...table.map(row => [...row])]);
            }
        }

        // Backtrack to find selected items
        let res = table[n][capacity];
        let w = capacity;
        const selected: number[] = [];
        for (let i = n; i > 0 && res > 0; i--) {
            if (res !== table[i - 1][w]) {
                selected.push(items[i - 1].id);
                res -= items[i - 1].value;
                w -= items[i - 1].weight;
            }
        }
        setSelectedItems(selected);
        setIsVisualizing(false);
        setCurrentStep(null);
    };

    const visualizeGreedy = async () => {
        setIsVisualizing(true);
        // Sort items by value/weight ratio
        const sortedItems = [...items].sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
        let remainingCapacity = capacity;
        const result: { item: Item; fraction: number }[] = [];

        for (const item of sortedItems) {
            await new Promise(resolve => setTimeout(resolve, speed * 2));
            if (remainingCapacity <= 0) break;

            if (item.weight <= remainingCapacity) {
                result.push({ item, fraction: 1 });
                remainingCapacity -= item.weight;
            } else {
                result.push({ item, fraction: remainingCapacity / item.weight });
                remainingCapacity = 0;
            }
            setGreedyResult([...result]);
        }
        setIsVisualizing(false);
    };

    const handleVisualize = () => {
        resetVisualizer();
        if (method === '01') visualize01();
        else visualizeGreedy();
    };

    return (
        <div className="flex flex-col items-center w-full max-w-7xl mx-auto p-4 animate-fade-in space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600 pb-2">
                    Knapsack Visualizer
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Compare DP (0/1) vs Greedy (Fractional) Knapsack algorithms.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 w-full">
                {/* Controls & Items Panel */}
                <div className="lg:w-1/3 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Package className="text-orange-500" /> Settings
                            </h2>
                            <div className="flex gap-2">
                                <button 
                                    onClick={resetVisualizer}
                                    className="p-2 text-gray-500 hover:text-orange-500 transition-colors"
                                    title="Reset"
                                >
                                    <RotateCcw size={18} />
                                </button>
                                <button 
                                    onClick={handleVisualize}
                                    disabled={isVisualizing}
                                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                                >
                                    <Play size={18} fill="currentColor" /> Solve
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-500 block mb-2">Algorithm Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => setMethod('01')}
                                        className={`py-2 px-3 rounded-lg border text-sm font-bold transition-all ${method === '01' ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                    >
                                        0/1 (DP)
                                    </button>
                                    <button 
                                        onClick={() => setMethod('greedy')}
                                        className={`py-2 px-3 rounded-lg border text-sm font-bold transition-all ${method === 'greedy' ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                    >
                                        Greedy (Frac)
                                    </button>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-semibold text-gray-500">Knapsack Capacity</label>
                                    <span className="text-orange-500 font-bold">{capacity}</span>
                                </div>
                                <input 
                                    type="range" min="1" max="15" value={capacity} 
                                    onChange={(e) => setCapacity(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-sm font-semibold text-gray-500">Items (Max 6)</label>
                                    <button 
                                        onClick={addItem}
                                        className="p-1 bg-green-500/10 text-green-600 rounded-md hover:bg-green-500 hover:text-white transition-all"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {items.map((item, idx) => (
                                        <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border ${selectedItems.includes(item.id) ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800'}`}>
                                            <span className="text-xs font-bold text-gray-400 w-4">{idx + 1}</span>
                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                <div className="relative">
                                                    <span className="absolute -top-2 left-2 px-1 bg-inherit text-[10px] text-gray-400 font-bold uppercase tracking-widest">Val</span>
                                                    <input 
                                                        type="number" value={item.value} 
                                                        onChange={(e) => updateItem(item.id, 'value', parseInt(e.target.value))}
                                                        className="w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-2 text-sm font-bold pt-3"
                                                    />
                                                </div>
                                                <div className="relative">
                                                     <span className="absolute -top-2 left-2 px-1 bg-inherit text-[10px] text-gray-400 font-bold uppercase tracking-widest">Wt</span>
                                                    <input 
                                                        type="number" value={item.weight} 
                                                        onChange={(e) => updateItem(item.id, 'weight', parseInt(e.target.value))}
                                                        className="w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-2 text-sm font-bold pt-3"
                                                    />
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-3">
                        <Info className="text-blue-500 shrink-0" size={20} />
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            {method === '01' ? 
                                "0/1 Knapsack selects whole items using Dynamic Programming to find the maximum possible value." : 
                                "Greedy Knapsack sorts by value-to-weight ratio and can take fractions of items to fill the remaining space."
                            }
                        </p>
                    </div>
                </div>

                {/* Visualization Panel */}
                <div className="lg:w-2/3 min-h-[500px] flex flex-col">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex-1 flex flex-col items-center justify-center">
                        {method === '01' ? (
                            <div className="w-full overflow-x-auto">
                                {dpTable.length > 0 ? (
                                    <table className="w-full border-collapse text-xs sm:text-sm mx-auto">
                                        <thead>
                                            <tr>
                                                <th className="p-2 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">i \ w</th>
                                                {Array.from({ length: capacity + 1 }).map((_, w) => (
                                                    <th key={w} className="p-2 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 w-10">{w}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dpTable.map((row, i) => (
                                                <tr key={i}>
                                                    <td className="p-2 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-bold whitespace-nowrap">
                                                        {i === 0 ? "Initial" : `Item ${i}`}
                                                    </td>
                                                    {row.map((val, j) => (
                                                        <td 
                                                            key={j} 
                                                            className={`p-2 border border-gray-100 dark:border-gray-700 text-center font-mono transition-all duration-300 ${
                                                                currentStep?.i === i && currentStep?.j === j ? 'bg-orange-500 text-white scale-110 z-10' : 
                                                                dpTable[i][j] > 0 ? 'text-gray-900 dark:text-gray-100' : 'text-gray-300 dark:text-gray-600'
                                                            }`}
                                                        >
                                                            {val}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-20 text-gray-400">Click Solve to build DP Table</div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full space-y-8 p-4">
                                <h3 className="text-xl font-bold border-b pb-4 mb-8 flex justify-between items-center">
                                    Greedy Filling Strategy
                                    <span className="text-sm font-normal text-gray-400">Ratio = Value / Weight</span>
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                    {greedyResult.length > 0 ? greedyResult.map((res, idx) => (
                                        <div key={idx} className="relative group">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold flex items-center gap-2">
                                                    Item {items.findIndex(it => it.id === res.item.id) + 1}
                                                    <span className="text-xs text-gray-400">(V:{res.item.value} W:{res.item.weight})</span>
                                                </span>
                                                <span className="text-orange-500 font-bold">{(res.fraction * 100).toFixed(0)}% Used</span>
                                            </div>
                                            <div className="w-full h-8 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 relative">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-1000 ease-out"
                                                    style={{ width: `${res.fraction * 100}%` }}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Profit Added: +{(res.fraction * res.item.value).toFixed(1)}
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-20 text-gray-400">Click Solve to visualize Greedy strategy</div>
                                    )}
                                </div>

                                {greedyResult.length > 0 && (
                                    <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex justify-between items-center">
                                        <span className="font-bold text-gray-600 dark:text-gray-300">Total Profit:</span>
                                        <span className="text-2xl font-black text-orange-500">
                                            {greedyResult.reduce((sum, res) => sum + (res.fraction * res.item.value), 0).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {method === '01' && dpTable.length > 0 && !isVisualizing && (
                         <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex justify-between items-center animate-fade-in">
                            <span className="font-bold text-green-700 dark:text-green-300">Optimal Profit:</span>
                            <span className="text-2xl font-black text-green-600">
                                {dpTable[items.length][capacity]}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KnapsackVisualizer;
