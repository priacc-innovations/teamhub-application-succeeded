import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Upload, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import api from "../../../api/axiosInstance";

export default function AddEmployee() {
  const [singleEmailError, setSingleEmailError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    employee_id: "",
    date_of_birth: "",
    joining_date: new Date().toISOString().split("T")[0],
    department: "",
    designation: "",
    domain: "",
    salary: "",
    password: "",
  });

  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [excelFile, setExcelFile] = useState<File | null>(null);

  // ---------------- SINGLE ADD ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ⭐ EMAIL VALIDATION
    if (!formData.email.endsWith("@priaccinnovations.ai")) {
      setSingleEmailError("Email must end with @priaccinnovations.ai");
      setTimeout(() => setSingleEmailError(""), 3000);
      return;
    }

    const payload = {
      fullName: formData.full_name,
      email: formData.email,
      password: formData.password,
      empid: formData.employee_id,
      dob: formData.date_of_birth,
      joiningDate: formData.joining_date,
      designation: formData.designation,
      domain: formData.domain,
      department: formData.department,
      baseSalary: Number(formData.salary),
      role: "employee"
    };

    try {
      await api.post("/user/add", payload);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setFormData({
          full_name: "",
          email: "",
          employee_id: "",
          date_of_birth: "",
          joining_date: new Date().toISOString().split("T")[0],
          department: "",
          designation: "",
          domain: "",
          salary: "",
          password: "",
        });
      }, 2000);

    } catch (err) {
      console.error("Failed to add employee", err);
      alert("Backend error. Check logs.");
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------- EXCEL FILE SELECT ----------------
  const handleExcelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel"
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadStatus("Invalid file. Please upload only Excel files (.xlsx or .xls)");
      fileRef.current!.value = "";
      return;
    }

    setExcelFile(file);
    setUploadStatus("File selected: " + file.name);
  };

  // ---------------- EXCEL → BULK UPLOAD ----------------
  const handleBulkUploadSubmit = async () => {
    if (!excelFile) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = event.target?.result;
        const workbook = await import("xlsx").then((XLSX) =>
          XLSX.read(data, { type: "binary" })
        );

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const json = await import("xlsx").then((XLSX) =>
          XLSX.utils.sheet_to_json(sheet)
        );

        const employees = json as any[];

        if (employees.length === 0) {
          setUploadStatus("No data found in sheet");
          return;
        }

        // ⭐ EMAIL VALIDATION FOR BULK
        for (let emp of employees) {
          if (!emp.email || !emp.email.endsWith("@priaccinnovations.ai")) {
            setUploadStatus(
              `Invalid email found: ${emp.email}. Only @priaccinnovations.ai allowed.`
            );
            return;
          }
        }

        const payload = employees.map((emp) => ({
          fullName: emp.full_name,
          email: emp.email,
          password: emp.password,
          empid: emp.employee_id,
          dob: emp.date_of_birth,
          joiningDate: emp.joining_date,
          designation: emp.designation,
          domain: emp.domain,
          department: emp.department,
          baseSalary: Number(emp.salary),
          role: "employee",
        }));

        await api.post("/user/add-bulk", payload);

        setUploadStatus(`Successfully uploaded ${employees.length} employees!`);
        setExcelFile(null);
        fileRef.current!.value = "";

        setTimeout(() => setUploadStatus(""), 3000);

      } catch (err) {
        console.error(err);
        setUploadStatus("Failed to process Excel file");
      }
    };

    reader.readAsBinaryString(excelFile);
  };

  // ---------------- DOWNLOAD TEMPLATE ----------------
  const downloadCSVTemplate = () => {
    const template =
      "employee_id,full_name,email,date_of_birth,joining_date,department,designation,domain,salary,password\n" +
      "EMP011,John Doe,john@company.com,1995-05-15,2025-01-15,Engineering,Software Developer,Data Science,60000,temp123\n" +
      "EMP012,Jane Smith,jane@company.com,1992-08-20,2025-01-20,Sales,Sales Manager,Sales,65000,temp456";

    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "employee_template.csv";
    a.click();
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Employee Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add employees individually or upload via Excel
          </p>
        </div>

        <Button variant="outline" className="gap-2" onClick={downloadCSVTemplate}>
          <Download className="w-5 h-5" /> Download Sample File
        </Button>
      </div>

      <div className="max-w-3xl">

        {/* ---------------- SINGLE REGISTRATION ---------------- */}
        <Card glassmorphism>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Employee Registration Form</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Input label="Employee ID" name="employee_id" required value={formData.employee_id} onChange={handleChange} labelClassName="required-label" />
                <Input label="Full Name" name="full_name" required value={formData.full_name} onChange={handleChange} labelClassName="required-label" />
                <Input label="Email" name="email" type="email" required value={formData.email} onChange={handleChange} labelClassName="required-label" />
                <Input label="Date of Birth" name="date_of_birth" type="date" required value={formData.date_of_birth} onChange={handleChange} labelClassName="required-label" />
                <Input label="Joining Date" name="joining_date" type="date" required value={formData.joining_date} onChange={handleChange} labelClassName="required-label" />
                <Input label="Department" name="department" required value={formData.department} onChange={handleChange} labelClassName="required-label" />
                <Input label="Designation" name="designation" required value={formData.designation} onChange={handleChange} labelClassName="required-label" />
                <Input label="Domain" name="domain" required value={formData.domain} onChange={handleChange} labelClassName="required-label" />
                <Input label="Salary" name="salary" type="number" required value={formData.salary} onChange={handleChange} labelClassName="required-label" />
                <Input label="Password" name="password" type="password" required value={formData.password} onChange={handleChange} labelClassName="required-label" />

              </div>

              {/* SINGLE EMAIL ERROR */}
              {singleEmailError && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <p className="text-red-700 dark:text-red-400 font-medium">
                    {singleEmailError}
                  </p>
                </motion.div>
              )}

              {success && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-green-100 rounded-lg">
                  <p className="text-green-700 font-medium">Employee added successfully!</p>
                </motion.div>
              )}

              <Button type="submit" size="lg" className="gap-2">
                <UserPlus className="w-5 h-5" /> Add Employee
              </Button>

            </form>
          </CardContent>
        </Card>

        {/* ---------------- EXCEL UPLOAD ---------------- */}
        <Card glassmorphism className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Bulk Upload via Excel</CardTitle>

              <input
                type="file"
                ref={fileRef}
                accept=".xlsx,.xls"
                onChange={handleExcelSelect}
                className="hidden"
              />

              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="w-5 h-5" /> Upload Excel
              </Button>
            </div>
          </CardHeader>

          <CardContent>

            {uploadStatus && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 rounded-lg mb-4 ${uploadStatus.toLowerCase().includes("invalid")
                    ? "bg-red-100 dark:bg-red-900/20"
                    : "bg-green-100 dark:bg-green-900/20"
                  }`}
              >
                <p
                  className={`font-medium ${uploadStatus.toLowerCase().includes("invalid")
                      ? "text-red-700 dark:text-red-400"
                      : "text-green-700 dark:text-green-400"
                    }`}
                >
                  {uploadStatus}
                </p>
              </motion.div>
            )}

            {excelFile && (
              <Button onClick={handleBulkUploadSubmit} className="w-full gap-2 mb-4">
                <Upload className="w-5 h-5" /> Submit Excel
              </Button>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload an Excel (.xlsx or .xls) file with all required employee fields.
            </p>

          </CardContent>

          <CardContent>

            {/* Instructions */}
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mt-3">

              <p className="font-semibold text-gray-900 dark:text-white">
                Bulk Upload Instructions:
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>Only Excel files: <strong>.xlsx or .xls</strong></li>
                <li>Google Sheets must be downloaded as Excel (*.xlsx*)</li>
                <li>First row must contain required column headers:</li>
              </ul>

              <div className="ml-6 text-xs">
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md block mt-1">
                  employee_id, full_name, email, date_of_birth, joining_date, department, designation, domain, salary, password
                </code>
              </div>

            </div>

          </CardContent>

        </Card>

      </div>
    </div>
  );
}
