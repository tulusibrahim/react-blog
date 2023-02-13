import { useEffect, useState } from "react";
import { supabase } from "../configs/configurations";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import moment from "moment";
import { useToast, useDisclosure } from "@chakra-ui/react";

const useEditPost = (props) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  let history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tag, setTag] = useState("");
  const [alltag, setAllTag] = useState([]);
  const [savedId, setSavedId] = useState("");
  const [selectedImg, setSelectedImg] = useState({});
  const [valueDebounceBody] = useDebounce(body, 1000);
  const [valueDebounceTitle] = useDebounce(title, 1000);
  const [valueDebounceImg] = useDebounce(selectedImg, 1000);
  const [saveStatus, setSaveStatus] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [image, setImage] = useState([]);
  let toast = useToast();

  const getData = async (id) => {
    let result = await supabase
      .from("blog")
      .select("*,blog_tags(*)")
      .eq("id", id);
    console.log(result);
    setBody(result.data[0].body);
    setTitle(result.data[0].title);
    if (result.data[0].coverImage !== null)
      setSelectedImg(JSON.parse(result.data[0].coverImage));
    // let parsedArray = result.data[0].blog_tags.map(res => res.name)
    setAllTag(result.data[0].blog_tags);
  };

  const saveDataOnChange = async () => {
    setSaveStatus("Saving...");
    const update = await supabase
      .from("blog")
      .update({
        title: title ? title : props.location.query.res.title,
        body: body ? body : props.location.query.res.body,
        coverImage: selectedImg
          ? selectedImg
          : props.location.query.res.selectedImg,
      })
      .eq("id", savedId);
    console.log(update);
    if (update.error !== null) {
      toast({
        description: "Failed to update, try later",
        status: "warning",
        isClosable: true,
      });
      setSaveStatus("Failed");
    } else {
      setSaveStatus("Saved");
    }
  };

  const postDataFinal = async () => {
    let result = await supabase
      .from("blog")
      .update({
        title: title ? title : props.location.query.res.title,
        body: body ? body : props.location.query.res.body,
        coverImage: selectedImg
          ? selectedImg
          : props.location.query.res.selectedImg,
        isDraft: "false",
      })
      .eq("id", savedId);
    // console.log(result)
    if (result.error) {
      toast({
        description: "Failed to post, please try again",
        status: "error",
      });
    } else {
      toast({ description: "Post published successfully", status: "success" });
      history.push("/profile");
    }
  };

  const checkTag = async (data) => {
    let parsedWord = data.target.value.replaceAll(" ", "").toLowerCase();

    if (parsedWord == "") {
      toast({
        description: "Please input tag name",
        status: "info",
        isClosable: true,
      });
    } else if (parsedWord) {
      setTag("");
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
    let deleteTag = await supabase
      .from("blog_postTag")
      .delete()
      .match({ post_id: props.location.query.res.id, tag_id: data.id });
    let result = await supabase
      .from("blog")
      .select("*,blog_tags(*)")
      .eq("id", props.location.query.res.id);
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

  useEffect(() => {
    document.title = `Edit - ${props.location.query.res.title}`;
    setSavedId(props.location.query.res.id);
    getData(props.location.query.res.id);
  }, []);

  useEffect(() => {
    if (valueDebounceBody || valueDebounceTitle || valueDebounceImg) {
      saveDataOnChange();
    }
  }, [valueDebounceBody, valueDebounceTitle, valueDebounceImg]);
  //backgroundColor: '#12253a',

  return {
    title,
    body,
    isOpen,
    onOpen,
    setSelectedImg,
    selectedImg,
    onClose,
    tag,
    saveStatus,
    image,
    postDataFinal,
    checkTag,
    removeOneTag,
    setTitle,
    setTag,
    setBody,
    searchImage,
    setImageTitle,
    alltag,
  };
};
export default useEditPost;
