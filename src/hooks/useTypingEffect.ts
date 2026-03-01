import { useState, useEffect } from 'react';

export function useTypingEffect(text: string, enabled: boolean, speed = 20): { displayText: string; isComplete: boolean } {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!enabled) {
            setDisplayText('');
            setIsComplete(false);
            return;
        }
        let i = 0;
        setDisplayText('');
        setIsComplete(false);
        const interval = setInterval(() => {
            i++;
            setDisplayText(text.slice(0, i));
            if (i >= text.length) {
                clearInterval(interval);
                setIsComplete(true);
            }
        }, speed);
        return () => clearInterval(interval);
    }, [text, enabled, speed]);

    return { displayText, isComplete };
}
