import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow, format } from "date-fns";

const CommunicationTimeline = ({ communications = [] }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case "email":
        return "Mail";
      case "phone":
        return "Phone";
      case "meeting":
        return "Users";
      case "text":
        return "MessageSquare";
      default:
        return "MessageCircle";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "email":
        return "text-blue-600 bg-blue-100";
      case "phone":
        return "text-green-600 bg-green-100";
      case "meeting":
        return "text-purple-600 bg-purple-100";
      case "text":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getDirectionIcon = (direction) => {
    return direction === "sent" ? "ArrowUpRight" : "ArrowDownLeft";
  };

  const getDirectionColor = (direction) => {
    return direction === "sent" ? "text-blue-600" : "text-green-600";
  };

  if (communications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="MessageCircle" size={24} className="mr-2 text-primary" />
            Communication History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ApperIcon name="MessageCircle" size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No communications recorded yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Log your first communication above to start building a history
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name="MessageCircle" size={24} className="mr-2 text-primary" />
          Communication History ({communications.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {communications.map((comm, index) => (
            <div
              key={comm.Id}
              className={`relative pl-8 pb-4 ${
                index < communications.length - 1 ? "border-l-2 border-gray-200 ml-4" : ""
              }`}
            >
              <div
                className={`absolute -left-2 top-2 w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(
                  comm.type
                )}`}
              >
                <ApperIcon name={getTypeIcon(comm.type)} size={16} />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 ml-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 capitalize">
                      {comm.type.replace('_', ' ')}
                    </span>
                    <ApperIcon
                      name={getDirectionIcon(comm.direction)}
                      size={14}
                      className={getDirectionColor(comm.direction)}
                    />
                    <span className={`text-sm ${getDirectionColor(comm.direction)}`}>
                      {comm.direction === "sent" ? "Sent" : "Received"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(comm.date), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{comm.message}</p>
                
                <div className="mt-2 text-xs text-gray-400">
                  {formatDistanceToNow(new Date(comm.date), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunicationTimeline;