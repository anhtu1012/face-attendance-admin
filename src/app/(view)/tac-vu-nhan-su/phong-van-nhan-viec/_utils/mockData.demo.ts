/**
 * Demo: How to use Mock Data and Filters
 *
 * This file demonstrates various use cases for the mock data and filter functions
 */

import {
  mockInterviewData,
  mockJobOfferData,
  filterInterviewData,
  filterJobOfferData,
} from "./mockData";

// ==========================================
// Example 1: Get all interview data
// ==========================================
console.log("=== All Interviews ===");
console.log(`Total: ${mockInterviewData.length} interviews`);
mockInterviewData.forEach((interview) => {
  console.log(
    `- ${interview.candidateName} | ${interview.status} | ${interview.interviewType}`
  );
});

// ==========================================
// Example 2: Filter by status
// ==========================================
console.log("\n=== Scheduled Interviews Only ===");
const scheduledInterviews = filterInterviewData(mockInterviewData, {
  status: "SCHEDULED",
});
console.log(`Total: ${scheduledInterviews.length} scheduled interviews`);

// ==========================================
// Example 3: Filter by date range
// ==========================================
console.log("\n=== Interviews in October 2025 ===");
const octoberInterviews = filterInterviewData(mockInterviewData, {
  fromDate: "2025-10-01",
  toDate: "2025-10-31",
});
console.log(`Total: ${octoberInterviews.length} interviews in October`);

// ==========================================
// Example 4: Quick search
// ==========================================
console.log("\n=== Search for 'Nguyen' ===");
const nguyenInterviews = filterInterviewData(mockInterviewData, {
  quickSearch: "nguyen",
});
console.log(`Total: ${nguyenInterviews.length} results`);
nguyenInterviews.forEach((interview) => {
  console.log(`- ${interview.candidateName}`);
});

// ==========================================
// Example 5: Combined filters
// ==========================================
console.log("\n=== Scheduled + Date Range + Search ===");
const combinedFilter = filterInterviewData(mockInterviewData, {
  status: "SCHEDULED",
  fromDate: "2025-10-01",
  toDate: "2025-10-31",
  quickSearch: "văn",
});
console.log(`Total: ${combinedFilter.length} results`);

// ==========================================
// Example 6: Job Offers by status
// ==========================================
console.log("\n=== Pending Job Offers ===");
const pendingOffers = filterJobOfferData(mockJobOfferData, {
  status: "PENDING",
});
console.log(`Total: ${pendingOffers.length} pending offers`);
pendingOffers.forEach((offer) => {
  console.log(`- ${offer.candidateName} | Guide: ${offer.guidePersonName}`);
});

// ==========================================
// Example 7: Statistics
// ==========================================
console.log("\n=== Interview Statistics ===");
const stats = {
  total: mockInterviewData.length,
  scheduled: filterInterviewData(mockInterviewData, { status: "SCHEDULED" })
    .length,
  confirmed: filterInterviewData(mockInterviewData, { status: "CONFIRMED" })
    .length,
  rejected: filterInterviewData(mockInterviewData, { status: "REJECTED" })
    .length,
  completed: filterInterviewData(mockInterviewData, { status: "COMPLETED" })
    .length,
  cancelled: filterInterviewData(mockInterviewData, { status: "CANCELLED" })
    .length,
  online: mockInterviewData.filter((i) => i.interviewType === "online").length,
  offline: mockInterviewData.filter((i) => i.interviewType === "offline")
    .length,
};

console.log("By Status:");
console.log(`  - Scheduled: ${stats.scheduled}`);
console.log(`  - Confirmed: ${stats.confirmed}`);
console.log(`  - Rejected: ${stats.rejected}`);
console.log(`  - Completed: ${stats.completed}`);
console.log(`  - Cancelled: ${stats.cancelled}`);
console.log("\nBy Type:");
console.log(`  - Online: ${stats.online}`);
console.log(`  - Offline: ${stats.offline}`);

// ==========================================
// Example 8: Job Offer Statistics
// ==========================================
console.log("\n=== Job Offer Statistics ===");
const offerStats = {
  total: mockJobOfferData.length,
  pending: filterJobOfferData(mockJobOfferData, { status: "PENDING" }).length,
  accepted: filterJobOfferData(mockJobOfferData, { status: "ACCEPTED" }).length,
  rejected: filterJobOfferData(mockJobOfferData, { status: "REJECTED" }).length,
  completed: filterJobOfferData(mockJobOfferData, { status: "COMPLETED" })
    .length,
};

console.log("By Status:");
console.log(`  - Pending: ${offerStats.pending}`);
console.log(`  - Accepted: ${offerStats.accepted}`);
console.log(`  - Rejected: ${offerStats.rejected}`);
console.log(`  - Completed: ${offerStats.completed}`);

// ==========================================
// Example 9: Export filtered data
// ==========================================
export const getFilteredInterviewData = (filters: {
  fromDate?: string;
  toDate?: string;
  status?: string;
  quickSearch?: string;
}) => {
  return filterInterviewData(mockInterviewData, filters);
};

export const getFilteredJobOfferData = (filters: {
  fromDate?: string;
  toDate?: string;
  status?: string;
  quickSearch?: string;
}) => {
  return filterJobOfferData(mockJobOfferData, filters);
};

// ==========================================
// Example 10: Common filter presets
// ==========================================
export const filterPresets = {
  // Today's interviews
  todayInterviews: () => {
    const today = new Date().toISOString().split("T")[0];
    return filterInterviewData(mockInterviewData, {
      fromDate: today,
      toDate: today,
    });
  },

  // Upcoming interviews (next 7 days)
  upcomingInterviews: () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return filterInterviewData(mockInterviewData, {
      fromDate: today.toISOString().split("T")[0],
      toDate: nextWeek.toISOString().split("T")[0],
    });
  },

  // Active job offers (pending or accepted)
  activeJobOffers: () => {
    return mockJobOfferData.filter(
      (offer) => offer.status === "PENDING" || offer.status === "ACCEPTED"
    );
  },

  // Rejected candidates (need follow up)
  rejectedCandidates: () => {
    const rejectedInterviews = filterInterviewData(mockInterviewData, {
      status: "REJECTED",
    });
    const rejectedOffers = filterJobOfferData(mockJobOfferData, {
      status: "REJECTED",
    });

    return {
      interviews: rejectedInterviews,
      jobOffers: rejectedOffers,
      total: rejectedInterviews.length + rejectedOffers.length,
    };
  },
};

// Usage examples:
console.log("\n=== Filter Presets ===");
console.log(`Today's Interviews: ${filterPresets.todayInterviews().length}`);
console.log(
  `Upcoming Interviews: ${filterPresets.upcomingInterviews().length}`
);
console.log(`Active Job Offers: ${filterPresets.activeJobOffers().length}`);
console.log(`Rejected Candidates: ${filterPresets.rejectedCandidates().total}`);
