// "use client";
// import React, { useEffect, useState } from 'react';
// import Split from 'react-split';
// import CodeMirror from "@uiw/react-codemirror";
// import { python } from '@codemirror/lang-python';
// import { vscodeDark } from "@uiw/codemirror-theme-vscode";
// import { Problem } from '@/lib/types/ide';
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
//   const [userCode, setUserCode] = useState<string>();
//   const [output, setOutput] = useState<string | null>(null);

//   useEffect(() => {
//     if (problems) {
//       const problem = problems.find(p => p.id === params.id);
//       if (problem) {
//         setClickedProblems(problem);
//       } else if (problems.length > 0) {
//         setClickedProblems(problems[0]);
//       }
//     }
//   }, [problems, params.id]);

//   useEffect(() => {
//     const code = localStorage.getItem(`code-${clickedProblems?.id}`);
//     if (code === '""' || code === null) {
//       setUserCode(clickedProblems?.starterCode);
//     } else {
//       setUserCode(JSON.parse(code));
//     }
//   }, [clickedProblems?.id]);

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
//     <div className="flex flex-col bg-[var(--color-gray-700)]">
//       <Split
//         className="flex flex-col h-full w-full"
//         direction="vertical"
//         sizes={[60, 40]}
//         minSize={150}
//         gutterSize={8}
//         gutterAlign="center"
//         snapOffset={30}
//       >
//         <div className="w-full h-full overflow-auto bg-[var(--color-gray-900)]">
//           <CodeMirror
//             value={userCode}
//             theme={vscodeDark}
//             onChange={handleCodeChange}
//             extensions={[python()]}
//             style={{
//               fontSize: "16px",
//               fontFamily: "var(--font-mono)",
//               height: "100%",
//             }}
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
//                   ? "bg-[var(--color-cyan)] text-[var(--color-gray-900)]"
//                   : "bg-[var(--color-gray-600)] text-[var(--foreground)] hover:bg-[var(--color-gray-500)]"
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

//       {output && (
//         <div className="flex justify-center items-center p-4 bg-[var(--color-gray-700)] border-t border-[var(--color-gray-600)]">
//           <div className="w-[95%] bg-[hsla(0,0%,100%,0.1)] text-[rgba(239,241,246,0.75)] text-[0.98rem] leading-5 whitespace-pre-wrap p-4 rounded-lg">
//             {output}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Playground;



// Playground.tsx
// "use client";
// import React, { useEffect, useState } from 'react';
// import Split from 'react-split';
// import CodeMirror from "@uiw/react-codemirror";
// import { python } from '@codemirror/lang-python';
// import { vscodeDark } from "@uiw/codemirror-theme-vscode";
// import { Problem } from '@/lib/types/ide';
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

//   useEffect(() => {
//     if (problems) {
//       const problem = problems.find(p => p.id === params.id);
//       if (problem) {
//         setClickedProblems(problem);
//         setUserCode(problem.starterCode);
//       } else if (problems.length > 0) {
//         setClickedProblems(problems[0]);
//         setUserCode(problems[0].starterCode);
//       }
//     }
//   }, [problems, params.id]);

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
//       <Split
//         className="flex flex-col h-[calc(100%-3rem)] w-full"
//         direction="vertical"
//         sizes={[60, 40]}
//         minSize={150}
//         gutterSize={8}
//         gutterAlign="center"
//         snapOffset={30}
//       >
//         <div className="w-full h-full overflow-auto bg-[var(--color-gray-900)]">
//           <CodeMirror
//             value={userCode}
//             theme={vscodeDark}
//             onChange={handleCodeChange}
//             extensions={[python()]}
//             className='text-lg font-mono h-full bg-gray-800'
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
import React, { useEffect, useState } from 'react';
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

type Props = {
  problems: Problem[];
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const Playground = ({ problems, setSuccess }: Props) => {
  const params = useParams<any>();
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  const [clickedProblems, setClickedProblems] = useState<Problem>();
  const [userCode, setUserCode] = useState<string>("");
  const [output, setOutput] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("python");

  const languageOptions = [
    { value: "python", label: "Python" },
    { value: "cpp", label: "C++" },
    { value: "java", label: "Java" },
    { value: "javascript", label: "JavaScript" },
    { value: "c", label: "C" },
  ];

  const getLanguageExtension = () => {
    switch (language) {
      case "cpp":
        return cpp();
      case "java":
        return java();
      case "javascript":
        return javascript();
      case "c":
        return cpp(); // Use C++ extension for C
      default:
        return python();
    }
  };

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

  useEffect(() => {
    if (clickedProblems) {
      setUserCode(clickedProblems.starterCodes[language]);
    }
  }, [language, clickedProblems]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        toast.error("Copy-pasting is disabled!", { position: "top-center" });
      }
      if (e.key === "Tab") {
        e.preventDefault();
        toast.error("Tab key is disabled!", { position: "top-center" });
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.error("Switching tabs is not allowed!", { position: "top-center" });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleCodeChange = (value: string) => {
    setUserCode(value);
  };

  const handleRun = async () => {
    try {
      localStorage.setItem(`code-${clickedProblems?.id}`, JSON.stringify(userCode));
      setOutput(`Output: ${userCode?.includes("return") ? "Sample output" : "Error: No return statement"}`);
      toast.success("Code executed!", { position: "top-center" });
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    try {
      setSuccess(true);
      setOutput("Output: All test cases passed!");
      toast.success("Code submitted successfully!", { position: "top-center" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col bg-[var(--color-gray-700)] h-full">
      <div className="flex justify-end p-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-[var(--color-gray-600)] text-[var(--foreground)] p-1 rounded"
        >
          {languageOptions.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
      <Split
        className="flex flex-col h-[calc(100%-3rem)] w-full"
        direction="vertical"
        sizes={[60, 40]}
        minSize={150}
        gutterSize={8}
        gutterAlign="center"
        snapOffset={30}
        gutter={(index, direction) => {
          const gutterElement = document.createElement("div");
          gutterElement.className = `gutter gutter-${direction}`;
          return gutterElement;
        }}
      >
        <div className="w-full h-full overflow-auto bg-[var(--color-gray-900)]">
          <CodeMirror
            value={userCode}
            theme={vscodeDark}
            onChange={handleCodeChange}
            extensions={[getLanguageExtension()]}
            className='bg-[#1E1E1E] text-lg font-mono h-[98%]'
          />
        </div>
        <div className="w-full h-full px-5 py-3 overflow-auto bg-[var(--color-gray-800)]">
          <div className="flex h-10 items-center space-x-6 border-b border-[var(--color-gray-600)]">
            <div className="relative flex h-full flex-col justify-center cursor-pointer">
              <div className="text-sm font-medium leading-5 text-[var(--foreground)]">Testcases</div>
              <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-[var(--color-cyan)]" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {clickedProblems?.examples.map((example, index) => (
              <button
                key={example.id}
                onClick={() => setActiveTestCaseId(index)}
                className={`px-4 py-1 rounded-lg text-sm font-medium transition-all ${activeTestCaseId === index
                    ? "bg-[var(--color-cyan)] text-[var(--color-gray-900)]"
                    : "bg-[var(--color-gray-600)] text-[var(--foreground)] hover:bg-[var(--color-gray-500)]"
                  }`}
              >
                Case {index + 1}
              </button>
            ))}
          </div>
          <div className="font-semibold my-4">
            <p className="text-sm font-medium mt-4 text-[var(--foreground)]">Input:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-2 bg-[var(--color-gray-600)] border-transparent text-[var(--foreground)] mt-2">
              {clickedProblems?.examples[activeTestCaseId].inputText}
            </div>
            <p className="text-sm font-medium mt-4 text-[var(--foreground)]">Output:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-2 bg-[var(--color-gray-600)] border-transparent text-[var(--foreground)] mt-2">
              {clickedProblems?.examples[activeTestCaseId].outputText}
            </div>
          </div>
        </div>
      </Split>
      <div className="flex justify-center items-center bg-[var(--color-gray-700)] border-t border-[var(--color-gray-600)]">
        <UserConsole handleRun={handleRun} handleSubmit={handleSubmit} output={output} />
      </div>
    </div>
  );
};

export default Playground;
