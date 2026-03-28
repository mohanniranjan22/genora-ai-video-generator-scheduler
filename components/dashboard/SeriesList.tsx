"use client";

import type { SeriesData } from "@/app/dashboard/create/page";
import SeriesCard from "@/components/dashboard/SeriesCard";
import { Plus } from "lucide-react";
import Link from "next/link";

interface DashboardSeries extends SeriesData {
  id: string;
  created_at: string;
  status: string;
}

export default function SeriesList({ series }: { series: any[] }) {
  if (!series || series.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-200 rounded-2xl bg-white text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-6">
          <Plus className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No active series yet</h2>
        <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
          Start your first automation to see your series and generated videos here.
        </p>
        <Link 
          href="/dashboard/create"
          className="h-12 px-8 flex items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
        >
          + Create New Series
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {series.map((item) => (
        <SeriesCard key={item.id} series={item} />
      ))}
    </div>
  );
}
