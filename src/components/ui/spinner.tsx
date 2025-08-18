

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
    className?: string;
}

const Spinner = ({ className }: SpinnerProps) => {
    return (
        <Loader2
            className={cn("h-10 w-10 animate-spin text-orange-500", className)}
        />
    );
};

export default Spinner;