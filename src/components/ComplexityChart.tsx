import React from 'react';

interface ComplexityChartProps {
  algorithm: string;
}

const ComplexityChart: React.FC<ComplexityChartProps> = ({ algorithm }) => {
  const getComplexityInfo = (algo: string) => {
    switch (algo) {
      case 'bubble':
      case 'selection':
      case 'insertion':
        return {
          time: 'O(n²)',
          space: 'O(1)',
          activeCurve: 'quadratic',
          label: 'Quadratic'
        };
      case 'merge':
        return {
          time: 'O(n log n)',
          space: 'O(n)',
          activeCurve: 'loglinear',
          label: 'Log-Linear'
        };
      case 'quick':
        return {
          time: 'O(n log n)',
          space: 'O(log n)',
          activeCurve: 'loglinear',
          label: 'Log-Linear'
        };
      case 'heap':
        return {
          time: 'O(n log n)',
          space: 'O(1)',
          activeCurve: 'loglinear',
          label: 'Log-Linear'
        };
      default:
        return {
          time: 'Unknown',
          space: 'Unknown',
          activeCurve: '',
          label: ''
        };
    }
  };

  const info = getComplexityInfo(algorithm);

  const generatePoints = (fn: (x: number) => number, scaleY: number = 1) => {
    const points = [];
    const width = 280;
    const height = 180;
    const padding = 20; // Left/Bottom padding

    // range x from 0 to 1
    // range y from 0 to 1
    for (let x = 0; x <= 1; x += 0.05) {
      const y = fn(x) * scaleY;
      const svgX = padding + x * (width - padding);
      const svgY = height - padding - y * (height - padding);
      points.push(`${svgX},${svgY}`);
    }
    return points.join(' ');
  };

  // Normalized functions for 0..1 range
  const linearPoints = generatePoints(x => x);
  // n log n normalized roughly. n=1 => 0. n=10 => 10*3.3 ~ 33
  // Let's just use power approximation for visuals
  const logLinearPoints = generatePoints(x => x === 0 ? 0 : x * (1 + Math.log2(1 + x * 8)) / 4 ); 
  const quadraticPoints = generatePoints(x => x * x);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full mt-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center justify-between">
        <span>Complexity Analysis</span>
        <div className="flex gap-4 text-sm font-normal">
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-100 dark:border-indigo-800">
                Time: <b>{info.time}</b>
            </span>
            <span className="px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full border border-teal-100 dark:border-teal-800">
                Space: <b>{info.space}</b>
            </span>
        </div>
      </h3>

      <div className="relative h-64 w-full">
        <svg viewBox="0 0 300 200" className="w-full h-full overflow-visible">
          {/* Axes */}
          <line x1="20" y1="180" x2="300" y2="180" stroke="#9ca3af" strokeWidth="2" />
          <line x1="20" y1="180" x2="20" y2="0" stroke="#9ca3af" strokeWidth="2" />
          
          {/* Labels */}
          <text x="290" y="195" className="text-[10px] fill-gray-500">n (Elements)</text>
          <text x="5" y="10" className="text-[10px] fill-gray-500" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', transformOrigin: 'center' }}>Operations</text>

          {/* Curves */}
          
          {/* O(n^2) - Quadratic */}
          <polyline 
            points={quadraticPoints} 
            fill="none" 
            stroke={info.activeCurve === 'quadratic' ? '#ec4899' : '#e5e7eb'} 
            strokeWidth={info.activeCurve === 'quadratic' ? 3 : 2}
            className="transition-all duration-300"
          />
          <text x="250" y="30" fill={info.activeCurve === 'quadratic' ? '#ec4899' : '#9ca3af'} className="text-[10px]">O(n²)</text>

          {/* O(n log n) */}
          <polyline 
            points={logLinearPoints} 
            fill="none" 
            stroke={info.activeCurve === 'loglinear' ? '#ec4899' : '#e5e7eb'} 
            strokeWidth={info.activeCurve === 'loglinear' ? 3 : 2}
             className="transition-all duration-300"
          />
           <text x="260" y="100" fill={info.activeCurve === 'loglinear' ? '#ec4899' : '#9ca3af'} className="text-[10px]">O(n log n)</text>

          {/* O(n) - Linear */}
          <polyline 
            points={linearPoints} 
            fill="none" 
            stroke="#e5e7eb" 
            strokeWidth="2"
            strokeDasharray="4"
          />
           <text x="270" y="170" fill="#9ca3af" className="text-[10px]">O(n)</text>

        </svg>

        {/* Legend/Key that could overlay or sit beside if needed, currently embedded in title */}
      </div>
    </div>
  );
};

export default ComplexityChart;
