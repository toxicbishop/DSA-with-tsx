import React, { useState, useEffect } from 'react';
import { Play, RefreshCw, MousePointer2 } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';



type NodeType = {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  distance: number;
  previousNode: NodeType | null;
};

const PathfindingVisualizer: React.FC = () => {
  const [dimensions, setDimensions] = useState({ rows: 15, cols: 30 });
  const [grid, setGrid] = useState<NodeType[][]>([]);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [algorithm, setAlgorithm] = useLocalStorage<'bfs' | 'dfs' | 'astar' | 'dijkstra' | 'prim'>('pathfindingAlgorithm', 'bfs');
  const [weights, setWeights] = useState<number[][]>([]);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      let rows = 15;
      let cols = 30;

      if (width < 640) { // Mobile
        cols = 12;
        rows = 18;
      } else if (width < 1024) { // Tablet
        cols = 20;
        rows = 15;
      }

      setDimensions({ rows, cols });
    };

    updateDimensions();
    // Only update on initial mount or when screen crosses breakpoints to avoid too many resets
  }, []);

  useEffect(() => {
    resetGrid();
  }, [dimensions]);

  const createNode = (col: number, row: number): NodeType => {
    const { rows, cols } = dimensions;
    return {
      col,
      row,
      isStart: row === Math.floor(rows / 2) && col === Math.floor(cols / 4),
      isEnd: row === Math.floor(rows / 2) && col === Math.floor(cols * 3 / 4),
      isWall: false,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      previousNode: null,
    };
  };

  const resetGrid = () => {
    const newGrid = [];
    const newWeights = [];
    const { rows, cols } = dimensions;
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      const currentWeights = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push(createNode(col, row));
        currentWeights.push(Math.floor(Math.random() * 9) + 1); // Random weights for MST
      }
      newGrid.push(currentRow);
      newWeights.push(currentWeights);
    }
    setGrid(newGrid);
    setWeights(newWeights);
    setIsVisualizing(false);
  };

  const handleMouseDown = (row: number, col: number) => {
    if (isVisualizing) return;
    const newGrid = [...grid];
    const node = newGrid[row][col];
    if (!node.isStart && !node.isEnd) {
        node.isWall = !node.isWall;
        setGrid(newGrid);
        setIsMousePressed(true);
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isMousePressed || isVisualizing) return;
    const newGrid = [...grid];
    const node = newGrid[row][col];
    if (!node.isStart && !node.isEnd) {
        node.isWall = true; // Draw walls on drag
        setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
  };

  const getNeighbors = (node: NodeType, grid: NodeType[][]) => {
    const neighbors = [];
    const { col, row } = node;
    const { rows, cols } = dimensions;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < rows - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < cols - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
  };

  const animateShortestPath = (endNode: NodeType) => {
    const shortestPathNodes: NodeType[] = [];
    let currentNode: NodeType | null = endNode;
    while (currentNode !== null) {
      shortestPathNodes.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }

    for (let i = 0; i < shortestPathNodes.length; i++) {
      setTimeout(() => {
        const node = shortestPathNodes[i];
        const newGrid = [...grid];
        newGrid[node.row][node.col].isPath = true;
        setGrid([...newGrid]);
        if (i === shortestPathNodes.length - 1) setIsVisualizing(false);
      }, 50 * i);
    }
  };

  const animateAlgorithm = (visitedNodesInOrder: NodeType[], endNode: NodeType) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(endNode);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const newGrid = [...grid];
        newGrid[node.row][node.col].isVisited = true;
        setGrid([...newGrid]);
      }, 10 * i);
    }
  };

  const visualize = () => {
    if (isVisualizing) return;
    setIsVisualizing(true);
    
    // Reset visited/path state only
    const cleanGrid = grid.map(row => row.map(node => ({
        ...node,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        previousNode: null
    })));
    setGrid(cleanGrid);

    const startNode = cleanGrid.flatMap(r => r).find(n => n.isStart);
    const endNode = cleanGrid.flatMap(r => r).find(n => n.isEnd);

    if (!startNode || !endNode) return;

    const visitedNodesInOrder: NodeType[] = [];
    
    if (algorithm === 'bfs' || algorithm === 'dijkstra') {
        // Dijkstra on unweighted grid is identical to BFS
        const queue: NodeType[] = [startNode];
        startNode.isVisited = true;
        startNode.distance = 0;

        while (queue.length > 0) {
            // Use shift for BFS (Queue), but for Dijkstra we would simulate Priority Queue
            // Since weights are 1, a simple Queue suffices for optimality.
            // To make it visually distinct if we had weights, we'd sort queue.
            if (algorithm === 'dijkstra') {
                queue.sort((a, b) => a.distance - b.distance); 
            }
            
            const currentNode = queue.shift()!;
            visitedNodesInOrder.push(currentNode);

            if (currentNode === endNode) break;

            const neighbors = getNeighbors(currentNode, cleanGrid);
            for (const neighbor of neighbors) {
                // For Dijkstra, we check if we found a shorter path
                if (algorithm === 'dijkstra') {
                     const distance = currentNode.distance + 1;
                     if (distance < neighbor.distance) {
                         neighbor.distance = distance;
                         neighbor.previousNode = currentNode;
                         neighbor.isVisited = true; // Visually mark
                         if (!queue.includes(neighbor)) queue.push(neighbor);
                     }
                } else {
                    // Standard BFS
                    neighbor.isVisited = true;
                    neighbor.previousNode = currentNode;
                    neighbor.distance = currentNode.distance + 1;
                    queue.push(neighbor);
                }
            }
        }
    } else if (algorithm === 'dfs') {
        const stack: NodeType[] = [startNode];
        
        // Custom iterative DFS loop
        while(stack.length > 0) {
            const currentNode = stack.pop()!;
            if (!currentNode.isVisited) {
                currentNode.isVisited = true;
                visitedNodesInOrder.push(currentNode);
                
                if (currentNode.row === endNode.row && currentNode.col === endNode.col) break;

                const neighbors = getNeighbors(currentNode, cleanGrid);
                for(const neighbor of neighbors) {
                    neighbor.previousNode = currentNode;
                    stack.push(neighbor);
                }
            }
        }
    } else if (algorithm === 'astar') {
        startNode.distance = 0;
        const openSet: NodeType[] = [startNode];
        
        while (openSet.length > 0) {
            openSet.sort((a, b) => {
                const hA = Math.abs(a.row - endNode.row) + Math.abs(a.col - endNode.col);
                const hB = Math.abs(b.row - endNode.row) + Math.abs(b.col - endNode.col);
                return (a.distance + hA) - (b.distance + hB);
            });

            const currentNode = openSet.shift()!;
            if (currentNode.isVisited) continue;

            currentNode.isVisited = true;
            visitedNodesInOrder.push(currentNode);

            if (currentNode === endNode) break;

            const neighbors = getNeighbors(currentNode, cleanGrid);
            for (const neighbor of neighbors) {
                const tempG = currentNode.distance + 1;
                if (tempG < neighbor.distance) {
                    neighbor.distance = tempG;
                    neighbor.previousNode = currentNode;
                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }
    } else if (algorithm === 'prim') {
        const visited = new Set<string>();
        const pq: { u: NodeType, v: NodeType | null, weight: number }[] = [{ u: startNode, v: null, weight: 0 }];
        
        while (pq.length > 0) {
            pq.sort((a, b) => a.weight - b.weight);
            const { u, v /*, weight */ } = pq.shift()!;
            const id = `${u.row}-${u.col}`;
            
            if (visited.has(id)) continue;
            visited.add(id);
            
            u.previousNode = v;
            visitedNodesInOrder.push(u);
            if (u === endNode) break;

            const neighbors = getNeighbors(u, cleanGrid);
            for (const neighbor of neighbors) {
                if (!visited.has(`${neighbor.row}-${neighbor.col}`)) {
                    pq.push({ u: neighbor, v: u, weight: weights[neighbor.row][neighbor.col] });
                }
            }
        }
    }

    animateAlgorithm(visitedNodesInOrder, endNode);
  };
  const generateMaze = () => {
      resetGrid();
      const { rows, cols } = dimensions;
      const newGrid = [];
      for (let row = 0; row < rows; row++) {
        const currentRow = [];
        for (let col = 0; col < cols; col++) {
          const node = createNode(col, row);
          // 30% chance of wall, but keep start/end clear
          if (Math.random() < 0.3 && !node.isStart && !node.isEnd) {
             node.isWall = true;
          }
          currentRow.push(node);
        }
        newGrid.push(currentRow);
      }
      setGrid(newGrid);
  };

  
  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-2 sm:p-4" onMouseUp={handleMouseUp}>
        <div className="flex flex-col w-full gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-4 items-center justify-center">
                <div className="flex-1 min-w-[200px]">
                    <select 
                        value={algorithm} 
                        onChange={(e) => setAlgorithm(e.target.value as any)}
                        className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-medium"
                    >
                        <option value="bfs">Breadth-First Search (O(V+E))</option>
                        <option value="dfs">Depth-First Search (O(V+E))</option>
                        <option value="astar">A* Search (O(E))</option>
                        <option value="dijkstra">Dijkstra's Algorithm (O((V+E) log V))</option>
                        <option value="prim">Prim's Algorithm (O(E log V))</option>
                    </select>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    <button 
                        onClick={generateMaze}
                        disabled={isVisualizing}
                        className="flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-gray-200 text-sm font-semibold whitespace-nowrap"
                    >
                        <div className="flex gap-0.5">
                            <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                            <div className="w-1 h-3 bg-indigo-500 rounded-full translate-y-1"></div>
                            <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                        </div>
                        <span>Random Maze</span>
                    </button>
                    
                    <button 
                        onClick={visualize}
                        disabled={isVisualizing}
                        className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg font-bold text-white transition-all transform hover:scale-105 active:scale-95 ${isVisualizing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:shadow-green-500/25'}`}
                    >
                        <Play size={18} fill="currentColor" />
                        <span>Visualize</span>
                    </button>
                    
                    <button 
                        onClick={resetGrid}
                        disabled={isVisualizing}
                        className="flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-gray-200 text-sm font-semibold"
                    >
                        <RefreshCw size={18} className={`${isVisualizing ? 'animate-spin' : ''}`} />
                        <span>Reset</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 sm:flex sm:items-center sm:justify-center gap-2 sm:gap-6 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2 px-1"><div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div><span className="font-medium">Start</span></div>
                <div className="flex items-center space-x-2 px-1"><div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div><span className="font-medium">End</span></div>
                <div className="flex items-center space-x-2 px-1"><div className="w-3 h-3 bg-slate-800 dark:bg-slate-200 rounded shadow-sm"></div><span className="font-medium">Wall</span></div>
                <div className="flex items-center space-x-2 px-1"><div className="w-3 h-3 bg-blue-400 rounded shadow-sm animate-pulse"></div><span className="font-medium">Visited</span></div>
                <div className="flex items-center space-x-2 px-1"><div className="w-3 h-3 bg-yellow-400 rounded shadow-sm"></div><span className="font-medium">Path</span></div>
            </div>
        </div>

        <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div 
                className="grid gap-[1px] bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-1 rounded-lg shadow-inner mx-auto min-w-max sm:min-w-0"
                style={{ 
                    gridTemplateColumns: `repeat(${dimensions.cols}, minmax(20px, 1fr))`,
                    width: dimensions.cols * 25 > 1200 ? 'max-content' : '100%'
                }}
            >
                {grid.map((row, rowIdx) => (
                    row.map((node, colIdx) => (
                        <div
                            key={`${rowIdx}-${colIdx}`}
                            onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                            onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                            className={`
                                aspect-square transition-all duration-300 ease-in-out cursor-pointer hover:opacity-80 flex items-center justify-center text-[6px] sm:text-[8px] text-gray-400/50
                                ${node.isStart ? 'bg-green-500 scale-105 shadow-lg z-10 rounded-full' : 
                                node.isEnd ? 'bg-red-500 scale-105 shadow-lg z-10 rounded-full' : 
                                node.isWall ? 'bg-slate-800 dark:bg-slate-200 animate-pop' :
                                node.isPath ? 'bg-yellow-400 animate-path' :
                                node.isVisited ? 'bg-blue-400 animate-visited' : 
                                'bg-white dark:bg-gray-800'}
                            `}
                            style={{ width: '100%' }}
                        >
                            {algorithm === 'prim' && !node.isWall && !node.isStart && !node.isEnd && weights[rowIdx][colIdx]}
                        </div>
                    ))
                ))}
            </div>
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
            <MousePointer2 size={16} /> Click and drag to draw walls.
        </p>
    </div>
  );
};

export default PathfindingVisualizer;
