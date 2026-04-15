export default function WonderAdmin({ data }) {
  return (
    <div className="bg-white rounded-3xl shadow border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-indigo-50 to-emerald-50 text-xs uppercase text-slate-600">
            <tr>
              <th className="p-4">Place</th>
              <th className="p-4">Location</th>
              <th className="p-4">Category</th>
              <th className="p-4">Material</th>
              <th className="p-4">Visitors</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-emerald-50 transition"
              >
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={new URL(`../assets/${item.image}`, import.meta.url).href}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <span className="font-semibold">{item.name}</span>
                </td>

                <td className="p-4 text-sm text-slate-500">
                  {item.location.city}, {item.location.country}
                </td>

                <td className="p-4">
                  <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded text-xs font-semibold">
                    {item.category}
                  </span>
                </td>

                <td className="p-4 text-sm">{item.details.material}</td>

                <td className="p-4 text-sm font-semibold text-emerald-600">
                  {item.facts.visitorsPerYear}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}