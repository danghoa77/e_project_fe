import React from "react";
import adminApi from "../api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/types/product";

const AdminCategories = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [open, setOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [editId, setEditId] = React.useState<string | null>(null);

  const [loadingAddUpdate, setLoadingAddUpdate] = React.useState(false);
  const [loadingDelete, setLoadingDelete] = React.useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await adminApi.getAllCategory();
      setCategories(res);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async () => {
    try {
      if (!newName.trim()) return;
      setLoadingAddUpdate(true);
      await adminApi.addCategory(newName);
      setNewName("");
      setOpen(false);
      fetchData();
    } catch (err) {
      console.error("Add category failed", err);
    } finally {
      setLoadingAddUpdate(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      setLoadingDelete(id);
      await adminApi.deleteCategory(id);
      fetchData();
    } catch (err) {
      console.error("Delete category failed", err);
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editId) return;
    try {
      setLoadingAddUpdate(true);
      await adminApi.updateCateogory(editId, newName);
      setEditId(null);
      setNewName("");
      setOpen(false);
      fetchData();
    } catch (err) {
      console.error("Update category failed", err);
    } finally {
      setLoadingAddUpdate(false);
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setNewName("");
    setOpen(true);
  };

  const openEditModal = (id: string, name: string) => {
    setEditId(id);
    setNewName(name);
    setOpen(true);
  };

  return (
    <div className="p-8 bg-stone-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-3xl md:text-4xl text-neutral-800">
          Categories
        </h1>
        <Button
          className="bg-black text-white hover:bg-neutral-800 shadow-md"
          onClick={openAddModal}
        >
          Add Category
        </Button>
      </div>
      <div className="overflow-x-auto bg-white rounded-sm shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-100">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <TableRow
                  key={cat._id}
                  className="border-b border-neutral-200/50"
                >
                  <TableCell className="font-medium max-w-[150px] truncate text-sm sm:text-base">
                    {cat.name}
                  </TableCell>
                  <TableCell className="flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      className="bg-neutral-800 text-white hover:bg-neutral-600 w-full sm:w-auto"
                      onClick={() => openEditModal(cat._id, cat.name)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-500 text-white hover:bg-red-600 w-full sm:w-auto"
                      onClick={() => handleDeleteCategory(cat._id)}
                      disabled={loadingDelete === cat._id}
                    >
                      {loadingDelete === cat._id ? "Deleting..." : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center py-10 text-gray-500 text-sm"
                >
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white rounded-xl shadow-lg">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Category name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              className="bg-neutral-800 text-white hover:bg-neutral-600 mr-2"
              onClick={editId ? handleUpdateCategory : handleAddCategory}
              disabled={loadingAddUpdate}
            >
              {loadingAddUpdate ? "Processing..." : editId ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
