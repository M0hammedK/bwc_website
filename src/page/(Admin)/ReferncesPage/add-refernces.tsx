import React from "react";
import AddReferenceForm from "src/components/form/add-refernce-form";
import Breadcrumb from "src/ui/breadcrumb";
import { useTranslation } from "react-i18next";
import EnBreadcrumb from "src/ui/en-breadcrumb";

export default function AddRefernces() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  return (
    <main>
      <div className="fixed h-screen  w-[83.5%] text-right bg-[#f2f2f2]">
        <div className="grid grid-cols-1">
          <div className="col-span-1 mb-2 mt-4 h-auto  rounded-lg">
            {dir === "ltr" ? (
              <EnBreadcrumb
                tilte1="publications"
                path1="/attendance"
                tilte2=" references"
                path2="/attendance/add-Attendance"
                tilte3="add a reference"
                path3="/attendance/add-Attendance"
              />
            ) : (
              <Breadcrumb
                tilte1="المنشورات"
                path1="/attendance"
                tilte2=" المراجع"
                path2="/attendance/add-Attendance"
                tilte3="إضافة مرجع"
                path3="/attendance/add-Attendance"
              />
            )}

            <AddReferenceForm />
          </div>
        </div>
      </div>
    </main>
  );
}
