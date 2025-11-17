const fetchLogout = async () => {
  const res = await fetch("/api/auth/session", {
    method: "DELETE",
    credentials: "same-origin",
  });
  if (!res.ok) {
    const err = await res.json();
    throw err;
  }
  return res.json();
};
export { fetchLogout };
