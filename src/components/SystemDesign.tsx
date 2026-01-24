import React from 'react';
import { Server, Database, GitBranch, Layers, Search, ArrowRightLeft, Activity, Globe } from 'lucide-react';

export const SystemDesign: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-16 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-4 pb-8">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">
                    DSA in System Design
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    Bridge the gap between theoretical algorithms and real-world scalable systems.
                </p>
            </div>

            {/* NEW: System Design Essentials Overview */}
            <section className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg text-white">
                        <Server size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Design Essentials</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Scalability */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-600 dark:text-orange-400">
                            <ArrowRightLeft size={18} /> Scalability
                        </h3>
                        <ul className="list-disc pl-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li><b>Vertical Scaling:</b> Add more power to a single server.</li>
                            <li><b>Horizontal Scaling:</b> Add more servers to distribute load.</li>
                            <li><b>Load Balancing:</b> Distribute traffic for reliability and speed.</li>
                        </ul>
                        <div className="flex justify-center mt-6">
                            {/* Visual: Scaling - LB to multiple nodes */}
                            <svg width="100%" height="80" viewBox="0 0 240 60" className="max-w-[320px]">
                                <defs>
                                    <marker id="arrow-orange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
                                    </marker>
                                </defs>
                                {/* Load Balancer */}
                                <rect x="20" y="10" width="40" height="40" rx="6" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
                                <text x="40" y="34" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">LB</text>
                                
                                {/* Servers */}
                                <g transform="translate(180, 0)">
                                    <rect x="0" y="5" width="30" height="14" rx="2" fill="#fed7aa" stroke="#f97316" />
                                    <rect x="0" y="23" width="30" height="14" rx="2" fill="#fed7aa" stroke="#f97316" />
                                    <rect x="0" y="41" width="30" height="14" rx="2" fill="#fed7aa" stroke="#f97316" />
                                </g>

                                {/* Connections */}
                                <path d="M 60 30 C 120 30, 120 12, 174 12" stroke="#f97316" strokeWidth="2" fill="none" markerEnd="url(#arrow-orange)" className="opacity-80" />
                                <path d="M 60 30 L 174 30" stroke="#f97316" strokeWidth="2" fill="none" markerEnd="url(#arrow-orange)" className="opacity-80" />
                                <path d="M 60 30 C 120 30, 120 48, 174 48" stroke="#f97316" strokeWidth="2" fill="none" markerEnd="url(#arrow-orange)" className="opacity-80" />
                            </svg>
                        </div>
                    </div>
                    {/* Caching */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-pink-500">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-pink-600 dark:text-pink-400">
                            <Layers size={18} /> Caching
                        </h3>
                        <ul className="list-disc pl-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>Reduce database load and speed up responses.</li>
                            <li>Types: <b>In-memory</b> (Redis), <b>Distributed</b> (Memcached).</li>
                            <li>Cache Invalidation: <b>LRU</b>, <b>TTL</b>, <b>Write-through</b>.</li>
                        </ul>
                        <div className="flex justify-center mt-6">
                            {/* Visual: Caching Layer */}
                            <svg width="100%" height="80" viewBox="0 0 240 60" className="max-w-[320px]">
                                <defs>
                                    <marker id="arrow-pink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#ec4899" />
                                    </marker>
                                    <marker id="arrow-gray" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
                                    </marker>
                                </defs>
                                
                                {/* App */}
                                <rect x="10" y="15" width="40" height="30" rx="4" fill="#64748b" stroke="#475569" />
                                <text x="30" y="34" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">App</text>
                                
                                {/* Cache */}
                                <rect x="90" y="5" width="50" height="25" rx="4" fill="#ec4899" stroke="#be185d" />
                                <text x="115" y="21" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">Cache</text>
                                
                                {/* DB */}
                                <rect x="180" y="15" width="40" height="30" rx="4" fill="#3b82f6" stroke="#2563eb" />
                                <text x="200" y="34" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">DB</text>
                                
                                {/* Flows */}
                                {/* To Cache */}
                                <path d="M 50 25 C 65 25, 75 17, 84 17" stroke="#ec4899" strokeWidth="2" fill="none" markerEnd="url(#arrow-pink)" />
                                {/* Cache Hit/Back */}
                                <path d="M 84 17 C 75 17, 65 20, 50 20" stroke="#ec4899" strokeWidth="2" fill="none" strokeDasharray="3,2" className="opacity-60" />

                                {/* To DB (Miss) */}
                                <path d="M 50 35 L 174 35" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrow-gray)" strokeDasharray="4,2" />
                            </svg>
                        </div>
                    </div>
                    {/* Message Queues */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <GitBranch size={18} /> Message Queues
                        </h3>
                        <ul className="list-disc pl-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>Decouple services for reliability and scaling.</li>
                            <li>Examples: <b>Kafka</b>, <b>RabbitMQ</b>, <b>SQS</b>.</li>
                            <li>Patterns: <b>Pub/Sub</b>, <b>Event Sourcing</b>.</li>
                        </ul>
                        <div className="flex justify-center mt-6">
                            {/* Visual: Message Queue */}
                            <svg width="100%" height="80" viewBox="0 0 240 60" className="max-w-[320px]">
                                <defs>
                                    <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                                    </marker>
                                </defs>
                                
                                {/* Prod */}
                                <rect x="10" y="20" width="35" height="20" rx="4" fill="#10b981" />
                                <text x="27" y="34" fontSize="8" fill="white" textAnchor="middle">Pub</text>
                                
                                {/* Queue Tube */}
                                <path d="M 70 20 L 170 20" stroke="#3b82f6" strokeWidth="2" />
                                <path d="M 70 40 L 170 40" stroke="#3b82f6" strokeWidth="2" />
                                <ellipse cx="170" cy="30" rx="5" ry="10" fill="#3b82f6" opacity="0.2" />
                                <path d="M 70 20 A 5 10 0 0 0 70 40" stroke="#3b82f6" strokeWidth="2" fill="none" />
                                
                                {/* Messages */}
                                <rect x="80" y="24" width="12" height="12" rx="2" fill="#facc15" stroke="#eab308" />
                                <rect x="100" y="24" width="12" height="12" rx="2" fill="#facc15" stroke="#eab308" />
                                <rect x="120" y="24" width="12" height="12" rx="2" fill="#facc15" stroke="#eab308" />

                                {/* Cons */}
                                <rect x="195" y="20" width="35" height="20" rx="4" fill="#8b5cf6" />
                                <text x="212" y="34" fontSize="8" fill="white" textAnchor="middle">Sub</text>
                                
                                {/* Arrows */}
                                <path d="M 45 30 L 64 30" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)" />
                                <path d="M 175 30 L 189 30" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)" />
                            </svg>
                        </div>
                    </div>
                    {/* API Design */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                            <Server size={18} /> API Design
                        </h3>
                        <ul className="list-disc pl-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>RESTful, GraphQL, gRPC.</li>
                            <li>Versioning, Rate Limiting, Auth (OAuth, JWT).</li>
                            <li>Security: HTTPS, CORS, Input Validation.</li>
                        </ul>
                        <div className="flex justify-center mt-6">
                            {/* Visual: API Gateway */}
                            <svg width="100%" height="80" viewBox="0 0 240 60" className="max-w-[320px]">
                                <defs>
                                    <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                                    </marker>
                                </defs>
                                
                                {/* Client */}
                                <circle cx="20" cy="30" r="10" fill="#64748b" />
                                <path d="M 15 30 L 25 30 M 20 25 L 20 35" stroke="white" strokeWidth="2" />
                                
                                {/* Gateway */}
                                <rect x="60" y="10" width="80" height="40" rx="4" fill="white" stroke="#10b981" strokeWidth="2" />
                                <text x="100" y="28" fontSize="10" fill="#10b981" textAnchor="middle" fontWeight="bold">API Gateway</text>
                                <g opacity="0.5">
                                    <circle cx="75" cy="40" r="2" fill="#10b981" />
                                    <circle cx="85" cy="40" r="2" fill="#10b981" />
                                    <circle cx="95" cy="40" r="2" fill="#10b981" />
                                </g>

                                {/* Service */}
                                <rect x="180" y="15" width="40" height="30" rx="4" fill="#10b981" />
                                <text x="200" y="34" fontSize="10" fill="white" textAnchor="middle">API</text>
                                
                                {/* Flow */}
                                <path d="M 30 30 L 54 30" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-green)" />
                                <path d="M 140 30 L 174 30" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-green)" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>


            {/* Section 1: Data Structure Trade-offs */}
            <section className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <ArrowRightLeft size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trade-offs: When to use what?</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Case Study 1 */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                             <Database size={18} /> Array vs Linked List: Music Playlist
                        </h3>
                        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                            <div>
                                <strong className="text-gray-900 dark:text-white block mb-1">Scenario:</strong>
                                A music player queue where users frequently skip songs (next/prev) and add songs to the middle.
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <strong className="text-green-600 dark:text-green-400">Why Linked List (Doubly)?</strong>
                                <ul className="list-disc pl-4 mt-1 space-y-1">
                                    <li><strong>O(1)</strong> insertion/deletion of songs anywhere (if we have a reference).</li>
                                    <li>Easy "Previous" and "Next" pointers for navigation.</li>
                                    <li>No need for contiguous memory (playlists can be huge).</li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <strong className="text-red-500 dark:text-red-400">Why not Array?</strong>
                                <ul className="list-disc pl-4 mt-1 space-y-1">
                                    <li><strong>O(n)</strong> shifting required when adding/removing from middle.</li>
                                    <li>Fixed size (in some languages) or expensive resizing.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Case Study 2 */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                             <Search size={18} /> HashMap vs Trie: Autocomplete
                        </h3>
                        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                            <div>
                                <strong className="text-gray-900 dark:text-white block mb-1">Scenario:</strong>
                                A search bar suggesting completions for "Alg...".
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <strong className="text-green-600 dark:text-green-400">Why Trie?</strong>
                                <ul className="list-disc pl-4 mt-1 space-y-1">
                                    <li>Supports prefix-based search efficiently (O(L) where L is word length).</li>
                                    <li>Can save space by sharing common prefixes (e.g., "apple", "app").</li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <strong className="text-red-500 dark:text-red-400">Why not HashMap?</strong>
                                <ul className="list-disc pl-4 mt-1 space-y-1">
                                    <li>Cannot easily find "all keys starting with 'alg'".</li>
                                    <li>Would require scanning all keys O(N) to filter.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: System Design Snippets */}
            <section className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                        <Server size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Design Snippets</h2>
                </div>

                <div className="space-y-6">
                     {/* Consistent Hashing */}
                    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-400 to-pink-500"></div>
                        
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <GitBranch className="text-orange-500" /> Consistent Hashing
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Used in Load Balancers and Distributed Caches (like DynamoDB, Cassandra).
                                </p>
                                <div className="space-y-2 text-sm">
                                    <p><strong className="text-orange-500">Concept:</strong> It's essentially a BST or Circular Linked List!</p>
                                    <p>Nodes are placed on a "ring" (0-360°). A key maps to a point on the ring, and the "owner" is the stored node found by moving clockwise (Next Greater Element).</p>
                                    <p className="mt-2 text-gray-500"><em>When a node is added/removed, only k/N keys need to be remapped, unlike Modulo Hashing where almost ALL keys move.</em></p>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 min-h-[220px]">
                                {/* Simple Visualization of a Ring */}
                                <svg viewBox="0 0 200 200" className="w-56 h-56">
                                    <defs>
                                        <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                            <path d="M 0 0 L 10 5 L 0 10 z" fill="red" />
                                        </marker>
                                    </defs>
                                    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-gray-600" />
                                    {/* Nodes */}
                                    <circle cx="100" cy="20" r="8" className="fill-blue-500" />
                                    <text x="115" y="25" fontSize="12" className="fill-gray-500">Node A</text>
                                    
                                    <circle cx="180" cy="100" r="8" className="fill-green-500" />
                                    <text x="150" y="125" fontSize="12" className="fill-gray-500">Node B</text>
                                    
                                    <circle cx="60" cy="170" r="8" className="fill-purple-500" />
                                    <text x="20" y="180" fontSize="12" className="fill-gray-500">Node C</text>

                                    {/* Data Item */}
                                    <circle cx="160" cy="60" r="4" className="fill-red-500 animate-ping" />
                                    <path d="M 160 60 A 80 80 0 0 1 180 100" stroke="red" strokeWidth="2" strokeDasharray="4" fill="none" markerEnd="url(#arrow-red)" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Bloom Filters */}
                    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-indigo-500"></div>
                        
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Layers className="text-blue-500" /> Bloom Filters
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Probabilistic data structure used for caching (e.g., checking if a username is taken, preventing one-hit-wonders in caches).
                                </p>
                                <div className="space-y-2 text-sm">
                                    <p><strong className="text-blue-500">Concept:</strong> A massive Bit Array + Multiple Hash Functions.</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>To add item: Hash it K times, set those bits to 1.</li>
                                        <li>To check item: Hash it K times. If ALL bits are 1, it <em>might</em> exist. If ANY bit is 0, it <strong>definitely does not</strong> exist.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 min-h-[180px]">
                                <div className="space-y-4 w-full max-w-xs overflow-hidden">
                                     <div className="flex justify-between text-xs text-gray-500 font-mono">
                                         <span>0</span><span>...</span><span>N</span>
                                     </div>
                                     <div className="flex gap-1.5 h-12">
                                         {[0,1,1,0,1,0,0,1,1,0,1,0].map((bit, i) => (
                                             <div key={i} className={`flex-1 rounded-md shadow-sm ${bit ? 'bg-blue-500 animate-pulse' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                         ))}
                                     </div>
                                     <div className="text-center text-sm font-bold text-gray-400 mt-2 uppercase tracking-tighter">Probabilistic Bit Array</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rate Limiting */}
                    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-400 to-teal-500"></div>
                        
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Activity className="text-green-500" /> Rate Limiting (Token Bucket)
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Controls the rate of traffic sent or received by a network interface.
                                </p>
                                <div className="space-y-2 text-sm">
                                    <p><strong className="text-green-500">How it works:</strong> A bucket holds tokens. Each request consumes one token.</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Tokens are added at a fixed rate.</li>
                                        <li>If the bucket is full, new tokens are discarded.</li>
                                        <li>Allows for small bursts of traffic while maintaining a steady average rate.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 min-h-[200px]">
                                <svg width="240" height="180" viewBox="0 0 160 120" className="drop-shadow-2xl">
                                    {/* Bucket */}
                                    <path d="M 40 30 L 120 30 L 110 100 L 50 100 Z" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                                    {/* Tokens */}
                                    <circle cx="80" cy="85" r="8" fill="#10b981" />
                                    <circle cx="65" cy="70" r="8" fill="#10b981" opacity="0.8" />
                                    <circle cx="95" cy="70" r="8" fill="#10b981" opacity="0.8" />
                                    <circle cx="80" cy="55" r="8" fill="#10b981" opacity="0.6" />
                                    {/* Falling Token */}
                                    <circle cx="80" cy="10" r="8" fill="#10b981" className="animate-bounce" />
                                    {/* Exit Arrow */}
                                    <path d="M 80 100 L 80 115" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)" />
                                    <text x="100" y="115" fontSize="8" fill="#ef4444" fontWeight="bold">Req Processed</text>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* CDN (Content Delivery Network) */}
                    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-cyan-500"></div>
                        
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Globe className="text-blue-500" /> CDN (Content Delivery Network)
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Geographically distributed group of servers that work together to provide fast delivery of Internet content.
                                </p>
                                <div className="space-y-2 text-sm">
                                    <p><strong className="text-blue-500">Benefits:</strong> Lowers latency by reducing the distance between the user and the server.</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li><b>Edge Servers:</b> Store cached content close to users.</li>
                                        <li><b>Origin Server:</b> The main source of content.</li>
                                        <li>Handles static assets (JS, CSS, Images, Videos).</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 min-h-[220px]">
                                <svg width="280" height="180" viewBox="0 0 180 120" className="drop-shadow-xl">
                                    {/* Origin Server */}
                                    <rect x="70" y="5" width="40" height="25" rx="4" fill="#3b82f6" />
                                    <text x="90" y="21" fontSize="9" fill="white" textAnchor="middle" fontWeight="bold">Origin</text>
                                    
                                    {/* Edge Servers */}
                                    <g>
                                        <rect x="10" y="65" width="40" height="25" rx="4" fill="#06b6d4" />
                                        <text x="30" y="81" fontSize="7" fill="white" textAnchor="middle" fontWeight="bold">US-East</text>
                                        
                                        <rect x="70" y="75" width="40" height="25" rx="4" fill="#06b6d4" />
                                        <text x="90" y="91" fontSize="7" fill="white" textAnchor="middle" fontWeight="bold">EU-West</text>
                                        
                                        <rect x="130" y="65" width="40" height="25" rx="4" fill="#06b6d4" />
                                        <text x="150" y="81" fontSize="7" fill="white" textAnchor="middle" fontWeight="bold">ASIA-S</text>
                                    </g>
                                    
                                    {/* Connections */}
                                    <path d="M 70 20 L 40 65" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
                                    <path d="M 90 30 L 92 75" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
                                    <path d="M 110 20 L 140 65" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
                                    
                                    {/* User to nearest Edge */}
                                    <circle cx="30" cy="110" r="4" fill="#64748b" />
                                    <text x="45" y="113" fontSize="8" fill="#64748b" fontWeight="bold">User</text>
                                    <path d="M 30 105 L 30 95" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow-green)" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Load Balancing Algorithms */}
                    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-500 to-yellow-500"></div>
                        
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <ArrowRightLeft className="text-orange-500" /> Load Balancing Algorithms
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                                    How a load balancer decides which server should handle the incoming request.
                                </p>
                                <div className="space-y-4 text-sm">
                                    <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-lg border border-orange-100 dark:border-orange-900/30">
                                        <p><strong className="text-orange-600 dark:text-orange-400">Round Robin:</strong> Cycles through all servers sequentially. Best when servers have equal capacity.</p>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                        <p><strong className="text-blue-600 dark:text-blue-400">Least Connections:</strong> Sends traffic to the server with fewest active requests. Ideal for long-lived connections.</p>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-lg border border-purple-100 dark:border-purple-900/30">
                                        <p><strong className="text-purple-600 dark:text-purple-400">IP Hashing:</strong> Uses client's IP to consistently map to the same server (Sticky Sessions).</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 min-h-[220px]">
                                <svg width="280" height="200" viewBox="0 0 160 120">
                                    {/* LB Node */}
                                    <rect x="10" y="45" width="40" height="30" rx="4" fill="#f97316" className="drop-shadow-lg" />
                                    <text x="30" y="65" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">LB</text>
                                    
                                    {/* Server Nodes */}
                                    <g transform="translate(100, 10)">
                                        <rect x="0" y="0" width="50" height="25" rx="4" fill="#3b82f6" />
                                        <text x="25" y="16" fontSize="8" fill="white" textAnchor="middle">Server 1</text>
                                        <circle cx="5" cy="5" r="3" fill="#ef4444" className="animate-pulse" /> {/* High load indicator */}
                                        
                                        <rect x="0" y="40" width="50" height="25" rx="4" fill="#3b82f6" />
                                        <text x="25" y="56" fontSize="8" fill="white" textAnchor="middle">Server 2</text>
                                        
                                        <rect x="0" y="80" width="50" height="25" rx="4" fill="#3b82f6" />
                                        <text x="25" y="96" fontSize="8" fill="white" textAnchor="middle">Server 3</text>
                                    </g>

                                    {/* Animated Request Lines */}
                                    <path d="M 50 60 C 70 60, 80 22, 100 22" stroke="#94a3b8" strokeWidth="2" fill="none" strokeDasharray="4,4" className="opacity-40" />
                                    <path d="M 50 60 L 100 60" stroke="#f97316" strokeWidth="3" fill="none" markerEnd="url(#arrow-orange)" className="animate-dash" />
                                    <path d="M 50 60 C 70 60, 80 98, 100 98" stroke="#94a3b8" strokeWidth="2" fill="none" strokeDasharray="4,4" className="opacity-40" />
                                    
                                    <text x="75" y="115" fontSize="7" fill="#f97316" textAnchor="middle" className="italic font-bold">Round Robin Dispatching...</text>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Database Scaling */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                             <Database size={18} /> Database Scaling: Up vs Out
                        </h3>
                         <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                                <div className="bg-purple-50 dark:bg-gray-700/30 p-4 rounded-lg">
                                    <strong className="text-purple-600 dark:text-purple-400 text-base">Vertical (Scaling Up)</strong>
                                    <p className="mt-2 mb-2">Buying a bigger machine (more RAM, 128 Core CPU).</p>
                                    <ul className="list-disc pl-4 space-y-1 text-xs opacity-80">
                                        <li>✅ Simplest to implement (no code change).</li>
                                        <li>❌ Limited by hardware caps (~$ cost).</li>
                                        <li>❌ Single Point of Failure.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                                <div className="bg-blue-50 dark:bg-gray-700/30 p-4 rounded-lg">
                                    <strong className="text-blue-600 dark:text-blue-400 text-base">Horizontal (Scaling Out)</strong>
                                    <p className="mt-2 mb-2">Adding more mid-range machines to a cluster.</p>
                                    <ul className="list-disc pl-4 space-y-1 text-xs opacity-80">
                                        <li>✅ Theoretically infinite scale.</li>
                                        <li>✅ High Availability / Resilience.</li>
                                        <li>❌ Complexity (Load Balancing, Sharding req).</li>
                                    </ul>
                                </div>
                            </div>
                         </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default SystemDesign;
