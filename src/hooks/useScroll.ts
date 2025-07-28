// src/hooks/useScroll.ts

import { useState, useEffect } from 'react';

/**
 * Kiểm tra xem một phần tử HTML có thanh cuộn dọc (vertical scroll) hay không.
 * @param element - Phần tử HTML cần kiểm tra.
 * @returns `true` nếu phần tử có thể cuộn, ngược lại `false`.
 */
const isElementScrollable = (element: HTMLElement): boolean => {
    // Lấy kiểu CSS đã được tính toán của phần tử
    const style = window.getComputedStyle(element);
    const overflowY = style.getPropertyValue('overflow-y');

    // Kiểm tra xem nội dung có thực sự cao hơn vùng chứa hay không
    const isContentOverflowing = element.scrollHeight > element.clientHeight;

    // Phần tử được coi là có thể cuộn nếu overflow-y là 'scroll',
    // hoặc là 'auto' và nội dung thực sự đang bị tràn.
    return (overflowY === 'scroll' || (overflowY === 'auto' && isContentOverflowing));
};

export const useScroll = () => {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            const target = event.target as HTMLElement;

            // --- LOGIC MỚI BẮT ĐẦU TỪ ĐÂY ---

            // Duyệt ngược từ phần tử target lên các phần tử cha cho đến body
            let currentElement: HTMLElement | null = target;
            while (currentElement && currentElement !== document.body) {
                // Nếu tìm thấy một phần tử có thể cuộn
                if (isElementScrollable(currentElement)) {
                    const isScrollingUp = event.deltaY < 0;
                    const isScrollingDown = event.deltaY > 0;

                    // Kiểm tra xem thanh cuộn của phần tử con đã chạm đỉnh hoặc đáy chưa
                    const isAtTop = currentElement.scrollTop === 0;
                    // Sử dụng sai số nhỏ (vd: 1) để xử lý các giá trị pixel lẻ
                    const isAtBottom = Math.abs(currentElement.scrollHeight - currentElement.clientHeight - currentElement.scrollTop) < 1;

                    // Nếu đang cuộn lên và chưa ở đỉnh, hoặc cuộn xuống và chưa ở đáy
                    // thì đó là cuộn bên trong phần tử con -> không cập nhật state của hook
                    if ((isScrollingUp && !isAtTop) || (isScrollingDown && !isAtBottom)) {
                        return; // Dừng xử lý
                    }
                }
                currentElement = currentElement.parentElement;
            }

            // --- LOGIC MỚI KẾT THÚC TẠI ĐÂY ---
            // Nếu không return ở trên, tức là đây là cuộn của cả trang

            // Giữ lại logic cũ của bạn
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
    }, []); // Dependency array rỗng để effect chỉ chạy một lần

    return scrollDirection;
};