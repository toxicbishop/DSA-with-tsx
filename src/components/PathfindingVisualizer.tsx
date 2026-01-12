import React, { useState, useEffect } from 'react';
import { Play, RefreshCw, MousePointer2 } from 'lucide-react';

const ROWS = 15;
const COLS = 30;

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
  const [grid, setGrid] = useState<NodeType[][]>([]);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [algorithm, setAlgorithm] = useState<'bfs' | 'dfs' | 'astar' | 'dijkstra'>('bfs');

  useEffect(() => {
    resetGrid();
  }, []);

  const createNode = (col: number, row: number): NodeType => {
    return {
      col,
      row,
      isStart: row === Math.floor(ROWS / 2) && col === Math.floor(COLS / 4),
      isEnd: row === Math.floor(ROWS / 2) && col === Math.floor(COLS * 3 / 4),
      isWall: false,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      previousNode: null,
    };
  };

  const resetGrid = () => {
    const newGrid = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < COLS; col++) {
        currentRow.push(createNode(col, row));
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
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
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
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
            // Sort by f = g + h
            openSet.sort((a, b) => {
                const hA = Math.abs(a.row - endNode.row) + Math.abs(a.col - endNode.col);
                const hB = Math.abs(b.row - endNode.row) + Math.abs(b.col - endNode.col);
                return (a.distance + hA) - (b.distance + hB);
            });

            const currentNode = openSet.shift()!;
            
            // Skip if already processed (though our logic below mostly prevents re-adding visited)
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
    }

    animateAlgorithm(visitedNodesInOrder, endNode);
  };
const generateMaze = () => {
      // Recursive Division / Randomized Prim's simplified
      // Simple Randomized Maze for now
      resetGrid();
      const newGrid = [];
      for (let row = 0; row < ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < COLS; col++) {
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
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4" onMouseUp={handleMouseUp}>
        <div className="flex flex-wrap gap-4 mb-6 items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
                <select 
                    value={algorithm} 
                    onChange={(e) => setAlgorithm(e.target.value as any)}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="bfs">Breadth-First Search (BFS)</option>
                    <option value="dfs">Depth-First Search (DFS)</option>
                    <option value="astar">A* Search (A-Star)</option>
                    <option value="dijkstra">Dijkstra's Algorithm</option>
                </select>
            </div>

            <button 
                onClick={generateMaze}
                disabled={isVisualizing}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-gray-200"
            >
                <div className="flex gap-0.5">
                    <div className="w-1 h-3 bg-current rounded-full"></div>
                    <div className="w-1 h-3 bg-current rounded-full translate-y-1"></div>
                    <div className="w-1 h-3 bg-current rounded-full"></div>
                </div>
                <span>Random Maze</span>
            </button>
            
            <button 
                onClick={visualize}
                disabled={isVisualizing}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold text-white transition-all ${isVisualizing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-green-500/25'}`}
            >
                <Play size={18} />
                <span>Visualize</span>
            </button>
            
            <button 
                onClick={resetGrid}
                disabled={isVisualizing}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-gray-200"
            >
                <RefreshCw size={18} />
                <span>Reset Grid</span>
            </button>

            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 px-4 border-l border-gray-300 dark:border-gray-600">
                <div className="flex items-center space-x-1"><div className="w-4 h-4 bg-green-500 rounded"></div><span>Start</span></div>
                <div className="flex items-center space-x-1"><div className="w-4 h-4 bg-red-500 rounded"></div><span>End</span></div>
                <div className="flex items-center space-x-1"><div className="w-4 h-4 bg-black dark:bg-white/50 rounded"></div><span>Wall</span></div>
                <div className="flex items-center space-x-1"><div className="w-4 h-4 bg-blue-400 rounded"></div><span>Visited</span></div>
                <div className="flex items-center space-x-1"><div className="w-4 h-4 bg-yellow-400 rounded"></div><span>Path</span></div>
            </div>
        </div>

        <div 
            className="grid gap-[1px] bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-1 rounded-lg shadow-inner overflow-hidden"
            style={{ 
                gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            }}
        >
            {grid.map((row, rowIdx) => (
                row.map((node, colIdx) => (
                    <div
                        key={`${rowIdx}-${colIdx}`}
                        onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                        onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                        className={`
                            w-6 h-6 sm:w-8 sm:h-8 transition-all duration-300 ease-in-out cursor-pointer hover:opacity-80
                            ${node.isStart ? 'bg-green-500 scale-110 shadow-lg z-10 rounded-full' : 
                              node.isEnd ? 'bg-red-500 scale-110 shadow-lg z-10 rounded-full' : 
                              node.isWall ? 'bg-slate-800 dark:bg-slate-200 animate-pop' :
                              node.isPath ? 'bg-yellow-400 animate-path' :
                              node.isVisited ? 'bg-blue-400 animate-visited' : 
                              'bg-white dark:bg-gray-800'}
                        `}
                    />
                ))
            ))}
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
            <MousePointer2 size={16} /> Click and drag to draw walls.
        </p>
    </div>
  );
};

export default PathfindingVisualizer;
