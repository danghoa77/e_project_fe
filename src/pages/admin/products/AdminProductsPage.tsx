import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

import type { ResProduct, GetProductsResponse } from "@/types/product";
import ProductDialog from "@/components/shared/ProductDialog";
import adminApi from "../api";

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ResProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ResProduct | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res: GetProductsResponse = await adminApi.getProducts();
      setProducts(res.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setOpenDialog(true);
  };

  const handleEditProduct = (product: ResProduct) => {
    setEditingProduct(product);
    setOpenDialog(true);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      setDeletingId(id);
      await adminApi.deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 bg-stone-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-3xl md:text-4xl text-neutral-800">
          Products
        </h1>
        <Button
          className="bg-black text-white hover:bg-neutral-800 shadow-md"
          onClick={handleAddProduct}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-sm shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead className="text-center">Rating</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i} className="border-b border-neutral-200/50">
                  <TableCell>
                    <Skeleton className="h-16 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-1/2" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-1/2" />
                  </TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-30 text-gray-500"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="relative w-16 h-16 overflow-hidden rounded-md border">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="bg-gray-100 w-full h-full" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {product.category?.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.variants.map((variant) => (
                        <span
                          key={variant._id}
                          className="text-xs bg-gray-100 rounded px-2 py-0.5 hover:bg-gray-200"
                          title={variant.sizes
                            .map(
                              (s) =>
                                `${s.size} - ${s.price}$ (${s.stock} in stock)`
                            )
                            .join("\n")}
                        >
                          {variant.color}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    ⭐ {product.averageRating} ({product.numReviews})
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-stone-300 text-blue-600 hover:text-blue-700"
                        onClick={() =>
                          (window.location.href = `/product/${product._id}`)
                        }
                      >
                        Detail
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-stone-300 text-green-600 hover:text-green-700"
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-stone-300 text-red-600 hover:text-red-700 disabled:opacity-50 w-[90px] justify-center"
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={deletingId === product._id}
                      >
                        {deletingId === product._id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProductDialog
        open={openDialog}
        onOpenChange={(isOpen) => {
          setOpenDialog(isOpen);
          if (!isOpen) {
            fetchProducts();
          }
        }}
        product={editingProduct || undefined}
        state={editingProduct ? "edit" : "add"}
      />
    </div>
  );
};
