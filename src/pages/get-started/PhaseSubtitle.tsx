import React, { useEffect } from 'react';
import { useTypingEffect } from '../../hooks/useTypingEffect';

export const PhaseSubtitle: React.FC<{ text: string; enabled: boolean; onComplete?: () => void }> = ({ text, enabled, onComplete }) => {
    const { displayText, isComplete } = useTypingEffect(text, enabled);

    useEffect(() => {
        if (isComplete && onComplete) onComplete();
    }, [isComplete, onComplete]);

    if (!enabled) return null;

    return (
        <p className="text-zinc-500 font-mono text-sm mb-6">
            {displayText}
        </p>
    );
};
