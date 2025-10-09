"use client";

import { AppointmentItem } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/interview.dto";
import React, { useMemo } from "react";
import SharedCardList from "../SharedCardList";

interface InterviewCardListProps {
  data: AppointmentItem[];
  loading: boolean;
  onChangeInterviewer?: (interview: AppointmentItem) => void;
}

const InterviewCardList: React.FC<InterviewCardListProps> = ({
  data,
  loading,
  onChangeInterviewer,
}) => {
  const mappedData = useMemo(
    () =>
      data.map((interview) => ({
        id: interview.id || "",
        type: "interview" as const,
        date: interview.interviewDate,
        startTime: interview.startTime,
        endTime: interview.endTime,
        interviewType: interview.interviewType,
        location: interview.location
          ? { address: interview.location }
          : undefined,
        meetingLink: interview.meetingLink,
        notes: interview.notes || "",
        statusInterview: interview.status,
        jobTitle: interview.jobTitle,
        department: interview.department,
        jobLevel: interview.jobLevel,
        interviewer: interview.interviewer,
        originalData: interview,
      })),
    [data]
  );

  const handleChange = onChangeInterviewer
    ? (item: (typeof mappedData)[0]) => {
        onChangeInterviewer(item.originalData);
      }
    : undefined;

  return (
    <SharedCardList
      data={mappedData}
      loading={loading}
      onChangeHandler={handleChange}
      baseRoute="/tac-vu-nhan-su/phong-van-nhan-viec/phong-van"
    />
  );
};

export default InterviewCardList;
