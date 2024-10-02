import { type ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal } from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { SquarePen, Trash2 } from "lucide-react";
import { Checkbox } from "../../ui/checkbox";

import { type z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import DeleteDialog from "../dailog/delete-dialog";
import { Link } from "react-router-dom";
import EditIcon from "src/assets/icons/edit-icon";
import Tooltip from "src/ui/tooltap";

// export type AddWriterOrder = {
//   isSelected: boolean;
//   id: number;
//   ar_fullName: string;
//   en_fullName: string;
//   image: string;
//   ar_description: string;
//   en_description: string;
//   ar_role: string;
//   en_role: string;
// };
export type AddWriterOrder = {
  isSelected: boolean;
  id: number;
  ar_fullName: string;
  en_fullName: string;
  image: string;
  ar_description: string;
  en_description: string;
  ar_role: string;
  en_role: string;
  publication: any[];
  soicalmedia: Soicalmedia[];
};

export interface Soicalmedia {
  id: number;
  name: string;
  url: string;
  writerId: number;
  writer: null;
}
export const AddWriterColumns: ColumnDef<AddWriterOrder>[] = [
  {
    accessorKey: "image",
    header: "ص",
    cell: ({ row }) => {
      return (
        <div className=" w-[50px] h-[50px] rounded-full">
          <img
            src={row.original.image}
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
      );
    },
  },
  {
    id: "ar_fullName",
    accessorKey: "ar_fullName",
    header: "الاسم الكامل",
  },
  // {
  //   id: "Nopub",
  //   accessorKey: "Nopub",
  //   sortingFn: "basic",
  // },
  // {
  //   header: "dob", // New Date of Birth column
  //   accessorKey: "dob",
  //   sortingFn: "datetime", // Built-in datetime sorting function
  // },
  {
    accessorKey: "",
    header: "عدد المنشورات",
    cell: ({ row }) => {
      return <p>0</p>;
    },
  },
  {
    accessorKey: "ar_fullName",
    header: "المسمى الوظيفي",
  },

  {
    id: "actions",
    header: "الإعدادات",
    cell: ({ row }) => {
      //   const { data: session } = useSession();

      return (
        <div className="flex justify-start ">
          <Link
            to={`/admin-dashboard/writer/update-writer/${row.original?.id}`}
          >
            <Tooltip text="تعديل">
              <Button
                className="bg-[#d5ae78] text-white ml-3 rounded-lg"
                size={"sm"}
              >
                <EditIcon />
              </Button>
            </Tooltip>
          </Link>
          <Link to={`/admin-dashboard/writer/info/${row.original?.id}`}>
            <Tooltip text="عرض">
              <Button
                className="bg-[#d5ae78] text-white ml-3 rounded-lg"
                size={"sm"}
              >
                <Eye className="" />
              </Button>
            </Tooltip>
          </Link>
          <Tooltip text="حذف">
            <DeleteDialog
              url={`/api/Writers/${row.original?.id}`}
              path={"/admin-dashboard/writer"}
            />
          </Tooltip>
        </div>
      );
    },
  },
];
export const AddEnWriterColumns: ColumnDef<AddWriterOrder>[] = [
  {
    accessorKey: "image",
    header: "image",
    cell: ({ row }) => {
      return (
        <div className=" w-[50px] h-[50px] rounded-full">
          <img
            src={row.original.image}
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
      );
    },
  },
  {
    id: "en_fullName",
    accessorKey: "en_fullName",
    header: "full name",
  },
  // {
  //   id: "Nopub",
  //   accessorKey: "Nopub",
  //   sortingFn: "basic",
  // },
  // {
  //   header: "dob", // New Date of Birth column
  //   accessorKey: "dob",
  //   sortingFn: "datetime", // Built-in datetime sorting function
  // },
  {
    accessorKey: "",
    header: "number of publishes",
    cell: ({ row }) => {
      return <p>0</p>;
    },
  },
  {
    accessorKey: "en_role",
    header: "role",
  },

  {
    id: "actions",
    header: "settings",
    cell: ({ row }) => {
      return (
        <div className="flex justify-start ">
          <Link
            to={`/admin-dashboard/writer/update-writer/${row.original?.id}`}
          >
            <Tooltip text="Edit">
              <Button
                className="bg-[#d5ae78] text-white ml-3 rounded-lg"
                size={"sm"}
                title="Edit"
                aria-label="Edit"
              >
                <EditIcon />
              </Button>
            </Tooltip>
          </Link>
          <Link to={`/admin-dashboard/writer/info/${row.original?.id}`}>
            <Tooltip text="view">
              <Button
                className="bg-[#d5ae78] text-white ml-3 rounded-lg"
                size={"sm"}
              >
                <Eye className="" />
              </Button>
            </Tooltip>
          </Link>
          <Tooltip text="delete">
            <DeleteDialog
              url={`/api/Writers/${row.original?.id}`}
              path={"/admin-dashboard/writer"}
            />
          </Tooltip>
        </div>
      );
    },
  },
];
