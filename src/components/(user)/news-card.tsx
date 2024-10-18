import { CalendarMinus2Icon } from "lucide-react";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ar";
interface INews {
  id: number;
  ar_Title: string;
  en_Title: string;
  b_image: string;
  date_of_publish: Date;
  type: string;
}

export default function NewsCard({
  id,
  ar_Title,
  en_Title,
  b_image,
  date_of_publish,
  type,
}: INews) {
  dayjs.extend(relativeTime);
  dayjs.locale("ar");
  const getRelativeTime = (date: string | Date, language: string): string => {
    dayjs.locale(language);
    return dayjs().to(dayjs(date));
  };
  return (
    <div className="p-4 flex items-center">
      <div className="size-20  min-w-[80px] ">
        <img
          src={b_image} // Replace with actual image path
          alt="Report cover"
          className="w-full   object-cover h-full rounded-lg"
        />
      </div>
      <div className="overflow-hidden p-4">
        <h3>{ar_Title}</h3>
        <span className="flex font-normal text-sm gap-2 mt-2">
          <CalendarMinus2Icon size={19} />
          {` ${getRelativeTime(date_of_publish, "ar")}`}
        </span>
      </div>
    </div>
  );
}
