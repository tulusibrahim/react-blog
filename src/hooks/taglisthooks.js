import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "../configs/configurations";

const useTagList = (second) => {
  const [dataTag, setDataTag] = useState([]);
  let toast = useToast();

  const getDataTag = async () => {
    let result = await supabase
      .from("blog_tags")
      .select("*, blog(*)", { count: "planned" });
    let filter = result.data.filter((i) => i.blog.length > 0);
    console.log(result);
    result.error
      ? toast({ description: "Failed to get data", status: "error" })
      : setDataTag([...filter]);
  };

  useEffect(() => {
    getDataTag();
  }, []);

  return { dataTag };
};

export default useTagList;
