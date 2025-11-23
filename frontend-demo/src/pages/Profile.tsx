import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/shared/Navbar";
//import Sidebar from "../components/shared/Sidebar";
import { motion } from "framer-motion";
import { ChevronDown, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import NotificationRibbon from "../components/shared/NotificationRibbon";
import DashboardOverview from "./EmployeeDashboard/tabs/DashboardOverview";
import { adminRenderContent } from "./AdminDashboard/AdminDashboard";
import { employeeRenderContent } from "./EmployeeDashboard/EmployeeDashboard";
import { hrRenderContent } from "./HRDashboard/HRDashboard";
import { trainerRenderContent } from "./TrainerDashboard/TrainerDashboard";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    domain: "",
    designation: "",
    baseSalary: "",
    empid: "",
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // BACK BUTTON
  const goBackDashboard = () => {
    if (user?.role === "employee") navigate("/employee");
    else if (user?.role === "admin") navigate("/admin");
    else if (user?.role === "hr") navigate("/hr");
    else if (user?.role === "trainer") navigate("/trainer");
  };

  // Load profile from backend
  useEffect(() => {
    if (!user?.id) return;

    fetch(`http://44.220.159.194:8080/api/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFormData({
          name: data.name || data.fullName || "",
          email: data.email || user?.email || "",
          phone: data.phone || "",
          dob: data.dob || "",
          address1: data.address1 || "",
          address2: data.address2 || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          pincode: data.pincode || "",
          domain: data.domain || "",
          designation: data.designation || "",
          baseSalary: data.baseSalary || "",
          empid: data.empid || "",
        });

        if (data.photoUrl) {
          setPhoto(data.photoUrl);

          // ⭐ THIS MAKES NAVBAR SHOW THE IMAGE
          useAuthStore.getState().updateUser({
            photoUrl: data.photoUrl,
          });
        }

      })
      .catch(() => toast.error("Failed to load profile"));
  }, [user]);

  // Render tabs
  const renderContent = () => {
    switch (user?.role) {
      case "admin":
        return adminRenderContent(activeTab);
      case "employee":
        return employeeRenderContent(activeTab);
      case "hr":
        return hrRenderContent(activeTab);
      case "trainer":
        return trainerRenderContent(activeTab);
      default:
        return <DashboardOverview />;
    }
  };

  // ⭐ UPDATED CLOUDINARY UPLOAD PHOTO — NO UI CHANGE
  const uploadPhoto = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append("photo", file);

    try {
      const res = await fetch(
        `http://44.220.159.194:8080/api/user/upload-photo/${user?.id}`,
        {
          method: "POST",
          body,
        }
      );

      if (!res.ok) {
        toast.error("Upload failed");
        return;
      }

      const data = await res.json(); // expects { url: "cloudinary_url" }
      setPhoto(data.url); // show Cloudinary photo instantly

      toast.success("Photo updated!");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // Save profile
  const handleSave = async () => {
    const payload = {
      ...formData,
      fullName: formData.name, // map name → fullName
    };

    const res = await fetch(
      `http://44.220.159.194:8080/api/user/update-profile/${user?.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      toast.success("Profile updated!");
      setIsEditing(false);
    } else {
      toast.error("Failed to update");
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 custom-scroll">
      <Navbar />
      <NotificationRibbon />

      {/* BACK BUTTON */}
      <button
        onClick={goBackDashboard}
        className="fixed top-24 left-6 bg-blue-600 text-white px-5 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
      >
        ← Back to Dashboard
      </button>

      <div className="flex">
        {activeTab !== "profile" && (
          <motion.main
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 p-6 overflow-y-auto"
          >
            {renderContent()}
          </motion.main>
        )}

        {activeTab === "profile" && (
          <div className="max-w-5xl mx-auto mt-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              My Profile
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* LEFT CARD */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="col-span-1 h-fit bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg 
                border border-gray-200 dark:border-gray-700 flex flex-col items-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <img
                    src={
                      photo ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                    }
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-blue-500 shadow-xl"
                  />

                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-2 right-2 p-2 bg-purple-600 text-white rounded-full shadow-lg border-2 border-white hover:scale-110 transition"
                  >
                    <Camera size={18} />
                  </button>

                  <input ref={fileRef} type="file" hidden onChange={uploadPhoto} />
                </div>

                {/* NAME */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center">
                  {formData.name}
                </h2>

                {/* EMAIL */}
                <p className="text-gray-500 dark:text-gray-300 text-center mb-3">
                  {formData.email}
                </p>
                <div className="text-center space-y-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Employee ID:</strong> {formData.empid || "N/A"}
                  </p>
                </div>

                {/* NEW FIELDS */}
                <div className="text-center space-y-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Domain:</strong> {formData.domain || "N/A"}
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Designation:</strong> {formData.designation || "N/A"}
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Base Salary:</strong> ₹ {formData.baseSalary || "0"} LPA
                  </p>
                </div>
              </motion.div>

              {/* RIGHT CARD */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="col-span-1 md:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <button
                  onClick={() => setOpen(!open)}
                  className="flex justify-between w-full items-center text-xl font-semibold mb-4 py-2 px-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <span>Personal Details</span>
                  <motion.div animate={{ rotate: open ? 180 : 0 }}>
                    <ChevronDown />
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    {Object.entries(formData)
                      .filter(
                        ([key]) =>
                          key !== "domain" &&
                          key !== "designation" &&
                          key !== "baseSalary"
                      )
                      .map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </label>

                          <input
                            name={key}
                            value={value}
                            disabled={key === "email" ? true : !isEditing}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                          />
                        </div>
                      ))}
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                    )}

                    {isEditing && (
                      <>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={handleSave}
                          className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                        >
                          Save Changes
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
