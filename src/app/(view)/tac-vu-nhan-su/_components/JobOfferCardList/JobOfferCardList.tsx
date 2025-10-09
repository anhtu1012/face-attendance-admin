"use client";

import { JobOfferItem } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/job-offer.dto";
import React, { useMemo } from "react";
import SharedCardList from "../SharedCardList";

interface JobOfferCardListProps {
  data: JobOfferItem[];
  loading: boolean;
  onChangeGuidePerson?: (jobOffer: JobOfferItem) => void;
}

const JobOfferCardList: React.FC<JobOfferCardListProps> = ({
  data,
  loading,
  onChangeGuidePerson,
}) => {
  const mappedData = useMemo(
    () =>
      data.map((jobOffer) => ({
        id: jobOffer.id || "",
        type: "jobOffer" as const,
        date: jobOffer.offerDate,
        startTime: jobOffer.startTime,
        endTime: jobOffer.endTime,
        interviewType: "offline" as const,
        location:  { address: jobOffer.address },
        meetingLink: undefined,
        notes: jobOffer.notes || "",
        statusInterview: jobOffer.status,
        jobTitle: jobOffer.jobTitle,
        department: jobOffer.department,
        jobLevel: jobOffer.jobLevel,
        guidePersonName: jobOffer.guidePersonName,
        originalData: jobOffer,
      })),
    [data]
  );

  const handleChange = onChangeGuidePerson
    ? (item: (typeof mappedData)[0]) => {
        onChangeGuidePerson(item.originalData);
      }
    : undefined;

  return (
    <SharedCardList
      data={mappedData}
      loading={loading}
      onChangeHandler={handleChange}
      baseRoute="/tac-vu-nhan-su/phong-van-nhan-viec/nhan-viec"
    />
  );
};

export default JobOfferCardList;
