import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function StudentDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  // Form state for editable fields
  const [form, setForm] = useState({
    age: "",
    medal: "",
    dob: "",
    email: "",
    phone_no: "",
  });

  // File state for photo & signature
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [signFile, setSignFile] = useState(null);
  const [signPreview, setSignPreview] = useState(null);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user || !token) navigate("/login");
  }, [user, token]);

  // Fetch student details on mount
  useEffect(() => {
    if (token) {
      api
        .get("/student/me")
        .then((res) => {
          setData(res.data);
          setForm({
            age: res.data.age || "",
            medal: res.data.medal || "",
            dob: res.data.dob || "",
            email: res.data.email || "",
            phone_no: res.data.phone_no || "",
          });
          setPhotoPreview(res.data.photo ? `http://localhost:5000/uploads/${res.data.photo}` : null);
          setSignPreview(res.data.signature ? `http://localhost:5000/uploads/${res.data.signature}` : null);
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSignChange = (e) => {
    const file = e.target.files[0];
    setSignFile(file);
    setSignPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update editable fields
      await api.put("/student/update", form);

      // Upload photo if selected
      if (photoFile) {
        const photoData = new FormData();
        photoData.append("photo", photoFile);
        await api.post("/student/upload/photo", photoData);
      }

      // Upload signature if selected
      if (signFile) {
        const signData = new FormData();
        signData.append("signature", signFile);
        await api.post("/student/upload/signature", signData);
      }

      alert("Details updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating details");
    }
  };

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    // <div className="min-h-screen bg-gray-50 p-6">
    //   <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
    //     <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

        
    //     <div className="grid grid-cols-2 gap-4 mb-6">
    //       <p><strong>SL No:</strong> {data.sl_no}</p>
    //       <p><strong>Course:</strong> {data.course_name}</p>
    //       <p><strong>Roll No:</strong> {data.roll_no}</p>
    //       <p><strong>Enroll No:</strong> {data.enroll_no}</p>
    //       <p><strong>Name:</strong> {data.student_name}</p>
    //       <p><strong>Father:</strong> {data.father_name}</p>
    //       <p><strong>Mother:</strong> {data.mother_name}</p>
    //       <p><strong>Medal:</strong> {data.medal || "N/A"}</p> 
    //     </div>

        
    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       <input
    //         type="number"
    //         name="age"
    //         placeholder="Age"
    //         value={form.age}
    //         onChange={handleChange}
    //         className="w-full p-2 border rounded"
    //       />
    //       {/* <input
    //         type="text"
    //         name="medal"
    //         placeholder="Medal"
    //         value={form.medal}
    //         onChange={handleChange}
    //         className="w-full p-2 border rounded"
    //       /> */}
    //       <input
    //         type="date"
    //         name="dob"
    //         value={form.dob}
    //         onChange={handleChange}
    //         className="w-full p-2 border rounded"
    //       />
    //       <input
    //         type="email"
    //         name="email"
    //         placeholder="Email"
    //         value={form.email}
    //         onChange={handleChange}
    //         className="w-full p-2 border rounded"
    //       />
    //       <input
    //         type="text"
    //         name="phone_no"
    //         placeholder="Phone Number"
    //         value={form.phone_no}
    //         onChange={handleChange}
    //         className="w-full p-2 border rounded"
    //       />

          
    //       <div className="flex flex-col md:flex-row gap-4 items-center">
    //         <div>
    //           <label className="block font-semibold mb-1">Photo:</label>
    //           {photoPreview && <img src={photoPreview} alt="Photo" className="w-24 h-24 object-cover mb-2 border" />}
    //           <input type="file" accept="image/*" onChange={handlePhotoChange} />
    //         </div>

    //         <div>
    //           <label className="block font-semibold mb-1">Signature:</label>
    //           {signPreview && <img src={signPreview} alt="Signature" className="w-24 h-24 object-cover mb-2 border" />}
    //           <input type="file" accept="image/*" onChange={handleSignChange} />
    //         </div>
    //       </div>

    //       <button
    //         type="submit"
    //         className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
    //       >
    //         Save
    //       </button>
    //     </form>

    //     <button
    //       onClick={() => { logout(); navigate("/login"); }}
    //       className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
    //     >
    //       Logout
    //     </button>
    //   </div>
    // </div>

    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* Header with title + logout */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="mt-2 md:mt-0 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
          <p><strong>SL No:</strong> {data.sl_no}</p>
          <p><strong>Course:</strong> {data.course_name}</p>
          <p><strong>Roll No:</strong> {data.roll_no}</p>
          <p><strong>Enroll No:</strong> {data.enroll_no}</p>
          <p><strong>Name:</strong> {data.student_name}</p>
          <p><strong>Father:</strong> {data.father_name}</p>
          <p><strong>Mother:</strong> {data.mother_name}</p>
          <p><strong>Medal:</strong> {data.medal || "N/A"}</p>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            name="phone_no"
            placeholder="Phone Number"
            value={form.phone_no}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Photo & Signature Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="p-4 border rounded-lg text-center">
              <label className="block font-semibold mb-2">Photo</label>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Photo"
                  className="w-24 h-24 object-cover mx-auto mb-2 border rounded-lg"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Max size: 500kB | Format: JPG/PNG</p>
            </div>

            <div className="p-4 border rounded-lg text-center">
              <label className="block font-semibold mb-2">Signature</label>
              {signPreview && (
                <img
                  src={signPreview}
                  alt="Signature"
                  className="w-24 h-24 object-cover mx-auto mb-2 border rounded-lg"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleSignChange}
                className="w-full text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Max size: 500kB | Format: JPG/PNG</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
