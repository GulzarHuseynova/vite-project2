import { useCallback, useState } from "react";
import { message } from "antd";
import { ProductService, type ProductItem, type PaginatedProductsResponse } from "../services/ProductService";
import { getArray } from "../utils/ProductHelpers";

interface PaginationMeta {
    current: number;
    pageSize: number;
    total: number;
}

export const useProduct = () => {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [fetching, setFetching] = useState(false);
    const [pagination, setPagination] = useState<PaginationMeta>({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchProducts = useCallback(async (page = 1, pageSize = 10) => {
        try {
            setFetching(true);
            const res = await ProductService.getAll({ page, pageSize });

            setProducts(getArray<ProductItem>(res));

            const total = Array.isArray(res)
                ? 0
                : (res as PaginatedProductsResponse).totalCount
                ?? (res as PaginatedProductsResponse).total
                ?? 0;

            setPagination({ current: page, pageSize, total });
        } catch (error) {
            console.error(error);
            message.error("Products load failed");
        } finally {
            setFetching(false);
        }
    }, []);

   

    return { products, fetching, pagination, fetchProducts };
};
