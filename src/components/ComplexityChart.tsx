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
      case 'cocktail':
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
      case 'radix':
      case 'bucket':
        return {
          time: 'O(nk)',
          space: 'O(n+k)',
          activeCurve: 'linear',
          label: 'Linear-ish'
        };
      case 'comb':
      case 'shell':
        return {
          time: 'O(n log n)',
          space: 'O(1)',
          activeCurve: 'loglinear',
          label: 'Log-Linear'
        };
      case 'bogo':
        return {
          time: 'O((n+1)!)',
          space: 'O(1)',
          activeCurve: 'factorial',
          label: 'Factorial'
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
      const y = Math.min(1.2, fn(x) * scaleY); // Cap y for visuals
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
  const factorialPoints = generatePoints(x => x < 0.2 ? 0 : Math.pow(x * 5, x * 5) / 3000); // Rough steep curve for factorial

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
          {/* Labels */}
          <text x="290" y="195" className="text-xs font-medium fill-gray-600 dark:fill-gray-300" textAnchor="end">n (Elements)</text>
          <text x="10" y="90" className="text-xs font-medium fill-gray-600 dark:fill-gray-300" textAnchor="middle" transform="rotate(-90, 10, 90)">Operations</text>

          {/* Curves */}
          
          {/* O(n!) - Factorial */}
          <polyline 
            points={factorialPoints} 
            fill="none" 
            stroke={info.activeCurve === 'factorial' ? '#ef4444' : '#fecaca'} 
            strokeWidth={info.activeCurve === 'factorial' ? 3 : 1}
            strokeDasharray={info.activeCurve === 'factorial' ? "0" : "2"}
            className="transition-all duration-300"
          />
          <text x="50" y="20" className={`text-xs font-bold transition-colors duration-300 ${info.activeCurve === 'factorial' ? 'fill-red-500' : 'fill-gray-400 dark:fill-gray-400'}`}>O(n!)</text>

          {/* O(n^2) - Quadratic */}
          <polyline 
            points={quadraticPoints} 
            fill="none" 
            stroke={info.activeCurve === 'quadratic' ? '#ec4899' : '#e5e7eb'} 
            strokeWidth={info.activeCurve === 'quadratic' ? 3 : 2}
            className="transition-all duration-300"
          />
          <text x="160" y="60" className={`text-xs font-bold transition-colors duration-300 ${info.activeCurve === 'quadratic' ? 'fill-pink-500' : 'fill-gray-400 dark:fill-gray-400'}`}>O(n²)</text>

          {/* O(n log n) */}
          <polyline 
            points={logLinearPoints} 
            fill="none" 
            stroke={info.activeCurve === 'loglinear' ? '#ec4899' : '#e5e7eb'} 
            strokeWidth={info.activeCurve === 'loglinear' ? 3 : 2}
             className="transition-all duration-300"
          />
           <text x="200" y="110" className={`text-xs font-bold transition-colors duration-300 ${info.activeCurve === 'loglinear' ? 'fill-pink-500' : 'fill-gray-400 dark:fill-gray-400'}`}>O(n log n)</text>

          {/* O(n) - Linear */}
          <polyline 
            points={linearPoints} 
            fill="none" 
            stroke={info.activeCurve === 'linear' ? '#10b981' : '#e5e7eb'} 
            strokeWidth={info.activeCurve === 'linear' ? 3 : 2}
            strokeDasharray={info.activeCurve === 'linear' ? "0" : "4"}
          />
           <text x="270" y="170" className={`text-xs font-bold transition-colors duration-300 ${info.activeCurve === 'linear' ? 'fill-emerald-500' : 'fill-gray-400 dark:fill-gray-500'}`}>O(n)</text>

        </svg>

        {/* Legend/Key that could overlay or sit beside if needed, currently embedded in title */}
      </div>
    </div>
  );
};

export default ComplexityChart;
