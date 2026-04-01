export default function Container( ) {
    return (
        <div>
            <h1>Pemrograman Framework Lanjutan</h1>
            <p className="slogan-1">Selamat Belajar ReactJS</p>
            <Greating />
           
            {/* Garis pemisah */}
            <hr className="section-divider" />
           
            <h2>📋 BIODATA SAYA</h2>
           
         
            <div className="biodata-container">
                <FotoProfile />
                <InfoBiodata />
            </div>
           
            {/* Quote */}
            <QuoteText />
        </div>
    );
}


function Greating() {
    return (
        <div>
            <p className="slogan-2"><strong>Semoga Belajar ReactJS Menyenangkan sangat</strong></p>
        </div>
    );
}


function FotoProfile() {
    return (
        <div className="foto-profile">
            <div className="foto-persegi">
                <img
                    src="profilAulia.jpeg"
                    alt="Foto Profil Aulia Syafitri Hasibuan"
                />
            </div>
        </div>
    );
}


function InfoBiodata() {
    return (
        <div className="info-biodata">
            <p><strong>Nama</strong> : Aulia Syafitri Hasibuan</p>
            <p><strong>NIM</strong> : 2457301023</p>
            <p><strong>Tanggal Lahir</strong> : 9 November 2005</    
            
            
            p>
            <p><strong>Alamat</strong> : Pekanbaru, Riau</p>
            <p><strong>Hobi</strong> : Ngoding</p>
            <p><strong>Program Studi</strong> : Sistem Informasi</p>
            <p><strong>Kampus</strong> : Politeknik Caltex Riau</p>
            <p><strong>Email</strong> : syafitri24si@mahasiswa.pcr.ac.id</p>
        </div>
    );
}


function QuoteText() {
    const text = "If it’s easy, it won’t change you. If it changes you, it won’t be easy.";
    const text2 = "- Aulia Syafitri Hasibuan -";


    return (
        <div className="quote">
            <p className="quote-text">"{text}"</p>
            <p className="quote-author">{text2}</p>
        </div>
    );
}

