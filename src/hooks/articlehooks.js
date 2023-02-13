import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { supabase, uuidv4 } from "../configs/configurations";
import moment from "moment";
import swal from "sweetalert";

const useArticle = (second) => {
  const { title } = useParams();
  const [data, setData] = useState([]);
  const [coverImg, setCoverImg] = useState({});
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const [inputComment, setInputComments] = useState("");
  const [session, setSession] = useState(false);
  const [profilePic, setProfilePic] = useState("");

  const getData = async () => {
    const { data, error } = await supabase
      .from("blog")
      .select(
        `
                *,
                blog_comments(*),
                blog_users(*),
                blog_tags(*)
            `
      )
      .match({ title: title, isDraft: "false" });
    console.log(data);
    setData(data);
    setComments(data[0].blog_comments);
    if (data[0].coverImage !== null)
      setCoverImg(JSON.parse(data[0].coverImage));
    setTags(data[0].blog_tags);

    if (data[0].blog_users) {
      getProfilePic(data[0].blog_users.id);
    }

    if (supabase.auth.session() == null) {
      updatePageViews(data[0].pageViews);
    } else if (supabase.auth.session().user.email !== data[0].email) {
      updatePageViews(data[0].pageViews);
    }
  };

  const getProfilePic = async (id) => {
    console.log(id);
    let profilePic = await supabase.storage
      .from("blog")
      .download(`profilePic/${id}`);
    if (profilePic.data) {
      let image = URL.createObjectURL(profilePic.data);
      setProfilePic(image);
    }
  };

  const getCommentData = async () => {
    // console.log(data[0].id)
    const { data, error } = await supabase
      .from("blog")
      .select(
        `
                *,
                blog_comments(
                    *
                )
            `
      )
      .eq("title", title);

    setComments(data[0].blog_comments);
  };

  const postComment = async (e) => {
    e.preventDefault();
    e.target.reset();
    setInputComments("");
    const { dataa, error } = await supabase.from("blog_comments").insert([
      {
        id: uuidv4(),
        articleId: data[0].id,
        author: supabase.auth.user().email,
        comment: inputComment,
        time: moment().format("DD MMMM YYYY"),
      },
    ]);
    getCommentData();
  };

  const addLikes = async () => {
    const { data: dataLikes, error } = await supabase
      .from("blog")
      .select("likes")
      .eq("title", title);

    if (data[0].likes == null) {
      const { data, error } = await supabase
        .from("blog")
        .update({ likes: 1 })
        .eq("title", title);
      if (error) {
        swal("Failed to like", {
          icon: "warning",
        });
      }
    } else {
      const { data, error } = await supabase
        .from("blog")
        .update({ likes: dataLikes[0].likes + 1 })
        .eq("title", title);
      if (error) {
        swal("Failed to like", {
          icon: "warning",
        });
      }
    }
    getData();
  };

  const updatePageViews = async (dataViews) => {
    console.log(dataViews);
    const { data, error } = await supabase
      .from("blog")
      .update({ pageViews: dataViews + 1 })
      .eq("title", title);
  };

  useEffect(() => {
    setSession(false);
    // setComments([])
    setData([]);
    getData();
    setInputComments("");
    // setProfilePic('')
    setSession(supabase.auth.session());
    // document.title = title
  }, []);

  return {
    data,
    comments,
    tags,
    profilePic,
    session,
    title,
    coverImg,
    addLikes,
    postComment,
    setInputComments,
  };
};
export default useArticle;
