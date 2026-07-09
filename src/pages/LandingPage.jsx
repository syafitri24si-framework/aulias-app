// src/pages/LandingPage.jsx - PROFESIONAL & CLEAN! (FIXED)
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
    FaUsers, FaClipboardList, FaTrophy, FaChartLine, 
    FaTags, FaUserPlus, FaArrowRight, FaInstagram, 
    FaTiktok, FaWhatsapp, FaChevronLeft, FaChevronRight,
    FaQuoteLeft, FaShieldAlt, FaBuilding, FaCoffee
} from 'react-icons/fa';
import logoRotte from '../assets/logo_rotte.png';

// ================================================================
// WARNA
// ================================================================
const PRIMARY = "#5E81F4";
const PRIMARY_DARK = "#1B51E5";
const GOLD = "#D4AF37";
const DARK = "#1A1A2E";
const TEXT = "#464A5F";
const TEXT_SECONDARY = "#64748B"; // ← SUDAH DITAMBAHKAN!
const LIGHT_BG = "#F8F9FC";

// ================================================================
// DATA
// ================================================================

const features = [
    {
        title: 'Manajemen Pelanggan',
        description: 'Kelola data pelanggan, riwayat transaksi, dan preferensi member dengan mudah dan terstruktur.',
        icon: <FaUsers size={22} />
    },
    {
        title: 'Transaksi Kasir',
        description: 'Proses pembayaran cepat dengan sistem poin dan tier loyalty yang terintegrasi penuh.',
        icon: <FaClipboardList size={22} />
    },
    {
        title: 'Program Loyalitas',
        description: 'Sistem tier Bronze, Silver, dan Gold dengan poin reward untuk setiap pembelian pelanggan.',
        icon: <FaTrophy size={22} />
    },
    {
        title: 'Laporan & Analitik',
        description: 'Dashboard interaktif dengan grafik penjualan, top produk, dan laporan churn pelanggan.',
        icon: <FaChartLine size={22} />
    },
    {
        title: 'Manajemen Promo',
        description: 'Buat dan kelola promo, diskon, bundling dengan target segmen pelanggan tertentu.',
        icon: <FaTags size={22} />
    },
    {
        title: 'Self-Service Customer',
        description: 'Pelanggan dapat login untuk melihat profil, poin, dan riwayat transaksi mereka sendiri.',
        icon: <FaUserPlus size={22} />
    }
];

const testimonials = [
    {
        id: 1,
        name: 'Aisyah Putri',
        role: 'Pemilik Manis Bakery',
        quote: 'Rotte benar-benar mengubah cara saya mengelola toko. Semua data pelanggan rapi dan pesanan lebih terpantau.'
    },
    {
        id: 2,
        name: 'Rama Wijaya',
        role: 'Pemilik Roti Raya',
        quote: 'Fitur loyalitas sangat membantu mempertahankan pelanggan. Program promo jadi lebih mudah dijalankan.'
    },
    {
        id: 3,
        name: 'Dewi Lestari',
        role: 'Pemilik Cake & Co',
        quote: 'Laporan ringkas membantu saya mengambil keputusan bisnis dengan cepat. Sangat direkomendasikan.'
    }
];

const promos = [
    {
        id: 1,
        title: 'Diskon 20% untuk Member Gold',
        description: 'Khusus pelanggan tier Gold, berlaku untuk semua produk roti dan kue.',
        validUntil: '30 Juni 2026',
        discount: '20%'
    },
    {
        id: 2,
        title: 'Beli 2 Roti Coklat Gratis 1',
        description: 'Promo bundling untuk semua varian roti coklat, minimal pembelian 2 pcs.',
        validUntil: '15 Juli 2026',
        discount: 'Buy 2 Get 1'
    },
    {
        id: 3,
        title: 'Free Delivery min. Rp 50.000',
        description: 'Gratis ongkir untuk area Kota dengan minimal belanja Rp 50.000.',
        validUntil: '31 Juli 2026',
        discount: 'Free Ongkir'
    }
];

// ================================================================
// COMPONENTS
// ================================================================

// ===== HEADER =====
function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: '12px 32px',
            background: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(16px)',
            borderBottom: scrolled ? `1px solid ${PRIMARY}15` : 'none',
            boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.3s ease'
        }}>
            <div style={{
                maxWidth: 1200,
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    textDecoration: 'none'
                }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${PRIMARY}40`
                    }}>
                        <img src={logoRotte} alt="Rotte" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                    </div>
                    <span style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: DARK,
                        letterSpacing: '-0.3px'
                    }}>
                        Rotte<span style={{ color: PRIMARY }}>.</span>
                    </span>
                </Link>

                <nav style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    fontFamily: "'Inter', sans-serif"
                }}>
                    {['Fitur', 'Testimoni', 'Promo'].map((item, idx) => {
                        const href = ['#features', '#testimonials', '#promos'][idx];
                        return (
                            <a key={item} href={href} style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: TEXT,
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={e => e.target.style.color = PRIMARY}
                            onMouseLeave={e => e.target.style.color = TEXT}>
                                {item}
                            </a>
                        );
                    })}
                    <Link to="/login" style={{
                        background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
                        color: '#FFFFFF',
                        padding: '8px 22px',
                        borderRadius: 9999,
                        fontSize: 13,
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: `0 4px 16px ${PRIMARY}40`
                    }}
                    onMouseEnter={e => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = `0 8px 24px ${PRIMARY}60`;
                    }}
                    onMouseLeave={e => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = `0 4px 16px ${PRIMARY}40`;
                    }}>
                        Masuk
                    </Link>
                </nav>
            </div>
        </header>
    );
}

// ===== HERO =====
function Hero() {
    return (
        <section style={{
            padding: '120px 32px 80px 32px',
            background: `linear-gradient(135deg, #FFFFFF 0%, ${LIGHT_BG} 100%)`,
            position: 'relative',
            overflow: 'hidden',
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center'
        }}>
            <div style={{
                position: 'absolute',
                top: -200,
                right: -100,
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: `${PRIMARY}04`,
                pointerEvents: 'none'
            }} />

            <div style={{
                maxWidth: 1200,
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 60,
                alignItems: 'center',
                width: '100%',
                position: 'relative',
                zIndex: 2
            }}>
                <div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: `${PRIMARY}10`,
                        padding: '4px 14px',
                        borderRadius: 9999,
                        marginBottom: 20
                    }}>
                        <span style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: PRIMARY
                        }}>
                            Rotte Bakery CRM
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: 44,
                        fontWeight: 800,
                        color: DARK,
                        lineHeight: 1.15,
                        margin: 0,
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: '-1px'
                    }}>
                        Kelola Toko Roti
                        <br />
                        dengan{' '}
                        <span style={{ color: PRIMARY }}>Lebih Rapi</span>
                        {' '}dan{' '}
                        <span style={{ color: GOLD }}>Lebih Cepat</span>
                    </h1>

                    <p style={{
                        fontSize: 16,
                        color: TEXT,
                        lineHeight: 1.8,
                        marginTop: 16,
                        maxWidth: 480
                    }}>
                        Rotte membantu pemilik toko roti mengelola pelanggan, pesanan, 
                        loyalitas, dan laporan dari satu platform yang terintegrasi.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: 12,
                        marginTop: 28,
                        flexWrap: 'wrap'
                    }}>
                        <Link to="/login" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
                            color: '#FFFFFF',
                            padding: '12px 32px',
                            borderRadius: 9999,
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            boxShadow: `0 4px 16px ${PRIMARY}40`
                        }}
                        onMouseEnter={e => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = `0 8px 28px ${PRIMARY}60`;
                        }}
                        onMouseLeave={e => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = `0 4px 16px ${PRIMARY}40`;
                        }}>
                            Masuk <FaArrowRight size={13} />
                        </Link>
                        <a href="#features" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            background: '#FFFFFF',
                            color: PRIMARY,
                            padding: '12px 28px',
                            borderRadius: 9999,
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: 'none',
                            border: `1.5px solid ${PRIMARY}20`,
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={e => {
                            e.target.style.borderColor = PRIMARY;
                            e.target.style.boxShadow = `0 4px 16px ${PRIMARY}10`;
                        }}
                        onMouseLeave={e => {
                            e.target.style.borderColor = `${PRIMARY}20`;
                            e.target.style.boxShadow = 'none';
                        }}>
                            Lihat Fitur
                        </a>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: 40,
                        marginTop: 44,
                        paddingTop: 28,
                        borderTop: `1px solid ${PRIMARY}10`
                    }}>
                        <div>
                            <div style={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: PRIMARY
                            }}>150+</div>
                            <div style={{ fontSize: 13, color: TEXT }}>Toko Roti</div>
                        </div>
                        <div>
                            <div style={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: GOLD
                            }}>4.8</div>
                            <div style={{ fontSize: 13, color: TEXT }}>Rating Kepuasan</div>
                        </div>
                        <div>
                            <div style={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: PRIMARY
                            }}>25K+</div>
                            <div style={{ fontSize: 13, color: TEXT }}>Transaksi</div>
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16
                }}>
                    {[
                        { icon: <FaUsers size={20} />, title: 'Customer', desc: 'Terorganisir', color: PRIMARY },
                        { icon: <FaClipboardList size={20} />, title: 'Order', desc: 'Terpantau', color: GOLD },
                        { icon: <FaTrophy size={20} />, title: 'Loyalty', desc: 'Program', color: '#A78BFA' },
                        { icon: <FaChartLine size={20} />, title: 'Reports', desc: 'Lengkap', color: '#E8637A' }
                    ].map((item, idx) => (
                        <div key={idx} style={{
                            background: '#FFFFFF',
                            borderRadius: 14,
                            padding: '24px 20px',
                            border: `1px solid ${PRIMARY}10`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                            transition: 'all 0.3s ease',
                            textAlign: 'center'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = `0 12px 32px ${item.color}15`;
                            e.currentTarget.style.borderColor = item.color;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                            e.currentTarget.style.borderColor = `${PRIMARY}10`;
                        }}>
                            <div style={{
                                width: 44,
                                height: 44,
                                borderRadius: 10,
                                background: `${item.color}10`,
                                color: item.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 10px'
                            }}>
                                {item.icon}
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: DARK }}>{item.title}</div>
                            <div style={{ fontSize: 12, color: TEXT }}>{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ===== FEATURES =====
function Features() {
    return (
        <section id="features" style={{
            padding: '80px 32px',
            background: '#FFFFFF'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: 600,
                    margin: '0 auto 56px'
                }}>
                    <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: PRIMARY,
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>
                        Fitur Unggulan
                    </span>
                    <h2 style={{
                        fontSize: 32,
                        fontWeight: 700,
                        color: DARK,
                        margin: '8px 0 0',
                        letterSpacing: '-0.3px'
                    }}>
                        Semua yang Anda Butuhkan
                    </h2>
                    <p style={{
                        fontSize: 15,
                        color: TEXT,
                        marginTop: 10
                    }}>
                        Kelola toko roti Anda dengan fitur-fitur canggih yang mudah digunakan
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 20
                }}>
                    {features.map((feature, index) => (
                        <div key={index} style={{
                            background: '#FFFFFF',
                            borderRadius: 14,
                            padding: '28px 24px',
                            border: `1px solid ${PRIMARY}08`,
                            transition: 'all 0.4s ease',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-6px)';
                            e.currentTarget.style.boxShadow = `0 20px 48px ${PRIMARY}10`;
                            e.currentTarget.style.borderColor = `${PRIMARY}30`;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                            e.currentTarget.style.borderColor = `${PRIMARY}08`;
                        }}>
                            <div style={{
                                width: 44,
                                height: 44,
                                borderRadius: 10,
                                background: `${PRIMARY}10`,
                                color: PRIMARY,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 14
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: DARK,
                                margin: 0
                            }}>
                                {feature.title}
                            </h3>
                            <p style={{
                                fontSize: 13,
                                color: TEXT,
                                lineHeight: 1.7,
                                marginTop: 6
                            }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ===== TESTIMONIALS =====
function Testimonials() {
    return (
        <section id="testimonials" style={{
            padding: '80px 32px',
            background: LIGHT_BG
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: 560,
                    margin: '0 auto 56px'
                }}>
                    <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: PRIMARY,
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>
                        Testimoni
                    </span>
                    <h2 style={{
                        fontSize: 32,
                        fontWeight: 700,
                        color: DARK,
                        margin: '8px 0 0',
                        letterSpacing: '-0.3px'
                    }}>
                        Apa Kata Mereka?
                    </h2>
                    <p style={{
                        fontSize: 15,
                        color: TEXT,
                        marginTop: 10
                    }}>
                        Pengalaman nyata dari pemilik toko roti yang sudah menggunakan Rotte
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 24
                }}>
                    {testimonials.map((t) => (
                        <div key={t.id} style={{
                            background: '#FFFFFF',
                            borderRadius: 14,
                            padding: '28px 24px',
                            border: `1px solid ${PRIMARY}08`,
                            transition: 'all 0.4s ease',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                            position: 'relative'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = `0 16px 40px ${PRIMARY}10`;
                            e.currentTarget.style.borderColor = `${PRIMARY}30`;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                            e.currentTarget.style.borderColor = `${PRIMARY}08`;
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 16,
                                right: 20,
                                fontSize: 24,
                                opacity: 0.06,
                                color: PRIMARY
                            }}>
                                <FaQuoteLeft />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: `${PRIMARY}10`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: PRIMARY
                                }}>
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 style={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: DARK,
                                        margin: 0
                                    }}>
                                        {t.name}
                                    </h4>
                                    <p style={{
                                        fontSize: 12,
                                        color: TEXT,
                                        margin: 0
                                    }}>
                                        {t.role}
                                    </p>
                                </div>
                            </div>
                            <p style={{
                                fontSize: 14,
                                color: TEXT,
                                lineHeight: 1.7,
                                fontStyle: 'italic',
                                margin: 0
                            }}>
                                "{t.quote}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ===== PROMOS =====
function Promos() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 3;
    const totalPages = Math.ceil(promos.length / itemsPerPage);

    const visibleItems = promos.slice(
        currentIndex * itemsPerPage,
        currentIndex * itemsPerPage + itemsPerPage
    );

    return (
        <section id="promos" style={{
            padding: '80px 32px',
            background: '#FFFFFF'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 40,
                    flexWrap: 'wrap',
                    gap: 16
                }}>
                    <div>
                        <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: PRIMARY,
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            Promo Berjalan
                        </span>
                        <h2 style={{
                            fontSize: 32,
                            fontWeight: 700,
                            color: DARK,
                            margin: '4px 0 0',
                            letterSpacing: '-0.3px'
                        }}>
                            Promo yang Sedang Berjalan
                        </h2>
                    </div>
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)} style={{
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                border: `1px solid ${PRIMARY}20`,
                                background: '#FFFFFF',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                color: TEXT
                            }}
                            onMouseEnter={e => { e.target.style.background = PRIMARY; e.target.style.color = '#FFF'; }}
                            onMouseLeave={e => { e.target.style.background = '#FFFFFF'; e.target.style.color = TEXT; }}>
                                <FaChevronLeft size={13} />
                            </button>
                            <button onClick={() => setCurrentIndex((prev) => (prev + 1) % totalPages)} style={{
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                border: `1px solid ${PRIMARY}20`,
                                background: '#FFFFFF',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                color: TEXT
                            }}
                            onMouseEnter={e => { e.target.style.background = PRIMARY; e.target.style.color = '#FFF'; }}
                            onMouseLeave={e => { e.target.style.background = '#FFFFFF'; e.target.style.color = TEXT; }}>
                                <FaChevronRight size={13} />
                            </button>
                        </div>
                    )}
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 24
                }}>
                    {visibleItems.map((promo) => (
                        <div key={promo.id} style={{
                            background: LIGHT_BG,
                            borderRadius: 14,
                            padding: '28px 24px',
                            border: `1px solid ${PRIMARY}08`,
                            transition: 'all 0.4s ease',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = `0 16px 40px ${PRIMARY}10`;
                            e.currentTarget.style.borderColor = `${PRIMARY}30`;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = `${PRIMARY}08`;
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                padding: '4px 14px',
                                background: `linear-gradient(135deg, ${GOLD}, #B8942E)`,
                                color: '#FFFFFF',
                                fontSize: 11,
                                fontWeight: 600,
                                borderRadius: '0 14px 0 14px'
                            }}>
                                {promo.discount}
                            </div>
                            <h3 style={{
                                fontSize: 17,
                                fontWeight: 600,
                                color: DARK,
                                margin: '0 0 6px',
                                paddingRight: 60
                            }}>
                                {promo.title}
                            </h3>
                            <p style={{
                                fontSize: 13,
                                color: TEXT,
                                lineHeight: 1.6,
                                margin: '0 0 12px'
                            }}>
                                {promo.description}
                            </p>
                            <div style={{
                                fontSize: 12,
                                color: TEXT_SECONDARY,
                                opacity: 0.6
                            }}>
                                Berlaku hingga: {promo.validUntil}
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 6,
                        marginTop: 24
                    }}>
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <div key={idx} style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: idx === currentIndex ? PRIMARY : `${PRIMARY}20`,
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onClick={() => setCurrentIndex(idx)} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// ===== CTA =====
function CTA() {
    return (
        <section style={{
            padding: '80px 32px',
            background: `linear-gradient(135deg, ${DARK}, #2A2A4A)`,
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: `${PRIMARY}08`,
                pointerEvents: 'none'
            }} />

            <div style={{
                maxWidth: 700,
                margin: '0 auto',
                textAlign: 'center',
                position: 'relative',
                zIndex: 2
            }}>
                <h2 style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    margin: 0,
                    letterSpacing: '-0.3px'
                }}>
                    Siap Membawa Bisnis Roti Anda ke Level Berikutnya?
                </h2>
                <p style={{
                    fontSize: 16,
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.7,
                    marginTop: 12,
                    maxWidth: 500,
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    Mulai gunakan Rotte sekarang dan rasakan kemudahan mengelola toko roti Anda.
                </p>
                <Link to="/login" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
                    color: '#FFFFFF',
                    padding: '12px 36px',
                    borderRadius: 9999,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: `0 4px 16px ${PRIMARY}40`,
                    marginTop: 24
                }}
                onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = `0 8px 28px ${PRIMARY}60`;
                }}
                onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = `0 4px 16px ${PRIMARY}40`;
                }}>
                    Mulai Sekarang <FaArrowRight size={14} />
                </Link>
            </div>
        </section>
    );
}

// ===== FOOTER =====
function Footer() {
    return (
        <footer style={{
            background: DARK,
            padding: '32px 32px',
            borderTop: `1px solid ${PRIMARY}10`
        }}>
            <div style={{
                maxWidth: 1200,
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16
            }}>
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                    }}>
                        <span style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: '#FFFFFF',
                            letterSpacing: '-0.3px'
                        }}>
                            Rotte<span style={{ color: PRIMARY }}>.</span>
                        </span>
                    </div>
                    <p style={{
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.25)',
                        marginTop: 2
                    }}>
                        Bakery CRM Platform
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    gap: 20,
                    flexWrap: 'wrap'
                }}>
                    {['Fitur', 'Testimoni', 'Promo', 'Masuk'].map((item, idx) => {
                        const href = ['#features', '#testimonials', '#promos', '/login'][idx];
                        const isLink = idx === 3;
                        if (isLink) {
                            return (
                                <Link key={item} to={href} style={{
                                    fontSize: 12,
                                    color: 'rgba(255,255,255,0.4)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={e => e.target.style.color = PRIMARY}
                                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>
                                    {item}
                                </Link>
                            );
                        }
                        return (
                            <a key={item} href={href} style={{
                                fontSize: 12,
                                color: 'rgba(255,255,255,0.4)',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={e => e.target.style.color = PRIMARY}
                            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>
                                {item}
                            </a>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    {[FaInstagram, FaTiktok, FaWhatsapp].map((Icon, idx) => (
                        <a key={idx} href="#" style={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.04)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'rgba(255,255,255,0.3)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={e => { e.target.style.background = `${PRIMARY}20`; e.target.style.color = PRIMARY; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.color = 'rgba(255,255,255,0.3)'; }}>
                            <Icon size={14} />
                        </a>
                    ))}
                </div>
            </div>

            <div style={{
                maxWidth: 1200,
                margin: '20px auto 0',
                paddingTop: 14,
                borderTop: `1px solid ${PRIMARY}08`,
                textAlign: 'center',
                fontSize: 11,
                color: 'rgba(255,255,255,0.15)'
            }}>
                © 2026 Rotte Bakery CRM. All rights reserved.
            </div>
        </footer>
    );
}

// ================================================================
// MAIN
// ================================================================
export default function LandingPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#FFFFFF',
            fontFamily: "'Inter', sans-serif"
        }}>
            <Header />
            <main>
                <Hero />
                <Features />
                <Testimonials />
                <Promos />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}