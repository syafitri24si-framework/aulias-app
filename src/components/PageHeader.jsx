export default function PageHeader({ title, breadcrumb, children }) {
    const renderBreadcrumb = () => {
        if (Array.isArray(breadcrumb)) {
            return breadcrumb.join(" / ");
        }
        return breadcrumb;
    };


    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <div className="text-xl font-bold">
                        {title || "Dashboard"}
                    </div>
                    <div className="text-gray-400 text-sm">
                        {breadcrumb ? renderBreadcrumb() : "Dashboard"}
                    </div>
                </div>
                {children ? (
                    children
                ) : (
                    <button className="bg-amber-800 text-white px-4 py-2 rounded">
                        Add Order
                    </button>
                )}
            </div>
        </div>
    );
}

