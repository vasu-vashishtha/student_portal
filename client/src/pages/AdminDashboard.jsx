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
//                         alt="photo"
//                         className="w-16 h-16 object-cover mx-auto rounded"
//                       />
//                     )}
//                   </td>
//                   <td className="border px-4 py-2">
//                     {s.signature && (
//                       <img
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
import api, { buildFileUrl } from "../api";
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
  // const handleDownloadExcel = async () => {
  //   if (students.length === 0) return;

  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet("Students");

  //   worksheet.columns = [
  //     { header: "SL No", key: "sl_no", width: 10 },
  //     { header: "Program", key: "course_name", width: 25 },
  //     { header: "Roll No", key: "roll_no", width: 15 },
  //     { header: "Enroll No", key: "enroll_no", width: 15 },
  //     { header: "Student Name", key: "student_name", width: 25 },
  //     { header: "Father", key: "father_name", width: 25 },
  //     { header: "Mother", key: "mother_name", width: 25 },
  //     { header: "DOB", key: "dob", width: 15 },
  //     { header: "Age", key: "age", width: 10 },
  //     { header: "Gender", key: "gender", width: 10 },
  //     { header: "Address", key: "address", width: 30 },    
  //     { header: "Email", key: "email", width: 30 },
  //     { header: "Phone", key: "phone_no", width: 15 },
  //     { header: "Medal", key: "medal", width: 10 },
  //     { header: "Photo", key: "photo", width: 40 },
  //     { header: "Signature", key: "signature", width: 40 },
  //   ];

  //   students.forEach((s) => {
  //     const row = worksheet.addRow(s);

  //     // Photo hyperlink
  //     if (s.photo) {
  //       row.getCell("photo").value = {
  //         text: "View Photo",
  //         hyperlink: buildFileUrl(s.photo),
  //       };
  //       row.getCell("photo").font = { color: { argb: "FF0000FF" }, underline: true };
  //     }

  //     // Signature hyperlink
  //     if (s.signature) {
  //       row.getCell("signature").value = {
  //         text: "View Signature",
  //         hyperlink: buildFileUrl(s.signature),
  //       };
  //       row.getCell("signature").font = { color: { argb: "FF0000FF" }, underline: true };
  //     }
  //   });

  //   const buffer = await workbook.xlsx.writeBuffer();
  //   saveAs(new Blob([buffer]), "students.xlsx");
  // };

// Export to Excel with embedded images + fallback hyperlinks
// const handleDownloadExcel = async () => {
//   if (students.length === 0) return;

//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Students");

//   worksheet.columns = [
//     { header: "SL No", key: "sl_no", width: 10 },
//     { header: "Program", key: "course_name", width: 25 },
//     { header: "Roll No", key: "roll_no", width: 15 },
//     { header: "Enroll No", key: "enroll_no", width: 15 },
//     { header: "Student Name", key: "student_name", width: 25 },
//     { header: "Father", key: "father_name", width: 25 },
//     { header: "Mother", key: "mother_name", width: 25 },
//     { header: "DOB", key: "dob", width: 15 },
//     { header: "Age", key: "age", width: 10 },
//     { header: "Gender", key: "gender", width: 10 },
//     { header: "Address", key: "address", width: 30 },
//     { header: "Email", key: "email", width: 30 },
//     { header: "Phone", key: "phone_no", width: 15 },
//     { header: "Medal", key: "medal", width: 10 },
//     { header: "Photo", key: "photo", width: 20 },
//     { header: "Signature", key: "signature", width: 20 },
//   ];

//   const getImageExtension = (filename) => {
//     if (!filename) return "png"; // default
//     const ext = filename.split(".").pop().toLowerCase();
//     if (["png", "jpg", "jpeg"].includes(ext)) return ext;
//     return "png"; // fallback
//   };

//   for (const s of students) {
//     const row = worksheet.addRow(s);

//     // --- Photo (Preview + Fallback) ---
//     if (s.photo) {
//       try {
//         const response = await fetch(buildFileUrl(s.photo));
//         const arrayBuffer = await response.arrayBuffer();
//         const photoExt = getImageExtension(s.photo);

//         const photoId = workbook.addImage({
//           buffer: arrayBuffer,
//           extension: photoExt,
//         });

//         worksheet.addImage(photoId, {
//           tl: { col: 14, row: row.number - 1 }, // Photo column index
//           ext: { width: 60, height: 60 },
//         });
//       } catch (err) {
//         console.error("Error embedding photo:", err);
//         row.getCell("photo").value = {
//           text: "View Photo",
//           hyperlink: buildFileUrl(s.photo),
//         };
//         row.getCell("photo").font = { color: { argb: "FF0000FF" }, underline: true };
//       }
//     }

//     // --- Signature (Preview + Fallback) ---
//     if (s.signature) {
//       try {
//         const response = await fetch(buildFileUrl(s.signature));
//         const arrayBuffer = await response.arrayBuffer();
//         const signExt = getImageExtension(s.signature);

//         const signId = workbook.addImage({
//           buffer: arrayBuffer,
//           extension: signExt,
//         });

//         worksheet.addImage(signId, {
//           tl: { col: 15, row: row.number - 1 }, // Signature column index
//           ext: { width: 60, height: 60 },
//         });
//       } catch (err) {
//         console.error("Error embedding signature:", err);
//         row.getCell("signature").value = {
//           text: "View Signature",
//           hyperlink: buildFileUrl(s.signature),
//         };
//         row.getCell("signature").font = { color: { argb: "FF0000FF" }, underline: true };
//       }
//     }
//   }

//   const buffer = await workbook.xlsx.writeBuffer();
//   saveAs(new Blob([buffer]), "students.xlsx");
// };


// Export to Excel with embedded images (Preview-only, no hyperlinks)
// const handleDownloadExcel = async () => {
//   if (students.length === 0) return;

//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Students");

//   worksheet.columns = [
//     { header: "SL No", key: "sl_no", width: 10 },
//     { header: "Program", key: "course_name", width: 25 },
//     { header: "Roll No", key: "roll_no", width: 15 },
//     { header: "Enroll No", key: "enroll_no", width: 15 },
//     { header: "Student Name", key: "student_name", width: 25 },
//     { header: "Father", key: "father_name", width: 25 },
//     { header: "Mother", key: "mother_name", width: 25 },
//     { header: "DOB", key: "dob", width: 15 },
//     { header: "Age", key: "age", width: 10 },
//     { header: "Gender", key: "gender", width: 10 },
//     { header: "Address", key: "address", width: 30 },
//     { header: "Email", key: "email", width: 30 },
//     { header: "Phone", key: "phone_no", width: 15 },
//     { header: "Medal", key: "medal", width: 10 },
//     { header: "Photo", key: "photo", width: 20 },
//     { header: "Signature", key: "signature", width: 20 },
//   ];

//   const getImageExtension = (filename) => {
//     if (!filename) return "png"; // default
//     const ext = filename.split(".").pop().toLowerCase();
//     if (["png", "jpg", "jpeg"].includes(ext)) return ext;
//     return "png"; // fallback
//   };

//   // fixed preview size
//   const imgWidth = 60;
//   const imgHeight = 60;

//   for (const s of students) {
//     const row = worksheet.addRow(s);

//     // --- Photo (Preview only) ---
//     if (s.photo) {
//       try {
//         const response = await fetch(buildFileUrl(s.photo));
//         const arrayBuffer = await response.arrayBuffer();
//         const photoExt = getImageExtension(s.photo);

//         const photoId = workbook.addImage({
//           buffer: arrayBuffer,
//           extension: photoExt,
//         });

//         worksheet.addImage(photoId, {
//           tl: { col: 14, row: row.number - 1 }, // Photo column index
//           ext: { width: imgWidth, height: imgHeight },
//         });

//         // Adjust row height for preview
//         worksheet.getRow(row.number).height = 50;
//       } catch (err) {
//         console.error("Error embedding photo:", err);
//         // leave blank on error
//       }
//     }

//     // --- Signature (Preview only) ---
//     if (s.signature) {
//       try {
//         const response = await fetch(buildFileUrl(s.signature));
//         const arrayBuffer = await response.arrayBuffer();
//         const signExt = getImageExtension(s.signature);

//         const signId = workbook.addImage({
//           buffer: arrayBuffer,
//           extension: signExt,
//         });

//         worksheet.addImage(signId, {
//           tl: { col: 15, row: row.number - 1 }, // Signature column index
//           ext: { width: imgWidth, height: imgHeight },
//         });

//         // Adjust row height for preview
//         worksheet.getRow(row.number).height = 50;
//       } catch (err) {
//         console.error("Error embedding signature:", err);
//         // leave blank on error
//       }
//     }
//   }

//   const buffer = await workbook.xlsx.writeBuffer();
//   saveAs(new Blob([buffer]), "students.xlsx");
// };


// Export to Excel with embedded images (Preview-only, no hyperlinks, cleaner look)
// const handleDownloadExcel = async () => {
//   if (students.length === 0) return;

//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Students");

//   // Slightly larger default row height
//   worksheet.properties.defaultRowHeight = 70;
//   worksheet.properties.defaultColWidth = 50;

//   worksheet.columns = [
//     { header: "SL No", key: "sl_no", width: 10 },
//     { header: "Program", key: "course_name", width: 25 },
//     { header: "Roll No", key: "roll_no", width: 15 },
//     { header: "Enroll No", key: "enroll_no", width: 15 },
//     { header: "Student Name", key: "student_name", width: 25 },
//     { header: "Father", key: "father_name", width: 25 },
//     { header: "Mother", key: "mother_name", width: 25 },
//     { header: "DOB", key: "dob", width: 15 },
//     { header: "Age", key: "age", width: 10 },
//     { header: "Gender", key: "gender", width: 10 },
//     { header: "Address", key: "address", width: 30 },
//     { header: "Email", key: "email", width: 30 },
//     { header: "Phone", key: "phone_no", width: 15 },
//     { header: "Medal", key: "medal", width: 10 },
//     { header: "Photo", key: "photo", width: 20 },
//     { header: "Signature", key: "signature", width: 20 },
//   ];

//   const getImageExtension = (filename) => {
//     if (!filename) return "png"; // default
//     const ext = filename.split(".").pop().toLowerCase();
//     if (["png", "jpg", "jpeg"].includes(ext)) return ext;
//     return "png"; // fallback
//   };

//   // Fixed preview size
//   const imgWidth = 60;
//   const imgHeight = 60;

//   for (const s of students) {
//     const row = worksheet.addRow(s);

//     // --- Photo Preview ---
//     if (s.photo) {
//       try {
//         const response = await fetch(buildFileUrl(s.photo));
//         const arrayBuffer = await response.arrayBuffer();
//         const photoExt = getImageExtension(s.photo);

//         const photoId = workbook.addImage({
//           buffer: arrayBuffer,
//           extension: photoExt,
//         });

//         worksheet.addImage(photoId, {
//           tl: { col: 14, row: row.number - 1 }, // Photo column index
//           ext: { width: imgWidth, height: imgHeight },
//         });
//       } catch (err) {
//         console.error("Error embedding photo:", err);
//         // leave cell blank
//       }
//     }

//     // --- Signature Preview ---
//     if (s.signature) {
//       try {
//         const response = await fetch(buildFileUrl(s.signature));
//         const arrayBuffer = await response.arrayBuffer();
//         const signExt = getImageExtension(s.signature);

//         const signId = workbook.addImage({
//           buffer: arrayBuffer,
//           extension: signExt,
//         });

//         worksheet.addImage(signId, {
//           tl: { col: 15, row: row.number - 1 }, // Signature column index
//           ext: { width: imgWidth, height: imgHeight },
//         });
//       } catch (err) {
//         console.error("Error embedding signature:", err);
//         // leave cell blank
//       }
//     }
//   }

//   const buffer = await workbook.xlsx.writeBuffer();
//   saveAs(new Blob([buffer]), "students.xlsx");
// };

const handleDownloadExcel = async () => {
  if (students.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Students");

  worksheet.properties.defaultColWidth = 30;
  worksheet.properties.defaultRowHeight = 40;

  worksheet.columns = [
    { header: "SL No", key: "sl_no", width: 10, },
    { header: "Program", key: "course_name", width: 25, },
    { header: "Roll No", key: "roll_no", width: 15, },
    { header: "Enroll No", key: "enroll_no", width: 15, },
    { header: "Student Name", key: "student_name", width: 25, },
    { header: "Father", key: "father_name", width: 25, },
    { header: "Mother", key: "mother_name", width: 25,  },
    { header: "DOB", key: "dob", width: 15,  },
    { header: "Age", key: "age", width: 10, },
    { header: "Gender", key: "gender", width: 10,  },
    { header: "Address", key: "address", width: 30,  },
    { header: "Email", key: "email", width: 30, },
    { header: "Phone", key: "phone_no", width: 15,  },
    { header: "Medal", key: "medal", height: 30 },
    { header: "Photo", key: "photo",  width: 25,  },
    { header: "Signature", key: "signature", width: 30, },
  ];

  const getImageExtension = (filename) => {
    if (!filename) return "png";
    const ext = filename.split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg"].includes(ext)) return ext;
    return "png";
  };

  // target image display size
  const imgHeightPx = 60;
  const imgWidthPx = 60;

  // Excel row height ≈ pixels * 0.75
  const excelRowHeight = imgHeightPx * 1.5;

  for (const s of students) {
    const row = worksheet.addRow(s);

    // set row height dynamically
    row.height = excelRowHeight;

    // --- Photo ---
    if (s.photo) {
      try {
        const response = await fetch(buildFileUrl(s.photo));
        const arrayBuffer = await response.arrayBuffer();
        const photoExt = getImageExtension(s.photo);

        const photoId = workbook.addImage({
          buffer: arrayBuffer,
          extension: photoExt,
        });

        worksheet.addImage(photoId, {
          tl: { col: 14, row: row.number - 1 },
          br: { col: 15, row: row.number }, // fit inside cell
          editAs: "oneCell",
        });
      } catch (err) {
        console.error("Error embedding photo:", err);
      }
    }

    // --- Signature ---
    if (s.signature) {
      try {
        const response = await fetch(buildFileUrl(s.signature));
        const arrayBuffer = await response.arrayBuffer();
        const signExt = getImageExtension(s.signature);

        const signId = workbook.addImage({
          buffer: arrayBuffer,
          extension: signExt,
        });

        worksheet.addImage(signId, {
          tl: { col: 15, row: row.number - 1 },
          br: { col: 16, row: row.number }, // fit inside cell
          editAs: "oneCell",
        });
      } catch (err) {
        console.error("Error embedding signature:", err);
      }
    }
  }

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
                        src={buildFileUrl(s.photo)}
                        alt="photo"
                        className="w-16 h-16 object-cover mx-auto rounded"
                      />
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {s.signature && (
                      <img
                        src={buildFileUrl(s.signature)}
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