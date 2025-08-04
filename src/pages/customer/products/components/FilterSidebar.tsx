// src/features/products/components/FilterSidebar.tsx

import * as React from "react";
import type { FilterState } from "@/types/product";
import { CATEGORIES, SIZES, MAX_PRICE } from "../constants";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterSidebarProps {
    onFilterChange: (filters: Partial<FilterState>) => void;
    currentFilters: Omit<FilterState, 'page' | 'limit'>;
}

export const FilterSidebar = ({ onFilterChange, currentFilters }: FilterSidebarProps) => {
    const [priceRange, setPriceRange] = React.useState(currentFilters.price ? [currentFilters.price.min, currentFilters.price.max] : [0, MAX_PRICE]);

    return (
        <div className="space-y-8">
            <div>
                <h3 className="font-semibold uppercase tracking-wider mb-4">Categories</h3>
                <Accordion type="multiple" className="w-full">
                    {CATEGORIES.map(cat => (
                        <AccordionItem value={cat.name} key={cat.name}>
                            <AccordionTrigger>{cat.name}</AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-2 pl-2">
                                    {cat.subcategories.map(sub => (
                                        <li key={sub}><button onClick={() => onFilterChange({ category: sub.toLowerCase().replace(/\s+/g, '-') })} className="text-sm text-neutral-600 hover:text-neutral-900">{sub}</button></li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            <div>
                <h3 className="font-semibold uppercase tracking-wider mb-4">Price</h3>
                <Slider max={MAX_PRICE} step={10} value={priceRange} onValueChange={setPriceRange} onValueCommit={(value) => onFilterChange({ price: { min: value[0], max: value[1] } })} />
                <div className="flex justify-between text-sm text-neutral-600 mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>
            <div>
                <h3 className="font-semibold uppercase tracking-wider mb-4">Size</h3>
                <div className="space-y-3">
                    {SIZES.map(size => (
                        <div key={size} className="flex items-center space-x-2">
                            <Checkbox id={size} checked={currentFilters.size === size} onCheckedChange={(checked) => onFilterChange({ size: checked ? size : undefined })} />
                            <label htmlFor={size} className="text-sm">{size}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};