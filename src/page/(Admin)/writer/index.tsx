import React from "react";
import WriterTable from "src/components/table/writer-table";
import Breadcrumb from "src/ui/breadcrumb";
import { useTranslation } from "react-i18next";
import EnBreadcrumb from "src/ui/en-breadcrumb";

export default function WriterIndex() {
  const { i18n } = useTranslation();
  const dir = i18n.dir();
  return (
    <main>
      <div className="fixed h-screen  w-[83.5%] text-right bg-[#f2f2f2]">
        <div className="grid grid-cols-1">
          <div className="col-span-1 mb-2 mt-4 h-auto  rounded-lg">
            {dir === "ltr" ? (
              <EnBreadcrumb
                tilte1="Organizations and Employees"
                path1="/attendance"
                tilte2=" Writers"
                path2="/attendance/add-Attendance"
                tilte3=""
                path3=""
              />
            ) : (
              <Breadcrumb
                tilte1="المؤسسات و الموظفين"
                path1="/attendance"
                tilte2=" الكُتَّاب"
                path2="/attendance/add-Attendance"
                tilte3=""
                path3=""
              />
            )}
          </div>
        </div>

        <WriterTable />
      </div>
    </main>
  );
}
