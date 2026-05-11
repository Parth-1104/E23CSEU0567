import { useState, useEffect } from 'react';


const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJlMjNjc2V1MDU2N0BiZW5uZXR0LmVkdS5pbiIsImV4cCI6MTc3ODQ4ODgwNSwiaWF0IjoxNzc4NDg3OTA1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOTIxMDM2NDAtNjkzZS00MDhiLWE3NmYtZDI4NTI2NWY5NzUzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicGFydGggcGFua2FqIHNpbmdoIiwic3ViIjoiNWFjMjZkNmEtYWM4My00N2QyLTljYzAtN2I4YWMyN2IwY2IyIn0sImVtYWlsIjoiZTIzY3NldTA1NjdAYmVubmV0dC5lZHUuaW4iLCJuYW1lIjoicGFydGggcGFua2FqIHNpbmdoIiwicm9sbE5vIjoiZTIzY3NldTA1NjciLCJhY2Nlc3NDb2RlIjoiVGZEeGdyIiwiY2xpZW50SUQiOiI1YWMyNmQ2YS1hYzgzLTQ3ZDItOWNjMC03YjhhYzI3YjBjYjIiLCJjbGllbnRTZWNyZXQiOiJzd3puanl4VkNVcEFOSkVCIn0.OqxAvy1SFcb5kxOEMjKwUpEeQioHSz-dLsKjWasPWqk"
// const TOKEN = process.env.ACCESS_TOKEN;

export const useNotifications = (type = '', page = 1, limit = 10) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewedIds, setViewedIds] = useState(() => {
    return JSON.parse(localStorage.getItem('viewed_notifs') || '[]');
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const query = `?page=${page}&limit=${limit}${type ? `&notification_type=${type}` : ''}`;
        const res = await fetch(`${API_URL}${query}`, {
          headers: { 'Authorization': `Bearer ${TOKEN}` }
        });
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, page, limit]);

  const markAsRead = (id) => {
    if (!viewedIds.includes(id)) {
      const updated = [...viewedIds, id];
      setViewedIds(updated);
      localStorage.setItem('viewed_notifs', JSON.stringify(updated));
    }
  };

  return { notifications, viewedIds, markAsRead, loading };
};