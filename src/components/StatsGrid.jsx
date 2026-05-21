import StatCard from "./StatCard";

export default function StatsGrid({ stats, columns = 4 }) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
  };

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-4 mb-6`}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          trend={stat.trend}
          color={stat.color}
        />
      ))}
    </div>
  );
}