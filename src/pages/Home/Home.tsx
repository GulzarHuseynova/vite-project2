import { useEffect, useState } from "react";
import {
    Card,
    Row,
    Col,
    Spin,
    Image,
    Typography,
    Layout,
    Button,
    Badge,
    Space,

} from "antd";
import {
    ShoppingCartOutlined,
    ArrowRightOutlined,
    FireFilled,
    CodeSandboxOutlined,
    RocketOutlined,
    SafetyCertificateOutlined,
    CustomerServiceOutlined,
    SyncOutlined,
    HeartOutlined,
    SearchOutlined,
    AppstoreOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import {
    ProductService,
    type ProductItem,
} from "../../services/ProductService";

import {
    getArray,
    getProductImages,
    FALLBACK_IMG,
} from "../../utils/ProductHelpers";

const { Title, Text, Paragraph } = Typography;
const { Header, Footer, Content } = Layout;

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("Hamısı");

    const active = location.pathname === "/products" ? "products" : "home";

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await ProductService.getAll();
                setProducts(getArray<ProductItem>(res));
            } catch (error) {
                console.error("Məhsullar yüklənmədi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    if (loading) {
        return (
            <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#f8fafc" }}>
                <CodeSandboxOutlined style={{ fontSize: 40, color: "#38bdf8", marginBottom: 20 }} className="pulse-anim" />
                <Spin size="large" />
                <Text style={{ marginTop: 15, color: "#64748b", fontWeight: 500, letterSpacing: 1 }}>Premium Store Yüklənir...</Text>
                <style>{`.pulse-anim { animation: pulse 1.5s infinite ease-in-out; } @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 0.8; } }`}</style>
            </div>
        );
    }

    const navBtnStyle = (key: string) => ({
        background: "transparent",
        border: "none",
        color: active === key ? "#38bdf8" : "#e2e8f0",
        fontSize: 16,
        fontWeight: active === key ? 600 : 500,
        cursor: "pointer",
        padding: "8px 0",
        borderBottom: active === key ? "2px solid #38bdf8" : "2px solid transparent",
        transition: "all 0.3s ease",
    });

    const categories = ["Hamısı", "Geyim", "Texnologiya", "Aksessuarlar", "Ayaqqabı"];

    return (
        <Layout style={{ minHeight: "100vh", background: "#f8fafc" }}>

            <Header
                style={{
                    position: "sticky", top: 0, zIndex: 1000,
                    background: "rgba(15, 23, 42, 0.85)",
                    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "0 5%", height: 76,
                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)"
                }}
            >
                <div
                    style={{ fontWeight: 900, color: "white", fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, letterSpacing: "-0.5px" }}
                    onClick={() => navigate("/")}
                >
                    <div style={{ background: "linear-gradient(135deg, #38bdf8, #3b82f6)", borderRadius: 10, padding: 6, display: "flex" }}>
                        <CodeSandboxOutlined style={{ color: "white", fontSize: 24 }} />
                    </div>
                    MyShop
                </div>

                <div style={{ display: "flex", gap: 45, alignItems: "center" }}>
                    <button style={navBtnStyle("home")} onClick={() => navigate("/")}>Ana səhifə</button>
                    <button style={navBtnStyle("products")} onClick={() => navigate("/products")}>Məhsullar</button>
                </div>

                <Space size="middle" align="center">
                    <Button type="text" shape="circle" icon={<SearchOutlined style={{ fontSize: 20, color: "white" }} />} className="hover-icon" />

                </Space>
            </Header>

            <Content style={{ maxWidth: 1300, margin: "0 auto", width: "100%", padding: "40px 24px" }}>
                <div className="hero-section">
                    <div style={{ position: "relative", zIndex: 2 }}>
                        <Badge
                            count="⚡ HƏFTƏNİN ENDİRİMLƏRİ"
                            style={{ backgroundColor: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", padding: "0 12px", fontWeight: 700, letterSpacing: 1.5, marginBottom: 25, borderRadius: 20, border: "1px solid rgba(56, 189, 248, 0.4)" }}
                        />
                        <Title style={{ color: "white", fontSize: "4.5rem", fontWeight: 900, marginBottom: 20, letterSpacing: "-2px", lineHeight: 1.1 }}>
                            Kəşf Et. Seç. <br /><span style={{ background: "linear-gradient(to right, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Zövqlə Geyin.</span>
                        </Title>
                        <Paragraph style={{ color: "#cbd5e1", fontSize: "1.25rem", maxWidth: 600, margin: "0 auto 40px auto", fontWeight: 400, lineHeight: 1.7 }}>
                            Sizin üçün xüsusi seçilmiş premium kolleksiyalar.
                            Stilinizi ən son dünya trendləri ilə yeniləyin.
                        </Paragraph>
                        <Space size="middle">
                            <Button type="primary" size="large" shape="round" icon={<ArrowRightOutlined />} className="hero-btn-primary" onClick={() => navigate("/products")}>
                                Alış-verişə Başla
                            </Button>
                            <Button size="large" shape="round" icon={<AppstoreOutlined />} className="hero-btn-secondary">
                                Kolleksiyalar
                            </Button>
                        </Space>
                    </div>
                </div>

                <Row gutter={[24, 24]} justify="center" style={{ marginTop: "-90px", marginBottom: "90px", position: "relative", zIndex: 10, padding: "0 10px" }}>
                    {[
                        { icon: <RocketOutlined />, title: "Sürətli Çatdırılma", desc: "Ölkə daxili 24 saat ərzində" },
                        { icon: <SafetyCertificateOutlined />, title: "Təhlükəsiz Ödəniş", desc: "100% qorunan 3D sistem" },
                        { icon: <SyncOutlined />, title: "Asan Qaytarma", desc: "14 gün ərzində problemsiz" },
                        { icon: <CustomerServiceOutlined />, title: "24/7 Dəstək", desc: "Müştəri xidmətləri aktiv" },
                    ].map((feature, idx) => (
                        <Col xs={24} sm={12} md={6} key={idx}>
                            <div className="feature-card">
                                <div className="feature-icon-wrapper">
                                    {feature.icon}
                                </div>
                                <div>
                                    <Title level={5} style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{feature.title}</Title>
                                    <Text type="secondary" style={{ fontSize: 13, color: "#64748b" }}>{feature.desc}</Text>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>

                <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                            <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: "-0.5px", color: "#0f172a" }}>
                                <FireFilled style={{ color: "#ef4444", marginRight: 10 }} className="pulse-icon" />
                                Trend Məhsullar
                            </Title>
                            <Text style={{ fontSize: 15, color: "#64748b", marginTop: 4, display: "block" }}>Bu həftə ən çox satılanlar</Text>
                        </div>
                        <Button type="link" onClick={() => navigate("/products")} style={{ fontWeight: 600, fontSize: 15, color: "#0f172a", padding: 0 }} className="hover-link">
                            Hamısına bax <ArrowRightOutlined />
                        </Button>
                    </div>

                    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 10 }} className="hide-scrollbar">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                shape="round"
                                size="large"
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    border: activeCategory === cat ? "none" : "1px solid #e2e8f0",
                                    background: activeCategory === cat ? "#0f172a" : "white",
                                    color: activeCategory === cat ? "white" : "#475569",
                                    fontWeight: activeCategory === cat ? 600 : 500,
                                    boxShadow: activeCategory === cat ? "0 4px 15px rgba(15, 23, 42, 0.2)" : "none",
                                    padding: "0 24px"
                                }}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>

                <Row gutter={[32, 40]} justify="start">
                    {[...products].slice(-3).reverse().map((product) => {
                        const images = getProductImages(product);

                        return (
                            <Col xs={24} sm={12} md={8} key={product.id}>
                                <Badge.Ribbon text="TÜKƏNİR" color="#ef4444" placement="start" style={{ padding: "0 15px", height: 28, lineHeight: "28px", fontWeight: 700, top: 20, left: -5, zIndex: 10 }}>
                                    <Card
                                        hoverable
                                        className="premium-product-card"
                                        styles={{ body: { padding: "24px" } }}
                                        cover={
                                            <div className="img-container">
                                                <Image
                                                    src={images[0] ? images[0].replace("http://161.97.154.119", "") : FALLBACK_IMG}
                                                    fallback={FALLBACK_IMG}
                                                    preview={false}
                                                    style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }}
                                                />
                                                <Button
                                                    shape="circle"
                                                    icon={<HeartOutlined />}
                                                    className="wishlist-btn"
                                                />
                                            </div>
                                        }
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Text style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, color: "#94a3b8" }}>{product.sku}</Text>
                                            <div style={{ display: "flex", gap: 2 }}>
                                                {[1, 2, 3, 4, 5].map(star => <span key={star} style={{ color: "#fbbf24", fontSize: 12 }}>★</span>)}
                                            </div>
                                        </div>

                                        <Title level={4} style={{ marginTop: 8, marginBottom: 12, fontWeight: 800, color: "#0f172a" }} ellipsis={{ rows: 1, tooltip: product.name }}>
                                            {product.name}
                                        </Title>

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20, paddingBottom: 5 }}>
                                            <div>
                                                <Text style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 2 }}>Məhsulun qiyməti</Text>
                                                <Text strong style={{ fontSize: 26, color: "#0f172a", fontWeight: 900, lineHeight: 1 }}>
                                                    {product.price} <span style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}>AZN</span>
                                                </Text>
                                            </div>
                                            <Button
                                                shape="circle"
                                                type="primary"
                                                icon={<ShoppingCartOutlined />}
                                                className="cart-action-btn"
                                            />
                                        </div>

                                        <Button
                                            block
                                            shape="round"
                                            size="large"
                                            onClick={() => navigate(`/ProductDetail/${product.id}`)}
                                            className="detail-btn"
                                        >
                                            Daha Ətraflı
                                        </Button>
                                    </Card>
                                </Badge.Ribbon>
                            </Col>
                        );
                    })}
                </Row>
            </Content>

            {/* FOOTER */}
            <Footer style={{ marginTop: 120, background: "#0a0f1d", color: "#cbd5e1", padding: "80px 20px 30px" }}>
                <div style={{ maxWidth: 1300, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 60 }}>

                    {/* Brand & Newsletter */}
                    <div style={{ gridColumn: "1 / -1", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 30, paddingBottom: 50, borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 50 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 15 }}>
                                <div style={{ background: "#38bdf8", borderRadius: 8, padding: 5, display: "flex" }}>
                                    <CodeSandboxOutlined style={{ color: "white", fontSize: 28 }} />
                                </div>
                                <Title level={2} style={{ color: "white", margin: 0, fontWeight: 900, letterSpacing: "-1px" }}>MyShop</Title>
                            </div>
                            <p style={{ color: "#94a3b8", fontSize: 16, maxWidth: 400, margin: 0 }}>Rəqəmsal ticarətin yeni ünvanı. Ən yaxşı qiymət və 100% orijinal məhsul zəmanəti.</p>
                        </div>

                        {/* Bulletproof Newsletter Form */}
                        <div style={{ background: "rgba(255,255,255,0.03)", padding: 10, borderRadius: 100, border: "1px solid rgba(255,255,255,0.1)", display: "flex", width: "100%", maxWidth: 450 }}>
                            <input
                                placeholder="E-poçt ünvanınızı yazın..."
                                style={{ background: "transparent", border: "none", outline: "none", color: "white", padding: "0 20px", flex: 1, fontSize: 15 }}
                            />
                            <Button type="primary" shape="round" style={{ background: "#38bdf8", color: "#0f172a", fontWeight: 700, border: "none", height: 44, padding: "0 30px" }}>
                                Abunə Ol
                            </Button>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <Title level={5} style={{ color: "white", marginBottom: 25, fontWeight: 700, letterSpacing: 1 }}>SƏHİFƏLƏR</Title>
                        <p className="footer-link" onClick={() => navigate("/")}>Ana səhifə</p>
                        <p className="footer-link" onClick={() => navigate("/products")}>Məhsullar</p>
                        <p className="footer-link">Günün Fürsətləri</p>
                        <p className="footer-link">Haqqımızda</p>
                    </div>

                    <div>
                        <Title level={5} style={{ color: "white", marginBottom: 25, fontWeight: 700, letterSpacing: 1 }}>MÜŞTƏRİ XİDMƏTLƏRİ</Title>
                        <p className="footer-link">Tez-tez verilən suallar</p>
                        <p className="footer-link">Çatdırılma Şərtləri</p>
                        <p className="footer-link">Geri Qaytarma</p>
                        <p className="footer-link">Zəmanət</p>
                    </div>

                    <div>
                        <Title level={5} style={{ color: "white", marginBottom: 25, fontWeight: 700, letterSpacing: 1 }}>ƏLAQƏ</Title>
                        <div style={{ display: "flex", flexDirection: "column", gap: 15, color: "#94a3b8" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 12 }}><div className="contact-icon">📍</div> Bakı, Azərbaycan</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 12 }}><div className="contact-icon">📞</div> +994 50 123 45 67</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 12 }}><div className="contact-icon">✉️</div> support@myshop.az</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright bar */}
                <div style={{ maxWidth: 1300, margin: "60px auto 0", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 25, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
                    <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>
                        © 2024 MyShop Premium E-commerce. Bütün hüquqlar qorunur.
                    </span>
                    <div style={{ display: "flex", gap: 10 }}>
                        {["FB", "IG", "TW", "IN"].map(soc => (
                            <div key={soc} className="social-bubble">{soc}</div>
                        ))}
                    </div>
                </div>
            </Footer>

            {/* SUPER PREMIUM CSS STYLES & ANIMATIONS */}

        </Layout>
    );
};

export default Home;