export default function Container({ children }) {
    return (
        <div>
          {children}
          <hr />
          <footer>
            <p>© 2026 - Politeknik Caltex Riau</p>
            <p>Dibangun dengan ReactJS | Pemrograman Framework Lanjutan</p>
          </footer>
        </div>
    )
}

