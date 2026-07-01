import { Link } from 'react-router-dom';
import { useState } from 'react';

// ============================================================
// PRD 1: CRM TOKO ROTI
// ============================================================

// ==================== DATA ====================
const features = [
  {
    title: 'Customer Management',
    description: 'Kelola data pelanggan secara rapi dan mudah dipantau untuk membangun hubungan yang lebih baik.',
    icon: '👥',
  },
  {
    title: 'Order Tracking',
    description: 'Pantau setiap pesanan dengan alur yang jelas sehingga operasional toko tetap teratur.',
    icon: '📦',
  },
  {
    title: 'Loyalty & Promo',
    description: 'Atur program loyalti dan promo secara praktis untuk menjaga pelanggan tetap kembali.',
    icon: '🎯',
  },
  {
    title: 'Reporting Ringkas',
    description: 'Dapatkan gambaran performa bisnis secara cepat lewat laporan yang sederhana dan informatif.',
    icon: '📊',
  },
];

const benefits = [
  'Hemat waktu karena semua data berada di satu tempat',
  'Mudah menjaga pelanggan lewat riwayat dan interaksi yang terorganisir',
  'Cepat mengambil keputusan dengan informasi yang lebih jelas',
];

// ============================================================
// PRD 2: TESTIMONI + PAKET HARGA
// ============================================================

const testimonials = [
  {
    id: 1,
    name: 'Aisyah Putri',
    role: 'Pemilik "Manis Bakery"',
    quote: 'Rotte benar-benar mengubah cara saya mengelola toko. Sekarang semua data pelanggan rapi dan pesanan lebih terpantau!',
    rating: 5,
    image: '👩‍🍳',
  },
  {
    id: 2,
    name: 'Rama Wijaya',
    role: 'Pemilik "Roti Raya"',
    quote: 'Fitur loyalitas sangat membantu mempertahankan pelanggan. Program promo jadi lebih mudah dijalankan.',
    rating: 5,
    image: '👨‍🍳',
  },
  {
    id: 3,
    name: 'Dewi Lestari',
    role: 'Pemilik "Cake & Co"',
    quote: 'Laporan ringkas membantu saya mengambil keputusan bisnis dengan cepat. Sangat direkomendasikan!',
    rating: 4,
    image: '👩‍🍳',
  },
];

const pricingPlans = [
  {
    id: 1,
    name: 'Starter',
    price: 'Rp 99.000',
    period: '/bulan',
    description: 'Cocok untuk toko roti pemula',
    features: [
      'Manajemen pelanggan dasar',
      'Pencatatan pesanan',
      'Laporan sederhana',
      '1 pengguna',
    ],
    isPopular: false,
    cta: 'Mulai Gratis',
  },
  {
    id: 2,
    name: 'Pro',
    price: 'Rp 249.000',
    period: '/bulan',
    description: 'Untuk toko roti yang berkembang',
    features: [
      'Semua fitur Starter',
      'Program loyalitas',
      'Manajemen promo',
      'Laporan lengkap',
      '5 pengguna',
      'Dukungan prioritas',
    ],
    isPopular: true,
    cta: 'Coba Pro',
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 'Rp 499.000',
    period: '/bulan',
    description: 'Untuk bisnis roti skala besar',
    features: [
      'Semua fitur Pro',
      'Multi cabang',
      'Integrasi API',
      'Analitik lanjutan',
      'Pengguna tidak terbatas',
      'Dukungan 24/7',
    ],
    isPopular: false,
    cta: 'Hubungi Kami',
  },
];

// ============================================================
// PRD 3: GALERI PRODUK
// ============================================================

const galleryItems = [
  {
    id: 1,
    title: 'Roti Coklat',
    description: 'Roti lembut dengan isian coklat premium',
    image: '🍞',
    category: 'Roti',
    price: 'Rp 15.000',
  },
  {
    id: 2,
    title: 'Croissant',
    description: 'Pastry renyah berlapis mentega',
    image: '🥐',
    category: 'Pastry',
    price: 'Rp 18.000',
  },
  {
    id: 3,
    title: 'Donat Gula',
    description: 'Donat empuk dengan taburan gula halus',
    image: '🍩',
    category: 'Donat',
    price: 'Rp 12.000',
  },
  {
    id: 4,
    title: 'Roti Tawar',
    description: 'Roti tawar lembut untuk sarapan',
    image: '🍞',
    category: 'Roti',
    price: 'Rp 28.000',
  },
  {
    id: 5,
    title: 'Kue Bolu',
    description: 'Kue bolu lembut dengan topping keju',
    image: '🎂',
    category: 'Kue',
    price: 'Rp 35.000',
  },
  {
    id: 6,
    title: 'Pie Apel',
    description: 'Pie apel homemade dengan kulit renyah',
    image: '🥧',
    category: 'Kue',
    price: 'Rp 42.000',
  },
  {
    id: 7,
    title: 'Roti Keju',
    description: 'Roti gurih dengan topping keju mozzarella',
    image: '🧀',
    category: 'Roti',
    price: 'Rp 20.000',
  },
  {
    id: 8,
    title: 'Donat Coklat',
    description: 'Donat dengan glaze coklat premium',
    image: '🍩',
    category: 'Donat',
    price: 'Rp 14.000',
  },
];

// ============================================================
// COMPONENTS
// ============================================================

// ==================== HEADER ====================
const Header = () => (
  <header style={{
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #F5E6D8',
    padding: '16px 24px',
  }}>
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <Link to="/" style={{
        fontSize: 20,
        fontWeight: 800,
        color: '#3A2A24',
        textDecoration: 'none',
        letterSpacing: '0.2em',
      }}>
        ROTTE
      </Link>
      
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: 32,
      }}>
        <a href="#features" style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#8B7568',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = '#E8637A'}
        onMouseLeave={e => e.target.style.color = '#8B7568'}>
          Fitur
        </a>
        <a href="#testimonials" style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#8B7568',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = '#E8637A'}
        onMouseLeave={e => e.target.style.color = '#8B7568'}>
          Testimoni
        </a>
        <a href="#pricing" style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#8B7568',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = '#E8637A'}
        onMouseLeave={e => e.target.style.color = '#8B7568'}>
          Harga
        </a>
        <a href="#gallery" style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#8B7568',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = '#E8637A'}
        onMouseLeave={e => e.target.style.color = '#8B7568'}>
          Galeri
        </a>
        <a href="#contact" style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#8B7568',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = '#E8637A'}
        onMouseLeave={e => e.target.style.color = '#8B7568'}>
          Hubungi
        </a>
        <Link to="/login" style={{
          background: '#E8637A',
          color: '#FFFFFF',
          padding: '10px 24px',
          borderRadius: 9999,
          fontSize: 14,
          fontWeight: 700,
          textDecoration: 'none',
          transition: 'all 0.2s',
          boxShadow: '0 4px 16px rgba(232, 99, 122, 0.3)',
        }}
        onMouseEnter={e => {
          e.target.style.background = '#d9556d';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.target.style.background = '#E8637A';
          e.target.style.transform = 'translateY(0)';
        }}>
          Masuk
        </Link>
      </nav>
    </div>
  </header>
);

// ==================== HERO ====================
const Hero = () => (
  <section style={{
    padding: '80px 24px',
    background: '#FFFBF8',
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute',
      top: -100,
      right: -100,
      width: 400,
      height: 400,
      borderRadius: '50%',
      background: 'rgba(232, 99, 122, 0.05)',
      pointerEvents: 'none',
    }} />
    <div style={{
      position: 'absolute',
      bottom: -80,
      left: -80,
      width: 300,
      height: 300,
      borderRadius: '50%',
      background: 'rgba(245, 230, 216, 0.3)',
      pointerEvents: 'none',
    }} />

    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 60,
      alignItems: 'center',
    }}>
      <div>
        <span style={{
          display: 'inline-block',
          background: '#F5E6D8',
          color: '#E8637A',
          padding: '6px 18px',
          borderRadius: 9999,
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 20,
        }}>
          🍞 Bakery CRM untuk toko roti modern
        </span>
        <h1 style={{
          fontSize: 44,
          fontWeight: 700,
          color: '#3A2A24',
          lineHeight: 1.2,
          margin: 0,
          fontFamily: "'Playfair_Display', serif",
        }}>
          Kelola toko roti Anda dengan lebih{' '}
          <span style={{ color: '#E8637A' }}>rapi</span>, lebih{' '}
          <span style={{ color: '#E8637A' }}>cepat</span>
        </h1>
        <p style={{
          fontSize: 18,
          color: '#8B7568',
          lineHeight: 1.8,
          marginTop: 16,
          maxWidth: 480,
        }}>
          Rotte membantu pemilik toko roti mengelola pelanggan, pesanan, loyalti, dan laporan dari satu tempat yang sederhana.
        </p>
        <div style={{
          display: 'flex',
          gap: 12,
          marginTop: 28,
        }}>
          <Link to="/login" style={{
            background: '#E8637A',
            color: '#FFFFFF',
            padding: '14px 36px',
            borderRadius: 9999,
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.2s',
            boxShadow: '0 4px 16px rgba(232, 99, 122, 0.35)',
            display: 'inline-block',
          }}
          onMouseEnter={e => {
            e.target.style.background = '#d9556d';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 24px rgba(232, 99, 122, 0.45)';
          }}
          onMouseLeave={e => {
            e.target.style.background = '#E8637A';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 16px rgba(232, 99, 122, 0.35)';
          }}>
            Coba Demo
          </Link>
          <a href="#features" style={{
            background: '#FFFFFF',
            color: '#E8637A',
            padding: '14px 36px',
            borderRadius: 9999,
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.2s',
            border: '2px solid rgba(232, 99, 122, 0.3)',
            display: 'inline-block',
          }}
          onMouseEnter={e => {
            e.target.style.borderColor = '#E8637A';
            e.target.style.background = '#FFF7F2';
          }}
          onMouseLeave={e => {
            e.target.style.borderColor = 'rgba(232, 99, 122, 0.3)';
            e.target.style.background = '#FFFFFF';
          }}>
            Lihat Fitur
          </a>
        </div>
      </div>

      <div style={{
        background: '#FFFFFF',
        borderRadius: 28,
        padding: '32px',
        border: '1px solid #F5E6D8',
        boxShadow: '0 8px 32px rgba(58, 42, 36, 0.06)',
      }}>
        <div style={{
          background: '#FFF7F2',
          borderRadius: 24,
          padding: '24px',
        }}>
          <p style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#E8637A',
            margin: '0 0 16px',
          }}>
            📋 Apa yang bisa Anda kendalikan
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            {[
              'Data pelanggan terorganisir',
              'Pesanan tetap terpantau',
              'Loyalti dan promo lebih mudah',
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#FFFFFF',
                padding: '12px 16px',
                borderRadius: 16,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <span style={{ color: '#E8637A', fontWeight: 700 }}>✓</span>
                <span style={{
                  fontSize: 14,
                  color: '#8B7568',
                }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 12,
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid #F5E6D8',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#E8637A',
              }}>150+</div>
              <div style={{
                fontSize: 11,
                color: '#8B7568',
              }}>Pelanggan</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#E8637A',
              }}>4.8/5</div>
              <div style={{
                fontSize: 11,
                color: '#8B7568',
              }}>Kepuasan</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#E8637A',
              }}>25</div>
              <div style={{
                fontSize: 11,
                color: '#8B7568',
              }}>Pesanan/bln</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ==================== FITUR (PRD 1) ====================
const Features = () => (
  <section id="features" style={{
    padding: '80px 24px',
    background: '#FFFFFF',
  }}>
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: 560,
        margin: '0 auto 48px',
      }}>
        <p style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#E8637A',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          margin: 0,
        }}>
          Fitur Utama
        </p>
        <h2 style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#3A2A24',
          margin: '8px 0 0',
          fontFamily: "'Playfair_Display', serif",
        }}>
          Semua yang perlu Anda kelola, tersusun dalam satu tempat
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
      }}>
        {features.map((feature) => (
          <div key={feature.title} style={{
            background: '#FFFFFF',
            borderRadius: 24,
            padding: '24px',
            border: '1px solid #F5E6D8',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 45px -25px rgba(58,42,36,0.3)';
            e.currentTarget.style.borderColor = '#E8637A';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
            e.currentTarget.style.borderColor = '#F5E6D8';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                background: 'rgba(232, 99, 122, 0.12)',
                color: '#E8637A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
              }}>
                {feature.icon}
              </div>
              <div>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#3A2A24',
                  margin: 0,
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: 14,
                  color: '#8B7568',
                  margin: '4px 0 0',
                  lineHeight: 1.7,
                }}>
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ==================== MANFAAT (PRD 1) ====================
const Benefits = () => (
  <section id="benefits" style={{
    padding: '80px 24px',
    background: '#FFFBF8',
  }}>
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
    }}>
      <div style={{
        background: '#F5E6D8',
        borderRadius: 32,
        padding: '48px',
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: 560,
          margin: '0 auto 40px',
        }}>
          <p style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#E8637A',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: 0,
          }}>
            Manfaat Bisnis
          </p>
          <h2 style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#3A2A24',
            margin: '8px 0 0',
            fontFamily: "'Playfair_Display', serif",
          }}>
            Fokus pada pelanggan dan pertumbuhan toko Anda
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 16,
        }}>
          {benefits.map((benefit, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.85)',
              borderRadius: 22,
              padding: '20px 24px',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8,
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 12,
                  background: '#FBE8EC',
                  color: '#E8637A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 700,
                }}>
                  {index + 1}
                </div>
                <span style={{
                  fontSize: 14,
                  color: '#3A2A24',
                  fontWeight: 500,
                }}>
                  {benefit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ==================== TESTIMONI (PRD 2) ====================
const Testimonials = () => {
  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <section id="testimonials" style={{
      padding: '80px 24px',
      background: '#FFFFFF',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: 560,
          margin: '0 auto 48px',
        }}>
          <p style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#E8637A',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: 0,
          }}>
            Testimoni Pelanggan
          </p>
          <h2 style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#3A2A24',
            margin: '8px 0 0',
            fontFamily: "'Playfair_Display', serif",
          }}>
            Apa kata mereka tentang Rotte?
          </h2>
          <p style={{
            fontSize: 16,
            color: '#8B7568',
            marginTop: 12,
          }}>
            Pengalaman nyata dari pemilik toko roti yang sudah menggunakan Rotte
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 24,
        }}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} style={{
              background: '#FFFBF8',
              borderRadius: 24,
              padding: '28px',
              border: '1px solid #F5E6D8',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 16px 45px -25px rgba(58,42,36,0.3)';
              e.currentTarget.style.borderColor = '#E8637A';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
              e.currentTarget.style.borderColor = '#F5E6D8';
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 12,
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#FBE8EC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}>
                  {testimonial.image}
                </div>
                <div>
                  <h4 style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#3A2A24',
                    margin: 0,
                  }}>
                    {testimonial.name}
                  </h4>
                  <p style={{
                    fontSize: 13,
                    color: '#8B7568',
                    margin: '2px 0 0',
                  }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
              
              <div style={{
                fontSize: 14,
                color: '#3A2A24',
                lineHeight: 1.7,
                marginBottom: 12,
                fontStyle: 'italic',
              }}>
                "{testimonial.quote}"
              </div>
              
              <div style={{
                fontSize: 16,
              }}>
                {renderStars(testimonial.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== PRICING (PRD 2) ====================
const Pricing = () => (
  <section id="pricing" style={{
    padding: '80px 24px',
    background: '#FFFBF8',
  }}>
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: 560,
        margin: '0 auto 48px',
      }}>
        <p style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#E8637A',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          margin: 0,
        }}>
          Pilihan Harga
        </p>
        <h2 style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#3A2A24',
          margin: '8px 0 0',
          fontFamily: "'Playfair_Display', serif",
        }}>
          Pilih paket yang sesuai dengan kebutuhan toko Anda
        </h2>
        <p style={{
          fontSize: 16,
          color: '#8B7568',
          marginTop: 12,
        }}>
          Mulai dari yang sederhana hingga skala besar, semua ada di Rotte
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 24,
        alignItems: 'stretch',
      }}>
        {pricingPlans.map((plan) => (
          <div key={plan.id} style={{
            background: plan.isPopular ? '#FFFFFF' : '#FFFBF8',
            borderRadius: 24,
            padding: '32px',
            border: plan.isPopular ? '2px solid #E8637A' : '1px solid #F5E6D8',
            boxShadow: plan.isPopular ? '0 8px 32px rgba(232, 99, 122, 0.15)' : '0 2px 8px rgba(0,0,0,0.02)',
            transition: 'all 0.3s ease',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 45px -25px rgba(58,42,36,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = plan.isPopular ? '0 8px 32px rgba(232, 99, 122, 0.15)' : '0 2px 8px rgba(0,0,0,0.02)';
          }}>
            {plan.isPopular && (
              <div style={{
                position: 'absolute',
                top: -12,
                right: 24,
                background: '#E8637A',
                color: '#FFFFFF',
                padding: '4px 16px',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 700,
              }}>
                POPULER
              </div>
            )}

            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#3A2A24',
                margin: 0,
              }}>
                {plan.name}
              </h3>
              <p style={{
                fontSize: 14,
                color: '#8B7568',
                margin: '4px 0 16px',
              }}>
                {plan.description}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                marginBottom: 16,
              }}>
                <span style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: '#E8637A',
                }}>
                  {plan.price}
                </span>
                <span style={{
                  fontSize: 14,
                  color: '#8B7568',
                  marginLeft: 4,
                }}>
                  {plan.period}
                </span>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 24px',
              }}>
                {plan.features.map((feature, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 0',
                    fontSize: 14,
                    color: '#3A2A24',
                    borderBottom: index < plan.features.length - 1 ? '1px solid #F5E6D8' : 'none',
                  }}>
                    <span style={{ color: '#E8637A' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Link to="/login" style={{
              display: 'block',
              textAlign: 'center',
              background: plan.isPopular ? '#E8637A' : '#FFFFFF',
              color: plan.isPopular ? '#FFFFFF' : '#E8637A',
              padding: '12px 24px',
              borderRadius: 9999,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s',
              border: plan.isPopular ? 'none' : '2px solid #E8637A',
              marginTop: 'auto',
            }}
            onMouseEnter={e => {
              if (plan.isPopular) {
                e.target.style.background = '#d9556d';
                e.target.style.transform = 'translateY(-2px)';
              } else {
                e.target.style.background = '#FFF7F2';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={e => {
              if (plan.isPopular) {
                e.target.style.background = '#E8637A';
                e.target.style.transform = 'translateY(0)';
              } else {
                e.target.style.background = '#FFFFFF';
                e.target.style.transform = 'translateY(0)';
              }
            }}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ==================== GALERI (PRD 3) ====================
const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = ['Semua', ...new Set(galleryItems.map(item => item.category))];

  const filteredItems = selectedCategory === 'Semua'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <section id="gallery" style={{
      padding: '80px 24px',
      background: '#FFFFFF',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: 560,
          margin: '0 auto 48px',
        }}>
          <p style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#E8637A',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: 0,
          }}>
            Galeri Produk
          </p>
          <h2 style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#3A2A24',
            margin: '8px 0 0',
            fontFamily: "'Playfair_Display', serif",
          }}>
            Lihat Koleksi Produk Kami
          </h2>
          <p style={{
            fontSize: 16,
            color: '#8B7568',
            marginTop: 12,
          }}>
            Berbagai pilihan roti dan kue berkualitas untuk Anda
          </p>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          flexWrap: 'wrap',
          marginBottom: 32,
        }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '8px 24px',
                borderRadius: 9999,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: selectedCategory === category ? '#E8637A' : 'transparent',
                color: selectedCategory === category ? '#FFFFFF' : '#8B7568',
                border: selectedCategory === category ? 'none' : '2px solid #F5E6D8',
              }}
              onMouseEnter={e => {
                if (selectedCategory !== category) {
                  e.target.style.borderColor = '#E8637A';
                  e.target.style.color = '#E8637A';
                }
              }}
              onMouseLeave={e => {
                if (selectedCategory !== category) {
                  e.target.style.borderColor = '#F5E6D8';
                  e.target.style.color = '#8B7568';
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24,
        }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              style={{
                background: '#FFFBF8',
                borderRadius: 20,
                padding: '24px',
                border: '1px solid #F5E6D8',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 16px 45px -25px rgba(58,42,36,0.3)';
                e.currentTarget.style.borderColor = '#E8637A';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                e.currentTarget.style.borderColor = '#F5E6D8';
              }}
            >
              <div style={{
                fontSize: 64,
                marginBottom: 12,
                display: 'block',
              }}>
                {item.image}
              </div>
              <h4 style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#3A2A24',
                margin: '0 0 4px',
              }}>
                {item.title}
              </h4>
              <p style={{
                fontSize: 13,
                color: '#8B7568',
                margin: '0 0 8px',
              }}>
                {item.description}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{
                  fontSize: 12,
                  color: '#E8637A',
                  background: 'rgba(232, 99, 122, 0.1)',
                  padding: '2px 12px',
                  borderRadius: 9999,
                  fontWeight: 600,
                }}>
                  {item.category}
                </span>
                <span style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#E8637A',
                }}>
                  {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Detail Produk */}
        {selectedItem && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
            onClick={() => setSelectedItem(null)}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 32,
                padding: '40px',
                maxWidth: 480,
                width: '100%',
                textAlign: 'center',
                position: 'relative',
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 20,
                  background: 'none',
                  border: 'none',
                  fontSize: 28,
                  cursor: 'pointer',
                  color: '#8B7568',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#E8637A'}
                onMouseLeave={e => e.target.style.color = '#8B7568'}
              >
                ✕
              </button>
              
              <div style={{
                fontSize: 80,
                marginBottom: 16,
              }}>
                {selectedItem.image}
              </div>
              
              <h3 style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#3A2A24',
                margin: '0 0 8px',
                fontFamily: "'Playfair_Display', serif",
              }}>
                {selectedItem.title}
              </h3>
              
              <p style={{
                fontSize: 14,
                color: '#8B7568',
                margin: '0 0 16px',
                lineHeight: 1.6,
              }}>
                {selectedItem.description}
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 16,
              }}>
                <span style={{
                  background: 'rgba(232, 99, 122, 0.1)',
                  color: '#E8637A',
                  padding: '4px 16px',
                  borderRadius: 9999,
                  fontSize: 13,
                  fontWeight: 600,
                }}>
                  {selectedItem.category}
                </span>
                <span style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#E8637A',
                }}>
                  {selectedItem.price}
                </span>
              </div>
              
              <Link to="/login" style={{
                display: 'block',
                marginTop: 24,
                background: '#E8637A',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: 9999,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.target.style.background = '#d9556d';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.target.style.background = '#E8637A';
                e.target.style.transform = 'translateY(0)';
              }}>
                Pesan Sekarang
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// ==================== CONTACT ====================
const Contact = () => (
  <section id="contact" style={{
    padding: '80px 24px',
    background: '#FFFBF8',
  }}>
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 32,
        padding: '56px 48px',
        textAlign: 'center',
        border: '1px solid #F5E6D8',
        boxShadow: '0 8px 32px rgba(58, 42, 36, 0.05)',
      }}>
        <h2 style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#3A2A24',
          margin: 0,
          fontFamily: "'Playfair_Display', serif",
        }}>
          Siap melihat Rotte bekerja untuk toko roti Anda?
        </h2>
        <p style={{
          fontSize: 16,
          color: '#8B7568',
          marginTop: 12,
          maxWidth: 480,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Coba demo atau hubungi tim kami untuk melihat bagaimana Rotte bisa membantu bisnis Anda.
        </p>
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          marginTop: 28,
        }}>
          <Link to="/login" style={{
            background: '#E8637A',
            color: '#FFFFFF',
            padding: '14px 36px',
            borderRadius: 9999,
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.2s',
            boxShadow: '0 4px 16px rgba(232, 99, 122, 0.35)',
          }}
          onMouseEnter={e => {
            e.target.style.background = '#d9556d';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.target.style.background = '#E8637A';
            e.target.style.transform = 'translateY(0)';
          }}>
            Coba Demo
          </Link>
          <a href="mailto:hello@rotte.app" style={{
            background: 'transparent',
            color: '#E8637A',
            padding: '14px 36px',
            borderRadius: 9999,
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.2s',
            border: '2px solid rgba(232, 99, 122, 0.3)',
          }}
          onMouseEnter={e => {
            e.target.style.borderColor = '#E8637A';
            e.target.style.background = '#FFF7F2';
          }}
          onMouseLeave={e => {
            e.target.style.borderColor = 'rgba(232, 99, 122, 0.3)';
            e.target.style.background = 'transparent';
          }}>
            Hubungi Kami
          </a>
        </div>
      </div>
    </div>
  </section>
);

// ==================== FOOTER ====================
const Footer = () => (
  <footer style={{
    borderTop: '1px solid #F5E6D8',
    padding: '24px',
    background: '#FFFFFF',
  }}>
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 16,
    }}>
      <p style={{
        fontSize: 14,
        color: '#8B7568',
        margin: 0,
      }}>
        © 2026 Rotte. All rights reserved.
      </p>
      <div style={{
        display: 'flex',
        gap: 24,
        flexWrap: 'wrap',
      }}>
        <a href="#features" style={{
          fontSize: 14,
          color: '#8B7568',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = '#E8637A'}
        onMouseLeave={e => e.target.style.color = '#8B7568'}>
          Fitur
        </a>
        <a href="#testimonials" style={{
          fontSize: 14,
          color: '#8B7568',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = '#E8637A'}
        onMouseLeave={e => e.target.style.color = '#8B7568'}>
          Testimoni
        </a>
        <a href="#pricing" style={{
          fontSize: 14,
          color: '#8B7568',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = '#E8637A'}
        onMouseLeave={e => e.target.style.color = '#8B7568'}>
          Harga
        </a>
        <a href="#gallery" style={{
          fontSize: 14,
          color: '#8B7568',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = '#E8637A'}
        onMouseLeave={e => e.target.style.color = '#8B7568'}>
          Galeri
        </a>
        <a href="#contact" style={{
          fontSize: 14,
          color: '#8B7568',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = '#E8637A'}
        onMouseLeave={e => e.target.style.color = '#8B7568'}>
          Hubungi
        </a>
      </div>
    </div>
  </footer>
);

// ============================================================
// MAIN
// ============================================================
export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFBF8',
    }}>
      <Header />
      <main>
        <Hero />
        <Features />
        <Benefits />
        <Testimonials />
        <Pricing />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}