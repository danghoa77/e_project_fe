// src/hooks/useScroll.ts (Phiên bản mới dùng sự kiện 'wheel')

import { useState, useEffect } from 'react';

export const useScroll = () => {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
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

        window.addEventListener('wheel', handleWheel);

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return scrollDirection;
};
