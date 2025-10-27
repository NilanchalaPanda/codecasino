// components/workspace/playground/console/Console.tsx
"use client";
import React, { useState, memo } from 'react';

type Props = {
    handleRun: () => void;
    handleSubmit: () => void;
    output: string | null;
    isExecuting?: boolean;
};

const UserConsole = ({ handleRun, handleSubmit, output, isExecuting = false }: Props) => {
    const [showOutput, setShowOutput] = useState(false);

    return (
        <div className="w-full">
            {/* Control Buttons */}
            <div className="flex justify-between items-center p-3 bg-[var(--color-gray-700)]">
                <div className="flex gap-3">
                    <button
                        onClick={handleRun}
                        disabled={isExecuting}
                        className="px-6 py-2 rounded-lg font-medium text-sm transition-all transform hover:scale-105
                       bg-[var(--color-gray-600)] text-[var(--foreground)] 
                       hover:bg-[var(--color-cyan)] hover:text-[var(--color-gray-900)]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                       border border-[var(--color-gray-500)] hover:border-[var(--color-cyan)]
                       shadow-lg hover:shadow-cyan-500/50"
                    >
                        {isExecuting ? '⏳ Running...' : '▶️ Run Code'}
                    </button>

                    <button
                        onClick={() => setShowOutput(!showOutput)}
                        className="px-4 py-2 rounded-lg font-medium text-sm transition-all
                       bg-[var(--color-gray-600)] text-[var(--foreground)] 
                       hover:bg-[var(--color-gray-500)]
                       border border-[var(--color-gray-500)]"
                    >
                        {showOutput ? '▼ Hide Output' : '▶ Show Output'}
                    </button>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isExecuting}
                    className="px-8 py-2 rounded-lg font-bold text-sm transition-all transform hover:scale-105
                     bg-gradient-to-r from-[var(--color-cyan)] to-[#00ff88] 
                     text-[var(--color-gray-900)]
                     hover:shadow-2xl hover:shadow-cyan-500/50
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                     animate-pulse-slow"
                >
                    {isExecuting ? '📤 Submitting...' : '✅ Submit Solution'}
                </button>
            </div>

            {/* Output Panel */}
            {showOutput && output && (
                <div className="p-4 bg-[var(--color-gray-800)] border-t border-[var(--color-gray-600)]">
                    <div className="bg-[var(--color-gray-900)] rounded-lg p-4 font-mono text-sm 
                          text-[var(--foreground)] overflow-auto max-h-64
                          border border-[var(--color-gray-600)]">
                        <pre className="whitespace-pre-wrap">{output}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(UserConsole);