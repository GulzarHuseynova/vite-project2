import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Card, Typography, Button, Image, Input, Select, Row, Col, Space, Drawer, Badge, Layout } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    SearchOutlined, ArrowUpOutlined, ArrowDownOutlined,
    SortAscendingOutlined, SortDescendingOutlined, PlusOutlined,
    AppstoreOutlined, FilterOutlined, CloseOutlined, CodeSandboxOutlined,
    FireOutlined
} from "@ant-design/icons";
import { ProductService, type ProductItem, type GetAllParams } from "../../src/services/ProductService";
import CategoryService from "../../src/services/CategoryService";
import { getProductImages, FALLBACK_IMG } from "../../src/utils/ProductHelpers";

const { Title, Text } = Typography;
const { Option } = Select;
const { Header } = Layout;
const pageSize = 12;

interface CategoryType {
    id: string | number;
    name: string;
}
interface NestedCategory {
    id?: string | number;
    name?: string;
}
interface ProductItemWithCategory extends ProductItem {
    category?: string | number | NestedCategory;
    categoryId?: string | number;
}

const Product = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [allProducts, setAllProducts] = useState<ProductItemWithCategory[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const page = Number(searchParams.get("page") ?? "1");
    const search = searchParams.get("search") ?? "";
    const sort = searchParams.get("sort") ?? "";
    const minPriceRaw = searchParams.get("minPrice") ?? "";
    const maxPriceRaw = searchParams.get("maxPrice") ?? "";
    const category = searchParams.get("category") ?? "";

    const [localSearch, setLocalSearch] = useState(search);
    const isUserTyping = useRef(false);

    const activeFilterCount = [sort, minPriceRaw, maxPriceRaw, category].filter(Boolean).length;
    const navBtnStyle = (path: string) => ({
        background: "transparent",
        border: "none",
        borderBottom: path === "products" ? "2px solid #38bdf8" : "2px solid transparent",
        paddingBottom: "8px",
        color: "white",
        fontSize: "16px",
        fontWeight: 500,
        cursor: "pointer",
        opacity: path === "products" ? 1 : 0.7,
        transition: "opacity 0.3s"
    });

    const updateUrlFilter = useCallback((key: string, value: string) => {
        const params = Object.fromEntries(searchParams.entries());
        if (value.trim()) { params[key] = value.trim(); } else { delete params[key]; }
        params["page"] = "1";
        setSearchParams(params, { replace: true });
    }, [searchParams, setSearchParams]);

    const clearAllFilters = useCallback(() => {
        const params = Object.fromEntries(searchParams.entries());
        delete params["sort"];
        delete params["minPrice"];
        delete params["maxPrice"];
        delete params["category"];
        params["page"] = "1";
        setSearchParams(params, { replace: true });
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryResponse = await CategoryService.getOptions();

                const resData = (categoryResponse && typeof categoryResponse === "object" && "data" in categoryResponse)
                    ? (categoryResponse as Record<string, unknown>).data
                    : categoryResponse;

                let rawList: unknown[] = [];
                if (Array.isArray(resData)) {
                    rawList = resData;
                } else if (resData && typeof resData === "object") {
                    const r = resData as Record<string, unknown>;
                    const innerList = r.data || r.items || r.options;
                    if (Array.isArray(innerList)) {
                        rawList = innerList;
                    }
                }

                const parsedCats: CategoryType[] = rawList.map(cat => {
                    if (typeof cat === "string") return { id: cat, name: cat };
                    if (cat && typeof cat === "object") {
                        const c = cat as Record<string, unknown>;
                        const catId = c.id ?? c.categoryId ?? c.value ?? c._id ?? "";
                        const catName = c.name ?? c.title ?? c.label ?? c.categoryName ?? "";
                        return {
                            id: String(catId),
                            name: String(catName)
                        };
                    }
                    return { id: "", name: "" };
                }).filter(c => c.id && c.name);

                setCategories(parsedCats);
            } catch (err) {
                console.error("Categories error:", err);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            setLoading(true);
            try {

                const params: GetAllParams & { categoryId?: string; name?: string } = {
                    page,
                    pageSize,
                    search: search || undefined,
                    name: search ? search.trim() : undefined,
                    minPrice: minPriceRaw ? Number(minPriceRaw) : undefined,
                    maxPrice: maxPriceRaw ? Number(maxPriceRaw) : undefined,
                    categoryId: category || undefined,
                };

                const res = await ProductService.getAll(params);
                if (!isMounted) return;

                const items: ProductItemWithCategory[] = Array.isArray(res) ? res
                    : (res as { data?: ProductItemWithCategory[]; items?: ProductItemWithCategory[]; products?: ProductItemWithCategory[] }).data
                    || (res as { data?: ProductItemWithCategory[]; items?: ProductItemWithCategory[]; products?: ProductItemWithCategory[] }).items
                    || (res as { data?: ProductItemWithCategory[]; items?: ProductItemWithCategory[]; products?: ProductItemWithCategory[] }).products
                    || [];

                setAllProducts(page === 1 ? items : prev => [...prev, ...items]);
                setHasMore(items.length === pageSize);
            } catch (err) {
                console.error("Məhsul yüklənərkən xəta:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        load();
        return () => { isMounted = false; };
    }, [page, search, minPriceRaw, maxPriceRaw, category]);


    const filteredProducts = useMemo(() => {
        const result = [...allProducts];

        if (sort) {
            result.sort((a, b) => {
                if (sort === "price_asc") return a.price - b.price;
                if (sort === "price_desc") return b.price - a.price;
                if (sort === "name_asc") return a.name.localeCompare(b.name);
                if (sort === "name_desc") return b.name.localeCompare(a.name);
                return 0;
            });
        }

        return result;
    }, [allProducts, sort]);

    useEffect(() => {
        if (!isUserTyping.current) return;
        const timer = setTimeout(() => {
            isUserTyping.current = false;
            if (localSearch !== search) updateUrlFilter("search", localSearch);
        }, 400);
        return () => clearTimeout(timer);
    }, [localSearch, search, updateUrlFilter]);

    const handleLoadMore = () => {
        const params = Object.fromEntries(searchParams.entries());
        params["page"] = String(page + 1);
        setSearchParams(params);
    };

    return (
        <div className="premium-page-wrapper">

            {/* Skrollu əngəlləyən təhlükəsiz Background Konteyneri */}
            <div className="bg-container">
                <div className="bg-shape shape-1"></div>
                <div className="bg-shape shape-2"></div>
                <div className="bg-shape shape-3"></div>
            </div>

            <div className="content-layer">
                <Header
                    style={{
                        position: "sticky", top: 0, zIndex: 1000,
                        background: "rgba(15, 23, 42, 0.75)",
                        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "0 5%", height: 80,
                        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)"
                    }}
                >
                    <div
                        style={{ fontWeight: 900, color: "white", fontSize: 26, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, letterSpacing: "-0.5px", fontFamily: "'Outfit', sans-serif" }}
                        onClick={() => navigate("/")}
                    >
                        <div style={{ background: "linear-gradient(135deg, #38bdf8, #6366f1)", borderRadius: 12, padding: 8, display: "flex", boxShadow: "0 4px 20px rgba(56, 189, 248, 0.5)" }}>
                            <CodeSandboxOutlined style={{ color: "white", fontSize: 26 }} />
                        </div>
                        MyShop<span style={{ color: "#38bdf8", fontSize: 32, lineHeight: 0 }}>.</span>
                    </div>

                    <div style={{ display: "flex", gap: 45, alignItems: "center" }}>
                        <button style={navBtnStyle("home")} onClick={() => navigate("/")}>Ana səhifə</button>
                        <button style={navBtnStyle("products")} onClick={() => navigate("/products")}>Məhsullar</button>
                    </div>

                    <Space size="middle" align="center">
                        <Button type="text" shape="circle" icon={<SearchOutlined style={{ fontSize: 22, color: "white" }} />} className="hover-icon" />
                    </Space>
                </Header>

                <div style={{ padding: "40px 24px", maxWidth: 1280, margin: "0 auto" }}>

                    <div className="premium-hero-banner">
                        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                            <div style={{
                                background: "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(99,102,241,0.2))",
                                borderRadius: 20,
                                padding: "16px",
                                display: "flex",
                                border: "1px solid rgba(255,255,255,0.5)",
                                boxShadow: "inset 0 2px 10px rgba(255,255,255,0.5)"
                            }}>
                                <AppstoreOutlined style={{ color: "#38bdf8", fontSize: 32 }} />
                            </div>
                            <div>
                                <Title level={1} style={{ margin: 0, color: "#0f172a", fontWeight: 800, letterSpacing: "-1px", fontSize: 36 }}>
                                    Xüsusi <span style={{ color: "transparent", backgroundClip: "text", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(135deg, #38bdf8, #6366f1)" }}>Kolleksiya</span>
                                </Title>
                                <Text style={{ color: "#64748b", fontSize: 17, fontWeight: 500, letterSpacing: "0.2px" }}>
                                    Zövqünüzə oxşayacaq ən son texnologiya və trendlər.
                                </Text>
                            </div>
                        </div>
                        <div className="hero-icon-container">
                            <FireOutlined style={{ fontSize: 80, color: "rgba(56, 189, 248, 0.1)" }} />
                        </div>
                    </div>

                    <Card className="filter-card" style={{ marginBottom: 40 }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col flex="auto">
                                <Input
                                    placeholder="Nə axtarırsınız? (Məs: Noutbuk, Telefon...)"
                                    prefix={<SearchOutlined style={{ color: "#38bdf8", fontSize: 20 }} />}
                                    value={localSearch}
                                    onChange={(e) => { isUserTyping.current = true; setLocalSearch(e.target.value); }}
                                    onClear={() => updateUrlFilter("search", "")}
                                    allowClear
                                    size="large"
                                    style={{ borderRadius: 16, border: "1px solid #e2e8f0", padding: "10px 20px", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.02)", fontSize: 16 }}
                                />
                            </Col>
                            <Col>
                                <Badge count={activeFilterCount} size="medium" offset={[-6, 6]} color="#6366f1" style={{ boxShadow: "0 0 0 2px #fff" }}>
                                    <Button
                                        size="large"
                                        icon={<FilterOutlined />}
                                        onClick={() => setDrawerOpen(true)}
                                        style={{
                                            borderRadius: 16,
                                            height: 52,
                                            padding: "0 28px",
                                            borderColor: activeFilterCount > 0 ? "#6366f1" : "#e2e8f0",
                                            color: activeFilterCount > 0 ? "#6366f1" : "#475569",
                                            fontWeight: 700,
                                            background: activeFilterCount > 0 ? "rgba(99,102,241,0.05)" : "white",
                                            fontSize: 16
                                        }}
                                    >
                                        Filtrlər
                                    </Button>
                                </Badge>
                            </Col>
                        </Row>
                    </Card>

                    <Drawer
                        title={
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Space>
                                    <div style={{ background: "rgba(56,189,248,0.1)", padding: 8, borderRadius: 10, display: "flex" }}>
                                        <FilterOutlined style={{ color: "#38bdf8", fontSize: 20 }} />
                                    </div>
                                    <span style={{ fontWeight: 800, fontSize: 20, color: "#0f172a" }}>Filtrlər</span>
                                </Space>
                                {activeFilterCount > 0 && (
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<CloseOutlined />}
                                        onClick={clearAllFilters}
                                        style={{ color: "#ef4444", fontWeight: 700, background: "rgba(239, 68, 68, 0.1)", borderRadius: 8, padding: "4px 12px", height: "auto" }}
                                    >
                                        Təmizlə
                                    </Button>
                                )}
                            </div>
                        }
                        placement="right"
                        onClose={() => setDrawerOpen(false)}
                        open={drawerOpen}
                        size="default"
                        styles={{ body: { padding: "32px 24px", background: "#f8fafc" }, header: { borderBottom: "1px solid rgba(0,0,0,0.04)", padding: "24px", background: "white" } }}
                        closeIcon={false}
                    >
                        <div style={{ marginBottom: 32 }}>
                            <Text strong style={{ display: "block", marginBottom: 12, color: "#334155", fontSize: 16, fontWeight: 700 }}>
                                Kateqoriya
                            </Text>
                            <Select
                                value={category || "all"}
                                onChange={(val) => updateUrlFilter("category", val === "all" ? "" : String(val))}
                                style={{ width: "100%" }}
                                size="large"
                                loading={categories.length === 0}
                                styles={{ popup: { root: { borderRadius: 16 } } }}
                            >
                                <Option value="all">Bütün kateqoriyalar</Option>
                                {categories.map((cat) => (
                                    <Option key={cat.id} value={String(cat.id)}>
                                        {cat.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <Text strong style={{ display: "block", marginBottom: 12, color: "#334155", fontSize: 16, fontWeight: 700 }}>
                                Qiymət aralığı (AZN)
                            </Text>
                            <Space.Compact style={{ width: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", borderRadius: 16 }} size="large">
                                <Input
                                    placeholder="Min"
                                    type="number"
                                    value={minPriceRaw}
                                    onChange={(e) => updateUrlFilter("minPrice", e.target.value)}
                                    style={{ textAlign: "center", borderRadius: "16px 0 0 16px", height: 50 }}
                                />
                                <Input
                                    placeholder="Max"
                                    type="number"
                                    value={maxPriceRaw}
                                    onChange={(e) => updateUrlFilter("maxPrice", e.target.value)}
                                    style={{ textAlign: "center", borderRadius: "0 16px 16px 0", height: 50 }}
                                />
                            </Space.Compact>
                        </div>

                        <div style={{ marginBottom: 40 }}>
                            <Text strong style={{ display: "block", marginBottom: 12, color: "#334155", fontSize: 16, fontWeight: 700 }}>
                                Sıralama
                            </Text>
                            <Select
                                value={sort || "default"}
                                onChange={(val) => updateUrlFilter("sort", val === "default" ? "" : val)}
                                style={{ width: "100%" }}
                                size="large"
                                styles={{ popup: { root: { borderRadius: 16 } } }}
                            >
                                <Option value="default">Seçim edin</Option>
                                <Option value="price_asc"><Space><SortAscendingOutlined style={{ color: "#6366f1" }} /> Qiymət: Ucuzdan bahaya</Space></Option>
                                <Option value="price_desc"><Space><SortDescendingOutlined style={{ color: "#6366f1" }} /> Qiymət: Bahadan ucuza</Space></Option>
                                <Option value="name_asc"><Space><ArrowUpOutlined style={{ color: "#6366f1" }} /> Ad: A-Z</Space></Option>
                                <Option value="name_desc"><Space><ArrowDownOutlined style={{ color: "#6366f1" }} /> Ad: Z-A</Space></Option>
                            </Select>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            block
                            onClick={() => setDrawerOpen(false)}
                            style={{
                                borderRadius: 16,
                                height: 56,
                                background: "linear-gradient(135deg, #38bdf8, #6366f1)",
                                border: "none",
                                fontWeight: 800,
                                fontSize: 17,
                                boxShadow: "0 12px 24px -6px rgba(99, 102, 241, 0.4)",
                                letterSpacing: "0.5px"
                            }}
                        >
                            Nəticələri Göstər
                        </Button>
                    </Drawer>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 36 }}>
                        {filteredProducts.map((product: ProductItemWithCategory, index) => {
                            const images = getProductImages(product);
                            const isHot = index === 0 || index === 3;
                            return (
                                <Card
                                    key={product.id}
                                    hoverable
                                    className="prod-card"
                                    styles={{ body: { padding: "28px 24px 24px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" } }}
                                    style={{ display: "flex", flexDirection: "column", animation: `fadeUp 0.6s ease forwards ${index * 0.05}s`, opacity: 0 }}
                                >
                                    {isHot && <div className="premium-badge">🔥 Trend</div>}

                                    {/* Image */}
                                    <div className="prod-card-img">
                                        <Image
                                            src={images[0] ? images[0].replace("http://161.97.154.119", "") : FALLBACK_IMG}
                                            fallback={FALLBACK_IMG}
                                            preview={false}
                                            style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <Title level={5} style={{ margin: "0 0 8px", fontSize: 19, color: "#0f172a", fontWeight: 800, lineHeight: 1.3 }}>
                                            {product.name}
                                        </Title>
                                        <Text type="secondary" style={{ fontSize: 14, fontWeight: 500, color: "#94a3b8" }}>SKU: <span style={{ color: "#64748b" }}>{product.sku}</span></Text>
                                    </div>

                                    {/* Price + Button */}
                                    <div style={{ marginTop: 28 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
                                            <div>
                                                <Text style={{ color: "#64748b", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Qiymət</Text>
                                                <Text strong style={{ color: "#0f172a", fontSize: 28, fontWeight: 900, lineHeight: 1 }}>
                                                    {product.price} <span style={{ fontSize: 15, fontWeight: 800, color: "#64748b" }}>AZN</span>
                                                </Text>
                                            </div>
                                            <div style={{ display: "flex", gap: 3, background: "#fffbeb", padding: "6px 10px", borderRadius: 10, border: "1px solid #fef3c7" }}>
                                                {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: "#fbbf24", fontSize: 13 }}>★</span>)}
                                            </div>
                                        </div>
                                        <button className="prod-detail-btn" onClick={() => navigate(`/ProductDetail/${product.id}`)}>
                                            Ətraflı İncələ
                                        </button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    {!loading && filteredProducts.length === 0 && (
                        <div style={{ textAlign: "center", padding: "120px 0", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", borderRadius: 32, marginTop: 40, border: "2px dashed #cbd5e1" }}>
                            <div style={{ fontSize: 72, marginBottom: 24, filter: "drop-shadow(0 15px 15px rgba(0,0,0,0.08))" }}>🛍️</div>
                            <Title level={2} style={{ color: "#0f172a", fontWeight: 900, letterSpacing: "-0.5px" }}>Təəssüf ki, heç nə tapılmadı</Title>
                            <Text style={{ color: "#64748b", fontSize: 18, fontWeight: 500 }}>Fərqli axtarış sözü və ya filtrasiya ilə yenidən yoxlayın.</Text>
                            <br />
                            <Button type="primary" size="large" onClick={clearAllFilters} style={{ marginTop: 24, borderRadius: 12, background: "#0f172a", height: 48, padding: "0 32px" }}>
                                Bütün filtrləri sıfırla
                            </Button>
                        </div>
                    )}

                    {hasMore && filteredProducts.length > 0 && (
                        <div style={{ textAlign: "center", marginTop: 64, marginBottom: 40 }}>
                            <Button
                                className="load-more-btn"
                                type="primary"
                                loading={loading}
                                onClick={handleLoadMore}
                                icon={!loading && <PlusOutlined />}
                                size="large"
                            >
                                Daha Çox Kəşf Et
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Product;