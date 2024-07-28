"use client";
import React from "react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import "@/app/_styles/globals.css";

type InquiryType = {
  name: string;
  email: string;
  message: string;
};

type ErrorsType = {
  name?: string;
  email?: string;
  message?: string;
};

const InquiryPage: React.FC = () => {
  const [inquiryData, setInquiryData] = useState<InquiryType>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<ErrorsType>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setInquiryData((prevData) => ({ ...prevData, [id]: value }));
  };

  const validate = () => {
    const tempErrors: ErrorsType = {};
    if (!inquiryData.name) tempErrors.name = "お名前は必須です。";
    if (!inquiryData.email) tempErrors.email = "メールアドレスは必須です。";
    if (!inquiryData.message) tempErrors.message = "本文は必須です。";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inquiryData),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      alert("送信しました");
      setInquiryData({ name: "", email: "", message: "" });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setInquiryData({ name: "", email: "", message: "" });
  };
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

      <div className="w-[800px] mx-auto my-5 p-5">
        <h1 className="text-xl mb-5 font-bold ">問合わせフォーム</h1>
        <form id="myForm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>
              <dl>
                <dt className="float-left w-[120px] mt-4">
                  お名前
                </dt>
                <div className="flex flex-col mb-5">
                  <dd>
                    <input
                      type="text"
                      id="name"
                      maxLength={30 as number}
                      value={inquiryData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="h-15 float-left"
                    />
                  </dd>
                  {errors.name && <span>{errors.name}</span>}
                </div>
              </dl>
            </label>

            <div className="mb-4">
              <label>
                <dl>
                  <dt className="float-left w-[120px] mt-4 ">メールアドレス</dt>
                  <div className="flex flex-col">
                    <dd>
                      <input
                        type="text"
                        id="email"
                        value={inquiryData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="h-15 pl-5"
                      />
                    </dd>
                    {errors.email && <span>{errors.email}</span>}
                  </div>
                </dl>
              </label>
            </div>
            <div className="mb-4">
              <label>
                <dl>
                  <dt className="float-left w-[120px] mt-[120px]">本文</dt>
                  <div className="flex flex-col">
                    <dd>
                      <textarea
                        id="message"
                        maxLength={500 as number}
                        value={inquiryData.message}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        rows={10 as number}
                        className="w-full box-border border border-gray-300 rounded-lg mb-2.5 p-5"
                      />
                    </dd>
                    {errors.message && <span>{errors.message}</span>}
                  </div>
                </dl>
              </label>
            </div>
          </div>
          <div className="text-center mt-10">
            <input
              type="submit"
              value="送信"
              disabled={isSubmitting}
              className="border border-gray-300
                      rounded m-0 mx-2 p-2 px-4
                      text-base font-bold
                      bg-blue-800 text-white"
            />
            <input
              type="reset"
              value="クリア"
              onClick={handleClear}
              disabled={isSubmitting}
              className="border border-gray-300
                      rounded m-0 mx-2 p-2 px-4
                      text-base font-bold
                      bg-gray-300"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default InquiryPage;