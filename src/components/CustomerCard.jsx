import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import Badge from "./Badge";
import Card from "./Card";

export default function CustomerCard({ customer }) {
  return (
    <Card className="p-4">
      <Link to={`/customers/${customer.id}`} className="block">
        <div className="flex gap-3">
          <Avatar name={customer.name} size="lg" />
          <div className="flex-1">
            <div className="font-semibold text-gray-900 mb-1">{customer.name}</div>
            <div className="text-xs text-gray-400 mb-2">{customer.email}</div>
            <div className="flex justify-between items-center">
              <Badge type={customer.loyalty === "None" ? "secondary" : customer.loyalty.toLowerCase()}>
                {customer.loyalty === "None" ? "Non-Member" : customer.loyalty}
              </Badge>
              <span className="text-sm font-semibold text-[#5E81F4]">{customer.points} pts</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}