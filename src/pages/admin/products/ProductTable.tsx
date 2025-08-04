import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import { Edit, Trash2 } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => (
  <div className="rounded-lg border border-neutral-200/80 bg-white shadow-sm">
    <div className="max-h-[600px] overflow-y-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-neutral-50">
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>SalePrice</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <img src={product.images[0]?.url} alt={product.name} className="h-12 w-12 object-cover rounded-md" />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.variants.reduce((sum, v) => sum + v.stock, 0)}</TableCell>
              <TableCell>${product.variants[0]?.price.toFixed(2)}</TableCell>
              <TableCell>$</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(product)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);