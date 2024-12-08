import React from 'react';
import { FileText, Calendar, Mail, ListTodo } from "lucide-react";

const DashboardSummary = () => {
  return (
    <div className="flex items-center gap-6">
      <h3 className="text-sm font-semibold whitespace-nowrap">Activity Overview</h3>
      <div className="flex items-center gap-6 overflow-x-auto">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm">Notes</p>
            <p className="text-xs text-gray-400">12 Total</p>
          </div>
        </div>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <Calendar className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm">Events</p>
            <p className="text-xs text-gray-400">5 Today</p>
          </div>
        </div>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <Mail className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm">Emails</p>
            <p className="text-xs text-gray-400">3 Unread</p>
          </div>
        </div>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <ListTodo className="h-5 w-5 text-purple-500" />
          <div>
            <p className="text-sm">Tasks</p>
            <p className="text-xs text-gray-400">8 Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;