import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { supabase, uuidv4 } from "../configs/configurations";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";
import swal from "sweetalert";
import { useToast, useDisclosure } from "@chakra-ui/react";

const useNewBlog = (second) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedImg, setSelectedImg] = useState({});
  const [tag, setTag] = useState("");
  const [alltag, setAllTag] = useState([]);
  const [upload, setUpload] = useState(false);
  let history = useHistory();
  const [image, setImage] = useState([]);
  let toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [valueDebounceBody] = useDebounce(body, 1000);
  const [valueDebounceTitle] = useDebounce(title, 1000);
  const [valueDebounceImg] = useDebounce(selectedImg, 1000);
  const [imageTitle, setImageTitle] = useState("");
  const [savedId, setSavedId] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const postDataOnChange = async (e) => {
    // e.preventDefault()
    setSaveStatus("Saving...");
    const user = supabase.auth.user();
    if (!savedId) {
      const { data, error } = await supabase.from("blog").insert([
        {
          id: uuidv4(),
          title: title ? title : "Untitled",
          body: body ? body : "",
          authorUserId: supabase.auth.user().id,
          email: user.email,
          date: moment().format("DD MMMM YYYY"),
          coverImage: selectedImg ? selectedImg : {},
          isDraft: true,
        },
      ]);
      console.log(data);
      setSavedId(data[0].id);
      setSaveStatus("Saved");
      if (error) {
        console.log(error);
        toast({
          description: "Failed to update, try later",
          status: "warning",
          isClosable: true,
        });
      }
      // onOpen()
      // else {
      //     history.push('/')
      // }
    } else {
      // onOpen()/
      console.log("ada saved id");
      setSaveStatus("Saving...");
      const update = await supabase.from("blog").upsert({
        id: savedId,
        title: title ? title : "Untitled",
        body: body ? body : "",
        authorUserId: supabase.auth.user().id,
        email: user.email,
        date: moment().format("DD MMMM YYYY"),
        coverImage: selectedImg ? selectedImg : {},
        isDraft: true,
      });
      console.log(update);
      setSaveStatus("Saved");
      update.error &&
        toast({
          description: "Failed to update, try later",
          status: "warning",
          isClosable: true,
        });
    }
  };

  const postDataFinal = async () => {
    swal({
      title: "Confirmation",
      text: "Sure want to publish it now?",
      icon: "warning",
      buttons: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        let result = await supabase
          .from("blog")
          .update({ isDraft: "false" })
          .eq("id", savedId);
        console.log(result);
        if (result.error) {
          toast({
            description: "Failed to publish, please try again.",
            status: "error",
          });
        } else {
          toast({
            description: "Post published successfully.",
            status: "success",
          });
          history.push("/");
        }
      }
    });
  };

  const checkTag = async (data) => {
    let parsedWord = data.target.value.replaceAll(" ", "").toLowerCase();
    console.log(parsedWord);
    if (parsedWord == "") {
      toast({
        description: "Please input tag name",
        status: "info",
        isClosable: true,
      });
    } else if (parsedWord) {
      setTag("");
      console.log(parsedWord);
      const result = await supabase
        .from("blog_tags")
        .select("*")
        .eq("name", `#${parsedWord}`);

      if (result.data.length) {
        // console.log('udh ada tag')
        const insertTag = await supabase
          .from("blog_postTag")
          .select("*")
          .match({ post_id: savedId, tag_id: result.data[0].id });
        // console.log(insertTag)
        if (insertTag.data.length == 0) {
          let postTag = await supabase
            .from("blog_postTag")
            .insert([{ post_id: savedId, tag_id: result.data[0].id }]);
          alltag
            ? setAllTag((oldTag) => [...oldTag, { name: `#${parsedWord}` }])
            : setAllTag({ name: `#${parsedWord}` });
        } else {
          toast({
            description: "Tag already exist",
            status: "warning",
            isClosable: true,
          });
        }
      } else {
        // console.log('blm ada tag')
        let postTag = await supabase
          .from("blog_tags")
          .insert({ name: `#${parsedWord}` });
        // console.log(postTag)
        postTag.error &&
          toast({ description: "Failed to add tag", status: "error" });

        const insertTag = await supabase
          .from("blog_postTag")
          .select("*")
          .match({ post_id: savedId, tag_id: postTag.data[0].id });
        // console.log(insertTag)
        if (insertTag.data.length == 0) {
          let insertTag = await supabase
            .from("blog_postTag")
            .insert([{ post_id: savedId, tag_id: postTag.data[0].id }]);
          alltag
            ? setAllTag((oldTag) => [...oldTag, { name: `#${parsedWord}` }])
            : setAllTag({ name: `#${parsedWord}` });
        } else {
          toast({
            description: "Tag already exist",
            status: "warning",
            isClosable: true,
          });
        }
      }
    }
  };

  const removeOneTag = async (data) => {
    let getTagId = await supabase
      .from("blog_tags")
      .select()
      .eq("name", data.name);
    console.log(getTagId);
    let deleteTag = await supabase
      .from("blog_postTag")
      .delete()
      .match({ post_id: savedId, tag_id: getTagId.data[0].id });
    console.log(deleteTag);
    let result = await supabase
      .from("blog")
      .select("*,blog_tags(*)")
      .eq("id", savedId);
    console.log(result);
    setAllTag(result.data[0].blog_tags);
  };

  const searchImage = async (e) => {
    e.preventDefault();
    let key = process.env.REACT_APP_VERCEL_PIXABAYKEY;
    let data = await fetch(
      `https://pixabay.com/api/?key=${key}&q=${imageTitle}&per_page=15`
    );
    let json = await data.json();
    console.log(json);
    setImage(json.hits);
  };
  //bug gabisa delete tag pas bikin new blog

  // window.onpopstate = () =>
  //     history.location.pathname == '/new' &&

  useEffect(() => {
    if (valueDebounceBody || valueDebounceTitle || valueDebounceImg) {
      postDataOnChange();
    }
  }, [valueDebounceBody, valueDebounceTitle, valueDebounceImg]);

  useEffect(() => {
    document.title = "New Blog";
    setSaveStatus();
    setUpload(false);
  }, []);
  //backgroundColor: '#112236',
  //editor js candidate replace medium editor

  return {
    body,
    alltag,
    title,
    saveStatus,
    tag,
    onClose,
    isOpen,
    image,
    setSelectedImg,
    searchImage,
    setImageTitle,
    selectedImg,
    setBody,
    setTitle,
    removeOneTag,
    checkTag,
    setTag,
    postDataFinal,
  };
};

export default useNewBlog;
