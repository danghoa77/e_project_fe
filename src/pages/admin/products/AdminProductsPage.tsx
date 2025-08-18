

import * as React from 'react';
import adminApi from '../api';
import { Product } from '@/types/product';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { ProductDialog } from '@/components/shared/ProductDialog';

export const AdminProductsPage = () => {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [deletingId, setDeletingId] = React.useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState<Product | undefined>();

    const navigate = useNavigate();

    React.useEffect(() => {
        (async () => {
            try {
                const res = await adminApi.fetchProducts();
                setProducts(res.products);
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleCreate = async (payload: FormData) => {
        try {
            const res = await adminApi.createProduct(payload);
            console.log(res);
            setProducts(prev => [res, ...prev]);
        } catch (err) {
            console.error("Create failed", err);
        }
    };

    const handleUpdate = async (formData: FormData) => {
        if (!editingProduct) return;
        try {
            const res = await adminApi.updateProduct(editingProduct._id, formData);
            setProducts(prev => prev.map(p => p._id === res._id ? res : p));
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await adminApi.deleteProduct(id);
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            console.error("Delete failed", err);
        } finally {
            setDeletingId(null);
        }
    };

    const handleView = (id: string) => navigate(`/admin/products/${id}`);
    const handleEdit = (p: Product) => { setEditingProduct(p); setDialogOpen(true); };

    return (
        <div className="p-8 bg-stone-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-stone-800">Products</h1>
                <Button onClick={() => { setEditingProduct(undefined); setDialogOpen(true); }} className="bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-2 shadow-sm">
                    <Plus className="w-4 h-4" /> Add Product
                </Button>
            </div>

            <ProductDialog
                open={dialogOpen}
                onClose={() => { setDialogOpen(false); setEditingProduct(undefined); }}
                onSubmit={editingProduct ? handleUpdate : handleCreate}
                initialData={editingProduct}
            />

            <div className="rounded-lg border border-stone-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-stone-100">
                        <TableRow>
                            <TableHead className="text-stone-600 text-xs uppercase tracking-wider">Image</TableHead>
                            <TableHead className="text-stone-600 text-xs uppercase tracking-wider">Name</TableHead>
                            <TableHead className="text-stone-600 text-xs uppercase tracking-wider">Category</TableHead>
                            <TableHead className="text-stone-600 text-xs uppercase tracking-wider">Variants</TableHead>
                            <TableHead className="text-stone-600 text-xs uppercase tracking-wider">Price</TableHead>
                            <TableHead className="text-stone-600 text-xs uppercase tracking-wider">Stock</TableHead>
                            <TableHead className="text-stone-600 text-xs uppercase tracking-wider">Created</TableHead>
                            <TableHead className="text-right text-stone-600 text-xs uppercase tracking-wider">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>{Array.from({ length: 8 }).map((__, j) => <TableCell key={j}><Skeleton className="h-5 w-full bg-stone-200" /></TableCell>)}</TableRow>
                            ))
                        ) : (
                            products.map(p => {
                                const imgUrl = p.images?.[0]?.url || 'https://via.placeholder.com/150';
                                const firstVariant = p.variants?.[0];
                                const totalStock = p.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;

                                return (
                                    <TableRow key={p._id} className="hover:bg-orange-50/50 transition-colors">
                                        <TableCell><img src={imgUrl} className="w-16 h-16 object-cover rounded-md border border-stone-200" alt={p.name} /></TableCell>
                                        <TableCell className="font-medium text-stone-800">{p.name}</TableCell>
                                        <TableCell className="text-stone-600">{p.category}</TableCell>
                                        <TableCell className="text-stone-600 text-center">{p.variants?.length || 0}</TableCell>
                                        <TableCell className="text-stone-800 font-semibold">
                                            {firstVariant?.salePrice && firstVariant.salePrice < firstVariant.price ? (
                                                <div className='flex flex-col'>
                                                    <span className="text-red-600">${firstVariant.salePrice.toFixed(2)}</span>
                                                    <span className="line-through text-sm text-stone-500 font-normal">${firstVariant.price.toFixed(2)}</span>
                                                </div>
                                            ) : (
                                                <span>${firstVariant?.price.toFixed(2) || '0.00'}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-stone-600">{totalStock}</TableCell>
                                        <TableCell className="text-stone-600">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="outline" className="border-stone-300" onClick={() => handleView(p._id)}>View</Button>
                                                <Button size="sm" variant="outline" className="border-stone-300 text-green-600 hover:text-green-700" onClick={() => handleEdit(p)}>Edit</Button>
                                                <Button size="sm" variant="outline" className="border-stone-300 text-red-600 hover:text-red-700 disabled:opacity-50" disabled={deletingId === p._id} onClick={() => handleDelete(p._id)}>
                                                    {deletingId === p._id ? "Deleting..." : "Delete"}
                                                </Button>
                                            </div>
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