import { Card, CardBody } from "@nextui-org/react";
import { GripHorizontal } from "lucide-react";

const ActivityCard = () => {
  return (
    <Card className="bg-background border-none h-full relative">
      <div className="drag-handle absolute -top-2 left-1/2 -translate-x-1/2 text-gray-500 p-2">
        <GripHorizontal className="h-5 w-5" />
      </div>
      <CardBody className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div>
              <p className="text-sm">New user registration</p>
              <p className="text-xs text-gray-400">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <div>
              <p className="text-sm">Sales report generated</p>
              <p className="text-xs text-gray-400">1 hour ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div>
              <p className="text-sm">System update completed</p>
              <p className="text-xs text-gray-400">3 hours ago</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ActivityCard;