import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Plus, Minus, Search, Trash2, Network, ArrowRight, Code2 } from 'lucide-react';

// --- TYPES ---
type NodeType = {
  id: number;
  value: number;
  x: number;
  y: number;
  highlight?: boolean;
  visited?: boolean;
  isPath?: boolean; // For search/path
};

type EdgeType = {
  source: number; // Node ID
  target: number; // Node ID
  weight?: number;
  highlight?: boolean;
  isMST?: boolean; // For MST visualization
  isPath?: boolean; // For shortest path
};

const ALGO_CODE: Record<string, string> = {
  inorder: `function inorder(node) {
  if (!node) return;
  inorder(node.left);
  visit(node);
  inorder(node.right);
}`,
  preorder: `function preorder(node) {
  if (!node) return;
  visit(node);
  preorder(node.left);
  preorder(node.right);
}`,
  postorder: `function postorder(node) {
  if (!node) return;
  postorder(node.left);
  postorder(node.right);
  visit(node);
}`,
  dijkstra: `function dijkstra(start) {
  dist[start] = 0;
  while(unvisited) {
    u = minDistance(unvisited);
    unvisited.remove(u);
    for(v in neighbors(u)) {
      alt = dist[u] + weight(u,v);
      if(alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
      }
    }
  }
}`,
  floyd: `for k from 1 to V:
  for i from 1 to V:
    for j from 1 to V:
      if dist[i][j] > dist[i][k] + dist[k][j]:
        dist[i][j] = dist[i][k] + dist[k][j];`,
  warshall: `for k from 1 to V:
  for i from 1 to V:
    for j from 1 to V:
      reach[i][j] = reach[i][j] OR 
        (reach[i][k] AND reach[k][j]);`,
  astar: `function aStar(start, end) {
  openSet = [start]
  while (openSet) {
    curr = openSet.popWithLowestF()
    if (curr == end) return reconstructPath()
    for (neighbor in neighbors(curr)) {
      gScore = dist[curr] + weight(curr, neighbor)
      if (gScore < dist[neighbor]) {
        dist[neighbor] = gScore
        fScore = gScore + h(neighbor, end)
        if (neighbor not in openSet) openSet.push(neighbor)
      }
    }
  }
}`
};

type Mode = 'traversal' | 'bst' | 'mst' | 'topo';

const TreeGraphVisualizer: React.FC = () => {
  const [mode, setMode] = useState<Mode>('traversal');
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<EdgeType[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [distMatrix, setDistMatrix] = useState<number[][] | null>(null);
  const [matrixType, setMatrixType] = useState<'dist' | 'reach'>('dist');
  
  // Inputs
  const [inputValue, setInputValue] = useState<string>('');
  const [speed, setSpeed] = useState(500);
  const [showCode, setShowCode] = useState(false);
  const [activeAlgo, setActiveAlgo] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    reset();
  }, [mode]);

  const log = (message: string) => {
    setLogs(prev => [message, ...prev].slice(0, 5));
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // --- INITIALIZATION ---

  const reset = () => {
    setNodes([]);
    setEdges([]);
    setLogs([]);
    setIsAnimating(false);
    setDistMatrix(null);
    setActiveAlgo(null);

    if (mode === 'traversal' || mode === 'bst') {
      // Initialize with a simple tree or empty for BST
      if (mode === 'traversal') initTraversalTree();
    } else if (mode === 'mst') {
      initGraph();
    } else if (mode === 'topo') {
        initDAG();
    }
  };

  const initTraversalTree = () => {
    // Hardcoded balanced tree for traversal demo
    //       10
    //     /    \
    //    5      15
    //   / \    /  \
    //  3   7  12   18
    const centerX = window.innerWidth < 768 ? 300 : 400;
    const newNodes = [
      { id: 10, value: 10, x: centerX, y: 50 },
      { id: 5, value: 5, x: centerX - 150, y: 150 },
      { id: 15, value: 15, x: centerX + 150, y: 150 },
      { id: 3, value: 3, x: centerX - 250, y: 250 },
      { id: 7, value: 7, x: centerX - 50, y: 250 },
      { id: 12, value: 12, x: centerX + 50, y: 250 },
      { id: 18, value: 18, x: centerX + 250, y: 250 },
    ];
    const newEdges = [
        { source: 10, target: 5 }, { source: 10, target: 15 },
        { source: 5, target: 3 }, { source: 5, target: 7 },
        { source: 15, target: 12 }, { source: 15, target: 18 }
    ];
    setNodes(newNodes);
    setEdges(newEdges);
  };

  const initGraph = () => {
    // Random graph for MST
    const centerX = window.innerWidth < 768 ? 300 : 400;
    const newNodes = [
        { id: 0, value: 0, x: centerX - 200, y: 100 },
        { id: 1, value: 1, x: centerX, y: 50 },
        { id: 2, value: 2, x: centerX + 200, y: 100 },
        { id: 3, value: 3, x: centerX - 200, y: 300 },
        { id: 4, value: 4, x: centerX, y: 350 },
        { id: 5, value: 5, x: centerX + 200, y: 300 },
    ];
    // Edges with weights
    const newEdges = [
        { source: 0, target: 1, weight: 4 },
        { source: 0, target: 3, weight: 2 },
        { source: 1, target: 2, weight: 6 },
        { source: 1, target: 3, weight: 5 },
        { source: 2, target: 5, weight: 3 },
        { source: 3, target: 4, weight: 1 },
        { source: 4, target: 5, weight: 8 },
        { source: 1, target: 4, weight: 7 }, // extra connectivity
    ];
    setNodes(newNodes);
    setEdges(newEdges);
  };

  const initDAG = () => {
      // DAG for Topo Sort
      const centerX = window.innerWidth < 768 ? 300 : 400;
      const newNodes = [
        { id: 5, value: 5, x: centerX - 300, y: 100 },
        { id: 4, value: 4, x: centerX - 300, y: 300 },
        { id: 2, value: 2, x: centerX - 100, y: 100 },
        { id: 0, value: 0, x: centerX - 100, y: 300 },
        { id: 1, value: 1, x: centerX + 100, y: 200 },
        { id: 3, value: 3, x: centerX + 300, y: 200 },
      ];
      // 5->2, 5->0, 4->0, 4->1, 2->3, 3->1
      const newEdges = [
          { source: 5, target: 2 },
          { source: 5, target: 0 },
          { source: 4, target: 0 },
          { source: 4, target: 1 },
          { source: 2, target: 3 },
          { source: 3, target: 1 },
      ];
      setNodes(newNodes);
      setEdges(newEdges);
  };

  // --- TRAVERSALS ---
  
  const highlightNode = async (id: number, color: boolean = true) => {
     setNodes(prev => prev.map(n => n.id === id ? { ...n, highlight: color, visited: color } : n));
     await sleep(speed);
     if (color) {
         setNodes(prev => prev.map(n => n.id === id ? { ...n, highlight: false } : n));
     }
  };

  const traverse = async (type: 'inorder' | 'preorder' | 'postorder') => {
      if (isAnimating) return;
      setActiveAlgo(type);
      setIsAnimating(true);
      log(`Starting ${type} traversal...`);
      
      // Clear previous visited
      setNodes(prev => prev.map(n => ({...n, visited: false, highlight: false})));

      // Helper to find children
      const getChildren = (id: number) => {
          const children = edges.filter(e => e.source === id).map(e => e.target);
          const left = nodes.find(n => n.id === children.find(c => nodes.find(no => no.id === c)!.value < nodes.find(no => no.id === id)!.value));
          const right = nodes.find(n => n.id === children.find(c => nodes.find(no => no.id === c)!.value > nodes.find(no => no.id === id)!.value));
          return { left, right };
      };

      const root = nodes.find(n => !edges.some(e => e.target === n.id)); // Find root (no incoming edges)
      if (!root) { setIsAnimating(false); return; }

      const recTraverse = async (curr: NodeType | undefined) => {
          if (!curr) return;
          const { left, right } = getChildren(curr.id);

          if (type === 'preorder') {
             await highlightNode(curr.id);
             log(`Visited ${curr.value}`);
          }
          await recTraverse(left);
          if (type === 'inorder') {
              await highlightNode(curr.id);
              log(`Visited ${curr.value}`);
          }
          await recTraverse(right);
          if (type === 'postorder') {
              await highlightNode(curr.id);
              log(`Visited ${curr.value}`);
          }
      };

      await recTraverse(root);
      setIsAnimating(false);
      log("Traversal Complete");
  };

  // --- BST OPERATIONS ---

  // NOTE: Simple BST implementation. For better visualization, we might need a proper tree data structure class
  // but for now adapting the nodes/edges list.

  const insertBST = async () => {
      const val = parseInt(inputValue);
      if (isNaN(val)) return;
      if (isAnimating) return;
      setIsAnimating(true);
      setInputValue('');
      
      const newEdges = [...edges];

      if (nodes.length === 0) {
          log(`Inserted root ${val}`);
          setNodes([{ id: val, value: val, x: 400, y: 50 }]);
          setIsAnimating(false);
          return;
      }

      let curr = nodes.find(n => !edges.some(e => e.target === n.id)); // root
      let level = 1;
      let xOffset = 200;

      while (curr) {
          await highlightNode(curr.id);
          
          if (val < curr.value) {
              log(`${val} < ${curr.value}, going left`);
              // Check left child
              const leftEdge = newEdges.find(e => e.source === curr!.id && nodes.find(n => n.id === e.target)!.value < curr!.value);
              if (leftEdge) {
                 curr = nodes.find(n => n.id === leftEdge.target);
                 level++;
                 xOffset /= 2;
              } else {
                 // Insert Left
                 const newId = val; // Assuming unique values for simplicity
                 const newNode = { 
                     id: newId, 
                     value: val, 
                     x: curr.x - xOffset, 
                     y: curr.y + 80 
                 };
                 setNodes(prev => [...prev, newNode]);
                 setEdges(prev => [...prev, { source: curr!.id, target: newId }]);
                 log(`Inserted ${val} to left of ${curr.value}`);
                 break;
              }
          } else if (val > curr.value) {
              log(`${val} > ${curr.value}, going right`);
              const rightEdge = newEdges.find(e => e.source === curr!.id && nodes.find(n => n.id === e.target)!.value > curr!.value);
              if (rightEdge) {
                  curr = nodes.find(n => n.id === rightEdge.target);
                  level++;
                  xOffset /= 2;
              } else {
                  // Insert Right
                  const newId = val;
                  const newNode = {
                      id: newId,
                      value: val,
                      x: curr.x + xOffset,
                      y: curr.y + 80
                  };
                  setNodes(prev => [...prev, newNode]);
                  setEdges(prev => [...prev, { source: curr!.id, target: newId }]);
                  log(`Inserted ${val} to right of ${curr.value}`);
                  break;
              }
          } else {
              log(`${val} already exists!`);
              break;
          }
      }
      setIsAnimating(false);
  };

  const calculateTree = (values: number[]) => {
      const newNodes: NodeType[] = [];
      const newEdges: EdgeType[] = [];
      
      if (values.length === 0) return { newNodes, newEdges };

      // Root
      newNodes.push({ id: values[0], value: values[0], x: 400, y: 50 });

      for (let i = 1; i < values.length; i++) {
          const val = values[i];
          let curr = newNodes[0];
          let level = 1;
          
          while (true) {
              // Adjust offset based on level to prevent overlap
              const currentOffset = 200 / Math.pow(1.5, level - 1); // Decay offset

              if (val < curr.value) {
                  const leftChildId = newEdges.find(e => e.source === curr.id && newNodes.find(nn => nn.id === e.target)!.value < curr.value)?.target;
                  if (leftChildId !== undefined) {
                      curr = newNodes.find(n => n.id === leftChildId)!;
                      level++;
                  } else {
                      newNodes.push({ id: val, value: val, x: curr.x - currentOffset, y: curr.y + 80 });
                      newEdges.push({ source: curr.id, target: val });
                      break;
                  }
              } else {
                   const rightChildId = newEdges.find(e => e.source === curr.id && newNodes.find(nn => nn.id === e.target)!.value > curr.value)?.target;
                   if (rightChildId !== undefined) {
                       curr = newNodes.find(n => n.id === rightChildId)!;
                       level++;
                   } else {
                   newNodes.push({ id: val, value: val, x: curr.x + currentOffset, y: curr.y + 80 });
                       newEdges.push({ source: curr.id, target: val });
                       break;
                   }
              }
          }
      }
      return { newNodes, newEdges };
  };

  const deleteBST = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    if (isAnimating) return;
    setIsAnimating(true);
    log(`Deleting ${val}...`);

    let curr = nodes.find(n => !edges.some(e => e.target === n.id)); // root
    let found = false;

    // Search Vis
    while (curr) {
        setNodes(prev => prev.map(n => n.id === curr!.id ? { ...n, highlight: true } : n));
        await sleep(speed);
        setNodes(prev => prev.map(n => n.id === curr!.id ? { ...n, highlight: false } : n));

        if (val === curr.value) {
            found = true;
            break;
        } else if (val < curr.value) {
             const leftEdge = edges.find(e => e.source === curr!.id && nodes.find(n => n.id === e.target)!.value < curr!.value);
             if (leftEdge) curr = nodes.find(n => n.id === leftEdge.target);
             else break;
        } else {
             const rightEdge = edges.find(e => e.source === curr!.id && nodes.find(n => n.id === e.target)!.value > curr!.value);
             if (rightEdge) curr = nodes.find(n => n.id === rightEdge.target);
             else break;
        }
    }

    if (found) {
        log(`Found ${val}, removing and rebuilding tree...`);
        await sleep(speed);
        const remainingValues = nodes.map(n => n.value).filter(v => v !== val);
        const { newNodes, newEdges } = calculateTree(remainingValues);
        setNodes(newNodes);
        setEdges(newEdges);
        log(`Deleted ${val}`);
    } else {
        log(`${val} not found.`);
    }
    
    setInputValue('');
    setIsAnimating(false);
  };

  const searchBST = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    if (isAnimating) return;
    setIsAnimating(true);
    log(`Searching for ${val}...`);

    let curr = nodes.find(n => !edges.some(e => e.target === n.id)); // root
    let found = false;

    while (curr) {
        setNodes(prev => prev.map(n => n.id === curr!.id ? { ...n, highlight: true } : n));
        await sleep(speed);
        setNodes(prev => prev.map(n => n.id === curr!.id ? { ...n, highlight: false } : n));

        if (val === curr.value) {
            log(`Found ${val}!`);
            setNodes(prev => prev.map(n => n.id === curr!.id ? { ...n, visited: true } : n)); // Keep green
            found = true;
            break;
        } else if (val < curr.value) {
             const leftEdge = edges.find(e => e.source === curr!.id && nodes.find(n => n.id === e.target)!.value < curr!.value);
             if (leftEdge) curr = nodes.find(n => n.id === leftEdge.target);
             else break;
        } else {
             const rightEdge = edges.find(e => e.source === curr!.id && nodes.find(n => n.id === e.target)!.value > curr!.value);
             if (rightEdge) curr = nodes.find(n => n.id === rightEdge.target);
             else break;
        }
    }

    if (!found) log(`${val} not found.`);
    setIsAnimating(false);
  };
  
  // --- MST (Prim's) ---

  const runPrim = async () => {
      if (isAnimating || nodes.length === 0) return;
      setIsAnimating(true);
      log("Starting Prim's Algorithm...");
      
      // Clean state
      setNodes(prev => prev.map(n => ({...n, visited: false, highlight: false, isPath: false})));
      setEdges(prev => prev.map(e => ({...e, isMST: false, highlight: false, isPath: false})));

      const visited = new Set<number>();
      visited.add(nodes[0].id); // Start with first node
      setNodes(prev => prev.map(n => n.id === nodes[0].id ? {...n, visited: true} : n));

      while (visited.size < nodes.length) {
          let minEdge: EdgeType | null = null;
          let minWeight = Infinity;

          // Find min edge connecting visited to unvisited
          for (const edge of edges) {
               const uVisited = visited.has(edge.source);
               const vVisited = visited.has(edge.target);
               
               if (uVisited !== vVisited) { // One in, one out
                   // Highlight considered edge
                   // await sleep(100); 
                   if (edge.weight! < minWeight) {
                       minWeight = edge.weight!;
                       minEdge = edge;
                   }
               }
          }

          if (minEdge) {
              await sleep(speed);
              const targetId = visited.has(minEdge.source) ? minEdge.target : minEdge.source;
              visited.add(targetId);
              
              log(`Added edge ${minEdge.source}-${minEdge.target} (Weight: ${minEdge.weight})`);
              
              setEdges(prev => prev.map(e => e === minEdge ? { ...e, isMST: true } : e));
              setNodes(prev => prev.map(n => n.id === targetId ? { ...n, visited: true } : n));
          } else {
              break; // Disconnected graph?
          }
      }
      setIsAnimating(false);
      log("MST Complete");
  };

  const runKruskal = async () => {
      // Basic visualization of Kruskal
      if (isAnimating) return;
      setIsAnimating(true);
      log("Starting Kruskal's Algorithm...");

      // Sort edges
      const sortedEdges = [...edges].sort((a,b) => (a.weight || 0) - (b.weight || 0));
      
      const parent: Record<number, number> = {};
      nodes.forEach(n => parent[n.id] = n.id);
      
      const find = (i: number): number => {
          if (parent[i] === i) return i;
          return find(parent[i]);
      };
      
      const union = (i: number, j: number) => {
          const rootI = find(i);
          const rootJ = find(j);
          if (rootI !== rootJ) parent[rootI] = rootJ;
      };

      for (const edge of sortedEdges) {
          setEdges(prev => prev.map(e => e === edge ? {...e, highlight: true} : e));
          await sleep(speed);
          
          if (find(edge.source) !== find(edge.target)) {
              union(edge.source, edge.target);
              setEdges(prev => prev.map(e => e === edge ? {...e, isMST: true, highlight: false} : e));
              log(`Selected edge ${edge.source}-${edge.target} (${edge.weight})`);
          } else {
              setEdges(prev => prev.map(e => e === edge ? {...e, highlight: false} : e)); // Rejected
          }
      }
      setIsAnimating(false);
      log("MST Complete");
  };

  const runDijkstra = async () => {
    if (isAnimating || nodes.length < 2) return;
    setActiveAlgo('dijkstra');
    setIsAnimating(true);
    log("Starting Dijkstra's Algorithm...");

    const startNode = nodes[0];
    const endNode = nodes[nodes.length - 1];
    
    setNodes(prev => prev.map(n => ({...n, visited: false, highlight: false, isPath: false})));
    setEdges(prev => prev.map(e => ({...e, highlight: false, isMST: false, isPath: false})));

    const distances: Record<number, number> = {};
    const previous: Record<number, number | null> = {};
    const unvisited = new Set<number>();

    nodes.forEach(n => {
        distances[n.id] = Infinity;
        previous[n.id] = null;
        unvisited.add(n.id);
    });
    distances[startNode.id] = 0;

    while (unvisited.size > 0) {
        let currId = Array.from(unvisited).reduce((minId, id) => 
            distances[id] < distances[minId] ? id : minId
        , Array.from(unvisited)[0]);

        if (distances[currId] === Infinity || currId === endNode.id) break;

        unvisited.delete(currId);
        await highlightNode(currId);
        setNodes(prev => prev.map(n => n.id === currId ? {...n, visited: true} : n));

        const neighbors = edges.filter(e => e.source === currId || e.target === currId);
        for (const edge of neighbors) {
            const neighborId = edge.source === currId ? edge.target : edge.source;
            if (!unvisited.has(neighborId)) continue;

            const newDist = distances[currId] + (edge.weight || 1);
            if (newDist < distances[neighborId]) {
                distances[neighborId] = newDist;
                previous[neighborId] = currId;
            }
        }
    }

    // Animate path back
    let curr = endNode.id;
    if (previous[curr] !== null) {
        while (curr !== null) {
            const prevId = previous[curr];
            setNodes(prev => prev.map(n => n.id === curr ? {...n, isPath: true} : n));
            if (prevId !== null) {
                setEdges(prev => prev.map(e => 
                    ((e.source === curr && e.target === prevId!) || (e.source === prevId! && e.target === curr))
                    ? {...e, isPath: true} : e
                ));
            }
            curr = prevId!;
            await sleep(speed / 2);
        }
    }
    setNodes(prev => prev.map(n => n.id === startNode.id ? {...n, isPath: true} : n));

    setIsAnimating(false);
    log("Shortest Path Found");
  };

  const runAStar = async () => {
    if (isAnimating || nodes.length < 2) return;
    setActiveAlgo('astar');
    setIsAnimating(true);
    log("Starting A* Algorithm...");

    const start = nodes[0];
    const end = nodes[nodes.length - 1];

    setNodes(prev => prev.map(n => ({...n, visited: false, highlight: false, isPath: false})));
    setEdges(prev => prev.map(e => ({...e, highlight: false, isMST: false, isPath: false})));

    const getHeuristic = (id: number) => {
        const n = nodes.find(node => node.id === id)!;
        return Math.sqrt(Math.pow(n.x - end.x, 2) + Math.pow(n.y - end.y, 2)) / 50;
    };

    const gScore: Record<number, number> = {};
    const fScore: Record<number, number> = {};
    const previous: Record<number, number | null> = {};
    const openSet = new Set([start.id]);

    nodes.forEach(n => {
        gScore[n.id] = Infinity;
        fScore[n.id] = Infinity;
        previous[n.id] = null;
    });

    gScore[start.id] = 0;
    fScore[start.id] = getHeuristic(start.id);

    while (openSet.size > 0) {
        let currId = Array.from(openSet).reduce((minId, id) => 
            fScore[id] < fScore[minId] ? id : minId
        );

        if (currId === end.id) break;

        openSet.delete(currId);
        await highlightNode(currId);
        setNodes(prev => prev.map(n => n.id === currId ? {...n, visited: true} : n));

        const adjEdges = edges.filter(e => e.source === currId || e.target === currId);
        for (const edge of adjEdges) {
            const neighborId = edge.source === currId ? edge.target : edge.source;
            const weight = edge.weight || 1;
            const tempG = gScore[currId] + weight;

            if (tempG < gScore[neighborId]) {
                previous[neighborId] = currId;
                gScore[neighborId] = tempG;
                fScore[neighborId] = tempG + getHeuristic(neighborId);
                openSet.add(neighborId);
            }
        }
    }

    // Path tracing
    let curr = end.id;
    if (previous[curr] !== null || curr === start.id) {
        while (curr !== null) {
            const prevId = previous[curr];
            setNodes(prev => prev.map(n => n.id === curr ? {...n, isPath: true} : n));
            if (prevId !== null) {
                setEdges(prev => prev.map(e => 
                    ((e.source === curr && e.target === prevId!) || (e.source === prevId! && e.target === curr))
                    ? {...e, isPath: true} : e
                ));
            }
            curr = prevId!;
            await sleep(speed / 2);
        }
    }

    setIsAnimating(false);
    log("A* Path Search Complete");
  };

  const runFloyd = async () => {
    if (isAnimating || nodes.length === 0) return;
    setActiveAlgo('floyd');
    setIsAnimating(true);
    setMatrixType('dist');
    log("Starting Floyd's Algorithm (Shortest Paths)...");

    const n = nodes.length;
    const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
    const nodeIds = nodes.map(node => node.id);

    for (let i = 0; i < n; i++) dist[i][i] = 0;
    edges.forEach(edge => {
        const u = nodeIds.indexOf(edge.source);
        const v = nodeIds.indexOf(edge.target);
        if (u !== -1 && v !== -1) {
            dist[u][v] = edge.weight || 1;
            dist[v][u] = edge.weight || 1;
        }
    });

    setDistMatrix([...dist.map(row => [...row])]);

    for (let k = 0; k < n; k++) {
        log(`Using vertex ${nodeIds[k]} as pivot`);
        setNodes(prev => prev.map((node, idx) => idx === k ? {...node, highlight: true} : {...node, highlight: false}));
        await sleep(speed);

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
                    if (dist[i][j] > dist[i][k] + dist[k][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        setDistMatrix([...dist.map(row => [...row])]);
                    }
                }
            }
        }
    }

    setNodes(prev => prev.map(node => ({...node, highlight: false})));
    setIsAnimating(false);
    log("Floyd's Algorithm Complete");
  };

  const runWarshall = async () => {
    if (isAnimating || nodes.length === 0) return;
    setActiveAlgo('warshall');
    setIsAnimating(true);
    setMatrixType('reach');
    log("Starting Warshall's Algorithm (Transitive Closure)...");

    const n = nodes.length;
    const reach = Array.from({ length: n }, () => Array(n).fill(0));
    const nodeIds = nodes.map(node => node.id);

    edges.forEach(edge => {
        const u = nodeIds.indexOf(edge.source);
        const v = nodeIds.indexOf(edge.target);
        if (u !== -1 && v !== -1) {
            reach[u][v] = 1;
            reach[v][u] = 1; // Assuming undirected based on current graph
        }
    });
    for (let i = 0; i < n; i++) reach[i][i] = 1;

    setDistMatrix([...reach.map(row => [...row])]);

    for (let k = 0; k < n; k++) {
        log(`Intermediate vertex: ${nodeIds[k]}`);
        setNodes(prev => prev.map((node, idx) => idx === k ? {...node, highlight: true} : {...node, highlight: false}));
        await sleep(speed);

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (reach[i][j] === 0) {
                    if (reach[i][k] === 1 && reach[k][j] === 1) {
                        reach[i][j] = 1;
                        setDistMatrix([...reach.map(row => [...row])]);
                    }
                }
            }
        }
    }

    setNodes(prev => prev.map(node => ({...node, highlight: false})));
    setIsAnimating(false);
    log("Warshall's Algorithm Complete");
  };

  // --- TOPOLOGICAL SORT ---
  const runTopoSort = async () => {
       if (isAnimating) return;
       setIsAnimating(true);
       log("Starting Topological Sort (Kahn's Algorithm)...");
       
       setNodes(prev => prev.map(n => ({...n, visited: false, highlight: false})));

       const inDegree: Record<number, number> = {};
       nodes.forEach(n => inDegree[n.id] = 0);
       edges.forEach(e => inDegree[e.target]++);

       const queue: number[] = [];
       nodes.forEach(n => {
           if (inDegree[n.id] === 0) queue.push(n.id);
       });

       const sortedOrder = [];

       while(queue.length > 0) {
           await sleep(speed);
           const u = queue.shift()!;
           sortedOrder.push(u);
           
           setNodes(prev => prev.map(n => n.id === u ? {...n, visited: true} : n));
           log(`Processed Node ${u}`);

           const neighbors = edges.filter(e => e.source === u).map(e => e.target);
           for (const v of neighbors) {
               inDegree[v]--;
               if (inDegree[v] === 0) {
                   queue.push(v);
               }
           }
       }
       
       if (sortedOrder.length !== nodes.length) {
           log("Cycle detected! Cannot perform Topological Sort.");
       } else {
           log(`Result: ${sortedOrder.join(' -> ')}`);
       }

       setIsAnimating(false);
  };


  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      {/* Controls Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center gap-4 bg-white dark:bg-gray-800 sticky top-16 z-10 transition-colors duration-300">
          
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'traversal' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600/50'}`}
                onClick={() => !isAnimating && setMode('traversal')}
              >Traversals</button>
              <button 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'bst' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600/50'}`}
                onClick={() => !isAnimating && setMode('bst')}
              >BST</button>
              <button 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'mst' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600/50'}`}
                onClick={() => !isAnimating && setMode('mst')}
              >MST</button>
              <button 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'topo' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600/50'}`}
                onClick={() => !isAnimating && setMode('topo')}
              >Topo Sort</button>
          </div>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>

          {/* Action Buttons based on Mode */}
          {mode === 'traversal' && (
              <>
                  <button onClick={() => traverse('inorder')} disabled={isAnimating} className="btn-primary flex items-center gap-2" title="Time: O(N), Space: O(H)"><ArrowRight size={16}/> Inorder</button>
                  <button onClick={() => traverse('preorder')} disabled={isAnimating} className="btn-primary flex items-center gap-2" title="Time: O(N), Space: O(H)"><ArrowRight size={16}/> Preorder</button>
                  <button onClick={() => traverse('postorder')} disabled={isAnimating} className="btn-primary flex items-center gap-2" title="Time: O(N), Space: O(H)"><ArrowRight size={16}/> Postorder</button>
              </>
          )}

          {mode === 'bst' && (
              <>
                <input 
                    type="number" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    placeholder="Value"
                    className="w-20 px-3 py-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none"
                />
                <button onClick={insertBST} disabled={isAnimating || !inputValue} className="btn-primary flex items-center gap-2" title="Time: O(log N), Space: O(1)"><Plus size={16}/> Insert</button>
                <button onClick={deleteBST} disabled={isAnimating || !inputValue} className="btn-primary flex items-center gap-2" title="Time: O(log N), Space: O(1)"><Minus size={16}/> Delete</button>
                <button onClick={searchBST} disabled={isAnimating || !inputValue} className="btn-primary flex items-center gap-2" title="Time: O(log N), Space: O(1)"><Search size={16}/> Search</button>
                <button onClick={() => {setNodes([]); setEdges([]);}} disabled={isAnimating} className="btn-secondary flex items-center gap-2"><Trash2 size={16}/> Clear</button>
              </>
          )}

          {mode === 'mst' && (
              <>
                  <button onClick={runPrim} disabled={isAnimating} className="btn-primary flex items-center gap-2" title="Time: O(E log V), Space: O(V)"><Network size={16}/> Prim's</button>
                  <button onClick={runKruskal} disabled={isAnimating} className="btn-primary flex items-center gap-2" title="Time: O(E log E), Space: O(V)"><Network size={16}/> Kruskal's</button>
                   <button onClick={runDijkstra} disabled={isAnimating} className="btn-primary flex items-center gap-2" title="Time: O((V+E) log V), Space: O(V)">Dijkstra</button>
                  <button onClick={runAStar} disabled={isAnimating} className="btn-primary flex items-center gap-2" title="Time: O(E), Space: O(V)">A*</button>
                  <button onClick={runFloyd} disabled={isAnimating} className="btn-primary flex items-center gap-2" title="Time: O(V³), Space: O(V²)">Floyd's</button>
                  <button onClick={runWarshall} disabled={isAnimating} className="btn-primary flex items-center gap-2" title="Time: O(V³), Space: O(V²)">Warshall's</button>
                  <button onClick={reset} disabled={isAnimating} className="btn-secondary flex items-center gap-2"><RotateCcw size={16}/> Reset Graph</button>
              </>
          )}

          {mode === 'topo' && (
              <>
                  <button onClick={runTopoSort} disabled={isAnimating} className="btn-primary flex items-center gap-2" title="Time: O(V+E), Space: O(V)"><Play size={16}/> Sort</button>
                  <button onClick={reset} disabled={isAnimating} className="btn-secondary flex items-center gap-2"><RotateCcw size={16}/> Reset DAG</button>
              </>
          )}
          
          <div className="ml-auto flex items-center gap-2">
            <button 
              onClick={() => setShowCode(!showCode)} 
              className={`p-2 rounded-lg transition-all ${showCode ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              title="Toggle Pseudo-code"
            >
              <Code2 size={20} />
            </button>
            <span className="text-xs text-gray-500">Speed:</span>
            <input type="range" min="100" max="1000" step="100" value={1100 - speed} onChange={(e) => setSpeed(1100 - parseInt(e.target.value))} className="w-24 px-0" />
          </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
         {/* Canvas Area */}
         <div className="flex-1 relative bg-white dark:bg-gray-900 overflow-auto cursor-move min-h-[400px]" ref={canvasRef}>
            <svg className="w-full h-full min-w-[600px] md:min-w-[1000px] min-h-[500px] md:min-h-[800px]">
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
                    </marker>
                </defs>
                
                {/* Edges */}
                {edges.map((edge, i) => {
                    const start = nodes.find(n => n.id === edge.source);
                    const end = nodes.find(n => n.id === edge.target);
                    if (!start || !end) return null;
                    
                    const isDirected = mode === 'topo' || mode === 'bst' || mode === 'traversal';

                    return (
                        <g key={i}>
                            <line 
                                x1={start.x} y1={start.y} 
                                x2={end.x} y2={end.y} 
                                stroke={edge.isPath ? '#fbbf24' : edge.isMST ? '#10b981' : edge.highlight ? '#ec4899' : '#9ca3af'} 
                                strokeWidth={edge.isPath || edge.isMST || edge.highlight ? 4 : 2}
                                markerEnd={isDirected && !edge.isPath ? "url(#arrowhead)" : ""}
                            />
                            {edge.weight !== undefined && (
                                <text 
                                    x={(start.x + end.x) / 2 - (Math.abs(start.x - end.x) < Math.abs(start.y - end.y) ? 12 : 0)} 
                                    y={(start.y + end.y) / 2 - (Math.abs(start.x - end.x) < Math.abs(start.y - end.y) ? 0 : 8)} 
                                    fill={edge.isMST ? '#10b981' : '#6b7280'}
                                    className="text-sm font-bold select-none"
                                    textAnchor={Math.abs(start.x - end.x) < Math.abs(start.y - end.y) ? "end" : "middle"}
                                >
                                    {edge.weight}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Nodes */}
                {nodes.map((node) => (
                    <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                        <circle 
                            r="20" 
                            className={`
                                transition-all duration-300
                                ${node.isPath ? 'fill-yellow-400 stroke-yellow-500' :
                                  node.visited ? 'fill-green-500 stroke-green-600' : 
                                  node.highlight ? 'fill-pink-500 stroke-pink-600' : 
                                  'fill-white dark:fill-gray-800 stroke-blue-500'}
                            `}
                            strokeWidth="3"
                        />
                        <text 
                            dy=".3em" 
                            textAnchor="middle" 
                            className={`font-bold select-none ${node.isPath || node.visited || node.highlight ? 'fill-white' : 'fill-gray-800 dark:fill-white'}`}
                        >
                            {node.value}
                        </text>
                    </g>
                ))}
            </svg>
         </div>

         {/* Sidebar / Logs */}
         <div className="w-full md:w-80 h-48 md:h-auto border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto relative">
             {showCode && activeAlgo && ALGO_CODE[activeAlgo] && (
               <div className="absolute inset-0 bg-gray-900/95 backdrop-blur text-white p-4 z-20 font-mono text-[10px] overflow-auto animate-in slide-in-from-right duration-300">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                    <h4 className="text-orange-400 font-bold uppercase tracking-wider">Algorithm Pseudo-code</h4>
                    <button onClick={() => setShowCode(false)} className="text-gray-400 hover:text-white transition-colors">✕</button>
                  </div>
                  <pre className="whitespace-pre-wrap leading-relaxed">
                    {ALGO_CODE[activeAlgo]}
                  </pre>
               </div>
             )}

             <h3 className="font-bold mb-4 text-gray-700 dark:text-gray-300">Execution Log</h3>
             <div className="space-y-2">
                 {logs.map((msg, i) => (
                     <div key={i} className="text-sm p-2 rounded bg-white dark:bg-gray-800 border-l-4 border-blue-500 shadow-sm">
                         {msg}
                     </div>
                 ))}
             </div>
             
              {distMatrix && (
                 <div className="mt-8 overflow-x-auto">
                     <h4 className="font-semibold mb-3 text-sm text-gray-500 uppercase tracking-wider">
                         {matrixType === 'dist' ? 'Distance Matrix' : 'Transitive Closure (Reachability)'}
                     </h4>
                     <table className="w-full text-xs border-collapse">
                         <thead>
                             <tr>
                                 <th className="p-1 border dark:border-gray-700"></th>
                                 {nodes.map(n => <th key={n.id} className="p-1 border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-[10px]">{n.value}</th>)}
                             </tr>
                         </thead>
                         <tbody>
                             {distMatrix.map((row, i) => (
                                 <tr key={i}>
                                     <td className="p-1 border dark:border-gray-700 font-bold bg-gray-100 dark:bg-gray-800 text-center text-[10px]">{nodes[i]?.value}</td>
                                     {row.map((val, j) => (
                                         <td key={j} className={`p-1 border dark:border-gray-700 text-center ${val === Infinity || (matrixType === 'reach' && val === 0) ? 'text-gray-400' : 'text-blue-500 font-medium'}`}>
                                             {val === Infinity ? '∞' : val}
                                         </td>
                                     ))}
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             )}
             
             <div className="mt-8">
                 <h4 className="font-semibold mb-2 text-sm text-gray-500 uppercase tracking-wider">Legend</h4>
                 <div className="space-y-2 text-sm">
                     <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span>Unvisited Node</span></div>
                     <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-pink-500"></div><span>Processing / Current</span></div>
                     <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span>Visited / Explored</span></div>
                     <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400"></div><span>Shortest Path</span></div>
                     {mode === 'mst' && <div className="flex items-center gap-2"><div className="w-8 h-1 bg-green-500"></div><span>MST Edge</span></div>}
                     <div className="flex items-center gap-2"><div className="w-8 h-1 bg-yellow-400"></div><span>Path Edge</span></div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default TreeGraphVisualizer;
