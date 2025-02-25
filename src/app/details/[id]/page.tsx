"use client";
import React from "react";
import { useEffect, useState } from "react";
import {useParams} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MicroCmsPost } from "@/_types/MicroCmsPost";
import "@/app/_styles/globals.css";

// type detailsType = {
//   id: number;
//   createdAt: string;
//   thumbnailUrl: any;
//   categories: string[];
//   title: string;
//   content: string;
// }; 

// type ApiResponse = {
//   post: detailsType;
// };

interface DetailsPageProps {
  id: string | string[];
}

const DetailsPage: React.FC<DetailsPageProps> = () => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    return date.toLocaleDateString("ja-JP", options);
  };
  const {id} = useParams();
  const [detailsData, setDetailsData] = useState<MicroCmsPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // ローディング状態を追加

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://sample-next-app.microcms.io/api/v1/posts/${id}`,
          {
            headers: {
              'X-MICROCMS-API-KEY': process.env
              .NEXT_PUBLIC_MICROCMS_API_KEY as string,
            }
          }
        );
        const result = (await response.json());

        setDetailsData(result);
      } finally {
        setLoading(false); // データ取得が完了したらローディングを終了
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  if (!detailsData) return <div>投稿が見つかりません</div>;

  return (
    <div>
      <header className="bg-neutral-800 flex justify-between py-6 px-7 h-15">
        <Link href="/" className="text-lg font-bold text-white no-underline">
          Blog
        </Link>
        <Link
          href="/inquiry"
          className="text-lg font-bold text-white no-underline"
        >
          お問い合わせ
        </Link>
      </header>

      <div
        style={{ border: "none" }}
        className="my-10 m-80 px-6 py-3 border-solid border-[13px] border-base-700"
      >
        <ul>
          <li key={detailsData.id}>
            <div className="img w-[800px] h-[400px] relative">
              <Image
                src={detailsData.thumbnailUrl.url}
                alt="img"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="pt-5 flex items-center justify-between">
            <div className="text-xs border-gray-400">
              {formatDate(detailsData.createdAt)}
            </div>
            <div className="self-start text-right mx-10">
              {detailsData.categories.map((category) => (
                <span
                  key={category.id}
                  className="m-[6px] p-[6px] text-[13px] border border-solid border-blue-600 rounded text-blue-600"
                >
                  {category.name}
                </span>
              ))}
            </div>
            </div>
            <div className="text-[25px] mt-2">{detailsData.title}</div>
            <div
              className="block mt-2 text-[16px]"
              dangerouslySetInnerHTML={{ __html: detailsData.content }}
            ></div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DetailsPage;