import api from '../lib/axios';
import { CoInformation } from '../types/CoInformation';
import { ApiResponse } from '../types/ApiResponse';

export const fetchCoInformations = async (): Promise<ApiResponse<CoInformation[]>> => {
  const response = await api.get<ApiResponse<CoInformation[]>>('/co-informations');
  return response.data;
};

export const getCoInformationById = async (
  id: string
): Promise<CoInformation> => {
  try {
    const response = await api.get<CoInformation>(`/co-informations/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching coInformation:", error);
    throw error;
  }
};

export const addCoInformation = async (
  data: Omit<CoInformation, '_id'>
): Promise<CoInformation> => {
  const response = await api.post<CoInformation>('/co-informations', data);
  return response.data;
};

export const updateCoInformation = async (
  id: string,
  data: Partial<CoInformation>
): Promise<CoInformation> => {
  try {
    const response = await api.patch<CoInformation>(`/co-informations/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating coInformation:", error);
    throw error;
  }
};

export const deleteCoInformation = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(`/co-informations/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting coInformation:", error);
    throw error;
  }
};
