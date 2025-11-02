"use client";

import { JobOfferItem } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/job-offer.dto";
import React from "react";
import SharedCardList from "../SharedCardList";

interface JobOfferCardListProps {
  data: JobOfferItem[];
  loading: boolean;
  onChangeGuidePerson?: (jobOffer: JobOfferItem) => void;
}

const JobOfferCardList: React.FC<JobOfferCardListProps> = ({}) => {
  return (
    <SharedCardList
      data={[]}
      loading={true}
      onChangeHandler={undefined}
      baseRoute="/tac-vu-nhan-su/phong-van-nhan-viec/nhan-viec"
    />
  );
};

export default JobOfferCardList;
