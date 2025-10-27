// "use client";
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { Problem } from '@/lib/types/ide';

// type Props = {
//     problems: Problem[];
// };

// const ProblemDescription = ({ problems }: Props) => {
//     const params = useParams<any>();
//     const [clickedProblems, setClickedProblems] = useState<Problem>();
//     const [difficultyColors] = useState([
//         { type: 'Hard', textColor: 'text-red-200', bgColor: 'bg-red-500' },
//         { type: 'Medium', textColor: 'text-orange-200', bgColor: 'bg-orange-500' },
//         { type: 'Easy', textColor: 'text-lime-200', bgColor: 'bg-lime-500' },
//     ]);

//     useEffect(() => {
//         if (problems) {
//             const problem = problems.find(p => p.id === params.id);
//             if (problem) {
//                 setClickedProblems(problem);
//             } else if (problems.length > 0) {
//                 setClickedProblems(problems[0]);
//             }
//         }
//     }, [problems, params.id]);

//     return (
//         <div className="bg-[var(--color-gray-700)] h-full">
//             <div className="flex h-11 w-full items-center pt-2 bg-[var(--color-gray-600)] text-[var(--foreground)] overflow-x-hidden overflow-y-auto">
//                 <div className="bg-[var(--color-gray-700)] rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer">
//                     Description
//                 </div>
//             </div>
//             <div className="bg-[var(--color-gray-700)] h-[calc(100%-2.75rem)] overflow-y-auto">
//                 <div className="text-lg text-[var(--foreground)] p-5">
//                     {clickedProblems?.order}. {clickedProblems?.title}
//                 </div>
//                 <div className="flex items-center justify-start m-2">
//                     <div className={`mx-4 px-4 py-1 w-15 rounded-full backdrop-blur-sm text-base
//             ${difficultyColors.find(d => d.type === clickedProblems?.difficulty)?.bgColor}
//             ${difficultyColors.find(d => d.type === clickedProblems?.difficulty)?.textColor}`}>
//                         {clickedProblems?.difficulty}
//                     </div>
//                 </div>
//                 <div className="px-5 py-2 text-[var(--foreground)]">
//                     <div dangerouslySetInnerHTML={{ __html: clickedProblems?.problemStatement || '' }} />
//                 </div>
//                 <div className="mt-4 px-5">
//                     {clickedProblems?.examples.map((example, index) => (
//                         <div key={index} className="mb-4">
//                             <p className="font-medium text-[var(--foreground)]">Example {index + 1}:</p>
//                             <div className="example-card p-4 bg-[var(--color-gray-800)] rounded-lg">
//                                 <pre className="text-[var(--foreground)]">
//                                     <strong>Input: </strong> {example.inputText}<br />
//                                     <strong>Output:</strong> {example.outputText}<br />
//                                     {example.explanation && (
//                                         <>
//                                             <strong>Explanation: </strong> {example.explanation}
//                                         </>
//                                     )}
//                                 </pre>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//                 <div className="px-5 py-2 text-[var(--foreground)]">
//                     {clickedProblems?.constraints && (
//                         <>
//                             <p className="font-medium">Constraints:</p>
//                             <div className="m-5" dangerouslySetInnerHTML={{ __html: clickedProblems?.constraints || '' }} />
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProblemDescription;



// components/workspace/problemDescription/ProblemDescription.tsx
"use client";
import React, { useEffect, useState, memo } from 'react';
import { useParams } from 'next/navigation';
import { Problem } from '@/lib/types/ide';

type Props = {
    problems: Problem[];
};

// Difficulty badge component
const DifficultyBadge = memo(({ difficulty }: { difficulty: string }) => {
    const colors = {
        'Hard': { text: 'text-red-200', bg: 'bg-red-500', glow: 'shadow-red-500/50' },
        'Medium': { text: 'text-orange-200', bg: 'bg-orange-500', glow: 'shadow-orange-500/50' },
        'Easy': { text: 'text-lime-200', bg: 'bg-lime-500', glow: 'shadow-lime-500/50' },
    };

    const color = colors[difficulty as keyof typeof colors] || colors.Easy;

    return (
        <div className={`px-4 py-1 rounded-full backdrop-blur-sm text-base font-bold
    ${color.bg} ${color.text} shadow-lg ${color.glow}
    animate-pulse-slow`}>
            {difficulty}
        </div>
    );
});

DifficultyBadge.displayName = 'DifficultyBadge';

// Tag component
const Tag = memo(({ text }: { text: string }) => (
    <span className="px-3 py-1 rounded-full text-xs font-medium
                   bg-[var(--color-gray-600)] text-[var(--color-cyan)]
                   border border-[var(--color-cyan)]/30
                   hover:bg-[var(--color-cyan)] hover:text-[var(--color-gray-900)]
                   transition-all cursor-default">
        {text}
    </span>
));

Tag.displayName = 'Tag';

// Tabs component
const TabButton = memo(({
    active,
    onClick,
    children
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) => (
    <button
        onClick={onClick}
        className={`relative px-4 py-2 text-sm font-medium transition-all
                 ${active
                ? 'text-[var(--color-cyan)]'
                : 'text-[var(--foreground)] hover:text-[var(--color-cyan)]'}`}
    >
        {children}
        {active && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-cyan)] 
                       rounded-full animate-expand" />
        )}
    </button>
));

TabButton.displayName = 'TabButton';

const ProblemDescription = ({ problems }: Props) => {
    const params = useParams<any>();
    const [clickedProblems, setClickedProblems] = useState<Problem>();
    const [activeTab, setActiveTab] = useState<'description' | 'hints' | 'solutions'>('description');

    useEffect(() => {
        if (problems) {
            const problem = problems.find(p => p.id === params.id);
            if (problem) {
                setClickedProblems(problem);
            } else if (problems.length > 0) {
                setClickedProblems(problems[0]);
            }
        }
    }, [problems, params.id]);

    if (!clickedProblems) {
        return (
            <div className="bg-[var(--color-gray-700)] h-full flex items-center justify-center">
                <div className="text-[var(--foreground)] text-lg">Loading problem...</div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-gray-700)] h-full flex flex-col">
            {/* Tabs Header */}
            <div className="flex h-12 w-full items-center pt-2 px-5 bg-[var(--color-gray-600)] 
                      text-[var(--foreground)] border-b border-[var(--color-gray-500)]">
                <div className="flex gap-2">
                    <TabButton
                        active={activeTab === 'description'}
                        onClick={() => setActiveTab('description')}
                    >
                        📋 Description
                    </TabButton>

                    {clickedProblems.hints && clickedProblems.hints.length > 0 && (
                        <TabButton
                            active={activeTab === 'hints'}
                            onClick={() => setActiveTab('hints')}
                        >
                            💡 Hints ({clickedProblems.hints.length})
                        </TabButton>
                    )}

                    <TabButton
                        active={activeTab === 'solutions'}
                        onClick={() => setActiveTab('solutions')}
                    >
                        🎯 Editorial
                    </TabButton>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {/* Description Tab Content */}
                {activeTab === 'description' && (
                    <div className="p-5">
                        {/* Title and Difficulty */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                                {clickedProblems.order}. {clickedProblems.title}
                            </h1>

                            <div className="flex items-center gap-3 flex-wrap">
                                <DifficultyBadge difficulty={clickedProblems.difficulty} />

                                {clickedProblems.category && (
                                    <span className="px-3 py-1 rounded-lg bg-[var(--color-gray-600)] 
                                   text-[var(--foreground)] text-sm">
                                        📁 {clickedProblems.category}
                                    </span>
                                )}

                                {clickedProblems.points && (
                                    <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500
                                   text-[var(--color-gray-900)] text-sm font-bold">
                                        ⭐ {clickedProblems.points} pts
                                    </span>
                                )}
                            </div>

                            {/* Tags */}
                            {clickedProblems.tags && clickedProblems.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {clickedProblems.tags.map((tag, index) => (
                                        <Tag key={index} text={tag} />
                                    ))}
                                </div>
                            )}

                            {/* Statistics */}
                            {(clickedProblems.solveRate || clickedProblems.totalAttempts) && (
                                <div className="flex gap-4 mt-4 text-sm text-[var(--foreground)]/70">
                                    {clickedProblems.solveRate && (
                                        <span>✅ Solve Rate: {clickedProblems.solveRate}%</span>
                                    )}
                                    {clickedProblems.totalAttempts && (
                                        <span>🎯 Attempts: {clickedProblems.totalAttempts}</span>
                                    )}
                                    {clickedProblems.averageTime && (
                                        <span>⏱️ Avg Time: {Math.floor(clickedProblems.averageTime / 60)}m</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Problem Statement */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                                Problem Statement
                            </h2>
                            <div
                                className="prose prose-invert max-w-none text-[var(--foreground)]"
                                dangerouslySetInnerHTML={{ __html: clickedProblems.problemStatement }}
                            />
                        </div>

                        {/* Detailed Description */}
                        {clickedProblems.detailedDescription && (
                            <div className="mb-6 p-4 bg-[var(--color-gray-800)] rounded-lg border border-[var(--color-gray-600)]">
                                <h3 className="text-md font-semibold text-[var(--color-cyan)] mb-2">
                                    📖 Detailed Explanation
                                </h3>
                                <div
                                    className="text-[var(--foreground)] text-sm"
                                    dangerouslySetInnerHTML={{ __html: clickedProblems.detailedDescription }}
                                />
                            </div>
                        )}

                        {/* Examples */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                                Examples
                            </h2>
                            {clickedProblems.examples.map((example, index) => (
                                <div
                                    key={index}
                                    className="mb-4 p-4 bg-[var(--color-gray-800)] rounded-lg 
                             border border-[var(--color-gray-600)] hover:border-[var(--color-cyan)]/50 
                             transition-all"
                                >
                                    <p className="font-bold text-[var(--color-cyan)] mb-2">
                                        Example {index + 1}:
                                    </p>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-[var(--foreground)]/70 text-sm">Input:</span>
                                            <pre className="mt-1 p-2 bg-[var(--color-gray-900)] rounded text-[var(--foreground)] 
                                      font-mono text-sm overflow-x-auto">
                                                {example.inputText}
                                            </pre>
                                        </div>
                                        <div>
                                            <span className="text-[var(--foreground)]/70 text-sm">Output:</span>
                                            <pre className="mt-1 p-2 bg-[var(--color-gray-900)] rounded text-[var(--foreground)] 
                                      font-mono text-sm overflow-x-auto">
                                                {example.outputText}
                                            </pre>
                                        </div>
                                        {example.explanation && (
                                            <div>
                                                <span className="text-[var(--foreground)]/70 text-sm">Explanation:</span>
                                                <p className="mt-1 text-[var(--foreground)] text-sm">
                                                    {example.explanation}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Constraints - COMPLETION STARTS HERE */}
                        {clickedProblems.constraints && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                                    Constraints
                                </h2>
                                <div
                                    className="p-4 bg-[var(--color-gray-800)] rounded-lg border border-[var(--color-gray-600)]
                             text-[var(--foreground)]"
                                    dangerouslySetInnerHTML={{ __html: clickedProblems.constraints }}
                                />
                            </div>
                        )}

                        {/* Complexity Section */}
                        {clickedProblems.complexity && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                                    Complexity Analysis
                                </h2>
                                <div className="space-y-3 p-4 bg-[var(--color-gray-800)] rounded-lg border border-[var(--color-gray-600)]">
                                    <div className="flex gap-4">
                                        <span className="font-bold text-[var(--color-cyan)]">Time Complexity:</span>
                                        <span className="text-[var(--foreground)]">{clickedProblems.complexity.time}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="font-bold text-[var(--color-cyan)]">Space Complexity:</span>
                                        <span className="text-[var(--foreground)]">{clickedProblems.complexity.space}</span>
                                    </div>
                                    {clickedProblems.complexity.explanation && (
                                        <div className="text-sm text-[var(--foreground)]/80">
                                            <span className="font-bold">Explanation:</span> {clickedProblems.complexity.explanation}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* COMPLETION ENDS HERE */}
                    </div>
                )}

                {/* Hints Tab Content */}
                {activeTab === 'hints' && clickedProblems.hints && clickedProblems.hints.length > 0 && (
                    <div className="p-5">
                        <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
                            💡 Hints
                        </h2>
                        <p className="text-sm text-[var(--foreground)]/70 mb-5">
                            Use these hints if you get stuck! Each hint reveals more of the solution.
                        </p>
                        <div className="space-y-4">
                            {clickedProblems.hints.map((hint, index) => (
                                <div
                                    key={hint.id}
                                    className="p-4 bg-[var(--color-gray-800)] rounded-lg border border-[var(--color-gray-600)]
                             hover:border-yellow-500/50 transition-all cursor-pointer group"
                                >
                                    <p className="font-bold text-yellow-500 mb-2">
                                        Hint {index + 1}
                                        <span className="ml-2 text-xs font-normal text-[var(--foreground)]/50">
                                            ({hint.penaltyPoints} penalty pts)
                                        </span>
                                    </p>
                                    <p className="text-[var(--foreground)] text-sm">
                                        {hint.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Solutions Tab Content (Editorial) */}
                {activeTab === 'solutions' && (
                    <div className="p-5">
                        <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
                            🎯 Editorial & Solutions
                        </h2>

                        {/* Intuition Section */}
                        {clickedProblems.intuition && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-[var(--color-cyan)] mb-3">
                                    🧠 Intuition
                                </h3>
                                <div
                                    className="prose prose-invert max-w-none text-[var(--foreground)]"
                                    dangerouslySetInnerHTML={{ __html: clickedProblems.intuition }}
                                />
                            </div>
                        )}

                        {/* Approach Section */}
                        {clickedProblems.approach && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-[var(--color-cyan)] mb-3">
                                    📝 Algorithm / Approach
                                </h3>
                                <div
                                    className="prose prose-invert max-w-none text-[var(--foreground)]"
                                    dangerouslySetInnerHTML={{ __html: clickedProblems.approach }}
                                />
                            </div>
                        )}

                        {/* Solution Code Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-[var(--color-cyan)] mb-3">
                                💻 Code Implementation (Python Example)
                            </h3>
                            {clickedProblems.solutionCodes && clickedProblems.solutionCodes.python ? (
                                <pre className="p-4 bg-[var(--color-gray-900)] rounded-lg border border-[var(--color-gray-600)]
                                font-mono text-sm text-lime-400 overflow-x-auto">
                                    {clickedProblems.solutionCodes.python}
                                </pre>
                            ) : (
                                <p className="text-[var(--foreground)]/70">Solution code not available for this language.</p>
                            )}
                        </div>

                        {/* Show other languages - simplified */}
                        <h4 className="text-md font-medium text-[var(--foreground)]/80 mb-2">
                            Other Languages Available:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(clickedProblems.solutionCodes || {}).filter(lang =>
                                (clickedProblems.solutionCodes as any)[lang] && lang !== 'python'
                            ).map(lang => (
                                <span
                                    key={lang}
                                    className="px-3 py-1 rounded-full text-xs font-medium 
                                   bg-[var(--color-gray-600)] text-[var(--foreground)]/70"
                                >
                                    {lang.toUpperCase()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemDescription;