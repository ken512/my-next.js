"use client";
import React from "react";
import { useEffect, useState } from "react";
import  Link  from "next/link";
import "@/app/_styles/globals.css"
import { MicroCmsPost} from "@/_types/MicroCmsPost";

// type ArticleType = {
//   id: number;
//   createdAt: string;
//   categories: string[];
//   title: string;
//   content: string;
// };

// type PostsType = {
//   posts: ArticleType[];
// };

const PostsList: React.FC = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };

    return date.toLocaleDateString("ja-JP", options);
  };

  const [posts, setPosts] = useState<MicroCmsPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // ローディング状態を追加

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://sample-next-app.microcms.io/api/v1/posts', {
            headers: {
              'X-MICROCMS-API-KEY': process.env
              .NEXT_PUBLIC_MICROCMS_API_KEY as string,
            }
          }
            );
        const data = (await response.json());

        setPosts(data.contents);
      } finally {
        setLoading(false); // データ取得が完了したらローディングを終了
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  return (
    <div>
      <header className="bg-neutral-800 flex justify-between py-6 px-7 h-15">
        <Link href="/" className="text-lg font-bold text-white no-underline">
          Blog
        </Link>
        <Link
          href="/inquiry"
          className="text-base font-bold text-white no-underline"
        >
          お問い合わせ
        </Link>
      </header>

      {
        posts.map((post:MicroCmsPost) => (
          <div
            key={post.id}
            className="my-8 m-80 px-6 py-3 text-[16px] border-solid border-[1.8px] border-base-700"
          >
            <ul>
              <li className="p-[10px]">
                <Link href={`/details/${post.id}`}>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-neutral-500">
                    {formatDate(post.createdAt)}
                  </div>
                  <div className="self-start text-right mx-10">
                    {post.categories.map((category) => (
                      <span
                        key={category.id}
                        className="m-[6px] p-[6px] text-[13px] border border-solid border-blue-600 rounded text-blue-600"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                  </div>
                  <div className="text-[25px]">{post.title}</div>
                  <div
                    className="mt-2 pt-2 overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                    }}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  ></div>
                </Link>
              </li>
            </ul>
          </div>
        ))}
    </div>
  );
};

export default PostsList;