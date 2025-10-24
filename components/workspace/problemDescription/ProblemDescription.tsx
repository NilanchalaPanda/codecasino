// "use client";
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { ThumbsUp, ThumbsDown, Star, CheckCheck, Square } from 'lucide-react';
// import { Problem, ProblemList, Users } from '@/lib/types/ide';

// type Props = {
//     user: Users;
//     problems: [Problem];
// };

// const ProblemDescription = ({ user, problems }: Props) => {
//     const params = useParams<any>();
//     const [clickedProblems, setClickedProblems] = useState<Problem>();
//     const [clickedProblemsId, setClickedProblemId] = useState<string>();
//     const [like, setLike] = useState<boolean>(false);
//     const [disLike, setDisLike] = useState<boolean>(false);
//     const [favorite, setFavorite] = useState<boolean>(false);
//     const [difficultyColors, setDifficultyColor] = useState([
//         {
//             type: 'Hard',
//             textColor: 'text-red-200',
//             bgColor: 'bg-red-500',
//         },
//         {
//             type: 'Medium',
//             textColor: 'text-orange-200',
//             bgColor: 'bg-orange-500',
//         },
//         {
//             type: 'Easy',
//             textColor: 'text-lime-200',
//             bgColor: 'bg-lime-500',
//         },
//     ]);

//     useEffect(() => {
//         if (problems) {
//             problems.forEach((problem: any, index) => {
//                 if (problem.id === params.id) {
//                     setClickedProblems(problem);
//                     setClickedProblemId(problem._id);
//                 }
//             });
//         }
//     }, [problems]);

//     useEffect(() => {
//         const ids = (user?.problemList ?? []).map((prob: any) => prob?._id);
//         const foundIndex = ids.indexOf(clickedProblemsId);
//         if (foundIndex !== -1) {
//             setLike(user.problemList[foundIndex].like);
//             setDisLike(user.problemList[foundIndex].dislike);
//             setFavorite(user.problemList[foundIndex].favorite);
//         }
//     }, [user, problems, clickedProblemsId]);

//     const handelLikedproblems = async () => {
//         const ids = user?.problemList.map((prob: any) => prob?._id);
//         const foundIndex = ids.indexOf(clickedProblemsId);
//         setLike((prevLike) => !prevLike);
//         try {
//             const res = await fetch('../../../api/handler/handelLikedproblems', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     like: !like,
//                     index: foundIndex,
//                     user: user,
//                 }),
//             });
//             const data = await res.json();
//         } catch (error) {
//             console.error('Error handling liked problems:', error);
//         }
//     };

//     const handelDisLikedproblems = async () => {
//         const ids = user?.problemList.map((prob: any) => prob?._id);
//         const foundIndex = ids.indexOf(clickedProblemsId);
//         setDisLike((prevDisLike) => !prevDisLike);
//         try {
//             const res = await fetch('../../../api/handler/handelDisLikedproblems', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     disLike: !disLike,
//                     index: foundIndex,
//                     user: user,
//                 }),
//             });
//             const data = await res.json();
//         } catch (error) {
//             console.error('Error handling disliked problems:', error);
//         }
//     };

//     const handelFavoritesproblems = async () => {
//         const ids = user?.problemList.map((prob: any) => prob?._id);
//         const foundIndex = ids.indexOf(clickedProblemsId);
//         setFavorite((prevFavorite) => !prevFavorite);
//         try {
//             const res = await fetch('../../../api/handler/handelFavoritesproblems', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     favorite: !favorite,
//                     index: foundIndex,
//                     user: user,
//                 }),
//             });
//             const data = await res.json();
//         } catch (error) {
//             console.error('Error handling favorite problems:', error);
//         }
//     };

//     return (
//         <div className='bg-slate-700'>
//             <div className='flex h-11 w-full items-center pt-2 bg-slate-600 text-white overflow-x-hidden overflow-y-auto'>
//                 <div className={"bg-slate-700 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
//                     Description
//                 </div>
//             </div>
//             <div className='bg-slate-700'>
//                 <div className='text-lg text-white p-5'>
//                     {clickedProblems?.order}. {clickedProblems?.title}
//                 </div>
//                 {/* section 1 */}
//                 <div className='flex items-center justify-start m-2'>
//                     <div className={`mx-4 px-4 py-1 w-15 rounded-full backdrop-blur-sm text-base
//                         ${difficultyColors.map((difficultyTypes) => {
//                         if (difficultyTypes.type === clickedProblems?.difficulty) {
//                             return " " + difficultyTypes.bgColor + " " + difficultyTypes.textColor + " ";
//                         }
//                     })}
//                     `}>
//                         {clickedProblems?.difficulty}
//                     </div>
//                     {/* Solved Section */}
//                     <div className='mx-2 cursor-pointer'>
//                         {user?.problemList.map((userProblem: ProblemList, index: any) => (
//                             <div key={index}>
//                                 {userProblem?._id === clickedProblemsId ? (
//                                     userProblem?.solved ? (
//                                         <CheckCheck size={24} color={'green'} />
//                                     ) : (
//                                         <Square size={20} color={'green'} />
//                                     )
//                                 ) : null}
//                             </div>
//                         ))}
//                     </div>
//                     {/* Liked Section */}
//                     <div className='mx-2 flex cursor-pointer'>
//                         <div onClick={handelLikedproblems}>
//                             {like ? <ThumbsUp size={20} fill='blue' color='blue' /> : <ThumbsUp size={20} color='blue' />}
//                         </div>
//                         <span className='ml-2 cursor-pointer'>123</span>
//                     </div>
//                     {/* Disliked Section */}
//                     <div className='mx-2 flex cursor-pointer'>
//                         <div onClick={handelDisLikedproblems}>
//                             {disLike ? <ThumbsDown size={20} fill='red' color='red' /> : <ThumbsDown size={20} color='red' />}
//                         </div>
//                         <span className='ml-2'>123</span>
//                     </div>
//                     {/* Favorite Section */}
//                     <div className='mx-3 cursor-pointer'>
//                         <div onClick={handelFavoritesproblems}>
//                             {favorite ? <Star size={20} fill='yellow' color='yellow' /> : <Star size={20} color='yellow' />}
//                         </div>
//                     </div>
//                 </div>
//                 {/* section 2 */}
//                 <div className='px-5 py-2 text-white'>
//                     <div dangerouslySetInnerHTML={{ __html: clickedProblems?.problemStatement || '' }} />
//                 </div>
//                 {/* section 3 */}
//                 <div className='mt-4 px-5'>
//                     {clickedProblems?.examples.map((examples, index) => (
//                         <div key={index}>
//                             <p className='font-medium text-white'>Example {examples.id + 1}</p>
//                             <div className='example-card'>
//                                 <pre>
//                                     <strong className='text-white'>Input: </strong> {examples.inputText}
//                                     <br />
//                                     <strong>Output:</strong> {examples.outputText}
//                                     <br />
//                                     {examples.explanation && (
//                                         <>
//                                             <strong>Explanation: </strong> {examples.explanation}
//                                         </>
//                                     )}
//                                 </pre>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//                 <div className='px-5 py-2 text-white'>
//                     {clickedProblems?.constraints && (
//                         <>
//                             Constraints:<br />
//                             <strong>
//                                 <div className='m-5' dangerouslySetInnerHTML={{ __html: clickedProblems?.constraints || '' }} />
//                             </strong>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProblemDescription;




// "use client"
// import React, { useEffect, useState } from 'react'
// import { useParams } from 'next/navigation'
// import { Problem } from '@/lib/types/ide'

// type Props = {
//     problems: Problem[]
// }

// const ProblemDescription = ({ problems }: Props) => {
//     const params = useParams<any>()
//     const [clickedProblems, setClickedProblems] = useState<Problem>()
//     const [difficultyColors] = useState([
//         { type: 'Hard', textColor: 'text-red-200', bgColor: 'bg-red-500' },
//         { type: 'Medium', textColor: 'text-orange-200', bgColor: 'bg-orange-500' },
//         { type: 'Easy', textColor: 'text-lime-200', bgColor: 'bg-lime-500' },
//     ])

//     useEffect(() => {
//         if (problems) {
//             const problem = problems.find(p => p.id === params.id)
//             if (problem) {
//                 setClickedProblems(problem)
//             } else if (problems.length > 0) {
//                 setClickedProblems(problems[0])
//             }
//         }
//     }, [problems, params.id])

//     return (
//         <div className="bg-[var(--color-gray-700)]">
//             <div className="flex h-11 w-full items-center pt-2 bg-[var(--color-gray-600)] text-[var(--foreground)] overflow-x-hidden overflow-y-auto">
//                 <div className="bg-[var(--color-gray-700)] rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer">
//                     Description
//                 </div>
//             </div>
//             <div className="bg-[var(--color-gray-700)]">
//                 <div className="text-lg text-[var(--foreground)] p-5">
//                     {clickedProblems?.order}. {clickedProblems?.title}
//                 </div>
//                 <div className="flex items-center justify-start m-2">
//                     <div className={`mx-4 px-4 py-1 w-15 rounded-full backdrop-blur-sm text-base
//             ${difficultyColors.find(d => d.type === clickedProblems?.difficulty)?.bgColor}
//             ${difficultyColors.find(d => d.type === clickedProblems?.difficulty)?.textColor}
//           `}>
//                         {clickedProblems?.difficulty}
//                     </div>
//                 </div>
//                 <div className="px-5 py-2 text-[var(--foreground)]">
//                     <div dangerouslySetInnerHTML={{ __html: clickedProblems?.problemStatement || '' }} />
//                 </div>
//                 <div className="mt-4 px-5">
//                     {clickedProblems?.examples.map((example, index) => (
//                         <div key={index}>
//                             <p className="font-medium text-[var(--foreground)]">Example {example.id + 1}</p>
//                             <div className="example-card">
//                                 <pre className="text-[var(--foreground)]">
//                                     <strong>Input: </strong> {example.inputText}
//                                     <br />
//                                     <strong>Output:</strong> {example.outputText}
//                                     <br />
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
//                             Constraints:<br />
//                             <strong>
//                                 <div className="m-5" dangerouslySetInnerHTML={{ __html: clickedProblems?.constraints || '' }} />
//                             </strong>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default ProblemDescription


// ProblemDescription.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Problem } from '@/lib/types/ide';

type Props = {
    problems: Problem[];
};

const ProblemDescription = ({ problems }: Props) => {
    const params = useParams<any>();
    const [clickedProblems, setClickedProblems] = useState<Problem>();
    const [difficultyColors] = useState([
        { type: 'Hard', textColor: 'text-red-200', bgColor: 'bg-red-500' },
        { type: 'Medium', textColor: 'text-orange-200', bgColor: 'bg-orange-500' },
        { type: 'Easy', textColor: 'text-lime-200', bgColor: 'bg-lime-500' },
    ]);

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

    return (
        <div className="bg-[var(--color-gray-700)] h-full">
            <div className="flex h-11 w-full items-center pt-2 bg-[var(--color-gray-600)] text-[var(--foreground)] overflow-x-hidden overflow-y-auto">
                <div className="bg-[var(--color-gray-700)] rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer">
                    Description
                </div>
            </div>
            <div className="bg-[var(--color-gray-700)] h-[calc(100%-2.75rem)] overflow-y-auto">
                <div className="text-lg text-[var(--foreground)] p-5">
                    {clickedProblems?.order}. {clickedProblems?.title}
                </div>
                <div className="flex items-center justify-start m-2">
                    <div className={`mx-4 px-4 py-1 w-15 rounded-full backdrop-blur-sm text-base
            ${difficultyColors.find(d => d.type === clickedProblems?.difficulty)?.bgColor}
            ${difficultyColors.find(d => d.type === clickedProblems?.difficulty)?.textColor}`}>
                        {clickedProblems?.difficulty}
                    </div>
                </div>
                <div className="px-5 py-2 text-[var(--foreground)]">
                    <div dangerouslySetInnerHTML={{ __html: clickedProblems?.problemStatement || '' }} />
                </div>
                <div className="mt-4 px-5">
                    {clickedProblems?.examples.map((example, index) => (
                        <div key={index} className="mb-4">
                            <p className="font-medium text-[var(--foreground)]">Example {index + 1}:</p>
                            <div className="example-card p-4 bg-[var(--color-gray-800)] rounded-lg">
                                <pre className="text-[var(--foreground)]">
                                    <strong>Input: </strong> {example.inputText}<br />
                                    <strong>Output:</strong> {example.outputText}<br />
                                    {example.explanation && (
                                        <>
                                            <strong>Explanation: </strong> {example.explanation}
                                        </>
                                    )}
                                </pre>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="px-5 py-2 text-[var(--foreground)]">
                    {clickedProblems?.constraints && (
                        <>
                            <p className="font-medium">Constraints:</p>
                            <div className="m-5" dangerouslySetInnerHTML={{ __html: clickedProblems?.constraints || '' }} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProblemDescription;
