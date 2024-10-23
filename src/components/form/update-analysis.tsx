import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
  MAX_FILES,
  publishes,
  Writer,
} from "../../types/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateAnalysis } from "src/types/validation";
import { z } from "zod";
import Label from "src/ui/label";
import { Input } from "src/ui/input";
import { Button } from "../../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance, getApi, patchApi, postApi, putApi } from "src/lib/http";
import { useToast } from "src/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Tiptap from "src/ui/Tiptap";
import { Textarea } from "src/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import EngTiptap from "src/ui/EngTiptap";
import { MultiSelect } from "primereact/multiselect";
import { Badge } from "src/ui/badge";
import { CircleX } from "lucide-react";
import { useTranslation } from "react-i18next";

type WriterOption = {
  value: number;
};
type ReferenceOption = {
  label: string;
  value: number;
};
type AnalysisFormValue = z.infer<typeof updateAnalysis>;
interface WriterResponse {
  data: {
    id: number;
    type: string;
    ar_Title: string;
    en_Title: string;
    b_image: string;
    images: string[];
    writers: Writer[];
    reportId: null;
    report: null;
    publish: boolean;
    t2read: number;
    tags: string[] | null;
    date_of_publish: Date;
    ar_table_of_content: string[] | null;
    en_table_of_content: string[] | null;
    ar_description: string;
    en_description: string;
    ar_Note: null;
    en_Note: string;
    references: any[];
  };
}
export interface WriterProp {
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
}
interface MutationData {
  id: number;
  ar_table_of_content: string[];
  en_table_of_content: string[];
  tags: string[];
  t2read: string;
  writersIdes: number[];
  referencesIdes: number[];
}
export type PublishesDataResp = {
  id: number;
  type: string;
  ar_Title: string;
  en_Title: string;
  b_image: string;
  images: string[];
  writers: Writer[];
  reportId: null;
  report: null;
  publish: boolean;
  t2read: string;
  tags: string[];
  date_of_publish: Date;
  ar_table_of_content: string[];
  en_table_of_content: string[];
  ar_description: string;
  en_description: string;
  ar_Note: null;
  en_Note: string;
  references: any[];
};
export interface Reference {
  id: number;
  ar_title: string;
  en_title: string;
  link: string;
  publication: PublishesDataResp[];
}
export interface Soicalmedia {
  id: number;
  name: string;
  url: string;
  writerId: number;
  writer: null;
}
export type ReferenceResp = {
  id: number;
  ar_title: string;
  en_title: string;
  link: string;
};
const kindOfCase = [
  { label: "منشورات", value: 1 },
  { label: "الاخبار", value: 2 },
  { label: "تحليلات", value: 3 },
] as const;
export default function UpdateFormAnalysis() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const form = useForm<z.infer<typeof updateAnalysis>>({
    resolver: zodResolver(updateAnalysis),
  });
  const [texts, setTexts] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  //
  const [tableOfContentAr, setTableOfContentAr] = useState<string[]>([]);
  const [inputValueTableOfContentAr, setInputValueTableOfContentAr] =
    useState<string>("");

  //
  const [tableOfContentEn, setTableOfContentEn] = useState<string[]>([]);
  const [inputValueTableOfContentEn, setInputValueTableOfContentEn] =
    useState<string>("");
  const handleDelete = (index: number, field: any) => {
    const updatedTexts = texts.filter((_, i) => i !== index);
    setTexts(updatedTexts);
    field.onChange(updatedTexts);
  };

  const handleTableOfContentArDelete = (index: number, field: any) => {
    const updatedTableOfContentAr = tableOfContentAr.filter(
      (_, i) => i !== index
    );
    setTableOfContentAr(updatedTableOfContentAr);
    field.onChange(updatedTableOfContentAr);
  };

  const handleTableOfContentEnDelete = (index: number, field: any) => {
    const updatedTableOfContentEn = tableOfContentEn.filter(
      (_, i) => i !== index
    );
    setTableOfContentEn(updatedTableOfContentEn);
    field.onChange(updatedTableOfContentEn);
  };
  const { data } = useQuery({
    queryKey: ["writer"],
    queryFn: () => getApi<WriterProp[]>("/api/Writers"),
  });

  const { data: referenceData } = useQuery({
    queryKey: ["reference"],
    queryFn: () => getApi<ReferenceResp[]>("/api/References"),
  });

  const [selectedWriters, setSelectedWriters] = useState<number[]>([]);

  const [selectedReference, setSelectedReference] = useState<number[]>([]);

  const writerOptions = data?.data.map((writer) => ({
    label: writer.ar_fullName,
    value: writer.id,
  }));

  const referenceOptions = referenceData?.data.map((writer) => ({
    label: writer.ar_title,
    value: writer.id,
  }));
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    form.setValue("writersIdes", selectedWriters);
    form.setValue("referencesIdes", selectedReference);
    if (id) {
      const numericId = parseInt(id, 10);
      setSelectedValue(numericId);
    }
  }, [id]);

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

  // First Mutation: Adding Publications
  const { mutate } = useMutation<WriterResponse, Error, AnalysisFormValue>({
    mutationKey: ["updateAnalysis"],
    mutationFn: (datas: AnalysisFormValue) => {
      const formData = new FormData();
      formData.append("Ar_Title", datas.Ar_Title);
      formData.append("En_Title", datas.En_Title);
      formData.append("date_of_publish", datas.date_of_publish);
      formData.append("Ar_description", datas.Ar_description);
      formData.append("En_description", datas.En_description);
      formData.append("Ar_note", datas.Ar_note);
      formData.append("En_note", datas.En_note);

      if (datas.ImageFile) {
        formData.append("ImageFile", datas.ImageFile[0]);
      }

      return putApi(`/api/Analysis/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (data, variables) => {
      console.log("data.data.id", data.data.id);
      const publishesID = data.data.id;
      secondMutate({
        id: publishesID,
        ar_table_of_content: tableOfContentAr,
        en_table_of_content: tableOfContentEn,
        tags: texts,
        t2read: variables.t2read,
        writersIdes: selectedWriters,
        referencesIdes: selectedReference,
      });
    },
    onError: (error) => {
      // Handle error
    },
  });

  // Second Mutation: Patching Publications
  const {
    mutate: secondMutate,
    isError: secondIsError,
    isSuccess: secondIsSuccess,
    isPending: secondIsPending,
  } = useMutation({
    mutationKey: ["AnalysisPatch"],
    mutationFn: (datas: MutationData) => {
      console.log("id:", datas.id);
      console.log("Payload:", datas);
      return patchApi(`/api/Analysis/${id}`, {
        tags: datas.tags,
        ar_table_of_content: datas.ar_table_of_content,
        en_table_of_content: datas.en_table_of_content,
        t2read: datas.t2read,
        writersIdes: datas.writersIdes, // Corrected
        referencesIdes: datas.referencesIdes, // Corrected
      });
    },
    onSuccess: (data) => {
      console.log("Second mutation success:", data);
      toast.success("تمت التعديل بنجاح.", {
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
      navigate("/admin-dashboard/analysis");
      window.location.reload();
    },
    onError: (error) => {
      console.log("Second mutation error:", error);
      toast.error("لم تتم العميله.", {
        style: {
          border: "1px solid  #FF5733 ",
          padding: "16px",
          color: " #FF5733 ",
        },
        iconTheme: {
          primary: " #FF5733 ",
          secondary: "#FFFAEE",
        },
      });
    },
  });

  const fetchPublishesData = async () => {
    const response = await axiosInstance.get<PublishesDataResp>(
      `/api/ManagingPublications/${id}`,
      {}
    );
    return response.data;
  };
  const {
    data: PublishesData,
    error: PublishesError,
    isLoading: PublishesIsLoading,
  } = useQuery({
    queryKey: ["UpdateOrg", id],
    queryFn: fetchPublishesData,
    enabled: !!id,
  });
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isNewFileSelected, setIsNewFileSelected] = useState(false); // Track if new image is selected

  console.log("selectedWriters", selectedWriters);
  console.log("selectedReference", selectedReference);
  useEffect(() => {
    if (PublishesData) {
      form.reset({
        Ar_Title: PublishesData.ar_Title,
        En_Title: PublishesData.en_Title,
        t2read: String(PublishesData.t2read),
        date_of_publish: String(PublishesData.date_of_publish).split("T")[0],
        tags: PublishesData.tags,
        ar_table_of_content: PublishesData.ar_table_of_content,
        en_table_of_content: PublishesData.en_table_of_content,
        Ar_description: PublishesData.ar_description,
        En_description: PublishesData.en_description,
        Ar_note: PublishesData.ar_Note!,
        En_note: PublishesData.en_Note,
      });
      setTexts(PublishesData.tags || []);
      setTableOfContentAr(PublishesData.ar_table_of_content || []);
      setTableOfContentEn(PublishesData.en_table_of_content || []);
      // Set the existing image URL for preview
      setExistingImageUrl(PublishesData.b_image); // This should be the image URL string
    }
    if (PublishesData?.writers) {
      const writerIds = PublishesData.writers.map((writer) => writer.id);
      setSelectedWriters(writerIds);
    }
    if (PublishesData?.references) {
      const referenceIds = PublishesData.references.map(
        (reference) => reference.id
      );
      setSelectedReference(referenceIds);
    }
  }, [PublishesData]);

  useEffect(() => {
    form.setValue("writersIdes", selectedWriters, { shouldValidate: true });
  }, [selectedWriters]);

  useEffect(() => {
    form.setValue("referencesIdes", selectedReference, {
      shouldValidate: true,
    });
  }, [selectedReference]);
  const onSubmit = (datas: AnalysisFormValue) => {
    mutate(datas);
  };

  return (
    <>
      {dir === "ltr" ? (
        <Form {...form}>
          {process.env.NODE_ENV === "development" && (
            <>
              <p>Ignore it, it just in dev mode</p>
              <div>{JSON.stringify(form.formState.errors)}</div>
            </>
          )}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="min-h-[90vh]  w-[100%] bg-[#f2f2f2] px-9"
          >
            <div className="grid h-[100px]  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth text-right ">
              {/* <div className="col-span-2 h-[50px] mt-7">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="col-span-2 flex">
                        {kindOfCase.map((caseType) => (
                          <label
                            key={caseType.value}
                            className="flex items-center w-full space-x-2"
                          >
                            <FormControl>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  value={caseType.value}
                                  checked={selectedValue === caseType.value}
                                  onChange={() => {
                                    const newValue =
                                      selectedValue === caseType.value
                                        ? null
                                        : caseType.value;
                                    setSelectedValue(newValue);
                                    field.onChange(newValue);
                                  }}
                                  className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:bg-[#D5AE78] checked:border-transparent focus:outline-none"
                                />

                                <svg
                                  className={`w-4 h-4 text-white absolute top-1 left-1 pointer-events-none ${
                                    selectedValue === caseType.value
                                      ? "block"
                                      : "hidden"
                                  }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </FormControl>
                            <h1 className="ml-2">{caseType.label}</h1>
                          </label>
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}
            </div>
            <div className="grid  h-[100px] grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth text-right ">
              <div className="text-start col-span-1 h-auto ">
                <label htmlFor="">Analysis Photo</label>
                <FormField
                  control={form.control}
                  name="ImageFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Image</FormLabel>
                      <FormControl>
                        <input
                          type="file"
                          className="float-start"
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
            </div>
            <div className="grid  h-[100px] grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth text-right ">
              <div className=" col-span-1 h-auto ">
                <Label text="عنوان الخبر" />
                <FormField
                  control={form.control}
                  name="Ar_Title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">
                        {"عنوان الخبر"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          dir="rtl"
                          placeholder="ادخل عنوان الخبر..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="text-start col-span-1 h-auto ">
                <Label text="Analysis Title" />
                <FormField
                  control={form.control}
                  name="En_Title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">
                        {"Analysis Title"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          dir="ltr"
                          placeholder="enter Analysis Title..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="text-start col-span-1  ">
                <label htmlFor="">Reference</label>
                <div className="card flex justify-center items-center">
                  <MultiSelect
                    dir="ltr"
                    value={selectedReference}
                    onChange={(e) => setSelectedReference(e.value)} // This will store only the selected writer IDs
                    options={referenceOptions} // writerOptions is an array of { label, value }
                    optionLabel="label"
                    optionValue="value"
                    placeholder="select references"
                    maxSelectedLabels={0}
                    className="w-full rounded-md border border-gray-300 bg-white shadow-sm py-[6px] translate-y-[3px] px-2 focus:ring focus:ring-indigo-500"
                    panelClassName="rounded-md bg-white px-2 py-2 shadow-lg border border-gray-300"
                    itemTemplate={(option) => {
                      if (!option) return null;

                      // Check if the current item's value (ID) is in the selectedWriters array (which only holds IDs)
                      const isItemSelected = selectedReference.includes(
                        option.value
                      );

                      return (
                        <div
                          className={`flex items-center justify-between gap-2 w-[370px] shadow-inner mb-1 p-2 rounded-lg cursor-pointer transition-all ${
                            isItemSelected ? "bg-gray-200" : "hover:bg-gray-100"
                          }`}
                        >
                          <span className="text-lg">{option.label}</span>
                        </div>
                      );
                    }}
                    selectedItemTemplate={(option) => {
                      if (!option) return null;

                      return (
                        <div className="flex items-center gap-2">
                          <span>{option.label}</span>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="grid  h-[100px] grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth text-right ">
              <div className="text-start col-span-1  ">
                <label htmlFor="">writers</label>
                <div className="card flex justify-center items-center">
                  <MultiSelect
                    dir="ltr"
                    value={selectedWriters}
                    onChange={(e) => setSelectedWriters(e.value)} // This will store only the selected writer IDs
                    options={writerOptions} // writerOptions is an array of { label, value }
                    optionLabel="label"
                    optionValue="value"
                    placeholder="select writers"
                    maxSelectedLabels={0}
                    className="w-full rounded-md border border-gray-300 bg-white shadow-sm py-[6px] translate-y-[3px] px-2 focus:ring focus:ring-indigo-500"
                    panelClassName="rounded-md bg-white px-2 py-2 shadow-lg border border-gray-300"
                    itemTemplate={(option) => {
                      if (!option) return null;

                      // Check if the current item's value (ID) is in the selectedWriters array (which only holds IDs)
                      const isItemSelected = selectedWriters.includes(
                        option.value
                      );

                      return (
                        <div
                          className={`flex items-center justify-between gap-2 w-[370px] shadow-inner mb-1 p-2 rounded-lg cursor-pointer transition-all ${
                            isItemSelected ? "bg-gray-200" : "hover:bg-gray-100"
                          }`}
                        >
                          <span className="text-lg">{option.label}</span>
                        </div>
                      );
                    }}
                    selectedItemTemplate={(option) => {
                      if (!option) return null;

                      return (
                        <div className="flex items-center gap-2">
                          <span>{option.label}</span>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
              <div className="text-start col-span-1 h-auto ">
                <Label text="Time to read" />
                <FormField
                  control={form.control}
                  name="t2read"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">
                        {"Time to read"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          dir="ltr"
                          type="text"
                          placeholder="Enter Time to read..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="text-start col-span-1 h-auto ">
                <Label text="Date Of Publish" />
                <FormField
                  control={form.control}
                  name="date_of_publish"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">
                        {"Date Of Publish"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          dir="ltr"
                          type="date"
                          placeholder="Enter Date Of Publish..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth text-right min-h-[10vh]">
              <div className="text-start col-span-1 h-auto ">
                <Label text="Tags" />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900"></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            dir="ltr"
                            placeholder="Enter Tags ..."
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

                          {Array.isArray(field.value) &&
                            field.value.length > 0 && (
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
                                  onClick={() => handleDelete(index, field)}
                                >
                                  <CircleX />
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
              <div className="col-span-1 h-auto ">
                <Label text="جدول محتويات" />
                <FormField
                  control={form.control}
                  name="ar_table_of_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900"></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            dir="rtl"
                            placeholder="ادخل جدول محتويات..."
                            value={inputValueTableOfContentAr}
                            onChange={(e) => {
                              setInputValueTableOfContentAr(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                inputValueTableOfContentAr.trim()
                              ) {
                                const newValues = Array.isArray(field.value)
                                  ? [...field.value, inputValueTableOfContentAr]
                                  : [inputValueTableOfContentAr];
                                field.onChange(newValues);
                                setTableOfContentAr(newValues);
                                setInputValueTableOfContentAr("");
                                e.preventDefault();
                              }
                            }}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            className="pr-20"
                          />

                          {Array.isArray(field.value) &&
                            field.value.length > 0 && (
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
                                  onClick={() =>
                                    handleTableOfContentArDelete(index, field)
                                  }
                                >
                                  <CircleX />
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

              <div className="text-start col-span-1 h-auto ">
                <Label text="Table Of Content" />
                <FormField
                  control={form.control}
                  name="en_table_of_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900"></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            dir="ltr"
                            placeholder="Enter Table Of Content ..."
                            value={inputValueTableOfContentEn}
                            onChange={(e) => {
                              setInputValueTableOfContentEn(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                inputValueTableOfContentEn.trim()
                              ) {
                                const newValues = Array.isArray(field.value)
                                  ? [...field.value, inputValueTableOfContentEn]
                                  : [inputValueTableOfContentEn];
                                field.onChange(newValues);
                                setTableOfContentEn(newValues);
                                setInputValueTableOfContentEn("");
                                e.preventDefault();
                              }
                            }}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            className="pr-20"
                          />

                          {Array.isArray(field.value) &&
                            field.value.length > 0 && (
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
                                  onClick={() =>
                                    handleTableOfContentEnDelete(index, field)
                                  }
                                >
                                  <CircleX />
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
            <div className="grid  h-[250px] grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right ">
              <div className=" col-span-1 h-auto ">
                <label htmlFor="">وصف الخبر</label>
                <FormField
                  control={form.control}
                  name="Ar_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>sadasd</FormLabel>
                      <FormControl>
                        <Tiptap
                          description={"ادخل الوصف"}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid  h-[250px] grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right ">
              <div className="text-start col-span-1 h-auto ">
                <label htmlFor="">Description </label>
                <FormField
                  control={form.control}
                  name="En_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>sadasd</FormLabel>
                      <FormControl>
                        <EngTiptap
                          description={"Enter the Description "}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 w-[100%]  items-start gap-4 text-right h-[20vh]  ">
              <div className=" col-span-3 h-auto translate-y-10">
                <Label text="ملاحظة" />
                <FormField
                  control={form.control}
                  name="Ar_note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">{"ملاحظة"}</FormLabel>
                      <FormControl>
                        <Textarea
                          dir="rtl"
                          className="bg-white border-2 border-[#d1d5db] rounded-xl"
                          rows={5}
                          {...field}
                          placeholder="ادخل ملاحظة ..."
                        ></Textarea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 w-[100%]  items-start gap-4 text-right h-[20vh]  ">
              <div className="text-start col-span-3 h-auto translate-y-10">
                <Label text="Note" />
                <FormField
                  control={form.control}
                  name="En_note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">{"Note"}</FormLabel>
                      <FormControl>
                        <Textarea
                          dir="ltr"
                          className="bg-white border-2 border-[#d1d5db] rounded-xl"
                          rows={5}
                          {...field}
                          placeholder="Enter Note ..."
                        ></Textarea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-full -translate-x-10 flex justify-end mt-20 ">
              <Button className=" mb-10 text-md inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg bg-[#000] px-10 py-2 text-lg font-bold text-white ring-offset-background transition-colors hover:bg-[#201f1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                Update
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Form {...form}>
          {process.env.NODE_ENV === "development" && (
            <>
              <p>Ignore it, it just in dev mode</p>
              <div>{JSON.stringify(form.formState.errors)}</div>
            </>
          )}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="min-h-[90vh]  w-[100%] bg-[#f2f2f2] px-9"
          >
            <div className="grid h-[100px]  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth text-right ">
              {/* <div className="col-span-2 h-[50px] mt-7">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="col-span-2 flex">
                        {kindOfCase.map((caseType) => (
                          <label
                            key={caseType.value}
                            className="flex items-center w-full space-x-2"
                          >
                            <FormControl>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  value={caseType.value}
                                  checked={selectedValue === caseType.value}
                                  onChange={() => {
                                    const newValue =
                                      selectedValue === caseType.value
                                        ? null
                                        : caseType.value;
                                    setSelectedValue(newValue);
                                    field.onChange(newValue);
                                  }}
                                  className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:bg-[#D5AE78] checked:border-transparent focus:outline-none"
                                />

                                <svg
                                  className={`w-4 h-4 text-white absolute top-1 left-1 pointer-events-none ${
                                    selectedValue === caseType.value
                                      ? "block"
                                      : "hidden"
                                  }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </FormControl>
                            <h1 className="ml-2">{caseType.label}</h1>
                          </label>
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}
            </div>
            <div className="grid  h-[100px] grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth text-right ">
              <div className=" col-span-1 h-auto ">
                <label htmlFor="">صورة التحليل</label>
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
            </div>
            <div className="grid  h-[100px] grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth text-right ">
              <div className=" col-span-1 h-auto ">
                <Label text="عنوان التحليل" />
                <FormField
                  control={form.control}
                  name="Ar_Title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">
                        {"عنوان التحليل"}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="ادخل عنوان التحليل..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="text-end col-span-1 h-auto ">
                <Label text="Analysis Title" />
                <FormField
                  control={form.control}
                  name="En_Title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">
                        {"Analysis Title"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          dir="ltr"
                          placeholder="enter Analysis Title..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" col-span-1  ">
                <label htmlFor="">المرجع</label>
                <div className="card flex justify-center items-center">
                  <MultiSelect
                    dir="rtl"
                    value={selectedReference}
                    onChange={(e) => setSelectedReference(e.value)} // This will store only the selected writer IDs
                    options={referenceOptions} // writerOptions is an array of { label, value }
                    optionLabel="label"
                    optionValue="value"
                    placeholder="اختار مرجع"
                    maxSelectedLabels={0}
                    className="w-full rounded-md border border-gray-300 bg-white shadow-sm py-[6px] translate-y-[3px] px-2 focus:ring focus:ring-indigo-500"
                    panelClassName="rounded-md bg-white px-2 py-2 shadow-lg border border-gray-300"
                    itemTemplate={(option) => {
                      if (!option) return null;

                      // Check if the current item's value (ID) is in the selectedWriters array (which only holds IDs)
                      const isItemSelected = selectedReference.includes(
                        option.value
                      );

                      return (
                        <div
                          className={`flex items-center justify-between gap-2 w-[370px] shadow-inner mb-1 p-2 rounded-lg cursor-pointer transition-all ${
                            isItemSelected ? "bg-gray-200" : "hover:bg-gray-100"
                          }`}
                        >
                          <span className="text-lg">{option.label}</span>
                        </div>
                      );
                    }}
                    selectedItemTemplate={(option) => {
                      if (!option) return null;

                      return (
                        <div className="flex items-center gap-2">
                          <span>{option.label}</span>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="grid  h-[100px] grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth text-right ">
              <div className=" col-span-1  ">
                <label htmlFor="">الكاتب</label>
                <div className="card flex justify-center items-center">
                  <MultiSelect
                    dir="rtl"
                    value={selectedWriters}
                    onChange={(e) => setSelectedWriters(e.value)} // This will store only the selected writer IDs
                    options={writerOptions} // writerOptions is an array of { label, value }
                    optionLabel="label"
                    optionValue="value"
                    placeholder="اختار الكاتب"
                    maxSelectedLabels={0}
                    className="w-full rounded-md border border-gray-300 bg-white shadow-sm py-[6px] translate-y-[3px] px-2 focus:ring focus:ring-indigo-500"
                    panelClassName="rounded-md bg-white px-2 py-2 shadow-lg border border-gray-300"
                    itemTemplate={(option) => {
                      if (!option) return null;

                      // Check if the current item's value (ID) is in the selectedWriters array (which only holds IDs)
                      const isItemSelected = selectedWriters.includes(
                        option.value
                      );

                      return (
                        <div
                          className={`flex items-center justify-between gap-2 w-[370px] shadow-inner mb-1 p-2 rounded-lg cursor-pointer transition-all ${
                            isItemSelected ? "bg-gray-200" : "hover:bg-gray-100"
                          }`}
                        >
                          <span className="text-lg">{option.label}</span>
                        </div>
                      );
                    }}
                    selectedItemTemplate={(option) => {
                      if (!option) return null;

                      return (
                        <div className="flex items-center gap-2">
                          <span>{option.label}</span>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
              <div className=" col-span-1 h-auto ">
                <Label text="وقت القراءه" />
                <FormField
                  control={form.control}
                  name="t2read"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">
                        {"وقت القراءه"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="ادخل وقت القراءه..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" col-span-1 h-auto ">
                <Label text="تاريخ النشر" />
                <FormField
                  control={form.control}
                  name="date_of_publish"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">
                        {"تاريخ النشر"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="ادخل تاريخ النشر..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth text-right min-h-[10vh]">
              <div className="col-span-1 h-auto ">
                <Label text="وسوم" />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900"></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            dir="rtl"
                            placeholder="ادخل الوسوم..."
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

                          {Array.isArray(field.value) &&
                            field.value.length > 0 && (
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
                                  onClick={() => handleDelete(index, field)}
                                >
                                  <CircleX />
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
              <div className="col-span-1 h-auto ">
                <Label text="جدول محتويات" />
                <FormField
                  control={form.control}
                  name="ar_table_of_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900"></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            dir="rtl"
                            placeholder="ادخل جدول محتويات..."
                            value={inputValueTableOfContentAr}
                            onChange={(e) => {
                              setInputValueTableOfContentAr(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                inputValueTableOfContentAr.trim()
                              ) {
                                const newValues = Array.isArray(field.value)
                                  ? [...field.value, inputValueTableOfContentAr]
                                  : [inputValueTableOfContentAr];
                                field.onChange(newValues);
                                setTableOfContentAr(newValues);
                                setInputValueTableOfContentAr("");
                                e.preventDefault();
                              }
                            }}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            className="pr-20"
                          />

                          {Array.isArray(field.value) &&
                            field.value.length > 0 && (
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
                                  onClick={() =>
                                    handleTableOfContentArDelete(index, field)
                                  }
                                >
                                  <CircleX />
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

              <div className="text-end col-span-1 h-auto ">
                <Label text="Table Of Content" />
                <FormField
                  control={form.control}
                  name="en_table_of_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900"></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            dir="ltr"
                            placeholder="Enter Table Of Content ..."
                            value={inputValueTableOfContentEn}
                            onChange={(e) => {
                              setInputValueTableOfContentEn(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                inputValueTableOfContentEn.trim()
                              ) {
                                const newValues = Array.isArray(field.value)
                                  ? [...field.value, inputValueTableOfContentEn]
                                  : [inputValueTableOfContentEn];
                                field.onChange(newValues);
                                setTableOfContentEn(newValues);
                                setInputValueTableOfContentEn("");
                                e.preventDefault();
                              }
                            }}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            className="pr-20"
                          />

                          {Array.isArray(field.value) &&
                            field.value.length > 0 && (
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
                                  onClick={() =>
                                    handleTableOfContentEnDelete(index, field)
                                  }
                                >
                                  <CircleX />
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

            <div className="grid  h-[250px] grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right ">
              <div className=" col-span-1 h-auto ">
                <label htmlFor="">وصف الخبر</label>
                <FormField
                  control={form.control}
                  name="Ar_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>sadasd</FormLabel>
                      <FormControl>
                        <Tiptap
                          description={"ادخل الوصف"}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid  h-[250px] grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right ">
              <div className="text-end col-span-1 h-auto ">
                <label htmlFor="">Description </label>
                <FormField
                  control={form.control}
                  name="En_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>sadasd</FormLabel>
                      <FormControl>
                        <EngTiptap
                          description={"Enter the Description "}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 w-[100%]  items-start gap-4 text-right h-[20vh]  ">
              <div className=" col-span-3 h-auto translate-y-10">
                <Label text="ملاحظة" />
                <FormField
                  control={form.control}
                  name="Ar_note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">{"ملاحظة"}</FormLabel>
                      <FormControl>
                        <Textarea
                          className="bg-white border-2 border-[#d1d5db] rounded-xl"
                          rows={5}
                          {...field}
                          placeholder="ادخل ملاحظة ..."
                        ></Textarea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 w-[100%]  items-start gap-4 text-right h-[20vh]  ">
              <div className="text-end col-span-3 h-auto translate-y-10">
                <Label text="Note" />
                <FormField
                  control={form.control}
                  name="En_note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-900">{"Note"}</FormLabel>
                      <FormControl>
                        <Textarea
                          dir="ltr"
                          className="bg-white border-2 border-[#d1d5db] rounded-xl"
                          rows={5}
                          {...field}
                          placeholder="Enter Note ..."
                        ></Textarea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-full translate-x-10 flex justify-end mt-20 ">
              <Button className=" mb-10 text-md inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg bg-[#000] px-10 py-2 text-lg font-bold text-white ring-offset-background transition-colors hover:bg-[#201f1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                تعديل
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
