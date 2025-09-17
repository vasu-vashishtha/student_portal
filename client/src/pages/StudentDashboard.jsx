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
    dob: "",
    age: "",
    gender: "",
    address: "",
    email: "",
    phone_no: "",
    medal: "",
  });

  // File state for photo & signature
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [signFile, setSignFile] = useState(null);
  const [signPreview, setSignPreview] = useState(null);

  // Helper function to calculate age
  const calculateAge = (dob) => {
    if (!dob) return "";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

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
            dob: res.data.dob || "",
            age: res.data.dob ? calculateAge(res.data.dob) : "",
            gender: res.data.gender || "",
            address: res.data.address || "",
            email: res.data.email || "",
            phone_no: res.data.phone_no || "",
            medal: res.data.medal || "",
          });
          setPhotoPreview(res.data.photo ? `http://localhost:5000/uploads/${res.data.photo}` : null);
          setSignPreview(res.data.signature ? `http://localhost:5000/uploads/${res.data.signature}` : null);
        })
        .catch((err) => console.error(err));
    }
  }, [token]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "dob") {
      setForm({
        ...form,
        dob: value,
        age: calculateAge(value),
      });
    }else{
      setForm({ ...form, [e.target.name]: e.target.value });
    }
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

    if (!form.gender) {
      alert("Gender is required");
      return;
    }
    if (!form.phone_no) {
      alert("Phone number is required");
      return;
    }
    if (!photoFile && !photoPreview) {
      alert("Photo is required");
      return;
    }
    if (!signFile && !signPreview) {
      alert("Signature is required");
      return;
    }

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
          <p><strong>Program:</strong> {data.course_name}</p>
          <p><strong>Roll No:</strong> {data.roll_no}</p>
          <p><strong>Enroll No:</strong> {data.enroll_no}</p>
          <p><strong>Name:</strong> {data.student_name}</p>
          <p><strong>Father:</strong> {data.father_name}</p>
          <p><strong>Mother:</strong> {data.mother_name}</p>
          <p><strong>Medal:</strong> {data.medal || "N/A"}</p>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Date of Birth</label>
          <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
        </div>
        <div>
          <label className="block font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
        </div>
        <div>
        <label className="block font-medium mb-1">Gender <span className="text-red-600">*</span></label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
        <label className="block font-medium mb-1">Address</label>
          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Phone<span className="text-red-600">*</span></label>
          <input
            type="text"
            name="phone_no"
            placeholder="Phone Number"
            value={form.phone_no}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
          

          {/* Photo & Signature Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="p-4 border rounded-lg text-center">
              <label className="block font-semibold mb-2">Photo<span className="text-red-600">*</span></label>
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
              {/* <p className="text-xs text-gray-500 mt-1">Max size: 500kB | Format: JPG/PNG</p> */}
            </div>

            <div className="p-4 border rounded-lg text-center">
              <label className="block font-semibold mb-2">Signature<span className="text-red-600">*</span></label>
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
              {/* <p className="text-xs text-gray-500 mt-1">Max size: 500kB | Format: JPG/PNG</p> */}
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
