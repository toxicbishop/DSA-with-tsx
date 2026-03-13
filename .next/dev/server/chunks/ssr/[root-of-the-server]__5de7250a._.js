module.exports = [
"[project]/DSA-with-tsx/src/views/HomeView.tsx [ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/DSA-with-tsx/src/views/HomeView.tsx'\n\nExpected a semicolon");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/DSA-with-tsx/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
// Next.js page for Home
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$DSA$2d$with$2d$tsx$2f$src$2f$views$2f$HomeView$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/DSA-with-tsx/src/views/HomeView.tsx [ssr] (ecmascript)");
;
;
;
function Home() {
    // Minimal state for required props
    const [isNotesOpen, setIsNotesOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [completedPrograms, setCompletedPrograms] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    // Stub navigation and handler
    const navigateTo = (view)=>{
        // For demo: just log or use router.push if needed
        // router.push(`/${view}`) if using next/router
        console.log('Navigate to:', view);
    };
    const handleProgramClick = (name)=>{
        // For demo: just log
        console.log('Program clicked:', name);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$DSA$2d$with$2d$tsx$2f$src$2f$views$2f$HomeView$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["HomeView"], {
        navigateTo: navigateTo,
        isNotesOpen: isNotesOpen,
        setIsNotesOpen: setIsNotesOpen,
        completedPrograms: completedPrograms,
        handleProgramClick: handleProgramClick
    }, void 0, false, {
        fileName: "[project]/DSA-with-tsx/pages/index.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5de7250a._.js.map