import React, { useEffect, useState } from "react";
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
import { addOrgSchema } from "src/types/validation";
import { z } from "zod";
import Label from "src/ui/label";
import { Input } from "src/ui/input";
import { Button } from "../../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance, postApi, putApi } from "src/lib/http";
import { useToast } from "src/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export type OrgResp = {
  id: number;
  ar_name: string;
  en_name: string;
  img: string;
  link: string;
};
type OrgFormValue = z.infer<typeof addOrgSchema>;

export default function UpdateOrg() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const form = useForm<z.infer<typeof addOrgSchema>>({
    resolver: zodResolver(addOrgSchema),
  });

  const fetchData = async () => {
    const response = await axiosInstance.get<OrgResp>(
      `/api/OrgUndBWC/${id}`,
      {}
    );
    return response.data;
  };
  const {
    data: OrgData,
    error: OrgError,
    isLoading: OrgIsLoading,
  } = useQuery({
    queryKey: ["UpdateOrg", id],
    queryFn: fetchData,
    enabled: !!id,
  });
  const [isNewFileSelected, setIsNewFileSelected] = useState(false); // Track if new image is selected

  useEffect(() => {
    if (OrgData) {
      form.reset({
        Ar_name: OrgData.ar_name,
        En_name: OrgData.en_name,
        Link: OrgData.link,
      });

      // Set the existing image URL for preview
      setExistingImageUrl(OrgData.img); // This should be the image URL string
    }
  }, [OrgData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0]; // Get the first file

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); // Show the preview of the new image
      };
      reader.readAsDataURL(file);

      form.setValue("ImageFile", files); // Pass the FileList to the form
      setIsNewFileSelected(true); // Mark that a new file is selected
    } else {
      setPreview(null);
      setIsNewFileSelected(false); // No new file selected

      // Instead of setting "ImageFile" to null or undefined, skip updating it
      form.setValue("ImageFile", undefined as unknown as FileList); // Optional: if you must reset, but be careful with this
    }
  };

  const { mutate } = useMutation({
    mutationKey: ["AddOrg"],
    mutationFn: (datas: OrgFormValue) => {
      const formData = new FormData();
      formData.append("Ar_name", datas.Ar_name);
      formData.append("En_name", datas.En_name);
      formData.append("Link", datas.Link);

      if (isNewFileSelected && datas.ImageFile && datas.ImageFile.length > 0) {
        formData.append("imageFile", datas.ImageFile[0]); // Send the first file in the FileList
      } else {
        formData.append("imageFileUrl", existingImageUrl || ""); // Send the existing image URL
      }

      return putApi(`/api/OrgUndBWC/${id}`, formData, {
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
      navigate("/admin-dashboard/organization");
    },
    onError: (error) => {
      // toast({
      //   title: "لم تتم العملية",
      //   description: error.message,
      //   variant: "destructive",
      // });
    },
  });
  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];

  //   if (file) {
  //     const reader = new FileReader();

  //     reader.onloadend = () => {
  //       setPreview(reader.result as string);
  //     };

  //     reader.readAsDataURL(file);
  //   } else {
  //     setPreview(null);
  //   }
  // };

  const onSubmit = (datas: OrgFormValue) => {
    mutate(datas);
  };

  return (
    <>
      {dir === "ltr" ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="min-h-[90vh]  w-[100%] bg-[#f2f2f2]"
          >
            {
              <>
                <div className=" items-right col-span-1 flex h-[140px] flex-col ml-10">
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

            <div className="mt-4 ml-10">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover"
                />
              ) : existingImageUrl ? (
                <img
                  src={existingImageUrl}
                  alt="Existing Image"
                  className="w-32 h-32 object-cover"
                />
              ) : (
                <p>No image uploaded</p>
              )}
            </div>
            <div className="grid grid-cols-4 w-[100%] px-10 items-start gap-4 text-right h-[20vh]  ">
              <div className=" col-span-1 h-auto translate-y-10">
                <label className="float-start">organization name</label>
                <FormField
                  control={form.control}
                  name="En_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">
                        {"organization name"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="enter organization name..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" col-span-1 h-auto translate-y-10">
                <Label text="اسم المؤسسة" />
                <FormField
                  control={form.control}
                  name="Ar_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">
                        {"اسم المؤسسة"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          dir="rtl"
                          placeholder="ادخل اسم المؤسسة..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 w-[100%] px-10 items-start gap-4 text-right h-[20vh]  ">
              <div className=" col-span-1 h-auto translate-y-10">
                <label htmlFor="" className="float-start">
                  Organization link
                </label>
                <FormField
                  control={form.control}
                  name="Link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">
                        {"Organization link"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Organization link"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-full -translate-x-10 flex justify-end">
              <Button className="text-lg inline-flex h-10 items-center  justify-center whitespace-nowrap rounded-lg bg-[#000] px-10 py-2  font-bold text-white ring-offset-background transition-colors hover:bg-[#201f1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                Update
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="min-h-[90vh]  w-[100%] bg-[#f2f2f2]"
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

            <div className="mt-4 mr-10">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover"
                />
              ) : existingImageUrl ? (
                <img
                  src={existingImageUrl}
                  alt="Existing Image"
                  className="w-32 h-32 object-cover"
                />
              ) : (
                <p>No image uploaded</p>
              )}
            </div>
            <div className="grid grid-cols-4 w-[100%] px-10 items-start gap-4 text-right h-[20vh]  ">
              <div className=" col-span-1 h-auto translate-y-10">
                <Label text="اسم المؤسسة" />
                <FormField
                  control={form.control}
                  name="Ar_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">
                        {"اسم المؤسسة"}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="ادخل اسم المؤسسة..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" col-span-1 h-auto translate-y-10">
                <Label text="organization name" />
                <FormField
                  control={form.control}
                  name="En_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">
                        {"organization name"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="enter organization name..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 w-[100%] px-10 items-start gap-4 text-right h-[20vh]  ">
              <div className=" col-span-1 h-auto translate-y-10">
                <Label text="رابط موقع المؤسسة" />
                <FormField
                  control={form.control}
                  name="Link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">
                        {"رابط موقع المؤسسة"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ادخل رابط موقع المؤسسة..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-full translate-x-10 flex justify-end">
              <Button className="text-md inline-flex h-10 items-center  justify-center whitespace-nowrap rounded-lg bg-[#000] px-10 py-2 text-sm font-bold text-white ring-offset-background transition-colors hover:bg-[#201f1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                تعديل
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
