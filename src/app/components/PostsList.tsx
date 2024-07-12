"use client";
import React from "react";
import { useEffect, useState } from "react";
import  Link  from "next/link";
import "@/app/styles/globals.css"

type ArticleType = {
  id: number;
  createdAt: string;
  categories: string[];
  title: string;
  content: string;
};

type PostsType = {
  posts: ArticleType[];
};

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

  const [posts, setPosts] = useState<PostsType>({ posts: [] });
  const [loading, setLoading] = useState<boolean>(true); // ローディング状態を追加

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts"
        );
        const data = (await response.json()) as PostsType;

        setPosts(data);
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

      {Array.isArray(posts.posts) &&
        posts.posts.map((article) => (
          <div
            key={article.id}
            className="my-8 m-80 px-6 py-3 text-[16px] border-solid border-[1.8px] border-base-700"
          >
            <ul>
              <li className="p-[10px]">
                <Link href={`/details/${article.id}`}>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-neutral-500">
                    {formatDate(article.createdAt)}
                  </div>
                  <div className="self-start text-right mx-10">
                    {article.categories.map((category, idx) => (
                      <span
                        key={idx}
                        className="m-[6px] p-[6px] text-[13px] border border-solid border-blue-600 rounded text-blue-600"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  </div>
                  <div className="text-[25px]">{article.title}</div>
                  <div
                    className="mt-2 pt-2 overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                    }}
                    dangerouslySetInnerHTML={{ __html: article.content }}
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
