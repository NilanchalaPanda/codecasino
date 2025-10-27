// hooks/useAntiCheat.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export interface ViolationLog {
    type: 'tab_switch' | 'copy' | 'paste' | 'devtools' | 'fullscreen_exit' | 'window_blur' | 'keyboard_shortcut';
    timestamp: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    details?: string;
}

interface AntiCheatConfig {
    enableFullscreenLock?: boolean;
    enableCopyPasteBlock?: boolean;
    enableTabSwitchDetection?: boolean;
    enableDevToolsDetection?: boolean;
    enableKeyboardShortcutBlock?: boolean;
    maxViolations?: number;
    onViolation?: (log: ViolationLog) => void;
    onMaxViolationsReached?: () => void;
}

export const useAntiCheat = (config: AntiCheatConfig = {}) => {
    const {
        enableFullscreenLock = true,
        enableCopyPasteBlock = true,
        enableTabSwitchDetection = true,
        enableDevToolsDetection = true,
        enableKeyboardShortcutBlock = true,
        maxViolations = 5,
        onViolation,
        onMaxViolationsReached,
    } = config;

    const [violations, setViolations] = useState<ViolationLog[]>([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const violationCountRef = useRef(0);
    const lastViolationRef = useRef<number>(0);

    // Log violation with debounce (prevent spam)
    const logViolation = useCallback((violation: ViolationLog) => {
        const now = Date.now();
        // Debounce violations within 1 second
        if (now - lastViolationRef.current < 1000 &&
            violations[violations.length - 1]?.type === violation.type) {
            return;
        }

        lastViolationRef.current = now;
        violationCountRef.current += 1;

        setViolations(prev => [...prev, violation]);
        onViolation?.(violation);

        // Show toast notification
        const messages = {
            tab_switch: '⚠️ Tab switching detected!',
            copy: '❌ Copying is disabled!',
            paste: '❌ Pasting is disabled!',
            devtools: '🚨 Developer tools detected!',
            fullscreen_exit: '⚠️ Please return to fullscreen!',
            window_blur: '⚠️ Window focus lost!',
            keyboard_shortcut: '❌ This shortcut is disabled!',
        };

        toast.error(messages[violation.type], {
            position: 'top-center',
            duration: 3000,
            style: {
                background: '#ff0033',
                color: '#fff',
                fontWeight: 'bold',
            }
        });

        // Check if max violations reached
        if (violationCountRef.current >= maxViolations) {
            onMaxViolationsReached?.();
            toast.error('⛔ Maximum violations reached! Test will be submitted.', {
                position: 'top-center',
                duration: 5000,
                style: {
                    background: '#ff0033',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '16px',
                }
            });
        }
    }, [violations, maxViolations, onViolation, onMaxViolationsReached]);

    // Fullscreen management
    const enterFullscreen = useCallback(async () => {
        try {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
            }
            setIsFullscreen(true);
        } catch (error) {
            console.error('Failed to enter fullscreen:', error);
            toast.error('Failed to enter fullscreen mode');
        }
    }, []);

    const exitFullscreen = useCallback(async () => {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            }
            setIsFullscreen(false);
        } catch (error) {
            console.error('Failed to exit fullscreen:', error);
        }
    }, []);

    // DevTools detection
    useEffect(() => {
        if (!enableDevToolsDetection || !isActive) return;

        let devtoolsOpen = false;
        const threshold = 160; // DevTools size threshold

        const detectDevTools = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;

            if ((widthThreshold || heightThreshold) && !devtoolsOpen) {
                devtoolsOpen = true;
                logViolation({
                    type: 'devtools',
                    timestamp: Date.now(),
                    severity: 'critical',
                    details: 'Developer tools opened'
                });
            } else if (!widthThreshold && !heightThreshold && devtoolsOpen) {
                devtoolsOpen = false;
            }
        };

        const interval = setInterval(detectDevTools, 1000);
        return () => clearInterval(interval);
    }, [enableDevToolsDetection, isActive, logViolation]);

    // Copy/Paste/Cut prevention
    useEffect(() => {
        if (!enableCopyPasteBlock || !isActive) return;

        const handleCopy = (e: ClipboardEvent) => {
            e.preventDefault();
            logViolation({
                type: 'copy',
                timestamp: Date.now(),
                severity: 'high',
            });
        };

        const handlePaste = (e: ClipboardEvent) => {
            e.preventDefault();
            logViolation({
                type: 'paste',
                timestamp: Date.now(),
                severity: 'high',
            });
        };

        const handleCut = (e: ClipboardEvent) => {
            e.preventDefault();
            logViolation({
                type: 'copy',
                timestamp: Date.now(),
                severity: 'high',
                details: 'Cut operation'
            });
        };

        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('cut', handleCut);

        return () => {
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('cut', handleCut);
        };
    }, [enableCopyPasteBlock, isActive, logViolation]);

    // Keyboard shortcut blocking
    useEffect(() => {
        if (!enableKeyboardShortcutBlock || !isActive) return;

        const blockedShortcuts = new Set([
            'c', 'v', 'x', // Copy, paste, cut
            'a', // Select all (can be abused)
            's', // Save (might save externally)
            'i', // Inspect
            'j', // Console
            'u', // View source
            'p', // Print
            'f', // Find (can be used to search for answers)
        ]);

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();

            // Block Ctrl/Cmd + [key] combinations
            if ((e.ctrlKey || e.metaKey) && blockedShortcuts.has(key)) {
                e.preventDefault();
                e.stopPropagation();
                logViolation({
                    type: 'keyboard_shortcut',
                    timestamp: Date.now(),
                    severity: 'medium',
                    details: `Blocked: ${e.ctrlKey ? 'Ctrl' : 'Cmd'}+${key.toUpperCase()}`
                });
                return false;
            }

            // Block F12 (DevTools)
            if (e.key === 'F12') {
                e.preventDefault();
                logViolation({
                    type: 'devtools',
                    timestamp: Date.now(),
                    severity: 'critical',
                    details: 'F12 pressed'
                });
                return false;
            }

            // Block Alt+Tab, Cmd+Tab (window switching)
            if ((e.altKey || e.metaKey) && e.key === 'Tab') {
                e.preventDefault();
                logViolation({
                    type: 'tab_switch',
                    timestamp: Date.now(),
                    severity: 'critical',
                    details: 'Window switch attempt'
                });
                return false;
            }

            // Block right-click menu shortcuts
            if (e.shiftKey && e.key === 'F10') {
                e.preventDefault();
                return false;
            }
        };

        // Block context menu (right-click)
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            toast.error('Right-click is disabled', { position: 'top-center' });
            return false;
        };

        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [enableKeyboardShortcutBlock, isActive, logViolation]);

    // Tab switching and window blur detection
    useEffect(() => {
        if (!enableTabSwitchDetection || !isActive) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                logViolation({
                    type: 'tab_switch',
                    timestamp: Date.now(),
                    severity: 'critical',
                    details: 'Tab switched or minimized'
                });
            }
        };

        const handleBlur = () => {
            logViolation({
                type: 'window_blur',
                timestamp: Date.now(),
                severity: 'high',
                details: 'Window lost focus'
            });
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
        };
    }, [enableTabSwitchDetection, isActive, logViolation]);

    // Fullscreen change detection
    useEffect(() => {
        if (!enableFullscreenLock || !isActive) return;

        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!document.fullscreenElement;
            setIsFullscreen(isCurrentlyFullscreen);

            if (!isCurrentlyFullscreen && isActive) {
                logViolation({
                    type: 'fullscreen_exit',
                    timestamp: Date.now(),
                    severity: 'critical',
                    details: 'Exited fullscreen mode'
                });

                // Attempt to re-enter fullscreen after a short delay
                setTimeout(() => {
                    enterFullscreen();
                }, 1000);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [enableFullscreenLock, isActive, logViolation, enterFullscreen]);

    // Prevent page unload/reload
    useEffect(() => {
        if (!isActive) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = 'Are you sure you want to leave? Your test will be submitted.';
            return e.returnValue;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isActive]);

    // Start anti-cheat monitoring
    const startMonitoring = useCallback(async () => {
        setIsActive(true);
        if (enableFullscreenLock) {
            await enterFullscreen();
        }
        toast.success('🎮 Battle Mode Activated!', {
            position: 'top-center',
            duration: 2000,
            style: {
                background: '#00d9ff',
                color: '#0d0d0d',
                fontWeight: 'bold',
            }
        });
    }, [enableFullscreenLock, enterFullscreen]);

    // Stop anti-cheat monitoring
    const stopMonitoring = useCallback(async () => {
        setIsActive(false);
        if (isFullscreen) {
            await exitFullscreen();
        }
    }, [isFullscreen, exitFullscreen]);

    // Reset violations
    const resetViolations = useCallback(() => {
        setViolations([]);
        violationCountRef.current = 0;
    }, []);

    return {
        violations,
        violationCount: violationCountRef.current,
        isFullscreen,
        isActive,
        startMonitoring,
        stopMonitoring,
        enterFullscreen,
        exitFullscreen,
        resetViolations,
    };
};