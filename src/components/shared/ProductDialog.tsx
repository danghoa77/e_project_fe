import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  Category,
  ResProduct,
  UpdateProductDto,
  UpdateImageDto,
  UpdateSizeDto,
  UpdateVariantDto,
} from "@/types/product";
import adminApi from "@/pages/admin/api";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: "add" | "edit";
  product?: ResProduct;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  onOpenChange,
  product,
  state,
}) => {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(
    typeof product?.category === "string"
      ? product.category
      : product?.category?._id || ""
  );

  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images?.map((img) => img.url) || []
  );
  const [images, setImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletedVariants, setDeletedVariants] = useState<string[]>([]);
  const [deletedSizes, setDeletedSizes] = useState<string[]>([]);

  const [variants, setVariants] = useState<UpdateVariantDto[]>(
    product?.variants?.length
      ? product.variants.map((v) => ({
          _id: v._id,
          color: v.color,
          sizes: v.sizes.map((s) => ({
            _id: s._id,
            size: s.size,
            price: s.price,
            salePrice: s.salePrice,
            stock: s.stock,
          })),
        }))
      : [{ color: "", sizes: [{ size: "", price: 0, salePrice: 0, stock: 0 }] }]
  );

  useEffect(() => {
    if (state === "edit" && product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setCategory(
        typeof product.category === "string"
          ? product.category
          : product.category?._id || ""
      );
      setExistingImages(product.images?.map((img) => img.url) || []);
      setImages([]);

      setVariants(
        product.variants?.length
          ? product.variants.map((v) => ({
              _id: v._id,
              color: v.color,
              sizes: v.sizes.map((s) => ({
                _id: s._id,
                size: s.size,
                price: s.price,
                salePrice: s.salePrice,
                stock: s.stock,
              })),
            }))
          : [
              {
                color: "",
                sizes: [{ size: "", price: 0, salePrice: 0, stock: 0 }],
              },
            ]
      );
    } else if (state === "add") {
      resetForm();
    }
  }, [product, state, open]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryList = await adminApi.getAllCategory();
        setCategories(categoryList);
      } catch (err) {
        console.error("Fetch category failed", err);
      }
    };
    fetchCategory();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (existingImages.length + images.length + newFiles.length <= 5) {
        setImages([...images, ...newFiles]);
      } else {
        alert("You can upload up to 5 images");
      }
    }
  };

  const handleRemoveExistingImage = (url: string) => {
    setExistingImages(existingImages.filter((img) => img !== url));
  };

  const handleRemoveNewImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleVariantsChange = (newVariants: UpdateVariantDto[]) => {
    setVariants(newVariants);
  };

  const addVariant = () => {
    handleVariantsChange([
      ...variants,
      { color: "", sizes: [{ size: "", price: 0, salePrice: 0, stock: 0 }] },
    ]);
  };

  const removeVariant = (index: number) => {
    const variant = variants[index];
    if (variant._id) {
      setDeletedVariants((prev) => [...prev, variant._id!]);
    }
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    handleVariantsChange(newVariants);
    console.log("Deleting variant:", variant._id);
  };

  const updateVariant = (
    index: number,
    field: keyof UpdateVariantDto,
    value: any
  ) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    handleVariantsChange(newVariants);
  };

  const addSizeToVariant = (variantIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].sizes.push({
      size: "",
      price: 0,
      salePrice: 0,
      stock: 0,
    });
    handleVariantsChange(newVariants);
  };

  const removeSizeFromVariant = (variantIndex: number, sizeIndex: number) => {
    const size = variants[variantIndex].sizes[sizeIndex];
    if (size._id) {
      setDeletedSizes((prev) => [...prev, size._id!]);
    }
    const newVariants = [...variants];
    newVariants[variantIndex].sizes.splice(sizeIndex, 1);
    handleVariantsChange(newVariants);
    console.log("Deleting size:", size._id);
  };

  const updateSize = (
    variantIndex: number,
    sizeIndex: number,
    field: keyof UpdateSizeDto,
    value: any
  ) => {
    const newVariants = [...variants];
    (newVariants[variantIndex].sizes[sizeIndex] as any)[field] = value;
    handleVariantsChange(newVariants);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setExistingImages([]);
    setImages([]);
    setVariants([
      { color: "", sizes: [{ size: "", price: 0, salePrice: 0, stock: 0 }] },
    ]);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const remainingImages: UpdateImageDto[] =
        product?.images
          ?.filter((img) => existingImages.includes(img.url))
          .map((img) => ({
            url: img.url,
            cloudinaryId: img.cloudinaryId,
          })) || [];

      const deletedImages: string[] =
        product?.images
          ?.filter((img) => !existingImages.includes(img.url))
          .map((img) => img.cloudinaryId) || [];

      const dto: UpdateProductDto = {
        name,
        description,
        category,
        variants: variants.map((v) => ({
          _id: v._id,
          color: v.color,
          sizes: v.sizes.map((s) => ({
            _id: s._id,
            size: s.size,
            price: s.price,
            salePrice: s.salePrice,
            stock: s.stock,
          })),
        })),
        images: remainingImages,
        deletedImages,
        deletedVariants,
        deletedSizes,
      };

      const formData = new FormData();
      formData.append("dto", JSON.stringify(dto));
      images.forEach((file) => formData.append("images", file));

      if (state === "add") {
        await adminApi.createProduct(formData);
      } else if (state === "edit" && product?._id) {
        await adminApi.updateProduct(product._id, formData);
      }

      resetForm();
      onOpenChange(false);
    } catch (err) {
      console.error("Submit failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto hide-scrollbar bg-white rounded-lg font-sans">
        <DialogHeader>
          <DialogTitle>
            {state === "add" ? "Add Product" : "Edit Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />

          <Select
            value={category}
            onValueChange={setCategory}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {categories.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div>
            <label className="block text-sm font-medium mb-2">Images</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {existingImages.map((url, i) => (
                <div key={i} className="relative w-24 h-24">
                  <img
                    src={url}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                    onClick={() => handleRemoveExistingImage(url)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {images.map((file, i) => (
                <div key={i} className="relative w-24 h-24">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                    onClick={() => handleRemoveNewImage(i)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {existingImages.length + images.length < 5 && (
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={loading}
              />
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Variants</h3>
            {variants.map((variant, vIdx) => (
              <div
                key={vIdx}
                className="border p-3 rounded-md mb-3 space-y-2 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <Input
                    placeholder="Color"
                    value={variant.color}
                    onChange={(e) =>
                      updateVariant(vIdx, "color", e.target.value)
                    }
                    disabled={loading}
                  />
                  {variants.length > 1 && (
                    <Button
                      size={"sm"}
                      className="shadow-none"
                      onClick={() => removeVariant(vIdx)}
                      disabled={loading}
                    >
                      ✕
                    </Button>
                  )}
                </div>

                {variant.sizes.map((size, sIdx) => (
                  <div
                    key={sIdx}
                    className="grid grid-cols-4 gap-2 items-center"
                  >
                    <Input
                      placeholder="Size"
                      value={size.size}
                      onChange={(e) =>
                        updateSize(vIdx, sIdx, "size", e.target.value)
                      }
                      disabled={loading}
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={size.price}
                      onChange={(e) =>
                        updateSize(vIdx, sIdx, "price", +e.target.value)
                      }
                      disabled={loading}
                    />
                    <Input
                      type="number"
                      placeholder="Sale Price"
                      value={size.salePrice}
                      onChange={(e) =>
                        updateSize(vIdx, sIdx, "salePrice", +e.target.value)
                      }
                      disabled={loading}
                    />
                    <div className="flex items-center">
                      <Input
                        type="number"
                        placeholder="Stock"
                        value={size.stock}
                        onChange={(e) =>
                          updateSize(vIdx, sIdx, "stock", +e.target.value)
                        }
                        disabled={loading}
                      />
                      {variant.sizes.length > 1 && (
                        <Button
                          size={"sm"}
                          className="shadow-none"
                          onClick={() => removeSizeFromVariant(vIdx, sIdx)}
                          disabled={loading}
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  size="sm"
                  className="bg-neutral-800 text-white hover:bg-neutral-700"
                  onClick={() => addSizeToVariant(vIdx)}
                  disabled={loading}
                >
                  + Add size
                </Button>
              </div>
            ))}

            <Button
              className="bg-neutral-800 text-white hover:bg-neutral-700"
              onClick={addVariant}
              disabled={loading}
            >
              + Add variant
            </Button>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSubmit}
              className="bg-neutral-800 text-white hover:bg-neutral-700"
              disabled={loading}
            >
              {loading ? "Saving..." : state === "add" ? "Add" : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
