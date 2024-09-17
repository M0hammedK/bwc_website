import React from "react";
import AddServicesForm from "src/components/form/services-form";
import Breadcrumb from "src/ui/breadcrumb";
import { useTranslation } from "react-i18next";
import EnBreadcrumb from "src/ui/en-breadcrumb";
export default function AddServicesIndex() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  return (
    <main>
      <div className="min-h-screen  w-[100%] text-right bg-[#f2f2f2]">
        <div className="grid grid-cols-1">
          <div className="col-span-1 mb-2 mt-4 h-auto  rounded-lg">
            {dir === "ltr" ? (
              <EnBreadcrumb
                tilte1="Features"
                path1="/attendance"
                tilte2=" Services"
                path2="/attendance/add-Attendance"
                tilte3="add services"
                path3=""
              />
            ) : (
              <Breadcrumb
                tilte1="المزايا"
                path1="/attendance"
                tilte2=" خدماتنا"
                path2="/attendance/add-Attendance"
                tilte3="إضافة خدماتنا"
                path3=""
              />
            )}
          </div>
        </div>

        <AddServicesForm />
      </div>
    </main>
  );
}
