import * as React from 'react';
import adminApi from '../api';
import { CreateProductDto, Product, PreviewFile } from '@/types/product';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export const AdminProductsPage = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [images, setImages] = React.useState<PreviewFile[]>([]);
  const dialogCloseRef = React.useRef<HTMLButtonElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selectedFiles = Array.from(files).slice(0, 5 - images.length);
    const newFiles: PreviewFile[] = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const variant = {
      size: formData.get("size") as string,
      color: formData.get("color") as string,
      price: Number(formData.get("price")),
      salePrice: formData.get("salePrice")
        ? Number(formData.get("salePrice"))
        : undefined,
      stock: Number(formData.get("stock")),
    };

    const dto: Omit<CreateProductDto, "images"> = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      variants: [variant],
    };

    const payload = new FormData();
    payload.append("dto", JSON.stringify(dto));
    images.forEach(({ file }) => payload.append("files", file));

    try {
      const res = await adminApi.createProduct(payload);
      setProducts((prev) => [...prev, res]);
      form.reset();
      setImages([]);
      dialogCloseRef.current?.click(); // close dialog
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminApi.fetchProducts();
        setProducts(res.products);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await adminApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 font-sans">
      <Dialog>
        <DialogTrigger asChild>
          <Button ref={dialogCloseRef} className="bg-black text-white hover:bg-neutral-800 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto hide-scrollbar bg-white">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Product Name</label>
              <input type="text" name="name" className="w-full px-3 py-2 border rounded-md" required />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Category</label>
              <input type="text" name="category" className="w-full px-3 py-2 border rounded-md" required />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Images (max 5)</label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-md"
              />
              {images.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img.preview}
                        alt={`Preview ${index}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-2">Variant</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="size" placeholder="Size" required className="px-3 py-2 border rounded-md" />
                <input type="text" name="color" placeholder="Color" required className="px-3 py-2 border rounded-md" />
                <input type="number" name="price" placeholder="Price" required min={0} className="px-3 py-2 border rounded-md" />
                <input type="number" name="salePrice" placeholder="Sale Price" min={0} className="px-3 py-2 border rounded-md" />
                <input type="number" name="stock" placeholder="Stock" required min={0} className="px-3 py-2 border rounded-md" />
              </div>
            </div>

            <Button type="submit" className=" text-white mt-4">
              Add
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden mt-6">
        <Table>
          <TableHeader className="bg-neutral-100">
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full bg-neutral-200" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              products.map((p) => {
                const firstImage = p.images[0]?.url || '';
                const firstVariant = p.variants[0];
                const stock = p.variants.reduce((acc, v) => acc + v.stock, 0);

                return (
                  <TableRow key={p._id} className="hover:bg-neutral-50">
                    <TableCell>
                      <img
                        src={firstImage}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>{p.variants.length}</TableCell>
                    <TableCell>
                      {firstVariant?.salePrice ? (
                        <div className="space-y-1">
                          <p className="text-red-600 font-semibold">
                            ${firstVariant.salePrice.toFixed(2)}
                          </p>
                          <p className="line-through text-sm text-neutral-500">
                            ${firstVariant.price.toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <p>${firstVariant?.price.toFixed(2)}</p>
                      )}
                    </TableCell>
                    <TableCell>{stock}</TableCell>
                    <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" className="bg-[#c85a2e] text-white hover:bg-[#b64f29]">Update</Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleDelete(p._id)}
                        disabled={deletingId === p._id}
                      >
                        {deletingId === p._id ? "Deleting..." : "Delete"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
