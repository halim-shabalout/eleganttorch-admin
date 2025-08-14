export type RequestStatus = "في الانتظار" | "جاري العمل عليه" | "تم الانتهاء";

export interface CommunicationRequest {
  _id: string;
  name?: string;
  phone?: string;
  message?: string;
  status?: RequestStatus;
  createdAt?: string;
  updatedAt?: string;
}
