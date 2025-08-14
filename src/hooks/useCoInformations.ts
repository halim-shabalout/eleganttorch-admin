import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import {
  fetchCoInformations,
  addCoInformation,
  deleteCoInformation,
  updateCoInformation,
  getCoInformationById,
} from '../services/CoInformationsService';
import { CoInformation } from '../types/CoInformation';

export const useCoInformations = () => {
  const [coInformations, setCoInformations] = useState<CoInformation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newCoInformation, setNewCoInformation] = useState<CoInformation | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [adding, setAdding] = useState<boolean>(false);
  const [removing, setRemoving] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCoInformations();
      setCoInformations(res.data || []);
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

  const findOne = async (id: string): Promise<CoInformation | null> => {
    setLoading(true);
    setError(null);
    try {
      const coInfo = await getCoInformationById(id);
      return coInfo;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to fetch coInformation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const add = async (data: Omit<CoInformation, '_id'>) => {
    setAdding(true);
    setError(null);
    try {
      const created = await addCoInformation(data);
      setNewCoInformation(created);
      setCoInformations(prev => [...prev, created]);
      return created || null;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to add coInformation");
    } finally {
      setAdding(false);
    }
  };

  const update = async (id: string, updatedData: Partial<CoInformation>) => {
    setUpdating(true);
    setError(null);
    try {
      const updated = await updateCoInformation(id, updatedData);
      setCoInformations(prev =>
        prev.map(info => (info._id === updated._id ? updated : info))
      );
      return updated || null;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to update coInformation");
    } finally {
      setUpdating(false);
    }
  };

  const remove = async (id: string) => {
    setRemoving(true);
    setError(null);
    try {
      await deleteCoInformation(id);
      setCoInformations(prev => prev.filter(info => info._id !== id));
      return true;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to delete coInformation");
    } finally {
      setRemoving(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    coInformations,
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
    newCoInformation,
  };
};
