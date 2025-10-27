// "use client";
// import React, { useEffect, useState } from 'react';
// import Split from 'react-split';
// import CodeMirror from "@uiw/react-codemirror";
// import { cpp } from '@codemirror/lang-cpp';
// import { java } from '@codemirror/lang-java';
// import { javascript } from '@codemirror/lang-javascript';
// import { python } from '@codemirror/lang-python';
// import { vscodeDark } from "@uiw/codemirror-theme-vscode";
// import { Problem, Language } from '@/lib/types/ide';
// import UserConsole from './console/Console';
// import { useParams } from 'next/navigation';
// import { toast } from 'react-hot-toast';

// type Props = {
//   problems: Problem[];
//   setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
// };

// const Playground = ({ problems, setSuccess }: Props) => {
//   const params = useParams<any>();
//   const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
//   const [clickedProblems, setClickedProblems] = useState<Problem>();
//   const [userCode, setUserCode] = useState<string>("");
//   const [output, setOutput] = useState<string | null>(null);
//   const [language, setLanguage] = useState<Language>("python");

//   const languageOptions = [
//     { value: "python", label: "Python" },
//     { value: "cpp", label: "C++" },
//     { value: "java", label: "Java" },
//     { value: "javascript", label: "JavaScript" },
//     { value: "c", label: "C" },
//   ];

//   const getLanguageExtension = () => {
//     switch (language) {
//       case "cpp":
//         return cpp();
//       case "java":
//         return java();
//       case "javascript":
//         return javascript();
//       case "c":
//         return cpp(); // Use C++ extension for C
//       default:
//         return python();
//     }
//   };

//   useEffect(() => {
//     if (problems) {
//       const problem = problems.find(p => p.id === params.id);
//       if (problem) {
//         setClickedProblems(problem);
//         setUserCode(problem.starterCodes[language]);
//       } else if (problems.length > 0) {
//         setClickedProblems(problems[0]);
//         setUserCode(problems[0].starterCodes[language]);
//       }
//     }
//   }, [problems, params.id, language]);

//   useEffect(() => {
//     if (clickedProblems) {
//       setUserCode(clickedProblems.starterCodes[language]);
//     }
//   }, [language, clickedProblems]);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(e.key.toLowerCase())) {
//         e.preventDefault();
//         toast.error("Copy-pasting is disabled!", { position: "top-center" });
//       }
//       if (e.key === "Tab") {
//         e.preventDefault();
//         toast.error("Tab key is disabled!", { position: "top-center" });
//       }
//     };

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         toast.error("Switching tabs is not allowed!", { position: "top-center" });
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []);

//   const handleCodeChange = (value: string) => {
//     setUserCode(value);
//   };

//   const handleRun = async () => {
//     try {
//       localStorage.setItem(`code-${clickedProblems?.id}`, JSON.stringify(userCode));
//       setOutput(`Output: ${userCode?.includes("return") ? "Sample output" : "Error: No return statement"}`);
//       toast.success("Code executed!", { position: "top-center" });
//     } catch (error: any) {
//       setOutput(`Error: ${error.message}`);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       setSuccess(true);
//       setOutput("Output: All test cases passed!");
//       toast.success("Code submitted successfully!", { position: "top-center" });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="flex flex-col bg-[var(--color-gray-700)] h-full">
//       <div className="flex justify-end p-2">
//         <select
//           value={language}
//           onChange={(e) => setLanguage(e.target.value as Language)}
//           className="bg-[var(--color-gray-600)] text-[var(--foreground)] p-1 rounded"
//         >
//           {languageOptions.map((lang) => (
//             <option key={lang.value} value={lang.value}>
//               {lang.label}
//             </option>
//           ))}
//         </select>
//       </div>
//       <Split
//         className="flex flex-col h-[calc(100%-3rem)] w-full"
//         direction="vertical"
//         sizes={[60, 40]}
//         minSize={150}
//         gutterSize={8}
//         gutterAlign="center"
//         snapOffset={30}
//         gutter={(index, direction) => {
//           const gutterElement = document.createElement("div");
//           gutterElement.className = `gutter gutter-${direction}`;
//           return gutterElement;
//         }}
//       >
//         <div className="w-full h-full overflow-auto bg-[var(--color-gray-900)]">
//           <CodeMirror
//             value={userCode}
//             theme={vscodeDark}
//             onChange={handleCodeChange}
//             extensions={[getLanguageExtension()]}
//             className='bg-[#1E1E1E] text-lg font-mono h-[98%]'
//           />
//         </div>
//         <div className="w-full h-full px-5 py-3 overflow-auto bg-[var(--color-gray-800)]">
//           <div className="flex h-10 items-center space-x-6 border-b border-[var(--color-gray-600)]">
//             <div className="relative flex h-full flex-col justify-center cursor-pointer">
//               <div className="text-sm font-medium leading-5 text-[var(--foreground)]">Testcases</div>
//               <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-[var(--color-cyan)]" />
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-2 mt-4">
//             {clickedProblems?.examples.map((example, index) => (
//               <button
//                 key={example.id}
//                 onClick={() => setActiveTestCaseId(index)}
//                 className={`px-4 py-1 rounded-lg text-sm font-medium transition-all ${activeTestCaseId === index
//                     ? "bg-[var(--color-cyan)] text-[var(--color-gray-900)]"
//                     : "bg-[var(--color-gray-600)] text-[var(--foreground)] hover:bg-[var(--color-gray-500)]"
//                   }`}
//               >
//                 Case {index + 1}
//               </button>
//             ))}
//           </div>
//           <div className="font-semibold my-4">
//             <p className="text-sm font-medium mt-4 text-[var(--foreground)]">Input:</p>
//             <div className="w-full cursor-text rounded-lg border px-3 py-2 bg-[var(--color-gray-600)] border-transparent text-[var(--foreground)] mt-2">
//               {clickedProblems?.examples[activeTestCaseId].inputText}
//             </div>
//             <p className="text-sm font-medium mt-4 text-[var(--foreground)]">Output:</p>
//             <div className="w-full cursor-text rounded-lg border px-3 py-2 bg-[var(--color-gray-600)] border-transparent text-[var(--foreground)] mt-2">
//               {clickedProblems?.examples[activeTestCaseId].outputText}
//             </div>
//           </div>
//         </div>
//       </Split>
//       <div className="flex justify-center items-center bg-[var(--color-gray-700)] border-t border-[var(--color-gray-600)]">
//         <UserConsole handleRun={handleRun} handleSubmit={handleSubmit} output={output} />
//       </div>
//     </div>
//   );
// };

// export default Playground;


"use client";
import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import Split from 'react-split';
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Problem, Language } from '@/lib/types/ide';
import UserConsole from './console/Console';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAntiCheat } from '@/hooks/useAntiCheat';

type Props = {
  problems: Problem[];
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  isBattleMode?: boolean; // Flag for battle/contest mode
};

// Memoized language selector component
const LanguageSelector = memo(({
  language,
  onChange,
  disabled
}: {
  language: Language;
  onChange: (lang: Language) => void;
  disabled: boolean;
}) => {
  const languageOptions = [
    { value: "python", label: "Python 3", icon: "🐍" },
    { value: "cpp", label: "C++17", icon: "⚡" },
    { value: "java", label: "Java 11", icon: "☕" },
    { value: "javascript", label: "JavaScript", icon: "🟨" },
    { value: "c", label: "C11", icon: "🔧" },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[var(--foreground)] opacity-70">Language:</span>
      <select
        value={language}
        onChange={(e) => onChange(e.target.value as Language)}
        disabled={disabled}
        className="bg-[var(--color-gray-600)] text-[var(--foreground)] px-3 py-1.5 rounded-lg 
                   text-sm font-medium border border-[var(--color-gray-500)] hover:bg-[var(--color-gray-500)]
                   transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {languageOptions.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.icon} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
});

LanguageSelector.displayName = 'LanguageSelector';

// Memoized test case button
const TestCaseButton = memo(({
  caseNum,
  isActive,
  onClick
}: {
  caseNum: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all transform hover:scale-105
      ${isActive
        ? "bg-[var(--color-cyan)] text-[var(--color-gray-900)] shadow-lg shadow-cyan-500/50"
        : "bg-[var(--color-gray-600)] text-[var(--foreground)] hover:bg-[var(--color-gray-500)]"
      }`}
  >
    Case {caseNum}
  </button>
));

TestCaseButton.displayName = 'TestCaseButton';

const Playground = ({ problems, setSuccess, isBattleMode = false }: Props) => {
  const params = useParams<any>();
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  const [clickedProblems, setClickedProblems] = useState<Problem>();
  const [userCode, setUserCode] = useState<string>("");
  const [output, setOutput] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("python");
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Anti-cheat system
  const antiCheat = useAntiCheat({
    enableFullscreenLock: isBattleMode,
    enableCopyPasteBlock: isBattleMode,
    enableTabSwitchDetection: isBattleMode,
    enableDevToolsDetection: isBattleMode,
    enableKeyboardShortcutBlock: isBattleMode,
    maxViolations: 5,
    onViolation: (violation) => {
      console.log('Violation detected:', violation);
      // Send to analytics/backend
    },
    onMaxViolationsReached: () => {
      toast.error('⛔ Maximum violations reached! Submitting test...', {
        duration: 5000,
        position: 'top-center',
      });
      // Auto-submit after violations
      setTimeout(() => handleSubmit(), 2000);
    }
  });

  // Get language extension for CodeMirror
  const getLanguageExtension = useCallback(() => {
    switch (language) {
      case "cpp":
        return cpp();
      case "java":
        return java();
      case "javascript":
        return javascript();
      case "c":
        return cpp();
      default:
        return python();
    }
  }, [language]);

  // Memoized language extension
  const languageExtension = useMemo(() => getLanguageExtension(), [getLanguageExtension]);

  // Load problem and code
  useEffect(() => {
    if (problems) {
      const problem = problems.find(p => p.id === params.id);
      if (problem) {
        setClickedProblems(problem);
        setUserCode(problem.starterCodes[language]);
      } else if (problems.length > 0) {
        setClickedProblems(problems[0]);
        setUserCode(problems[0].starterCodes[language]);
      }
    }
  }, [problems, params.id, language]);

  // Update code when language changes
  useEffect(() => {
    if (clickedProblems) {
      setUserCode(clickedProblems.starterCodes[language]);
    }
  }, [language, clickedProblems]);

  // Start anti-cheat when battle mode is enabled
  useEffect(() => {
    if (isBattleMode) {
      antiCheat.startMonitoring();
      return () => {
        antiCheat.stopMonitoring();
      };
    }
  }, [isBattleMode]);

  // Auto-save code (debounced)
  useEffect(() => {
    if (!userCode || !clickedProblems) return;

    const timeoutId = setTimeout(() => {
      try {
        // In production, save to backend instead
        const saveKey = `code-${clickedProblems.id}-${language}`;
        const codeData = {
          code: userCode,
          language,
          timestamp: Date.now(),
        };
        // Note: localStorage used here but should be backend API
        if (typeof window !== 'undefined') {
          const savedData = JSON.stringify(codeData);
          // localStorage is used temporarily - replace with API call
          console.log('Auto-saving code:', saveKey);
        }
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [userCode, clickedProblems, language]);

  // Handle code change with performance optimization
  const handleCodeChange = useCallback((value: string) => {
    setUserCode(value);
  }, []);

  // Handle language change
  const handleLanguageChange = useCallback((newLanguage: Language) => {
    if (isExecuting) {
      toast.error('Cannot change language while code is executing', {
        position: 'top-center'
      });
      return;
    }
    setLanguage(newLanguage);
  }, [isExecuting]);

  // Run code
  const handleRun = useCallback(async () => {
    if (!clickedProblems || !userCode) {
      toast.error('No code to execute', { position: 'top-center' });
      return;
    }

    setIsExecuting(true);
    setOutput('⏳ Executing code...');

    try {
      // Simulate code execution (replace with actual backend API)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Basic validation
      const hasReturnStatement = userCode.toLowerCase().includes('return');

      if (!hasReturnStatement) {
        setOutput(`❌ Error: No return statement found in your code.`);
        toast.error('Code execution failed!', { position: 'top-center' });
        return;
      }

      // Simulate running test cases
      const testResults = clickedProblems.examples.map((example, index) => {
        return {
          case: index + 1,
          input: example.inputText,
          expected: example.outputText,
          actual: example.outputText, // Mock: In production, run actual code
          passed: true,
        };
      });

      const allPassed = testResults.every(r => r.passed);
      const passedCount = testResults.filter(r => r.passed).length;

      let outputText = `✅ Test Cases: ${passedCount}/${testResults.length} passed\n\n`;
      testResults.forEach(result => {
        outputText += `Case ${result.case}: ${result.passed ? '✅ PASS' : '❌ FAIL'}\n`;
        outputText += `  Input: ${result.input}\n`;
        outputText += `  Expected: ${result.expected}\n`;
        outputText += `  Got: ${result.actual}\n\n`;
      });

      setOutput(outputText);

      if (allPassed) {
        toast.success('All test cases passed! 🎉', {
          position: 'top-center',
          duration: 3000,
        });
      } else {
        toast.error('Some test cases failed', { position: 'top-center' });
      }

    } catch (error: any) {
      setOutput(`❌ Error: ${error.message}`);
      toast.error('Execution error!', { position: 'top-center' });
    } finally {
      setIsExecuting(false);
    }
  }, [clickedProblems, userCode]);

  // Submit code
  const handleSubmit = useCallback(async () => {
    if (!clickedProblems || !userCode) {
      toast.error('No code to submit', { position: 'top-center' });
      return;
    }

    setIsExecuting(true);
    setOutput('📤 Submitting your solution...');

    try {
      // Simulate submission (replace with actual backend API)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check violations
      if (antiCheat.violationCount > 0) {
        toast((t) => (
          <div>
            <p className="font-bold">⚠️ Violations Detected</p>
            <p className="text-sm">Your submission has {antiCheat.violationCount} violation(s)</p>
          </div>
        ), {
          duration: 5000,
          position: 'top-center',
        });
      }

      // Mock: All test cases passed
      setSuccess(true);
      setOutput(`🎉 Success! All test cases passed!\n\nRuntime: 42ms\nMemory: 12.3MB\nPoints: +${clickedProblems.points || 100}`);

      toast.success('Solution accepted! 🎉', {
        position: 'top-center',
        duration: 3000,
      });

      // Stop anti-cheat monitoring after successful submission
      if (isBattleMode) {
        setTimeout(() => {
          antiCheat.stopMonitoring();
        }, 3000);
      }

    } catch (error: any) {
      setOutput(`❌ Submission Error: ${error.message}`);
      toast.error('Submission failed!', { position: 'top-center' });
    } finally {
      setIsExecuting(false);
    }
  }, [clickedProblems, userCode, antiCheat, isBattleMode, setSuccess]);

  // Reset code to starter
  const handleReset = useCallback(() => {
    if (clickedProblems) {
      setUserCode(clickedProblems.starterCodes[language]);
      toast.success('Code reset to starter template', { position: 'top-center' });
    }
  }, [clickedProblems, language]);

  return (
    <div className="flex flex-col bg-[var(--color-gray-700)] h-full relative">
      {/* Battle Mode Indicator */}
      {isBattleMode && antiCheat.isActive && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-[var(--color-cyan)] text-[var(--color-gray-900)] px-4 py-1 rounded-full 
                          text-sm font-bold flex items-center gap-2 shadow-lg animate-pulse">
            <span>🎮</span>
            <span>BATTLE MODE ACTIVE</span>
            {antiCheat.violationCount > 0 && (
              <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                {antiCheat.violationCount} violations
              </span>
            )}
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex justify-between items-center p-2 bg-[var(--color-gray-800)] border-b border-[var(--color-gray-600)]">
        <div className="flex items-center gap-4">
          <LanguageSelector
            language={language}
            onChange={handleLanguageChange}
            disabled={isExecuting}
          />

          {lastSaved && (
            <span className="text-xs text-[var(--foreground)] opacity-50">
              Auto-saved {Math.floor((Date.now() - lastSaved.getTime()) / 1000)}s ago
            </span>
          )}
        </div>

        <button
          onClick={handleReset}
          disabled={isExecuting}
          className="bg-[var(--color-gray-600)] text-[var(--foreground)] px-3 py-1 rounded-lg 
                     text-sm hover:bg-[var(--color-gray-500)] transition-all disabled:opacity-50"
        >
          🔄 Reset
        </button>
      </div>

      {/* Split Editor and Test Cases */}
      <Split
        className="flex flex-col h-[calc(100%-8rem)] w-full"
        direction="vertical"
        sizes={[60, 40]}
        minSize={150}
        gutterSize={8}
        gutterAlign="center"
        snapOffset={30}
        gutter={(index, direction) => {
          const gutterElement = document.createElement("div");
          gutterElement.className = `gutter gutter-${direction} bg-[var(--color-gray-600)] hover:bg-[var(--color-cyan)] transition-colors`;
          return gutterElement;
        }}
      >
        {/* Code Editor */}
        <div className="w-full h-full overflow-auto bg-[var(--color-gray-900)]">
          <CodeMirror
            value={userCode}
            theme={vscodeDark}
            onChange={handleCodeChange}
            extensions={[languageExtension]}
            className='bg-[#1E1E1E] text-sm font-mono h-full'
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightActiveLine: true,
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              searchKeymap: false, // Disable search to prevent cheating
            }}
          />
        </div>

        {/* Test Cases Panel */}
        <div className="w-full h-full px-5 py-3 overflow-auto bg-[var(--color-gray-800)]">
          <div className="flex h-10 items-center space-x-6 border-b border-[var(--color-gray-600)]">
            <div className="relative flex h-full flex-col justify-center cursor-pointer">
              <div className="text-sm font-medium leading-5 text-[var(--foreground)]">
                Test Cases
              </div>
              <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-[var(--color-cyan)]" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {clickedProblems?.examples.map((example, index) => (
              <TestCaseButton
                key={example.id}
                caseNum={index + 1}
                isActive={activeTestCaseId === index}
                onClick={() => setActiveTestCaseId(index)}
              />
            ))}
          </div>

          <div className="font-semibold my-4">
            <p className="text-sm font-medium mt-4 text-[var(--foreground)]">Input:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-2 bg-[var(--color-gray-600)] 
                            border-transparent text-[var(--foreground)] mt-2 font-mono">
              {clickedProblems?.examples[activeTestCaseId]?.inputText}
            </div>

            <p className="text-sm font-medium mt-4 text-[var(--foreground)]">Expected Output:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-2 bg-[var(--color-gray-600)] 
                            border-transparent text-[var(--foreground)] mt-2 font-mono">
              {clickedProblems?.examples[activeTestCaseId]?.outputText}
            </div>

            {clickedProblems?.examples[activeTestCaseId]?.explanation && (
              <>
                <p className="text-sm font-medium mt-4 text-[var(--foreground)]">Explanation:</p>
                <div className="w-full rounded-lg border px-3 py-2 bg-[var(--color-gray-600)] 
                                border-transparent text-[var(--foreground)] mt-2 text-sm">
                  {clickedProblems?.examples[activeTestCaseId]?.explanation}
                </div>
              </>
            )}
          </div>
        </div>
      </Split>

      {/* Console/Controls */}
      <div className="flex justify-center items-center bg-[var(--color-gray-700)] border-t border-[var(--color-gray-600)]">
        <UserConsole
          handleRun={handleRun}
          handleSubmit={handleSubmit}
          output={output}
          isExecuting={isExecuting}
        />
      </div>
    </div>
  );
};

export default Playground;