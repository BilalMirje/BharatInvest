import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import type { Business, Pitch, Offer, Conversation, ChatMessage } from '../types';

export const usePublicBusinesses = () =>
  useQuery<Business[]>({
    queryKey: ['publicBusinesses'],
    queryFn: () => api.get('/api/public/businesses').then((r) => r.data),
  });

export const useMyBusinesses = () =>
  useQuery<Business[]>({
    queryKey: ['myBusinesses'],
    queryFn: () => api.get('/api/businesses/my').then((r) => r.data),
  });

export const useLiveBusinesses = (category?: string) =>
  useQuery<Business[]>({
    queryKey: ['liveBusinesses', category],
    queryFn: () =>
      api.get('/api/businesses', { params: category ? { category } : {} }).then((r) => r.data),
  });

export const useBusiness = (id: number) =>
  useQuery<Business>({
    queryKey: ['business', id],
    queryFn: () => api.get(`/api/businesses/${id}`).then((r) => r.data),
    enabled: !!id,
  });

export const usePendingBusinesses = () =>
  useQuery<Business[]>({
    queryKey: ['pendingBusinesses'],
    queryFn: () => api.get('/api/admin/businesses/pending').then((r) => r.data),
  });

export const useAllBusinessesAdmin = () =>
  useQuery<Business[]>({
    queryKey: ['allBusinesses'],
    queryFn: () => api.get('/api/admin/businesses').then((r) => r.data),
  });

export const usePitch = (businessId: number) =>
  useQuery<Pitch>({
    queryKey: ['pitch', businessId],
    queryFn: () => api.get(`/api/pitches/business/${businessId}`).then((r) => r.data),
    enabled: !!businessId,
  });

export const useOffersForBusiness = (businessId: number) =>
  useQuery<Offer[]>({
    queryKey: ['offers', businessId],
    queryFn: () => api.get(`/api/offers/business/${businessId}`).then((r) => r.data),
    enabled: !!businessId,
  });

export const useMyOffers = () =>
  useQuery<Offer[]>({
    queryKey: ['myOffers'],
    queryFn: () => api.get('/api/offers/my').then((r) => r.data),
  });

export const useReceivedOffers = () =>
  useQuery<Offer[]>({
    queryKey: ['receivedOffers'],
    queryFn: () => api.get('/api/offers/received').then((r) => r.data),
  });

export const useConversations = () =>
  useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: () => api.get('/api/conversations').then((r) => r.data),
    refetchInterval: 5000,
  });

export const useMessages = (conversationId: number) =>
  useQuery<ChatMessage[]>({
    queryKey: ['messages', conversationId],
    queryFn: () => api.get(`/api/conversations/${conversationId}/messages`).then((r) => r.data),
    enabled: !!conversationId,
    refetchInterval: 3000,
  });

export const useCreateBusiness = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/api/businesses', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['myBusinesses'] }),
  });
};

export const useApproveBusiness = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.put(`/api/admin/businesses/${id}/approve`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pendingBusinesses'] });
      qc.invalidateQueries({ queryKey: ['allBusinesses'] });
    },
  });
};

export const useRejectBusiness = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      api.put(`/api/admin/businesses/${id}/reject`, { reason }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pendingBusinesses'] });
      qc.invalidateQueries({ queryKey: ['allBusinesses'] });
    },
  });
};

export const useSavePitchUrl = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/api/pitches/save-url', data).then((r) => r.data),
    onSuccess: (_: any, vars: any) => qc.invalidateQueries({ queryKey: ['pitch', vars.businessId] }),
  });
};

export const useAnalyzePitch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pitchId: number) => api.post(`/api/pitches/${pitchId}/analyze`).then((r) => r.data),
    onSuccess: (data: Pitch) => qc.invalidateQueries({ queryKey: ['pitch', data.businessId] }),
  });
};


export const useAnalyzeByBusiness = () =>
  useMutation({
    mutationFn: (businessId: number) =>
      api.post(`/api/pitches/analyze-business/${businessId}`).then((r) => r.data),
  });

export const useSubmitPitch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pitchId: number) => api.post(`/api/pitches/${pitchId}/submit`).then((r) => r.data),
    onSuccess: (data: Pitch) => {
      qc.invalidateQueries({ queryKey: ['pitch', data.businessId] });
      qc.invalidateQueries({ queryKey: ['myBusinesses'] });
    },
  });
};

export const useCreateOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/api/offers', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['myOffers'] }),
  });
};

export const useAcceptOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.put(`/api/offers/${id}/accept`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['receivedOffers'] });
      qc.invalidateQueries({ queryKey: ['myBusinesses'] });
    },
  });
};

export const useRejectOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.put(`/api/offers/${id}/reject`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['receivedOffers'] }),
  });
};

export const useDeleteBusiness = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/admin/businesses/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['allBusinesses'] });
      qc.invalidateQueries({ queryKey: ['pendingBusinesses'] });
    },
  });
};

export const useAdminInvestors = () =>
  useQuery<any[]>({
    queryKey: ['adminInvestors'],
    queryFn: () => api.get('/api/admin/investors').then((r) => r.data),
  });

export const useApproveInvestor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.put(`/api/admin/investors/${id}/approve`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminInvestors'] }),
  });
};

export const useRejectInvestor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.put(`/api/admin/investors/${id}/reject`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminInvestors'] }),
  });
};

export const useInvestorOffers = (investorId: number) =>
  useQuery<any[]>({
    queryKey: ['investorOffers', investorId],
    queryFn: () => api.get(`/api/admin/investors/${investorId}/offers`).then((r) => r.data),
    enabled: !!investorId,
  });

export const useTranslate = () =>
  useMutation({
    mutationFn: ({ text, language }: { text: string; language: string }) =>
      api.post('/api/ai/translate', { text, language }).then((r) => r.data),
  });
