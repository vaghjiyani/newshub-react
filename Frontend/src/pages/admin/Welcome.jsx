import React from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";

function Welcome() {
  return (
    <AdminLayout title="Welcome">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            to="/admin/dashboard"
            className="group bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-all duration-200"
          >
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                Dashboard
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                View and manage your admin dashboard
              </p>
            </div>
          </Link>

          <Link
            to="/admin/add-user"
            className="group bg-white rounded-lg border border-gray-200 hover:border-green-500 transition-all duration-200"
          >
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                Add User
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Create new user accounts
              </p>
            </div>
          </Link>

          <Link
            to="/admin/edit-profile"
            className="group bg-white rounded-lg border border-gray-200 hover:border-purple-500 transition-all duration-200"
          >
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                Edit Profile
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Update your admin profile
              </p>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Welcome;
