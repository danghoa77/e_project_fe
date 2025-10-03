import * as React from "react";
import type { FilterState } from "@/types/product";
import { MAX_PRICE, SIZES } from "../constants";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterSidebarProps {
  onFilterChange: (filters: Partial<FilterState>) => void;
  currentFilters: Omit<FilterState, "page" | "limit">;
  categories: {
    _id: string;
    name: string;
    subcategories?: { _id: string; name: string }[];
  }[];
}

export const FilterSidebar = ({
  onFilterChange,
  currentFilters,
  categories,
}: FilterSidebarProps) => {
  const [priceRange, setPriceRange] = React.useState(
    currentFilters.price
      ? [currentFilters.price.min, currentFilters.price.max]
      : [0, MAX_PRICE]
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold uppercase tracking-wider mb-4">
          Categories
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onFilterChange({ category: "" })}
              className={`text-sm hover:text-neutral-900 ${
                !currentFilters.category
                  ? "text-black font-medium"
                  : "text-neutral-600"
              }`}
            >
              All
            </button>
          </li>

          {categories.map((cat) => (
            <li key={cat._id}>
              <button
                onClick={() => onFilterChange({ category: cat._id })}
                className={`text-sm hover:text-neutral-900 ${
                  currentFilters.category === cat._id
                    ? "text-black font-medium"
                    : "text-neutral-600"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold uppercase tracking-wider mb-4">Price</h3>
        <Slider
          max={MAX_PRICE}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          onValueCommit={(value) =>
            onFilterChange({ price: { min: value[0], max: value[1] } })
          }
        />
        <div className="flex justify-between text-sm text-neutral-600 mt-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold uppercase tracking-wider mb-4">Size</h3>
        <div className="space-y-3">
          {SIZES.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={size}
                checked={currentFilters.size?.includes(size)}
                onCheckedChange={(checked) => {
                  const newSizes = checked
                    ? [...(currentFilters.size || []), size]
                    : (currentFilters.size || []).filter((s) => s !== size);

                  onFilterChange({
                    size: newSizes.length > 0 ? newSizes : undefined,
                  });
                }}
              />
              <label htmlFor={size} className="text-sm">
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
