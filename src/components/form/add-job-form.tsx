import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addJobSchema } from "src/types/validation";
import { z } from "zod";
import Label from "src/ui/label";
import { Input } from "src/ui/input";
import { Button } from "../../ui/button";
import { useMutation } from "@tanstack/react-query";
import { postApi } from "src/lib/http";
import { useToast } from "src/ui/use-toast";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AddPersonalImageDialog from "../dailog/add-personal-image-dialog";
import { Textarea } from "src/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import { cn } from "src/lib/utils";
import { Badge } from "src/ui/badge";
import { ChevronsUpDown } from "lucide-react";

type AddJobFormValue = z.infer<typeof addJobSchema>;

export default function AddJobForm() {
  // const { toast } = useToast();
  const [states, _setStates] = useState([
    { label: "متاحة", value: true },
    { label: "غير متاحة", value: false },
  ]);
  const [publish, _setPublish] = useState([
    { label: "مشنور", value: true },
    { label: "غير منشور", value: false },
  ]);
  const [texts, setTexts] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  //
  const [skillsEn, setSkillsEn] = useState<string[]>([]);
  const [inputValueSkillsEn, setInputValueSkillsEn] = useState<string>("");
  //
  const [advancesAr, setAdvancesAr] = useState<string[]>([]);
  const [inputValueAdvancesAr, setInputValueAdvancesAr] = useState<string>("");
  //
  const [advancesEn, setAdvancesEn] = useState<string[]>([]);
  const [inputValueAdvancesEn, setInputValueAdvancesEn] = useState<string>("");

  const handleDelete = (index: number, field: any) => {
    const updatedTexts = texts.filter((_, i) => i !== index);
    setTexts(updatedTexts);
    field.onChange(updatedTexts);
  };
  const handleSkillsEnDelete = (index: number, field: any) => {
    const updatedTexts = skillsEn.filter((_, i) => i !== index);
    setSkillsEn(updatedTexts);
    field.onChange(updatedTexts);
  };
  const handleAdvancesAr = (index: number, field: any) => {
    const updatedTexts = advancesAr.filter((_, i) => i !== index);
    setAdvancesAr(updatedTexts);
    field.onChange(updatedTexts);
  };
  const handleAdvancesEn = (index: number, field: any) => {
    const updatedTexts = advancesEn.filter((_, i) => i !== index);
    setAdvancesEn(updatedTexts);
    field.onChange(updatedTexts);
  };

  console.log("fsdfsdfsd", texts);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof addJobSchema>>({
    resolver: zodResolver(addJobSchema),
  });

  const { mutate } = useMutation({
    mutationKey: ["AddReferences"],
    mutationFn: (datas: AddJobFormValue) => {
      const formData = new FormData();
      formData.append("Ar_jobTitle", datas.Ar_jobTitle);
      formData.append("En_jobTitle", datas.En_jobTitle);
      // formData.append("avaliable", datas.avaliable);
      // formData.append("publish", datas.publish);
      formData.append("Ar_basicDescription", datas.Ar_basicDescription);
      formData.append("En_basicDescription", datas.En_basicDescription);
      // formData.append("Ar_skiles", datas.Ar_skiles);
      // formData.append("En_skiles", datas.En_skiles);
      // formData.append("Ar_advances", datas.Ar_advances);
      // formData.append("En_advances", datas.En_advances);
      formData.append("formLink", datas.formLink);
      formData.append("endDate", String(new Date(datas.endDate).toISOString()));

      if (datas.ImageFile) {
        formData.append("ImageFile", datas.ImageFile[0]);
      }

      return postApi("/api/OrgUndBWC", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      // toast({
      //   title: "اشعار",
      //   variant: "success",
      //   description: "تمت الاضافة بنجاح",
      // });
      toast.success("تمت الاضافة بنجاح.", {
        style: {
          border: "1px solid #4FFFB0",
          padding: "16px",
          color: "#4FFFB0",
        },
        iconTheme: {
          primary: "#4FFFB0",
          secondary: "#FFFAEE",
        },
      });
      navigate("/admin-dashboard/references");
    },
    onError: (error) => {
      // toast({
      //   title: "لم تتم العملية",
      //   description: error.message,
      //   variant: "destructive",
      // });
    },
  });
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };
  const onSubmit = (datas: AddJobFormValue) => {
    mutate(datas);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-h-[90vh]   w-[100%] "
      >
        {
          <>
            <div className=" items-right col-span-1 flex h-[140px] flex-col mr-10">
              <label className="text-md mb-2 block font-bold text-gray-950">
                صورة المؤسسة
              </label>
              <FormField
                control={form.control}
                name="ImageFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          handleFileChange(e); // Set the preview and form data
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-3"></div>
          </>
        }
        <div className="grid grid-cols-3 w-[100%] px-10 items-start gap-4 text-right h-[20vh]  ">
          <div className=" col-span-1 h-auto translate-y-10">
            <Label text="عنوان الوظيفة" />
            <FormField
              control={form.control}
              name="Ar_jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-900">
                    {"عنوان الوظيفة"}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="ادخل عنوان الوظيفة..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="text-end col-span-1 h-auto translate-y-10">
            <Label text="Job Title" />
            <FormField
              control={form.control}
              name="En_jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-900">{"Job Title"}</FormLabel>
                  <FormControl>
                    <Input dir="ltr" placeholder="Enter Job Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=" col-span-1 h-auto translate-y-10">
            <Label text="اخر تاريخ للتسجيل" />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-900">
                    {"اخر تاريخ للتسجيل"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="ادخل اخر تاريخ للتسجيل"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 w-[100%] px-10 items-start gap-4 text-right h-[20vh]  ">
          <div className=" col-span-1 h-auto translate-y-10">
            <Label text="رابط التقديم" />
            <FormField
              control={form.control}
              name="formLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-900">
                    {"رابط التقديم"}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="ادخل رابط التقديم..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=" col-span-1 h-auto translate-y-10">
            <Label text="حالة الوظيفة" />
            <FormField
              control={form.control}
              name="avaliable"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      dir="rtl"
                      // Convert the string value to boolean
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      defaultValue={String(field.value)}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="اختر حالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {states?.map((statuse) => (
                            <SelectItem
                              key={statuse.label}
                              value={String(statuse.value)}
                            >
                              {statuse.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className=" col-span-1 h-auto translate-y-10">
            <Label text="حالة  النشر" />
            <FormField
              control={form.control}
              name="publish"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      dir="rtl"
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="اختر حالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {publish?.map((publishs) => (
                            <SelectItem
                              key={publishs.label}
                              value={String(publishs.value)}
                            >
                              {publishs.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 w-[100%]  px-10 items-start gap-4 text-right min-h-[20vh]  ">
          <div className="col-span-1 h-auto translate-y-10  ">
            <Label text="المهارات" />
            <FormField
              control={form.control}
              name="Ar_skiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-900"></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="ادخل المهارات..."
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && inputValue.trim()) {
                            const newValues = Array.isArray(field.value)
                              ? [...field.value, inputValue]
                              : [inputValue];
                            field.onChange(newValues);
                            setTexts(newValues);
                            setInputValue("");
                            e.preventDefault();
                          }
                        }}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        className="pr-20"
                      />

                      {Array.isArray(field.value) && field.value.length > 0 && (
                        <Badge className="absolute right-2 top-2">
                          {`تم تحديد ${field.value.length}`}
                        </Badge>
                      )}

                      {/* Display the list of texts with delete option */}

                      {Array.isArray(field.value) &&
                        field.value.length > 0 &&
                        field.value.map((item: string, index: number) => (
                          <div key={index} className="flex items-center  ">
                            <span>{item}</span>
                            <button
                              type="button"
                              className="ml-2 text-red-500"
                              onClick={() => handleDelete(index, field)} // Call delete function
                            >
                              حذف
                            </button>
                          </div>
                        ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="text-end col-span-1 h-auto translate-y-10  ">
            <Label text="Skills" />
            <FormField
              control={form.control}
              name="En_skiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-900"></FormLabel>
                  <FormControl dir="ltr">
                    <div className="relative">
                      <Input
                        placeholder="Enter Skills ..."
                        value={inputValueSkillsEn}
                        onChange={(e) => {
                          setInputValueSkillsEn(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && inputValueSkillsEn.trim()) {
                            const newValues = Array.isArray(field.value)
                              ? [...field.value, inputValueSkillsEn]
                              : [inputValueSkillsEn];
                            field.onChange(newValues);
                            setSkillsEn(newValues);
                            setInputValueSkillsEn("");
                            e.preventDefault();
                          }
                        }}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        className="pr-20"
                      />

                      {Array.isArray(field.value) && field.value.length > 0 && (
                        <Badge className="absolute right-2 top-2">
                          {`تم تحديد ${field.value.length}`}
                        </Badge>
                      )}

                      {/* Display the list of texts with delete option */}

                      {Array.isArray(field.value) &&
                        field.value.length > 0 &&
                        field.value.map((item: string, index: number) => (
                          <div key={index} className="flex items-center  ">
                            <span>{item}</span>
                            <button
                              type="button"
                              className="ml-2 text-red-500"
                              onClick={() => handleSkillsEnDelete(index, field)} // Call delete function
                            >
                              حذف
                            </button>
                          </div>
                        ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1 h-auto translate-y-10  ">
            <Label text="المهام الوظيفيه" />
            <FormField
              control={form.control}
              name="Ar_advances"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-900"></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="ادخل المهام الوظيفيه..."
                        value={inputValueAdvancesAr}
                        onChange={(e) => {
                          setInputValueAdvancesAr(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            inputValueAdvancesAr.trim()
                          ) {
                            const newValues = Array.isArray(field.value)
                              ? [...field.value, inputValueAdvancesAr]
                              : [inputValueAdvancesAr];
                            field.onChange(newValues);
                            setAdvancesAr(newValues);
                            setInputValueAdvancesAr("");
                            e.preventDefault();
                          }
                        }}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        className="pr-20"
                      />

                      {Array.isArray(field.value) && field.value.length > 0 && (
                        <Badge className="absolute right-2 top-2">
                          {`تم تحديد ${field.value.length}`}
                        </Badge>
                      )}

                      {Array.isArray(field.value) &&
                        field.value.length > 0 &&
                        field.value.map((item: string, index: number) => (
                          <div key={index} className="flex items-center  ">
                            <span>{item}</span>
                            <button
                              type="button"
                              className="ml-2 text-red-500"
                              onClick={() => handleAdvancesAr(index, field)}
                            >
                              حذف
                            </button>
                          </div>
                        ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/*  */}
        <div className="grid grid-cols-3 w-[100%]  px-10 items-start gap-4 text-right min-h-[20vh]  ">
          <div className="col-span-1 h-auto translate-y-10  ">
            <Label text="Advances" />
            <FormField
              control={form.control}
              name="En_advances"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-900"></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter Advances"
                        value={inputValueAdvancesEn}
                        onChange={(e) => {
                          setInputValueAdvancesEn(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            inputValueAdvancesEn.trim()
                          ) {
                            const newValues = Array.isArray(field.value)
                              ? [...field.value, inputValueAdvancesEn]
                              : [inputValueAdvancesEn];
                            field.onChange(newValues);
                            setAdvancesEn(newValues);
                            setInputValueAdvancesEn("");
                            e.preventDefault();
                          }
                        }}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        className="pr-20"
                      />

                      {Array.isArray(field.value) && field.value.length > 0 && (
                        <Badge className="absolute right-2 top-2">
                          {`تم تحديد ${field.value.length}`}
                        </Badge>
                      )}

                      {/* Display the list of texts with delete option */}

                      {Array.isArray(field.value) &&
                        field.value.length > 0 &&
                        field.value.map((item: string, index: number) => (
                          <div key={index} className="flex items-center  ">
                            <span>{item}</span>
                            <button
                              type="button"
                              className="ml-2 text-red-500"
                              onClick={() => handleAdvancesEn(index, field)} // Call delete function
                            >
                              حذف
                            </button>
                          </div>
                        ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 w-[100%] px-10 items-start gap-4 text-right h-[20vh]  ">
          <div className=" col-span-1 h-auto translate-y-10">
            <Label text="التفاصيل" />
            <FormField
              control={form.control}
              name="Ar_basicDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-900">{"التفاصيل"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="ادخل التفاصيل..."
                      className="bg-white"
                      {...field}
                      rows={5}
                    ></Textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 mt-5 w-[100%] px-10 items-start gap-4 text-right h-[20vh]  ">
          <div className="text-end col-span-1 h-auto translate-y-10">
            <Label text="Description" />
            <FormField
              control={form.control}
              name="En_basicDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-900">
                    {"Description"}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      dir="ltr"
                      placeholder="enter Description ..."
                      {...field}
                      rows={5}
                      className="bg-white"
                    ></Textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="w-full translate-x-10 flex justify-end mt-20">
          <Button className="text-md mb-10 inline-flex h-10 items-center  justify-center whitespace-nowrap rounded-lg bg-[#000] px-10 py-2 text-sm font-bold text-white ring-offset-background transition-colors hover:bg-[#201f1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            إضافة
          </Button>
        </div>
      </form>
    </Form>
  );
}
