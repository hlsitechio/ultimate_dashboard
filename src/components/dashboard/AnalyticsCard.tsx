import React from 'react';
import { Card, CardBody } from "@nextui-org/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const activityData = [
  { name: 'Mon', notes: 4, events: 3, tasks: 5 },
  { name: 'Tue', notes: 3, events: 4, tasks: 3 },
  { name: 'Wed', notes: 2, events: 2, tasks: 4 },
  { name: 'Thu', notes: 5, events: 3, tasks: 2 },
  { name: 'Fri', notes: 3, events: 5, tasks: 3 },
  { name: 'Sat', notes: 4, events: 2, tasks: 4 },
  { name: 'Sun', notes: 6, events: 4, tasks: 5 },
];

const shoppingData = [
  { name: 'Dairy', value: 8 },
  { name: 'Produce', value: 12 },
  { name: 'Meat', value: 5 },
  { name: 'Bakery', value: 7 },
  { name: 'Pantry', value: 15 },
];

const AnalyticsCard = () => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="bg-background/80 backdrop-blur-md border-none">
        <CardBody>
          <h3 className="text-sm font-semibold mb-4">Activity Overview</h3>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="notes"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="events"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#EC4899"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs text-gray-400">Notes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-400">Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500" />
              <span className="text-xs text-gray-400">Tasks</span>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-background/80 backdrop-blur-md border-none">
        <CardBody>
          <h3 className="text-sm font-semibold mb-4">Shopping Categories</h3>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shoppingData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#4F46E5"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AnalyticsCard;