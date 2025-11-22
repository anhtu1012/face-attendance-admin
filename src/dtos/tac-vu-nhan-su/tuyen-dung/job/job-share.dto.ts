export interface HRUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  department?: string;
  position?: string;
  status: "active" | "inactive";
}

export interface ShareJobRequest {
  jobCode: string;
  toUserId: string;
  message?: string;
}

export interface ShareJobResponse {
  id: string;
  jobCode: string;
  fromUserId: string;
  toUserId: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt?: string;
}

export interface JobShareRequest {
  id: string;
  jobCode: string;
  jobTitle: string;
  fromUser: {
    id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  toUser: {
    id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  message?: string;
}

export interface AcceptShareRequest {
  requestId: string;
}

export interface RejectShareRequest {
  requestId: string;
  reason?: string;
}
