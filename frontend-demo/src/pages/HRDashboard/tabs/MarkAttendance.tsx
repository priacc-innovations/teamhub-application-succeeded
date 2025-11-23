import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/Select";

import { motion } from "framer-motion";
import axios from "axios";

type AttendanceRow = {
  id: number;
  employeeId: string;
  name: string;
  domain: string;
  date: string;
  status: string;
};

export default function MarkAttendance() {
  const [attendanceList, setAttendanceList] = useState<AttendanceRow[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [editedRows, setEditedRows] = useState<Record<number, string>>({});

  const fetchAttendance = async () => {
    if (!selectedMonth && !selectedDate) return;

    let date_array = selectedDate.split("-")
    console.log(date_array)

    let sendDate = date_array[1] + "/" + date_array[2] + "/" + date_array[0]

    try {
      const res = await axios.get(
        `http://44.220.159.194:8080/api/attendance/hr-filter?month=${selectedMonth}&date=${sendDate}`
      );
      console.log(res)
      setAttendanceList(res.data);
      setEditedRows({});
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const updateLocalStatus = (id: number, newStatus: string) => {
    setEditedRows((prev) => ({ ...prev, [id]: newStatus }));
  };

  const submitAllChanges = async () => {
    const updates = Object.keys(editedRows).map((id) => ({
      id: Number(id),
      status: editedRows[Number(id)],
    }));

    if (updates.length === 0) return;

    try {
      await axios.put("http://44.220.159.194:8080/api/attendance/update-bulk", updates);

      // Update UI
      setAttendanceList((prev) =>
        prev.map((row) =>
          updates.find((u) => u.id === row.id)
            ? { ...row, status: editedRows[row.id] }
            : row
        )
      );

      setEditedRows({});
      toast.success("Attendance updated!", {
        position: "top-right",
        autoClose: 2000,
      });

    } catch (err) {
      console.error("Bulk update failed:", err);
      toast.error("Update failed!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700";
      case "absent":
        return "bg-red-100 text-red-700";
      case "late":
        return "bg-orange-100 text-orange-700";
      case "half_day":
        return "bg-yellow-100 text-yellow-700";
      case "leave":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Mark Attendance
      </h1>

      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Attendance Marking</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Month Filter */}
            <div>
              <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                Select Month
              </label>

              <Select value={selectedMonth} onValueChange={(v: string) => setSelectedMonth(v)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Choose month" />
                </SelectTrigger>

                <SelectContent>
                  {months.map((m, index) => (
                    <SelectItem key={index} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                Select Date
              </label>

              <input
                type="date"
                className="mt-1 w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700"
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button className="w-full" onClick={fetchAttendance}>
                Apply Filter
              </Button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="space-y-3">
            {attendanceList.length === 0 ? (
              <p className="text-gray-500 text-sm">No attendance records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800 text-left text-gray-700 dark:text-gray-300">
                      <th className="p-3 border">Emp ID</th>
                      <th className="p-3 border">Name</th>
                      <th className="p-3 border">Domain</th>
                      <th className="p-3 border">Date</th>
                      <th className="p-3 border">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendanceList.map((row) => {
                      const finalStatus = editedRows[row.id] || row.status;

                      return (
                        <tr key={row.id} className="bg-white dark:bg-gray-900 border-b">
                          <td className="p-3 border">{row.employeeId}</td>
                          <td className="p-3 border">{row.name}</td>
                          <td className="p-3 border">{row.domain}</td>
                          <td className="p-3 border">{row.date}</td>

                          <td className="p-3 border">
                            <div className="flex items-center gap-3">

                              {/* Colored Badge */}
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  finalStatus
                                )}`}
                              >
                                {finalStatus.replace("_", " ")}
                              </span>

                              {/* Dropdown */}
                              <Select
                                value={finalStatus}
                                onValueChange={(value: string) =>
                                  updateLocalStatus(row.id, value)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder={finalStatus} />
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectItem value="present">Present</SelectItem>
                                  <SelectItem value="absent">Absent</SelectItem>
                                  <SelectItem value="late">Late</SelectItem>
                                  <SelectItem value="half_day">Half Day</SelectItem>
                                  <SelectItem value="leave">Leave</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SUBMIT ALL BUTTON */}
          {attendanceList.length > 0 && (
            <div className="flex justify-end">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                onClick={submitAllChanges}
              >
                Submit All Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <ToastContainer />

    </div>
  );
}
