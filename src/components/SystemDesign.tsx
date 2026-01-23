import React from 'react';
import { Server, Database, GitBranch, Layers, Search, ArrowRightLeft } from 'lucide-react';

export const SystemDesign: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-16 animate-fade-in">
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
                        <div className="flex justify-center mt-4">
                            {/* Visual: Scaling Arrows */}
                            <svg width="120" height="40" viewBox="0 0 120 40">
                                <rect x="10" y="20" width="20" height="10" fill="#f59e42" />
                                <rect x="40" y="10" width="20" height="20" fill="#f59e42" />
                                <rect x="70" y="5" width="20" height="30" fill="#f59e42" />
                                <text x="10" y="38" fontSize="10" fill="#888">Vertical</text>
                                <rect x="100" y="20" width="10" height="10" fill="#6366f1" />
                                <rect x="100" y="5" width="10" height="10" fill="#6366f1" />
                                <text x="90" y="38" fontSize="10" fill="#888">Horizontal</text>
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
                        <div className="flex justify-center mt-4">
                            {/* Visual: Cache Hit/Miss */}
                            <svg width="120" height="40" viewBox="0 0 120 40">
                                <circle cx="30" cy="20" r="10" fill="#f472b6" />
                                <text x="22" y="25" fontSize="10" fill="#fff">Cache</text>
                                <rect x="60" y="15" width="30" height="10" fill="#6366f1" />
                                <text x="65" y="23" fontSize="10" fill="#fff">DB</text>
                                <line x1="40" y1="20" x2="60" y2="20" stroke="#f59e42" strokeWidth="2" markerEnd="url(#arrow)" />
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
                        <div className="flex justify-center mt-4">
                            {/* Visual: Queue Arrows */}
                            <svg width="120" height="40" viewBox="0 0 120 40">
                                <rect x="10" y="15" width="20" height="10" fill="#6366f1" />
                                <rect x="40" y="15" width="20" height="10" fill="#6366f1" />
                                <rect x="70" y="15" width="20" height="10" fill="#6366f1" />
                                <line x1="30" y1="20" x2="40" y2="20" stroke="#f59e42" strokeWidth="2" markerEnd="url(#arrow)" />
                                <line x1="60" y1="20" x2="70" y2="20" stroke="#f59e42" strokeWidth="2" markerEnd="url(#arrow)" />
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
                        <div className="flex justify-center mt-4">
                            {/* Visual: API Flow */}
                            <svg width="120" height="40" viewBox="0 0 120 40">
                                <rect x="10" y="15" width="20" height="10" fill="#34d399" />
                                <rect x="50" y="15" width="20" height="10" fill="#6366f1" />
                                <rect x="90" y="15" width="20" height="10" fill="#f59e42" />
                                <line x1="30" y1="20" x2="50" y2="20" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrow)" />
                                <line x1="70" y1="20" x2="90" y2="20" stroke="#f59e42" strokeWidth="2" markerEnd="url(#arrow)" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                    DSA in System Design
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Bridge the gap between theoretical algorithms and real-world scalable systems.
                </p>
            </div>

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
                            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                                {/* Simple Visualization of a Ring */}
                                <svg viewBox="0 0 200 200" className="w-48 h-48">
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
                                    <path d="M 160 60 A 80 80 0 0 1 180 100" stroke="red" strokeWidth="2" strokeDasharray="4" fill="none" markerEnd="url(#arrow)" />
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
                            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                                <div className="space-y-2 w-full max-w-xs overflow-hidden">
                                     <div className="flex justify-between text-xs text-gray-500">
                                         <span>0</span><span>...</span><span>N</span>
                                     </div>
                                     <div className="flex gap-1 h-8">
                                         {[0,1,1,0,1,0,0,1,1,0,1,0].map((bit, i) => (
                                             <div key={i} className={`flex-1 rounded-sm ${bit ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                         ))}
                                     </div>
                                     <div className="text-center text-xs text-gray-500 mt-2">Bit Array</div>
                                </div>
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
