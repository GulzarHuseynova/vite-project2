import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Image, Spin, Typography, Button, Tag } from "antd";
import { ProductService, type ProductItem } from "../../services/ProductService";
import { getArray, getProductImages, FALLBACK_IMG } from "../../utils/ProductHelpers";

const { Title, Text } = Typography;

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState<ProductItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await ProductService.getAll();
                const products = getArray<ProductItem>(res);
                setProduct(products.find(p => p.id === id) || null);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [id]);

    if (loading) {
        return (
            <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ padding: 40 }}>
                <Title level={3}>Product tapılmadı</Title>
                <Button onClick={() => navigate("/")}>Geri qayıt</Button>
            </div>
        );
    }

    const images = getProductImages(product);

    return (
        <div style={{ background: "#f5f6fa", minHeight: "100vh", padding: 40 }}>
            
            {/* BACK */}
            <Button
                onClick={() => navigate(-1)}
                style={{ marginBottom: 20, borderRadius: 8 }}
            >
                ← Geri
            </Button>

            <Card
                style={{
                    borderRadius: 18,
                    boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                }}
            >
                <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>

                    {/* LEFT IMAGE SECTION */}
                    <div style={{ flex: 1, minWidth: 320 }}>
                        
                        {/* MAIN IMAGE */}
                        <div style={{ borderRadius: 14, overflow: "hidden" }}>
                            <Image
                                src={images[activeImg] || FALLBACK_IMG}
                                fallback={FALLBACK_IMG}
                                style={{
                                    width: "100%",
                                    height: 420,
                                    objectFit: "cover",
                                    borderRadius: 14,
                                }}
                            />
                        </div>

                        {/* THUMBNAILS */}
                        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                            {images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    onClick={() => setActiveImg(i)}
                                    style={{
                                        width: 70,
                                        height: 70,
                                        objectFit: "cover",
                                        borderRadius: 10,
                                        cursor: "pointer",
                                        border: activeImg === i ? "2px solid #0ea5e9" : "1px solid #e5e7eb",
                                        transition: "0.2s",
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT INFO SECTION (sticky feel) */}
                    <div style={{ flex: 1, minWidth: 320 }}>
                        
                        <Tag color="blue" style={{ marginBottom: 10 }}>
                            SKU: {product.sku}
                        </Tag>

                        <Title level={2} style={{ marginBottom: 10 }}>
                            {product.name}
                        </Title>

                        <Text type="secondary">
                            {product.description || "Bu məhsul üçün əlavə açıqlama yoxdur."}
                        </Text>

                        {/* PRICE */}
                        <div
                            style={{
                                margin: '25px 25px',
                                padding: "12px 18px",
                                background: "linear-gradient(135deg,#0f172a,#1e293b)",
                                borderRadius: 12,
                                display: "inline-block",
                            }}
                        >
                            <span style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
                                {product.price} AZN
                            </span>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div style={{ marginTop: 30, display: "flex", gap: 10 }}>
                            <Button
                                type="primary"
                                size="large"
                                style={{
                                    background: "#0ea5e9",
                                    borderRadius: 10,
                                    padding: "0 20px",
                                }}
                            >
                                Add to Cart
                            </Button>

                            <Button
                                size="large"
                                style={{
                                    borderRadius: 10,
                                }}
                            >
                                ❤️ Wishlist
                            </Button>
                        </div>

                        {/* EXTRA INFO BLOCK */}
                        <div
                            style={{
                                marginTop: 30,
                                padding: 16,
                                border: "1px solid #e5e7eb",
                                borderRadius: 12,
                                background: "#fff",
                            }}
                        >
                            <Text type="secondary">
                                ✔ Sürətli çatdırılma <br />
                                ✔ 14 gün geri qaytarma <br />
                                ✔ 100% orijinal məhsul
                            </Text>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProductDetails;