import type { ProductItem } from "../services/ProductService";
import { resolveImageUrl } from "./ImageUrl";

export const FALLBACK_IMG =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAAI0lEQVRoge3BMQEAAADCoPVP7WsIoAAAAAAAAAAAAAAAeAMBxAAALJqiagAAAABJRU5ErkJggg==";

export const getProductImages = (
    product: ProductItem,
): string[] => {
    if (
        Array.isArray(product.images) &&
        product.images.length > 0
    ) {
        return product.images
            .map((img) => {
                if (
                    img &&
                    typeof img === "object" &&
                    typeof img.url === "string"
                ) {
                    return resolveImageUrl(
                        img.url,
                    );
                }

                return null;
            })
            .filter(Boolean) as string[];
    }

    if (product.imageUrl) {
        return [
            resolveImageUrl(
                product.imageUrl,
            ),
        ];
    }

    return [];
};

export const getArray = <T,>(
    response: unknown,
): T[] => {
    if (Array.isArray(response)) {
        return response as T[];
    }

    if (
        response &&
        typeof response === "object"
    ) {
        const obj = response as {
            data?: unknown;
            items?: unknown;
        };

        if (
            Array.isArray(obj.data)
        ) {
            return obj.data as T[];
        }

        if (
            Array.isArray(obj.items)
        ) {
            return obj.items as T[];
        }
    }

    return [];
};