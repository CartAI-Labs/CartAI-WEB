import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { productService } from "../../../services/productService";
import type { Product, CreateProductRequest, UpdateProductRequest } from "../../../domain/shopModels";

export type ImageItem = 
  | { type: 'existing'; id: string }
  | { type: 'new'; file: File; previewUrl: string; id: string };

export function useProductManagement() {
  const { t: translate } = useTranslation();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState<"create" | "edit" | null>(null);

  const initialFormState = {
    id: "",
    name: "",
    description: "",
    price: 0,
    stock: 0,
    imageFileIds: [] as string[],
    attributes: undefined as Record<string, string> | undefined,
  };

  const [form, setForm] = useState(initialFormState);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      toast.error(translate("admin.errorLoadingProducts"));
    } finally {
      setLoading(false);
    }
  }, [translate]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateModal = () => {
    setForm(initialFormState);
    setImages([]);
    setShowModal("create");
  };

  const openEditModal = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageFileIds: product.imageFileIds || [],
      attributes: product.attributes,
    });
    setImages((product.imageFileIds || []).map(id => ({ type: 'existing', id })));
    setShowModal("edit");
  };

  const closeModal = () => {
    setShowModal(null);
    setForm(initialFormState);
    setImages([]);
  };

  const handleFormChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    const newItems = Array.from(files).map(file => ({
      type: 'new' as const,
      file,
      previewUrl: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(2, 9)
    }));
    setImages(prev => [...prev, ...newItems]);
  };

  const setMainImage = (index: number) => {
    setImages(prev => {
      const arr = [...prev];
      const [item] = arr.splice(index, 1);
      arr.unshift(item);
      return arr;
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const processImagesForUpload = async (): Promise<string[]> => {
    const finalImageIds: string[] = [];
    for (const img of images) {
      if (img.type === 'existing') {
        finalImageIds.push(img.id);
      } else {
        const fileId = await productService.uploadImage(img.file);
        finalImageIds.push(fileId);
      }
    }
    return finalImageIds;
  };

  const onCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || form.price < 0 || form.stock < 0) {
      toast.error(translate("admin.errorFillAllFields"));
      return;
    }

    try {
      setIsSubmitting(true);
      const finalImageIds = await processImagesForUpload();

      const request: CreateProductRequest = {
        name: form.name,
        description: form.description,
        price: form.price,
        stock: form.stock,
        imageFileIds: finalImageIds,
        attributes: form.attributes,
      };

      await productService.createProduct(request);
      toast.success(translate("admin.productCreatedSuccess"));
      closeModal();
      loadProducts();
    } catch (error) {
      toast.error(translate("admin.errorCreatingProduct"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.name || !form.description || form.price < 0 || form.stock < 0) {
      toast.error(translate("admin.errorFillAllFields"));
      return;
    }

    try {
      setIsSubmitting(true);
      const finalImageIds = await processImagesForUpload();

      const request: UpdateProductRequest = {
        id: form.id,
        name: form.name,
        description: form.description,
        price: form.price,
        stock: form.stock,
        imageFileIds: finalImageIds,
        attributes: form.attributes,
      };

      await productService.updateProduct(request);
      toast.success(translate("admin.productUpdatedSuccess"));
      closeModal();
      loadProducts();
    } catch (error) {
      toast.error(translate("admin.errorUpdatingProduct"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm(translate("admin.confirmDeleteProduct"))) return;

    try {
      await productService.deleteProduct(id);
      toast.success(translate("admin.productDeletedSuccess"));
      loadProducts();
    } catch (error) {
      toast.error(translate("admin.errorDeletingProduct"));
    }
  };

  return {
    filteredProducts,
    loading,
    searchQuery,
    setSearchQuery,
    showModal,
    form,
    images,
    isSubmitting,
    openCreateModal,
    openEditModal,
    closeModal,
    handleFormChange,
    handleImageChange,
    setMainImage,
    removeImage,
    onCreateSubmit,
    onEditSubmit,
    handleDeleteProduct,
    translate,
  };
}
