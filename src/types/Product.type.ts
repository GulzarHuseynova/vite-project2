import type { ProductItem } from "../services/ProductService";

export interface ProductImage {
    url: string;
    sortOrder?: number;
    isMain?: boolean;
}

export interface ProductForm {
    name: string;
    sku: string;
    description?: string;
    price: number;
    stock: number;
    isActive?: boolean;
    imageUrl?: string;
    images?: ProductImage[];
}

export interface ProductFormValues {
    name: string;
    sku: string;
    description?: string;
    price: number;
    stock?: number;
    isActive?: boolean;
}
export interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingProduct?: ProductItem | null;
}