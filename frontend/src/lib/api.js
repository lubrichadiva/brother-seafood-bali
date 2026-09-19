import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
export const fileUrl = (path) => `${API}/files/${path}`;

export const api = {
  proposals: () => axios.get(`${API}/proposals`).then((r) => r.data),
  proposal: (id) => axios.get(`${API}/proposals/${id}`).then((r) => r.data),
  createProposal: (d) => axios.post(`${API}/proposals`, d).then((r) => r.data),
  updateProposal: (id, d) => axios.put(`${API}/proposals/${id}`, d).then((r) => r.data),
  deleteProposal: (id) => axios.delete(`${API}/proposals/${id}`).then((r) => r.data),
  docxUrl: (id) => `${API}/proposals/${id}/docx`,
  visits: () => axios.get(`${API}/visits`).then((r) => r.data),
  summary: () => axios.get(`${API}/visits/summary`).then((r) => r.data),
  createVisit: (d) => axios.post(`${API}/visits`, d).then((r) => r.data),
  patchVisit: (id, d) => axios.patch(`${API}/visits/${id}`, d).then((r) => r.data),
  deleteVisit: (id) => axios.delete(`${API}/visits/${id}`).then((r) => r.data),
  monthlyReport: (month) => axios.get(`${API}/reports/monthly`, { params: month ? { month } : {} }).then((r) => r.data),
  monthlyReportXlsxUrl: (month) => `${API}/reports/monthly.xlsx${month ? `?month=${month}` : ""}`,
  reservations: (month, guide, travelAgent) => axios.get(`${API}/reservations`, { params: { ...(month ? { month } : {}), ...(guide ? { guide } : {}), ...(travelAgent ? { travel_agent: travelAgent } : {}) } }).then((r) => r.data),
  createReservation: (d) => axios.post(`${API}/reservations`, d).then((r) => r.data),
  updateReservation: (id, d) => axios.put(`${API}/reservations/${id}`, d).then((r) => r.data),
  patchReservation: (id, d) => axios.patch(`${API}/reservations/${id}`, d).then((r) => r.data),
  deleteReservation: (id) => axios.delete(`${API}/reservations/${id}`).then((r) => r.data),
  reservationSummary: (month, guide, travelAgent) => axios.get(`${API}/reservations/summary`, { params: { ...(month ? { month } : {}), ...(guide ? { guide } : {}), ...(travelAgent ? { travel_agent: travelAgent } : {}) } }).then((r) => r.data),
  settings: () => axios.get(`${API}/settings`).then((r) => r.data),
  uploadLogo: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return axios.post(`${API}/settings/logo`, fd).then((r) => r.data);
  },
  removeLogo: () => axios.delete(`${API}/settings/logo`).then((r) => r.data),
  uploadGallery: (file, caption) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("caption", caption || "");
    return axios.post(`${API}/settings/gallery`, fd).then((r) => r.data);
  },
  removeGallery: (id) => axios.delete(`${API}/settings/gallery/${id}`).then((r) => r.data),
};

export const idr = (n) => `IDR ${Math.round(Number(n) || 0).toLocaleString("en-US")}`;
