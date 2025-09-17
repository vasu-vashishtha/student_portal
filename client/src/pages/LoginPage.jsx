// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api";
// import { useAuth } from "../contexts/AuthContext";

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("admin");
//   const [error, setError] = useState("");

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!username || !password) {
//       setError("Please fill in all fields");
//       return;
//     }

//     try {
//       const res = await api.post("/auth/login", { username, password, role });

//       // Save user & token
//       login(res.data.user, res.data.token);

//       // Navigate based on role
//       if (res.data.role === "admin") navigate("/admin");
//       else if (res.data.role === "student") navigate("/student");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Invalid credentials");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white shadow-lg rounded-lg p-8 w-96">
//         <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block mb-1 font-semibold">Role</label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full p-2 border rounded"
//             >
//               <option value="admin">Admin</option>
//               <option value="student">Student</option>
//             </select>
//           </div>

//           <input
//             type="text"
//             placeholder={role === "student" ? "Enroll No" : "Username"}
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-2 border rounded"
//           />

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import ccsuLogo from "../assets/ccsu_logo.png"

export default function LoginPage() {
  const { login, user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { username, password, role });

      const userData = { ...res.data.user, role: res.data.role };
      login(userData, res.data.token);

      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "student") navigate("/student");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    // <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //   <div className="bg-white shadow-lg rounded-lg p-8 w-96">
    //     <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

    //     {error && <p className="text-red-500 text-center mb-2">{error}</p>}

    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       <input
    //         type="text"
    //         placeholder="Username / Enroll No"
    //         value={username}
    //         onChange={(e) => setUsername(e.target.value)}
    //         className="w-full p-2 border rounded"
    //         required
    //       />
    //       <input
    //         type="password"
    //         placeholder="Password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         className="w-full p-2 border rounded"
    //         required
    //       />

    //       {/* Role selection */}
    //       <select
    //         value={role}
    //         onChange={(e) => setRole(e.target.value)}
    //         className="w-full p-2 border rounded"
    //         required
    //       >
    //         <option value="student">Student</option>
    //         <option value="admin">Admin</option>
    //       </select>

    //       <button
    //         type="submit"
    //         className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    //       >
    //         Login
    //       </button>
    //     </form>

    //     {user && (
    //       <p className="text-center mt-4">
    //         Logged in as: <strong>{user?.role?.toUpperCase() || "UNKNOWN"}</strong>
    //       </p>
    //     )}
    //   </div>
    // </div>
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-lg overflow-hidden w-[90%] max-w-4xl">
        
        
        <div className="flex flex-col items-center justify-center bg-blue-600 text-white p-8 md:w-1/2">
          <img
            src={ccsuLogo} 
            alt="CCSU Logo"
            className="w-32 h-32 mb-4"
          />
          <h1 className="text-lg font-semibold text-center leading-snug">
            Chaudhary Charan Singh University, Meerut, NAAC A++
          </h1>
        </div>

        
        <div className="p-8 md:w-1/2 w-full">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>

          {error && (
            <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username / Enroll No"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
            >
              Login
            </button>
          </form>

          {user && (
            <p className="text-center mt-4 text-gray-600">
              Logged in as:{" "}
              <strong className="text-blue-600">
                {user?.role?.toUpperCase() || "UNKNOWN"}
              </strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


