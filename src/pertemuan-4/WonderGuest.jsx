export default function WonderGuest({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-white/80 backdrop-blur rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition duration-500 border border-white group"
        >
          {/* IMAGE */}
          <div className="h-60 overflow-hidden relative">
            <img
              src={new URL(`../assets/${item.image}`, import.meta.url).href}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />

            {/* CATEGORY */}
            <div className="absolute top-4 left-4 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold">
              {item.category}
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6 text-center">
            <h3 className="text-lg font-serif text-slate-800">
              {item.name}
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              {item.location.city}, {item.location.country}
            </p>

            <p className="text-[11px] italic text-slate-500 mt-3">
              {item.facts.interesting}
            </p>

            {/* ACTIVITIES */}
            <div className="flex flex-wrap justify-center gap-1 mt-4">
              {item.activities.map((act, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full"
                >
                  {act}
                </span>
              ))}
            </div>

            {/* FOOTER */}
            <div className="border-t mt-5 pt-4 text-xs flex justify-between">
              <span className="text-emerald-600 font-medium">
                {item.details.material}
              </span>
              <span className="text-indigo-600 font-semibold">
                {item.facts.visitorsPerYear}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}