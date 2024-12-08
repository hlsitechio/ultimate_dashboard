import { Card, CardBody } from "@nextui-org/react";
import { Activity, Users, DollarSign, ShoppingBag, GripHorizontal } from "lucide-react";
import { useAsync } from "../../hooks/useAsync";
import LoadingSpinner from "../LoadingSpinner";
import { getRecentActivity } from "../../api/activity";

const stats = [
  {
    title: "Total Users",
    value: "2,543",
    icon: Users,
    trend: "+12.5%",
    color: "text-primary"
  },
  {
    title: "Revenue",
    value: "$45,234",
    icon: DollarSign,
    trend: "+8.2%",
    color: "text-green-500"
  },
  {
    title: "Active Sessions",
    value: "1,234",
    icon: Activity,
    trend: "+3.1%",
    color: "text-blue-500"
  },
  {
    title: "Orders",
    value: "845",
    icon: ShoppingBag,
    trend: "+5.8%",
    color: "text-purple-500"
  }
];

const StatCards = () => {
  const { isLoading, error } = useAsync();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Card className="bg-background border-none">
        <CardBody>
          <p className="text-danger">Failed to load statistics</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div className="drag-handle absolute -top-2 left-1/2 -translate-x-1/2 text-gray-500 p-2">
        <GripHorizontal className="h-5 w-5" />
      </div>
      <div className="grid grid-cols-4 gap-4 pt-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-background border-none">
              <CardBody className="flex flex-row items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-20`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-xl font-semibold">{stat.value}</h3>
                    <span className="text-xs text-green-500">{stat.trend}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StatCards;