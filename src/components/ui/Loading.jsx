import React from "react";

const Loading = ({ type = "default" }) => {
  if (type === "table") {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 shimmer rounded"></div>
          <div className="h-10 w-32 shimmer rounded"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
              <div className="h-12 w-12 shimmer rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 shimmer rounded"></div>
                <div className="h-3 w-48 shimmer rounded"></div>
              </div>
              <div className="h-6 w-16 shimmer rounded-full"></div>
              <div className="h-8 w-8 shimmer rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg border">
              <div className="space-y-3">
                <div className="h-4 w-24 shimmer rounded"></div>
                <div className="h-8 w-16 shimmer rounded"></div>
                <div className="h-3 w-32 shimmer rounded"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="space-y-4">
            <div className="h-6 w-48 shimmer rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-10 w-10 shimmer rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 shimmer rounded"></div>
                    <div className="h-3 w-64 shimmer rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-4">
          <div className="h-6 w-32 shimmer rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 shimmer rounded"></div>
                <div className="h-10 w-full shimmer rounded"></div>
              </div>
            ))}
          </div>
          <div className="flex space-x-3">
            <div className="h-10 w-24 shimmer rounded"></div>
            <div className="h-10 w-20 shimmer rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-600 font-medium">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;