import Card from "./Card";

export default function TopProductsChart({ products }) {
  if (!products || products.length === 0) {
    return <Card>No data available</Card>;
  }

  const maxCount = products[0]?.count || 1;

  return (
    <Card>
      <h3 className="font-bold text-gray-900 mb-1">🍞 Top 5 Produk Terlaris</h3>
      <p className="text-xs text-[#5E81F4] mb-4">Berdasarkan jumlah pesanan</p>
      <div className="space-y-3">
        {products.map((product, idx) => (
          <div key={product.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{idx + 1}. {product.name}</span>
              <span className="text-[#5E81F4] font-semibold">{product.count}×</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5E81F4] rounded-full"
                style={{ width: `${(product.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}