import React, { useEffect, useState } from "react";
import Footer from "src/components/footer";
import Navbar from "src/components/navbar";
import { ReactComponent as TranslateIcon } from "../../assets/icons/translate-icon.svg";
import CalendarIcon from "../../assets/icons/calendar-icon";
import ClockCircle from "../../assets/icons/clock-circle";
import NewsList from "../../components/(user)/news-list";
import MorePublish from "src/components/(user)/more-publish";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ar";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getApi } from "src/lib/http";
import { LoaderIcon } from "lucide-react";
import Cookies from "js-cookie";

export interface PubblicationResp {
  id: number;
  type: string;
  ar_Title: string;
  en_Title: string;
  b_image: string;
  images: string[];
  writers: Writer[];
  reportId: number;
  report: null;
  publish: boolean;
  t2read: number;
  tags: string[];
  date_of_publish: Date;
  ar_table_of_content: string[];
  en_table_of_content: string[];
  ar_description: string;
  en_description: string;
  ar_Note: string;
  en_Note: string;
  references: Reference[];
}

export interface Reference {
  id: number;
  ar_title: string;
  en_title: string;
  link: string;
  publication: null[];
}

export interface Writer {
  id: number;
  ar_fullName: string;
  en_fullName: string;
  image: string;
  ar_description: string;
  en_description: string;
  ar_role: string;
  en_role: string;
  publication: null[];
  soicalmedia: any[];
}
export interface ReportPubResp {
  id: number;
  ar_Title: string;
  en_Title: string;
}
export default function PublishDetails() {
  const AccessToken = Cookies.get("accessToken");
  const { id } = useParams<{ id: string }>();
  const [language, setLanguage] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  dayjs.extend(relativeTime);
  dayjs.locale("ar");
  const { i18n } = useTranslation();
  const dir = i18n.dir();

  const { data: PPublicDetails, isPending } = useQuery({
    queryKey: ["PPublicDetails"],
    queryFn: () =>
      getApi<PubblicationResp>(`/api/website/Publications/Details/${id}`),
  });

  const getRelativeTime = (date: string | Date, language: string): string => {
    dayjs.locale(language);
    return dayjs().to(dayjs(date));
  };

  const { data: ReportPub } = useQuery({
    queryKey: ["ReportPubInViewPage"],
    queryFn: () =>
      getApi<ReportPubResp[]>("/api/website/Reports/pub", {
        headers: {
          "Content-Type": "application/json", // Ensures that the request body is treated as JSON
          Authorization: `Bearer ${AccessToken}`,
        },
      }),
  });

  const matchingItem = ReportPub?.data?.find(
    (item) => item.id === PPublicDetails?.data.reportId
  );

  const { id: matchingId, ar_Title } = matchingItem || {};
  const { id: matchingIEn, en_Title } = matchingItem || {};
  const [isOpen, setIsOpen] = useState(false);

  const toggleDiv = () => {
    setIsOpen(!isOpen);
  };
  const onChangeLanguage = () => {
    language === "ar" ? setLanguage("en") : setLanguage("ar");
  };

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };
  useEffect(() => {
    changeLanguage(language);
    document.body.dir = i18n.dir();
  }, [i18n, i18n.language, language]);
  const openModal = () => {
    if (PPublicDetails?.data.b_image) {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openArrayModal = (image: any) => {
    setSelectedImage(image);
  };

  // Function to close the modal
  const closeArrayModal = () => {
    setSelectedImage(null);
  };
  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full ">
        <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" />
      </div>
    );
  }
  return (
    <>
      {dir === "ltr" ? (
        <div>
          <div className="xlg:max-w-[1200px] justify-self-center">
            <div className="w-full lg:h-[8vh] md:h-[8vh]  sm:h-[11vh]">
              <Navbar />
            </div>
            <div dir="ltr" className=" min-h-screen md:p-4 p-4 mb-80">
              {/* Main Content Section */}
              <main className="md:max-w-[90vw] mx-auto  md:p-6">
                <h1 className=" text-[36px] font-bold mb-[43px] flex items-center gap-x-2">
                  <span className="bg-[#CCA972] h-10 w-[10px] rounded-full "></span>
                  <span>Publication</span>
                </h1>
                <h1 className=" text-2xl font-bold mb-[43px]">
                  {PPublicDetails?.data.en_Title}
                </h1>
                {/* Image Section */}
                <div className="mb-8 relative h-[400px] overflow-hidden">
                  <img
                    src={PPublicDetails?.data.b_image} // Replace with actual image path
                    alt="Report cover"
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={openModal}
                  />
                </div>
                {modalOpen && (
                  <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                    onClick={closeModal}
                  >
                    <div
                      className="relative w-[100%] h-[100%] overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <>
                        <img
                          src={PPublicDetails?.data.b_image!}
                          className="w-[80%] h-[80%] mx-auto object-fill"
                          alt=""
                        />
                        <button
                          onClick={closeModal}
                          className="absolute top-4 right-4 p-2 rounded-full bg-white text-black hover:bg-gray-200"
                        >
                          &times;
                        </button>
                      </>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-6 gap-x-2 gap-y-2">
                  <div className=" col-span-6 md:col-span-4 ">
                    <div className="flex flex-col md:flex-row justify-between md:h-[70px] bg-[#D5AE78] items-center mb-4 rounded-lg">
                      <div className="flex items-center gap-x-2 py-5 ps-8">
                        <div className="flex items-center gap-x-2">
                          <CalendarIcon />
                          <span>{` ${getRelativeTime(
                            PPublicDetails?.data.date_of_publish ?? new Date(),
                            "en"
                          )}`}</span>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <ClockCircle />
                          <span>
                            Time to read: {String(PPublicDetails?.data.t2read)}{" "}
                            minutes
                          </span>
                        </div>
                      </div>
                      <button className="bg-[#C4A171]  md:h-[68px] w-full md:w-fit flex items-center place-content-center gap-x-2  text-black px-4 py-2 rounded-[8px]">
                        <TranslateIcon />
                        <span
                          onClick={onChangeLanguage}
                          className="cursor-pointer"
                        >
                          اقرأ هذا باللغة بالعربية
                        </span>
                      </button>
                    </div>
                    {/*-------- author ------------- */}
                    <div>
                      {PPublicDetails?.data.writers.map((items, index) => (
                        <div className="flex items-center gap-x-2">
                          <div className="">
                            <img
                              src={items.image} // Replace with actual image path
                              className="rounded-full object-cover mr-4 mb-4"
                              width="60" // Add fixed width here
                              height="60" // Add fixed height here
                              alt={`Image of ${items.en_fullName}`}
                            />
                          </div>
                          <span className="text-base font-bold">
                            {items.en_fullName}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mb-[47px]">
                      <h2 className="text-xl font-bold mb-5"> ✅ Tags</h2>
                      <p>
                        {PPublicDetails?.data.tags.map((item, index) => (
                          <span className="border-[1px] border-black text-base rounded-3xl p-2 ml-2 hover:bg-gray-100">
                            {item}
                          </span>
                        ))}
                      </p>
                    </div>
                    <div className=" grid min-h-[100px] my-4 items-start gap-4 overflow-y-scroll scroll-smooth text-start">
                      <label htmlFor="" className="">
                        ✅ More Photos Of The Publication
                      </label>
                      <div className="overflow-y-auto min-h-96">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {PPublicDetails?.data.images.map((item, index) => (
                            <div
                              key={index}
                              className="rounded-lg shadow-md flex items-center justify-center mx-auto bg-slate-200 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                              onClick={() => openArrayModal(item)}
                            >
                              <img
                                src={item}
                                alt={`publication-${index}`}
                                className="w-full h-48 object-fill"
                                loading="lazy"
                              />
                              <div className="p-4">
                                {/* Optional: Add any additional content like captions or buttons here */}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {selectedImage && (
                      <div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                        onClick={closeArrayModal}
                      >
                        <div
                          className="relative w-[80%] h-[80%] overflow-hidden"
                          onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside the modal content
                        >
                          <img
                            src={selectedImage}
                            className="w-full h-full object-contain"
                            alt="Enlarged view"
                          />
                          <button
                            onClick={closeArrayModal}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white text-black hover:bg-gray-200"
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="mb-[47px] ">
                      <h2 className="text-xl font-bold mb-5 ">
                        {" "}
                        ✅ Description
                      </h2>
                      <p>
                        {PPublicDetails?.data.en_description && (
                          <div
                            className="custom-html-content-en max-w-[800px] break-words"
                            dangerouslySetInnerHTML={{
                              __html: PPublicDetails.data.en_description,
                            }}
                          />
                        )}
                      </p>
                    </div>
                    {/* ------ note ----------- */}
                    <div className="mb-[47px]">
                      <h2 className="text-xl font-bold mb-5"> ✅ Note</h2>
                      <div className="max-w-[800px] break-words">
                        {PPublicDetails?.data.en_Note}
                      </div>
                    </div>

                    {matchingIEn ? (
                      <div className="mb-[47px]">
                        <h2 className="text-xl font-bold mb-5">
                          ✅ Associated report
                        </h2>
                        <Link
                          to={`/report-details/${matchingIEn}`}
                          target="_blank"
                        >
                          {en_Title}
                        </Link>
                      </div>
                    ) : null}
                    {/* <div className="w-full max-w-md mx-auto">
 

  
</div> */}
                    <div dir="rtl" className="mb-[47px] bg-[#EEEEEE] py-5 px-3">
                      <button
                        onClick={toggleDiv}
                        className="flex items-center px-4 py-2 relative bg-white rounded hover:bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                      >
                        <span>
                          {isOpen ? "Hide references" : "Show References"}
                        </span>
                        <span className="mr-2 transform transition-transform">
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="mt-4 p-4 rounded">
                          <p className="flex flex-wrap gap-2">
                            {PPublicDetails?.data.references.map(
                              (item, index) => (
                                <a
                                  key={index}
                                  href={`${item.link}`}
                                  target="_blank"
                                  className="border-[1px] border-black text-base rounded-3xl p-2 hover:bg-gray-100"
                                >
                                  {item.ar_title}
                                </a>
                              )
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="w-full border-t my-14"></div>

                    <div dir="rtl" className="mb-[47px]">
                      {PPublicDetails?.data.writers.map((item, index) => (
                        <div
                          className="border border-gray-300 rounded-lg p-4 mx-auto w-[100%] mb-2 flex items-center"
                          key={index}
                        >
                          <div className="flex-1 pr-4  ">
                            <p className="m-0 text-base text-end leading-6">
                              {item.ar_description}
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <img
                              src={item.image}
                              className="rounded-full object-cover mb-2"
                              width="60"
                              height="60"
                              alt={`Image of ${item.ar_fullName}`}
                            />
                            <span className="font-bold text-lg">
                              {item.ar_fullName}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {item.ar_role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className=" hidden md:block col-span-6 md:col-span-2 h-10">
                    {/* last news here */}
                    <div className="md:h-[70px] bg-[#D5AE78] rounded-lg flex items-center ps-4">
                      <h2 className="text-2xl font-bold">Read more</h2>
                    </div>
                    <NewsList />
                  </div>
                </div>
              </main>
            </div>
            <MorePublish />
          </div>
          <footer className="min-h-[65vh] p-2 overflow-hidden relative bg-black mt-10">
            <Footer />
          </footer>
        </div>
      ) : (
        <div>
          <div className="xlg:max-w-[1200px] justify-self-center">
            {/* Navbar Section */}
            <div className="w-full lg:h-[8vh] md:h-[8vh]  sm:h-[11vh]">
              <Navbar />
            </div>
            <div className="min-h-screen md:p-4 p-4 mb-44">
              {/* Main Content Section */}
              <main className="md:max-w-[90vw] mx-auto  md:p-6">
                <h1 className=" text-[36px] font-bold mb-[43px] flex items-center gap-x-2">
                  <span className="bg-[#CCA972] h-10 w-[10px] rounded-full "></span>
                  <span>منشور</span>
                </h1>
                <h1 className=" text-2xl font-bold mb-[43px]">
                  {PPublicDetails?.data.ar_Title}
                </h1>
                {/* Image Section */}
                <div className="mb-8 relative h-[400px] overflow-hidden">
                  <img
                    src={PPublicDetails?.data.b_image} // Replace with actual image path
                    alt="Report cover"
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={openModal}
                  />
                </div>
                {modalOpen && (
                  <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                    onClick={closeModal}
                  >
                    <div
                      className="relative w-[100%] h-[100%] overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <>
                        <img
                          src={PPublicDetails?.data.b_image!}
                          className="w-[80%] h-[80%] mx-auto object-fill"
                          alt=""
                        />
                        <button
                          onClick={closeModal}
                          className="absolute top-4 right-4 p-2 rounded-full bg-white text-black hover:bg-gray-200"
                        >
                          &times;
                        </button>
                      </>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-6 gap-x-2 gap-y-2">
                  <div className=" col-span-6 md:col-span-4 ">
                    <div className="flex flex-col md:flex-row justify-between md:h-[70px] bg-[#D5AE78] items-center mb-4 rounded-lg">
                      <div className="flex items-center gap-x-2 py-5 ps-8">
                        <div className="flex items-center gap-x-2">
                          <CalendarIcon />
                          <span>{` ${getRelativeTime(
                            PPublicDetails?.data.date_of_publish ?? new Date(),
                            "ar"
                          )}`}</span>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <ClockCircle />
                          <span>
                            وقت القراءة: {String(PPublicDetails?.data.t2read)}{" "}
                            دقيقة
                          </span>
                        </div>
                      </div>
                      <button className="bg-[#C4A171]  md:h-[68px] w-full md:w-fit flex items-center place-content-center gap-x-2  text-black px-4 py-2 rounded-[8px]">
                        <span
                          onClick={onChangeLanguage}
                          className="cursor-pointer"
                        >
                          Read this in English
                        </span>
                        <TranslateIcon />
                      </button>
                    </div>
                    {/*-------- author ------------- */}
                    <div>
                      {PPublicDetails?.data.writers.map((items, index) => (
                        <div className="flex items-center gap-x-2">
                          <div className="">
                            <img
                              src={items.image} // Replace with actual image path
                              className="rounded-full object-cover mr-4 mb-4"
                              width="60" // Add fixed width here
                              height="60" // Add fixed height here
                              alt={`Image of ${items.ar_fullName}`}
                            />
                          </div>
                          <span className="text-base font-bold">
                            {items.ar_fullName}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mb-[47px]">
                      <h2 className="text-xl font-bold mb-5"> ✅ الوسوم</h2>
                      <p>
                        {PPublicDetails?.data.tags.map((item, index) => (
                          <span className="border-[1px] border-black text-base rounded-3xl p-2 ml-2 hover:bg-gray-100">
                            {item}
                          </span>
                        ))}
                      </p>
                    </div>
                    <div className="my-4">
                      <label
                        htmlFor=""
                        className="block mb-2 text-lg font-semibold"
                      >
                        ✅ صور أخرى للمنشور
                      </label>
                      <div className="overflow-y-auto min-h-96">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {PPublicDetails?.data.images.map((item, index) => (
                            <div
                              key={index}
                              className="rounded-lg shadow-md flex items-center justify-center mx-auto bg-slate-200 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                              onClick={() => openArrayModal(item)}
                            >
                              <img
                                src={item}
                                alt={`publication-${index}`}
                                className="w-full h-48 object-fill"
                                loading="lazy"
                              />
                              <div className="p-4">
                                {/* Optional: Add any additional content like captions or buttons here */}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedImage && (
                      <div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                        onClick={closeArrayModal}
                      >
                        <div
                          className="relative w-[80%] h-[80%] overflow-hidden"
                          onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside the modal content
                        >
                          <img
                            src={selectedImage}
                            className="w-full h-full object-contain"
                            alt="Enlarged view"
                          />
                          <button
                            onClick={closeArrayModal}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white text-black hover:bg-gray-200"
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mb-[47px]">
                      <h2 className="text-xl font-bold mb-5"> ✅ الوصف</h2>
                      <p>
                        {PPublicDetails?.data.ar_description && (
                          <div
                            className="custom-html-content max-w-[800px] break-words"
                            dangerouslySetInnerHTML={{
                              __html: PPublicDetails.data.ar_description,
                            }}
                          />
                        )}
                      </p>
                    </div>
                    {/* ------ note ----------- */}
                    <div className="mb-[47px]">
                      <h2 className="text-xl font-bold mb-5"> ✅ ملاحظة</h2>
                      <p>{PPublicDetails?.data.ar_Note}</p>
                    </div>

                    {matchingId ? (
                      <div className="mb-[47px]">
                        <h2 className="text-xl font-bold mb-5">
                          ✅ التقرير المرتبط به
                        </h2>
                        <Link
                          to={`/report-details/${matchingId}`}
                          target="_blank"
                        >
                          {ar_Title}
                        </Link>
                      </div>
                    ) : null}
                    {/* <div className="w-full max-w-md mx-auto">
   

    
  </div> */}
                    <div dir="ltr" className="mb-[47px] bg-[#EEEEEE] py-5 px-3">
                      <button
                        onClick={toggleDiv}
                        className="flex items-center px-4 py-2 relative bg-white rounded hover:bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                      >
                        <span>{isOpen ? "إخفاء المراجع" : "عرض المراجع"}</span>
                        <span className="ml-2 transform transition-transform">
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="mt-4 p-4 rounded">
                          <p className="flex flex-wrap gap-2">
                            {PPublicDetails?.data.references.map(
                              (item, index) => (
                                <a
                                  key={index}
                                  href={`${item.link}`}
                                  target="_blank"
                                  className="border-[1px] border-black text-base rounded-3xl p-2 hover:bg-gray-100"
                                >
                                  {item.ar_title}
                                </a>
                              )
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="w-full border-t my-14"></div>

                    <div dir="ltr" className="mb-[47px]">
                      {PPublicDetails?.data.writers.map((item, index) => (
                        <div
                          className="border border-gray-300 rounded-lg p-4 mx-auto w-[100%] mb-2 flex items-center"
                          key={index}
                        >
                          <div className="flex-1 pr-4  ">
                            <p className="m-0 text-base text-end leading-6">
                              {item.ar_description}
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <img
                              src={item.image}
                              className="rounded-full object-cover mb-2"
                              width="60"
                              height="60"
                              alt={`Image of ${item.ar_fullName}`}
                            />
                            <span className="font-bold text-lg">
                              {item.ar_fullName}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {item.ar_role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className=" hidden md:block col-span-6 md:col-span-2 h-10">
                    {/* last news here */}
                    <div className="md:h-[70px] bg-[#D5AE78] rounded-lg flex items-center ps-4">
                      <h2 className="text-2xl font-bold">اقرأ أيضًا</h2>
                    </div>
                    <NewsList />
                  </div>
                </div>
              </main>
            </div>
            <MorePublish />
          </div>
          <footer className="min-h-[65vh] p-2 overflow-hidden relative bg-black mt-10">
            <Footer />
          </footer>
        </div>
      )}
    </>
  );
}
// {/* Article details */}
// <div className="flex justify-between items-center mb-4">
// <p className="text-gray-500">محمود الطاهري | أحمد سيف</p>
// <p className="text-gray-500">وقت القراءة: 00:08:40 | قبل 22 ساعة</p>
// </div>

// {/* Download & Language Option */}
// <div className="flex justify-between items-center mb-8">
// <button className="bg-yellow-500 text-white px-4 py-2 rounded">Read this in English</button>
// <button className="bg-yellow-500 text-white px-4 py-2 rounded">تحميل</button>
// </div>

// {/* Table of Contents */}
// <div className="bg-gray-100 p-4 mb-8 rounded-md">
// <h2 className="font-bold text-xl mb-4">فهرس المحتوى</h2>
// <ul className="list-disc list-inside text-gray-700">
//   <li>العنصر الأول</li>
//   <li>العنصر الثاني</li>
//   <li>العنصر الثالث</li>
//   <li>العنصر الرابع</li>
//   <li>العنصر الخامس</li>
// </ul>
// </div>

// {/* Report Text */}
// <section>
// <h2 className="font-bold text-xl mb-4">وصف التقرير</h2>
// <p className="text-gray-700 leading-relaxed mb-8">
//   النص هنا حول التقرير الذي قام بتوضيح التحديات على المستوى السياسي خلال فترة التصنيف في الدول العربية...
// </p>

// <h2 className="font-bold text-xl mb-4">ملخص التقرير</h2>
// <p className="text-gray-700 leading-relaxed mb-8">
//   النص هنا حول ملخص التقرير وعلاقته بالدور السياسي والاقتصادي...
// </p>

// <h2 className="font-bold text-xl mb-4">ملخص النتائج</h2>
// <p className="text-gray-700 leading-relaxed mb-8">
//   النص هنا حول ملخص النتائج وكيفية تطبيقها في المستقبل القريب...
// </p>
// </section>

// {/* Note Section */}
// <div className="bg-gray-200 p-4 rounded-md mb-8">
// <h2 className="font-bold text-xl mb-4">ملاحظة</h2>
// <p className="text-gray-700 leading-relaxed">
//   تم التنبيه إلى ضرورة الحذر في مسألة التصنيف...
// </p>
// </div>
// {/* Pagination Section */}
// <div className="flex justify-between items-center mt-8 max-w-7xl mx-auto">
// <button className="bg-gray-300 text-black px-4 py-2 rounded">العودة</button>
// <button className="bg-gray-300 text-black px-4 py-2 rounded">التالي</button>
// </div>
