import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

export const getEvents = () => API.get("/events");
export const createEvent = (data) => API.post("/events", data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);
export const toggleEvent = (id) => API.patch(`/events/${id}/toggle`);
export const saveAvailability = (data) =>
  API.post("/availability", data);

export const getAvailability = () =>
  API.get("/availability");
export const updateEvent = (id, data) => {
  return API.put(`/events/${id}`, data);           // uses the axios instance properly
};
export const getEventById = (id) => {
  return API.get(`/events/${id}`);
};
export const getEventBySlug = (slug) => {
  return API.get(`/events/slug/${slug}`);
};