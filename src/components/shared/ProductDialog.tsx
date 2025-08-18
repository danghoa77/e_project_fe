// src/components/shared/ProductDialog.tsx

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { Product, ProductVariant, CloudinaryImage } from "@/types/product";

// Kiểu dữ liệu VariantForm nên được định nghĩa ở đây hoặc import từ types
type VariantForm = Omit<ProductVariant, '_id'>;

interface ProductDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
    initialData?: Product;
}

export const ProductDialog: React.FC<ProductDialogProps> = ({ open, onClose, onSubmit, initialData }) => {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [variants, setVariants] = React.useState<Partial<VariantForm>[]>([]);
    const [existingImages, setExistingImages] = React.useState<CloudinaryImage[]>([]);
    const [deletedImages, setDeletedImages] = React.useState<string[]>([]);
    const [newImages, setNewImages] = React.useState<File[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (open && initialData) {
            setName(initialData.name);
            setDescription(initialData.description || "");
            setCategory(initialData.category);
            setVariants(initialData.variants.map(v => ({
                size: v.size,
                color: v.color,
                price: v.price,
                salePrice: v.salePrice,
                stock: v.stock
            })));
            setExistingImages(initialData.images || []);
            setDeletedImages([]);
            setNewImages([]);
        } else if (open) {
            // Reset form for creating new
            setName("");
            setDescription("");
            setCategory("");
            setVariants([{ size: "", color: "", price: 0, salePrice: 0, stock: 0 }]);
            setExistingImages([]);
            setDeletedImages([]);
            setNewImages([]);
        }
    }, [open, initialData]);

    const handleVariantChange = (i: number, field: keyof VariantForm, value: string | number) => {
        setVariants(prev => {
            const updated = [...prev];
            updated[i] = { ...updated[i], [field]: value };
            return updated;
        });
    };
    const addVariant = () => setVariants(prev => [...prev, { size: "", color: "", price: 0, salePrice: 0, stock: 0 }]);
    const removeVariant = (i: number) => setVariants(prev => prev.filter((_, idx) => idx !== i));

    const handleRemoveExistingImage = (cloudinaryId: string) => {
        setDeletedImages(prev => [...prev, cloudinaryId]);
        setExistingImages(prev => prev.filter(img => img.cloudinaryId !== cloudinaryId));
    };

    const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setNewImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        const dto = {
            name: name || undefined,
            description: description || undefined,
            category: category || undefined,
            variants: variants.map(v => ({
                size: v.size,
                color: v.color,
                price: Number(v.price),
                salePrice: Number(v.salePrice),
                stock: Number(v.stock) || 0
            })),
            deletedImages: deletedImages.length > 0 ? deletedImages : undefined
        };
        const dtoKey = initialData ? 'updateProductDto' : 'dto';
        formData.append(dtoKey, JSON.stringify(dto));
        newImages.forEach(file => formData.append("images", file));

        await onSubmit(formData);
        setLoading(false);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto hide-scrollbar bg-white rounded-lg font-sans">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-stone-800">{initialData ? "Edit Product" : "Create New Product"}</DialogTitle>
                    <DialogDescription>{initialData ? "Update the product's information, images, and variants." : "Fill in the details below to add a new product."}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Classic Silk Carré" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Scarves" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the product..." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Images</Label>
                        <div className="flex gap-3 flex-wrap p-3 border border-dashed rounded-md min-h-[110px]">
                            {existingImages.map(img => (
                                <div key={img.cloudinaryId} className="relative group">
                                    <img src={img.url} alt="product" className="w-24 h-24 object-cover rounded-md border" />
                                    <button type="button" onClick={() => handleRemoveExistingImage(img.cloudinaryId)} className="absolute -top-2 -right-2 bg-stone-700 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                                </div>
                            ))}
                        </div>
                        <Input type="file" multiple onChange={handleNewImagesChange} className="mt-2" />
                    </div>

                    <div className="space-y-4 border-t border-stone-200 pt-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-stone-800">Variants</h3>
                            <Button type="button" size="sm" variant="outline" onClick={addVariant}><Plus className="w-4 h-4 mr-2" />Add Variant</Button>
                        </div>
                        {variants.map((v, i) => (
                            <div key={i} className="grid grid-cols-2 lg:grid-cols-5 gap-3 p-4 border rounded-lg relative">
                                <Input value={v.size} onChange={e => handleVariantChange(i, "size", e.target.value)} placeholder="Size" required />
                                <Input value={v.color} onChange={e => handleVariantChange(i, "color", e.target.value)} placeholder="Color" required />
                                <Input type="number" value={v.price ?? ""} onChange={e => handleVariantChange(i, "price", Number(e.target.value))} placeholder="Price" required />
                                <Input type="number" value={v.salePrice ?? ""} onChange={e => handleVariantChange(i, "salePrice", Number(e.target.value))} placeholder="Sale Price" />
                                <Input type="number" value={v.stock ?? ""} onChange={e => handleVariantChange(i, "stock", Number(e.target.value))} placeholder="Stock" required />
                                {variants.length > 1 && (
                                    <button type="button" onClick={() => removeVariant(i)} className="absolute top-1.5 right-1.5 text-stone-400 hover:text-red-500 transition-colors"><X size={18} /></button>
                                )}
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};