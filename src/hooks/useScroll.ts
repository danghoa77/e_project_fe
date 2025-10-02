// src/hooks/useScroll.ts

import { useState, useEffect } from 'react';


const isElementScrollable = (element: HTMLElement): boolean => {

    const style = window.getComputedStyle(element);
    const overflowY = style.getPropertyValue('overflow-y');
    const isContentOverflowing = element.scrollHeight > element.clientHeight;

    return (overflowY === 'scroll' || (overflowY === 'auto' && isContentOverflowing));
};

export const useScroll = () => {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            const target = event.target as HTMLElement;
            let currentElement: HTMLElement | null = target;
            while (currentElement && currentElement !== document.body) {
                if (isElementScrollable(currentElement)) {
                    const isScrollingUp = event.deltaY < 0;
                    const isScrollingDown = event.deltaY > 0;
                    const isAtTop = currentElement.scrollTop === 0;
                    const isAtBottom = Math.abs(currentElement.scrollHeight - currentElement.clientHeight - currentElement.scrollTop) < 1;
                    if ((isScrollingUp && !isAtTop) || (isScrollingDown && !isAtBottom)) {
                        return;
                    }
                }
                currentElement = currentElement.parentElement;
            }

            if (window.scrollY < 100) {
                setScrollDirection('up');
                return;
            }

            if (event.deltaY > 0) {
                setScrollDirection('down');
            } else {
                setScrollDirection('up');
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return scrollDirection;
};