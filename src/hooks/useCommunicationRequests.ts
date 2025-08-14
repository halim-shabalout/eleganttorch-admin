import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import {
  fetchCommunicationRequests,
  addCommunicationRequest,
  deleteCommunicationRequest,
  updateCommunicationRequest,
  getCommunicationRequestById,
} from '../services/CommunicationRequestsService';
import { CommunicationRequest } from '../types/CommunicationRequest';

export const useCommunicationRequests = () => {
  const [requests, setRequests] = useState<CommunicationRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newRequest, setNewRequest] = useState<CommunicationRequest | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [adding, setAdding] = useState<boolean>(false);
  const [removing, setRemoving] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCommunicationRequests();
      setRequests(res.data || []);
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response
          ? `Server Error: ${axiosError.response.status} - ${axiosError.response.statusText}`
          : axiosError.request
          ? "Network error: No response received from server"
          : axiosError.message || "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const findOne = async (id: string): Promise<CommunicationRequest | null> => {
    setLoading(true);
    setError(null);
    try {
      const request = await getCommunicationRequestById(id);
      return request;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to fetch communication request");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const add = async (data: Omit<CommunicationRequest, '_id'>) => {
    setAdding(true);
    setError(null);
    try {
      const created = await addCommunicationRequest(data);
      setNewRequest(created);
      setRequests(prev => [...prev, created]);
      return created || null;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to add communication request");
    } finally {
      setAdding(false);
    }
  };

  const update = async (id: string, updatedData: Partial<CommunicationRequest>) => {
    setUpdating(true);
    setError(null);
    try {
      const updated = await updateCommunicationRequest(id, updatedData);
      setRequests(prev =>
        prev.map(req => (req._id === updated._id ? updated : req))
      );
      return updated || null;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to update communication request");
    } finally {
      setUpdating(false);
    }
  };

  const remove = async (id: string) => {
    setRemoving(true);
    setError(null);
    try {
      await deleteCommunicationRequest(id);
      setRequests(prev => prev.filter(req => req._id !== id));
      return true;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to delete communication request");
    } finally {
      setRemoving(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    requests,
    loading,
    error,
    refetch: fetchData,
    add,
    adding,
    remove,
    removing,
    update,
    updating,
    findOne,
    newRequest,
  };
};
