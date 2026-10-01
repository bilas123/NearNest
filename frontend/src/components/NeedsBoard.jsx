import React, { useState } from "react";
import { PlusCircle, MapPin, Clock, User, CheckCircle2, HandHeart } from "lucide-react";

export function NeedsBoard({ needs, onOpenCreateNeed }) {
  const [offeredIds, setOfferedIds] = useState([]);

  const handleOfferHelp = (id) => {
    if (!offeredIds.includes(id)) {
      setOfferedIds([...offeredIds, id]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Board Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-semibold border border-amber-200 mb-2">
            <HandHeart className="w-3.5 h-3.5 text-amber-600" />
            <span>Community Demand Broadcast</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">I Need This</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Can't find what you need? Ask nearby neighbors directly.
          </p>
        </div>

        <button
          onClick={onOpenCreateNeed}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#FFB703] text-gray-900 rounded-full text-xs sm:text-sm font-bold shadow-xs hover:bg-[#f0ac00] hover:scale-105 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Request</span>
        </button>
      </div>

      {/* Requests Feed */}
      <div className="space-y-4">
        {needs.map((item) => {
          const isOffered = offeredIds.includes(item._id);

          return (
            <div
              key={item._id}
              className="p-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {item.category}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-amber-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{item.distance}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Footer Metadata: Budget & Requester */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-500">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-900 font-bold rounded-lg border border-amber-200/80">
                    Budget: {item.budget}
                  </span>
                  <span className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-medium text-gray-700">{item.requesterName}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.postedTime}</span>
                  </span>
                </div>
              </div>

              {/* Right Action: I Have This button */}
              <div className="sm:self-center">
                {isOffered ? (
                  <div className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Offered to Help!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOfferHelp(item._id)}
                    className="w-full sm:w-auto px-5 py-2 bg-[#FFB703] text-gray-900 rounded-full text-xs font-bold shadow-xs hover:bg-[#f0ac00] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    I Have This
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
