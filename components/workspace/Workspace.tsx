'use client'

import { useEffect, useState } from "react"
import Split from "react-split"
import ProblemDescription from "./problemDescription/ProblemDescription"
import Playground from "./playground/Playground"
import Confetti from "react-confetti"
import useWindowSize from "@/hooks/useWindowSize"
import { Problem } from "@/lib/types/ide"

type Props = {
    problems: Problem[]
}

const Workspace = ({ problems }: Props) => {
    const { width, height } = useWindowSize()
    const [success, setSuccess] = useState(false)
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [success])

    return (
        <div className="h-[calc(100vh-2rem)]">
            <Split
                className="split h-full flex"
                direction="horizontal"
                sizes={[50, 50]}
                minSize={400}
            >
                <ProblemDescription problems={problems} />
                <div className="bg-[var(--color-gray-700)] h-full">
                    <Playground problems={problems} setSuccess={setSuccess} />
                    {success && <Confetti gravity={0.3} tweenDuration={5000} width={width - 1} height={height - 1} />}
                </div>
            </Split>

        </div>
    )
}
export default Workspace