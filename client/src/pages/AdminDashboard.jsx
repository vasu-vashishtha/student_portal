// import { useEffect, useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
// import api from "../api";
// import * as XLSX from "xlsx";

// export default function AdminDashboard() {
//   const { user, logout, token } = useAuth();
//   const navigate = useNavigate();
//   const [students, setStudents] = useState([]);

//   // Redirect to login if not logged in
//   useEffect(() => {
//     if (!user || !token) {
//       navigate("/login");
//     }
//   }, [user, token]);

//   // Fetch all students
//   useEffect(() => {
//     if (token) {
//       api
//         .get("/admin/students")
//         .then((res) => setStudents(res.data))
//         .catch((err) => console.error(err));
//     }
//   }, [token]);

//   // Export to Excel
//   const handleDownloadExcel = () => {
//     if (students.length === 0) return;

//     const worksheet = XLSX.utils.json_to_sheet(students);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
//     XLSX.writeFile(workbook, "students.xlsx");
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   if (!user) return null; 

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
//         {/* Header with title + logout */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-4">
//           <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
//             Admin Dashboard
//           </h1>
//           <div className="flex gap-2">
//             <button
//               onClick={handleDownloadExcel}
//               className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
//             >
//               Download Excel
//             </button>
//             <button
//               onClick={handleLogout}
//               className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
//             >
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* Scrollable Table */}
//         <div className="relative max-h-[70vh] overflow-auto border rounded-lg 
//                         scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
//           <table className="w-full border-collapse min-w-[1000px]">
//             <thead className="bg-gray-200 sticky top-0 z-10">
//               <tr>
//                 <th className="border px-4 py-2 text-sm">SL No</th>
//                 <th className="border px-4 py-2 text-sm">Course</th>
//                 <th className="border px-4 py-2 text-sm">Roll No</th>
//                 <th className="border px-4 py-2 text-sm">Enroll No</th>
//                 <th className="border px-4 py-2 text-sm">Student Name</th>
//                 <th className="border px-4 py-2 text-sm">Father</th>
//                 <th className="border px-4 py-2 text-sm">Mother</th>
//                 <th className="border px-4 py-2 text-sm">Age</th>
//                 <th className="border px-4 py-2 text-sm">Medal</th>
//                 <th className="border px-4 py-2 text-sm">DOB</th>
//                 <th className="border px-4 py-2 text-sm">Email</th>
//                 <th className="border px-4 py-2 text-sm">Phone</th>
//                 <th className="border px-4 py-2 text-sm">Photo</th>
//                 <th className="border px-4 py-2 text-sm">Signature</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((s) => (
//                 <tr
//                   key={s.id}
//                   className="text-center even:bg-gray-50 hover:bg-gray-100 transition"
//                 >
//                   <td className="border px-4 py-2">{s.sl_no}</td>
//                   <td className="border px-4 py-2">{s.course_name}</td>
//                   <td className="border px-4 py-2">{s.roll_no}</td>
//                   <td className="border px-4 py-2">{s.enroll_no}</td>
//                   <td className="border px-4 py-2">{s.student_name}</td>
//                   <td className="border px-4 py-2">{s.father_name}</td>
//                   <td className="border px-4 py-2">{s.mother_name}</td>
//                   <td className="border px-4 py-2">{s.age}</td>
//                   <td className="border px-4 py-2">{s.medal}</td>
//                   <td className="border px-4 py-2">{s.dob}</td>
//                   <td className="border px-4 py-2">{s.email}</td>
//                   <td className="border px-4 py-2">{s.phone_no}</td>
//                   <td className="border px-4 py-2">
//                     {s.photo && (
//                       <img
//                         src={`http://localhost:5000/uploads/${s.photo}`}
//                         alt="photo"
//                         className="w-16 h-16 object-cover mx-auto rounded"
//                       />
//                     )}
//                   </td>
//                   <td className="border px-4 py-2">
//                     {s.signature && (
//                       <img
//                         src={`http://localhost:5000/uploads/${s.signature}`}
//                         alt="sign"
//                         className="w-16 h-16 object-cover mx-auto rounded"
//                       />
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function AdminDashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, [user, token]);

  // Fetch all students
  useEffect(() => {
    if (token) {
      api
        .get("/admin/students")
        .then((res) =>
          setStudents(
            res.data.map((s) => ({
              ...s,
              dob: s.dob ? new Date(s.dob).toISOString().split("T")[0] : "", // ✅ format here
            }))
          )
        )
        .catch((err) => console.error(err));
    }
  }, [token]);

  // Export to Excel with hyperlinks
  const handleDownloadExcel = async () => {
    if (students.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Students");

    worksheet.columns = [
      { header: "SL No", key: "sl_no", width: 10 },
      { header: "Program", key: "course_name", width: 25 },
      { header: "Roll No", key: "roll_no", width: 15 },
      { header: "Enroll No", key: "enroll_no", width: 15 },
      { header: "Student Name", key: "student_name", width: 25 },
      { header: "Father", key: "father_name", width: 25 },
      { header: "Mother", key: "mother_name", width: 25 },
      { header: "DOB", key: "dob", width: 15 },
      { header: "Age", key: "age", width: 10 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Address", key: "address", width: 30 },    
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone_no", width: 15 },
      { header: "Medal", key: "medal", width: 10 },
      { header: "Photo", key: "photo", width: 40 },
      { header: "Signature", key: "signature", width: 40 },
    ];

    students.forEach((s) => {
      const row = worksheet.addRow(s);

      // Photo hyperlink
      if (s.photo) {
        row.getCell("photo").value = {
          text: "View Photo",
          hyperlink: `http://localhost:5000/uploads/${s.photo}`,
        };
        row.getCell("photo").font = { color: { argb: "FF0000FF" }, underline: true };
      }

      // Signature hyperlink
      if (s.signature) {
        row.getCell("signature").value = {
          text: "View Signature",
          hyperlink: `http://localhost:5000/uploads/${s.signature}`,
        };
        row.getCell("signature").font = { color: { argb: "FF0000FF" }, underline: true };
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "students.xlsx");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
        {/* Header with title + logout */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
            Admin Dashboard
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadExcel}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Download Excel
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="relative max-h-[70vh] overflow-auto border rounded-lg 
                        scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="border px-4 py-2 text-sm">SL No</th>
                <th className="border px-4 py-2 text-sm">Program</th>
                <th className="border px-4 py-2 text-sm">Roll No</th>
                <th className="border px-4 py-2 text-sm">Enroll No</th>
                <th className="border px-4 py-2 text-sm">Student Name</th>
                <th className="border px-4 py-2 text-sm">Father</th>
                <th className="border px-4 py-2 text-sm">Mother</th>
                <th className="border px-4 py-2 text-sm">DOB</th>
                <th className="border px-4 py-2 text-sm">Age</th>
                <th className="border px-4 py-2 text-sm">Gender</th>
                <th className="border px-4 py-2 text-sm">Address</th>
                <th className="border px-4 py-2 text-sm">Email</th>
                <th className="border px-4 py-2 text-sm">Phone</th>
                <th className="border px-4 py-2 text-sm">Medal</th>
                <th className="border px-4 py-2 text-sm">Photo</th>
                <th className="border px-4 py-2 text-sm">Signature</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  className="text-center even:bg-gray-50 hover:bg-gray-100 transition"
                >
                  <td className="border px-4 py-2">{s.sl_no}</td>
                  <td className="border px-4 py-2">{s.course_name}</td>
                  <td className="border px-4 py-2">{s.roll_no}</td>
                  <td className="border px-4 py-2">{s.enroll_no}</td>
                  <td className="border px-4 py-2">{s.student_name}</td>
                  <td className="border px-4 py-2">{s.father_name}</td>
                  <td className="border px-4 py-2">{s.mother_name}</td>
                  <td className="border px-4 py-2">{s.dob}</td>
                  <td className="border px-4 py-2">{s.age}</td>
                  <td className="border px-4 py-2">{s.gender}</td>
                  <td className="border px-4 py-2">{s.address}</td>
                  <td className="border px-4 py-2">{s.email}</td>
                  <td className="border px-4 py-2">{s.phone_no}</td>
                  <td className="border px-4 py-2">{s.medal}</td>
                  <td className="border px-4 py-2">
                    {s.photo && (
                      <img
                        src={`http://localhost:5000/uploads/${s.photo}`}
                        alt="photo"
                        className="w-16 h-16 object-cover mx-auto rounded"
                      />
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {s.signature && (
                      <img
                        src={`http://localhost:5000/uploads/${s.signature}`}
                        alt="sign"
                        className="w-16 h-16 object-cover mx-auto rounded"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}