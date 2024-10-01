// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const UpdateEmployeeButton = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [employeeData, setEmployeeData] = useState(null);
//   const [updatedData, setUpdatedData] = useState({});
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (isModalOpen) {
//       const fetchEmployeeDetails = async () => {
//         try {
//           const token = localStorage.getItem('token');
//           const response = await axios.get('http://localhost:3000/employee-details', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           setEmployeeData(response.data);
//           setUpdatedData(response.data);
//         } catch (err) {
//           setError('Failed to fetch employee details');
//         }
//       };

//       fetchEmployeeDetails();
//     }
//   }, [isModalOpen]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUpdatedData(prevData => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(
//         `http://localhost:3000/update-employee-details/${employeeData.EMPL_CODE}`,
//         updatedData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setMessage(response.data.message || 'Employee details updated successfully');
//       setError('');
//     } catch (err) {
//       setMessage('');
//       setError(err.response?.data?.message || 'An error occurred');
//     }
//   };

//   const handleClickOutside = (e) => {
//     if (e.target.id === 'modalOverlay') {
//       setIsModalOpen(false);
//     }
//   };

//   if (!employeeData) return null;

//   return (
//     <div className="relative">
//       {/* Toggle Button */}
//       <button
//         onClick={() => setIsModalOpen(true)}
//         className="bg-blue-500 text-white rounded hover:bg-blue-600 transition py-2 px-3"
//       >
//         Update Employee Details
//       </button>

//       {/* Modal */}
//       {isModalOpen && (
//         <div
//           id="modalOverlay"
//           className="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-center"
//           onClick={handleClickOutside}
//         >
//           <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-4xl mx-auto">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
//             >
//               &times;
//             </button>
//             <h2 className="text-xl font-semibold mb-4 text-center">Update Employee Details</h2>
//             {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
//             {message && <div className="text-green-600 mb-4 text-center">{message}</div>}
//             <form className="space-y-4">
//               {Object.keys(employeeData).map(key => (
//                 key !== 'EMPL_CODE' && (
//                   <div key={key} className="flex flex-col">
//                     <label className="text-gray-700 capitalize">{key.replace('_', ' ')}</label>
//                     <input
//                       type={key.includes('DATE') ? 'date' : 'text'}
//                       name={key}
//                       value={updatedData[key] || ''}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded-lg p-2"
//                     />
//                   </div>
//                 )
//               ))}
//               <button
//                 type="button"
//                 className="bg-blue-500 text-white rounded hover:bg-blue-600 transition py-2 px-4"
//                 onClick={handleSubmit}
//               >
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpdateEmployeeButton;
