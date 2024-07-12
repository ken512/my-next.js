"use client";
import DetailsPage from "@/app/components/DetailsPage";
import { useParams } from "next/navigation";

const DetailsArticle = () => {
  const {id} = useParams();
  
  if(!id) {
    return <div>Loading...</div>
  }
  return <DetailsPage id={id} />
};

export default DetailsArticle; 