import api from '../lib/axios';
import { CommunicationRequest } from '../types/CommunicationRequest';
import { ApiResponse } from '../types/ApiResponse';

export const fetchCommunicationRequests = async (): Promise<ApiResponse<CommunicationRequest[]>> => {
  const response = await api.get<ApiResponse<CommunicationRequest[]>>('/communication-requests');
  return response.data;
};

export const getCommunicationRequestById = async (
  id: string
): Promise<CommunicationRequest> => {
  try {
    const response = await api.get<CommunicationRequest>(`/communication-requests/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching communication request:", error);
    throw error;
  }
};

export const addCommunicationRequest = async (
  data: Omit<CommunicationRequest, '_id'>
): Promise<CommunicationRequest> => {
  const response = await api.post<CommunicationRequest>('/communication-requests', data);
  return response.data;
};

export const updateCommunicationRequest = async (
  id: string,
  data: Partial<CommunicationRequest>
): Promise<CommunicationRequest> => {
  try {
    const response = await api.patch<CommunicationRequest>(`/communication-requests/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating communication request:", error);
    throw error;
  }
};

export const deleteCommunicationRequest = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(`/communication-requests/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting communication request:", error);
    throw error;
  }
};
