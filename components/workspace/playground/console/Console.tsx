"use client"
import React from 'react'
import { ChevronUp } from 'lucide-react'

type Props = {
    handleRun: () => void
    handleSubmit: () => void
    output: string | null
}

const UserConsole = ({ handleRun, handleSubmit, output }: Props) => {
    return (
        <div className="flex h-fit min-h-[10vh] max-h-[35vh] bg-[var(--color-gray-700)] bottom-0 w-full overflow-hidden">
            <div className="mx-5 my-[10px] flex justify-between w-full">
                <div className="mr-2 flex flex-1 flex-nowrap items-center space-x-4">
                    <button className="px-3 py-1.5 font-medium items-center transition-all inline-flex bg-[var(--color-gray-600)] text-sm hover:bg-[var(--color-gray-500)] text-[var(--foreground)] rounded-lg pl-3 pr-2">
                        Console
                        <div className="ml-1 transform transition flex items-center">
                            <ChevronUp className="mx-1" color="grey" size={16} />
                        </div>
                    </button>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <button
                        className="px-3 py-1.5 text-sm font-medium items-center whitespace-nowrap transition-all focus:outline-none inline-flex bg-[var(--color-gray-600)] hover:bg-[var(--color-gray-500)] text-[var(--foreground)] rounded-lg"
                        onClick={handleRun}
                    >
                        Run
                    </button>
                    <button
                        className="px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-[var(--foreground)] bg-[var(--color-orange-accent)] hover:bg-[var(--color-cyan)] rounded-lg"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}
export default UserConsole
