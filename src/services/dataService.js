import { adminData, doctorData, nurseData } from "../data/mockdata";

// Mock async function (simulates network delay)
export function fetchDashboardData(role) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (role === "admin") resolve(adminData);
      else if (role === "doctor") resolve(doctorData);
      else if (role === "nurse") resolve(nurseData);
      else resolve({});
    }, 800); // simulate 800ms network latency
  });
}
