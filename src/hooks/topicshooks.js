import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../configs/configurations";

const useTopic = (second) => {
  let param = useParams();
  const [data, setData] = useState([]);

  const getData = async () => {
    let result = await supabase
      .from("blog_tags")
      .select("*,blog(*)")
      .eq("name", `#${param.topic}`);
    let removeDuplicateValue = Object.values(
      result.data[0].blog.reduce(
        (acc, current) => Object.assign(acc, { [current.id]: current }),
        {}
      )
    );
    setData(removeDuplicateValue);
  };

  useEffect(() => {
    getData();
    document.title = `Topic - ${param.topic.replace("#", "")}`;
  }, []);

  return { data, param };
};
export default useTopic;
