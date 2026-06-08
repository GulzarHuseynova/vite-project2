import axiosInstance from "./AxiosInstance";

export interface ProductImage {
    id?: string;
    url: string;
    sortOrder?: number;
    isMain?: boolean;
}

export interface ProductItem {
    id: string;
    name: string;
    sku: string;
    description?: string;
    price: number;
    stock?: number;
    imageUrl?: string;
    images?: ProductImage[];
}

export interface PaginatedProductsResponse {
    data?: ProductItem[] | {
        items?: ProductItem[];
    };
    items?: ProductItem[];
    total?: number;
    totalCount?: number;
    meta?: {
        total?: number;
    };
}

export type GetProductsResponse =
    | ProductItem[]
    | PaginatedProductsResponse;


export type GetAllParams = {
    page?: number;
    pageSize?: number;
    search?: string;
    sort?: string;
    minPrice?: number | null;
    maxPrice?: number | null;
    category?: string; 
};

export const ProductService = {
    getAll: async (
        params?: GetAllParams,
    ): Promise<GetProductsResponse> => {
        const res =
            await axiosInstance.get<GetProductsResponse>(
                "/products",
                {
                    params,
                },
            );

        return res.data;
    },

    getById: async (
        id: string,
    ): Promise<ProductItem> => {
        const res =
            await axiosInstance.get<ProductItem>(
                `/products/${id}`,
            );

        return res.data;
    },

    // ── Yeni Əlavə Olunan Metod ──
    // Backend-də kateqoriya endpoint-iniz hansıdırsa ("" daxilində onu yazın, məsələn: "/products/categories" və ya "/categories")
    getCategories: async (): Promise<string[]> => {
        const res = await axiosInstance.get<string[]>("/products/categories");
        return res.data;
    },
};