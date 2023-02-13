import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../configs/configurations";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import {
  AiOutlineHeart,
  AiOutlineComment,
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCloudUpload,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FaSort } from "react-icons/fa";
import {
  useToast,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Button,
  Flex,
  Input,
  Image,
  InputGroup,
  InputLeftAddon,
  Box,
  InputRightElement,
  Text,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Popover,
  PopoverHeader,
  Badge,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { BsPen, BsThreeDotsVertical } from "react-icons/bs";

const useAdmin = (second) => {
  const [data, setData] = useState("");
  const [warn, setWarn] = useState("");
  const [noPost, setNoPost] = useState("");
  const [profile, setProfile] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [sortState, setSortState] = useState("");
  const inputFile = useRef(null);
  let toast = useToast();
  let toastRef = useRef();

  const deletePost = async (id) => {
    try {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to see the post anymore!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        console.log(willDelete);
        if (willDelete) {
          await deleteComment(id);
          await deleteTag(id);
          const { data, error } = await supabase
            .from("blog")
            .delete()
            .match({ id: id });
          console.log(error);

          if (error) {
            swal("Failed delete post", {
              icon: "warning",
            });
          } else if (data) {
            swal("Success delete data", {
              icon: "success",
            });
          }
          getData();
        } else {
          return;
        }
      });
    } catch (error) {
      swal("Something is error. Please try again", {
        icon: "warning",
      });
    }
  };

  const deleteComment = async (id) => {
    try {
      const { data, error } = await supabase
        .from("blog_comments")
        .delete()
        .match({ articleId: id });
      if (error) {
        swal("Failed to delete post comment", {
          icon: "warning",
        });
      }
    } catch (error) {
      swal("Something is error. Please try again", {
        icon: "warning",
      });
    }
  };

  const deleteTag = async (id) => {
    try {
      const { data, error } = await supabase
        .from("blog_postTag")
        .delete()
        .match({ post_id: id });
      if (error) {
        swal("Failed to delete post tag", {
          icon: "warning",
        });
      }
    } catch (error) {
      swal("Something is error. Please try again", {
        icon: "warning",
      });
    }
  };

  const getData = async () => {
    const user = supabase.auth.user();
    const { data, error } = await supabase
      .from("blog")
      .select(`*,blog_comments(*),blog_tags(*)`)
      .eq("email", user.email)
      .order("title", { ascending: true });
    // console.log(data)
    if (data == "") {
      setNoPost("Make a post and it will appear here.");
    }
    setData(data);
  };

  const handleSorting = async (sort) => {
    const user = supabase.auth.user();
    if (sort === "az") {
      setSortState("az");
      let result = await supabase
        .from("blog")
        .select(`*, blog_comments(*)`)
        .eq("email", user.email)
        .order("title", { ascending: true });
      console.log(result);
      setData(result.data);
    } else if (sort === "za") {
      setSortState("za");
      let result = await supabase
        .from("blog")
        .select(`*, blog_comments(*)`)
        .eq("email", user.email)
        .order("title", { ascending: false });
      console.log(result);
      setData(result.data);
    } else if (sort === "draft") {
      setSortState("draft");
      let result = await supabase
        .from("blog")
        .select(`*, blog_comments(*)`)
        .eq("email", user.email)
        .order("isDraft", { ascending: false });
      console.log(result);
      setData(result.data);
    }
  };

  const getProfile = async () => {
    const userEmail = supabase.auth.user().email;
    const { data, error } = await supabase
      .from("blog_users")
      .select("*")
      .eq("email", userEmail);
    setProfile(data[0]);
    getProfilePicture();
  };

  const getProfilePicture = async () => {
    setProfilePic("");
    let userId = supabase.auth.user().id;
    let path = `profilePic/${userId}`;
    let { data, error } = await supabase.storage.from("blog").download(path);
    // console.log(data)

    let tess = await await supabase.storage.from("blog").getPublicUrl();
    console.log("nehh", tess);

    if (data) {
      let image = URL.createObjectURL(data);
      // console.log(image)
      setProfilePic(image);
    }
  };

  const updateProfile = async (which, value) => {
    if (!toastRef.current) {
      toastRef.current = toast({ description: "Loading...", status: "info" });
    }

    if (which === "bio") {
      let { data, error } = await supabase
        .from("blog_users")
        .update({ bio: value })
        .eq("id", supabase.auth.user().id);

      if (data) {
        toast.update(toastRef.current, {
          description: "Success update bio",
          status: "success",
          isClosable: true,
        });
      } else if (error) {
        toast({
          description: "Failed update bio, please try again.",
          status: "error",
          isClosable: true,
        });
      }
    } else if (which === "username") {
      if (value.toLowerCase() == profile.nickname) {
        return null;
      } else if (value.toLowerCase() === "") {
        toast({
          description: "Username cannot be blank.",
          status: "error",
          isClosable: true,
        });
      } else {
        let check = await supabase
          .from("blog_users")
          .select()
          .eq("nickname", value.toLowerCase());

        if (check.data.length) {
          toast({
            description: "Username has been taken.",
            status: "error",
            isClosable: true,
          });
        } else {
          let { data, error } = await supabase
            .from("blog_users")
            .update({ nickname: value.toLowerCase() })
            .eq("id", supabase.auth.user().id);

          if (data) {
            if (toastRef.current) {
              toast.update(toastRef.current, {
                description: "Success update username",
                status: "success",
                isClosable: true,
              });
            } else {
              toast({
                description: "Success update username",
                status: "success",
                isClosable: true,
              });
            }
          } else if (error) {
            toast({
              description: "Failed to update, please try again.",
              status: "error",
              isClosable: true,
            });
          }
        }
      }
    }
  };

  const handleFileUpload = async (e) => {
    toastRef.current = toast({ description: "Loading...", status: "info" });
    const { files } = e.target;
    const userId = supabase.auth.user().id;

    if (files && files.length) {
      console.log(files[0]);
      // alert("update")
      const { data, error } = await supabase.storage
        .from("blog")
        .upload(`profilePic/${userId}`, files[0], {
          upsert: true,
          contentType: "image/png",
        });
      console.log(data);
      console.log(error);
      if (data) {
        toastRef.current = toast({
          description: "Success upload photo",
          status: "success",
        });
        getProfile();
      } else {
        error &&
          toast({
            description: "Failed upload photo. Please try again",
            status: "warning",
          });
      }
    }
  };

  const unpublishPost = async (data) => {
    swal({
      title: "Confirmation",
      text: `Are you sure want to unpublish ${data.title}?`,
      buttons: true,
      icon: "warning",
    }).then(async (result) => {
      console.log(result);
      if (result) {
        let unpublish = await supabase
          .from("blog")
          .update({ isDraft: "true" })
          .eq("id", data.id);
        console.log(unpublish);
        unpublish.data &&
          toast({ description: "Post unpublished", status: "success" });
        getData();
      } else {
        return;
      }
    });
  };

  const PostTab = () => {
    return (
      <div>
        <div
          className="admin"
          style={{ flexDirection: "column", width: "100%" }}
        >
          <Box pb="20px" w={["100%", "95%", "95%", "95%"]}>
            <div
              className="admin"
              style={{ justifyContent: "space-between", paddingTop: "20px" }}
            >
              <div>Your posts</div>
              <div>
                <Menu>
                  <MenuButton
                    p="10px"
                    backgroundColor="#1c3857"
                    _active={{ backgroundColor: "#1c3857" }}
                    outline="none"
                    _hover={{ backgroundColor: "#152b43" }}
                    as={Button}
                    leftIcon={<FaSort />}
                  >
                    {sortState === "az"
                      ? "A - Z"
                      : sortState === "za"
                      ? "Z - A"
                      : sortState === "draft"
                      ? "Draft"
                      : "Sort"}
                  </MenuButton>
                  <MenuList bg="#0D1B2A">
                    <MenuItem
                      _focus={{ backgroundColor: "#152b43" }}
                      onClick={() => handleSorting("az")}
                    >
                      A - Z
                    </MenuItem>
                    <MenuItem
                      _focus={{ backgroundColor: "#152b43" }}
                      onClick={() => handleSorting("za")}
                    >
                      Z - A
                    </MenuItem>
                    <MenuItem
                      _focus={{ backgroundColor: "#152b43" }}
                      onClick={() => handleSorting("draft")}
                    >
                      Draft first
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </div>
            {data.map((res) => (
              <Flex
                key={res.id}
                pt="12px"
                pb="12px"
                justifyContent="space-between"
                align="center"
                borderBottom="0.1px #535353 solid"
              >
                <Box w="90%">
                  {res.isDraft == "true" ? (
                    <Box fontSize="1.2em" mb="3px" w={"fit-content"}>
                      {res.title}
                      <Badge ml="10px" colorScheme="green">
                        Draft
                      </Badge>
                    </Box>
                  ) : (
                    <Box fontSize="1.2em" mb="3px" w={"fit-content"}>
                      <Link
                        style={{ textDecoration: "none", color: "white" }}
                        to={{
                          pathname: `/article/${res.title}`,
                          query: { res },
                        }}
                      >
                        {res.title}
                      </Link>
                    </Box>
                  )}
                  <Box fontSize="0.6em" color="#a1a1a1" mb="10px">
                    {res.date}
                  </Box>
                  {res.isDraft !== "true" && (
                    <div
                      style={{
                        display: "flex",
                        maxWidth: "20%",
                        justifyContent: "flex-start",
                        marginTop: "5px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: "fit-content",
                          marginRight: "20px",
                          alignItems: "center",
                          justifyContent: "space-evenly",
                        }}
                      >
                        {/* <i className="far fa-eye" style={{ marginRight: '10px' }} data-toggle="tooltip" title="Views"></i> */}
                        <AiOutlineEye style={{ marginRight: "10px" }} />
                        {res.pageViews ? res.pageViews : "0"}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: "fit-content",
                          marginRight: "20px",
                          alignItems: "center",
                          justifyContent: "space-evenly",
                        }}
                      >
                        {/* <i className="far fa-heart" style={{ marginRight: '10px' }} data-toggle="tooltip" title="Likes"></i> */}
                        <AiOutlineHeart style={{ marginRight: "10px" }} />
                        {res.likes ? res.likes : "0"}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: "fit-content",
                          marginRight: "20px",
                          alignItems: "center",
                          justifyContent: "space-evenly",
                        }}
                      >
                        {/* <i className="far fa-comment-dots" style={{ marginRight: '10px' }} data-toggle="tooltip" title="Comments"></i> */}
                        <AiOutlineComment style={{ marginRight: "10px" }} />
                        {res.blog_comments.length
                          ? res.blog_comments.length
                          : "0"}
                      </div>
                    </div>
                  )}
                </Box>
                {res.isDraft == "true" ? (
                  <>
                    <Flex
                      display={["none", "none", "flex", "flex"]}
                      alignItems="center"
                      justifyContent="space-evenly"
                      w="18%"
                    >
                      <Link to={{ pathname: "/edit", query: { res } }}>
                        <Button colorScheme="green" fontWeight="normal">
                          Continue
                        </Button>
                      </Link>
                      <Box
                        onClick={() => deletePost(res.id)}
                        cursor="pointer"
                        color="#dc3545"
                        data-toggle="tooltip"
                        title="Delete"
                      >
                        <AiOutlineDelete size="1.3em" />
                      </Box>
                    </Flex>
                    <Box display={["block", "block", "none", "none"]}>
                      <Menu>
                        <MenuButton>
                          <BsThreeDotsVertical />
                        </MenuButton>
                        <MenuList bg="#0D1B2A">
                          <Link
                            to={{ pathname: "/edit", query: { res } }}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <MenuItem _focus={{ backgroundColor: "#152b43" }}>
                              {/* <Button colorScheme="green" fontWeight="normal" leftIcon={<BsPen />}>Continue</Button> */}
                              <BsPen style={{ marginRight: "10px" }} />
                              Continue
                            </MenuItem>
                          </Link>
                          <MenuItem
                            _focus={{ backgroundColor: "#152b43" }}
                            onClick={() => deletePost(res.id)}
                          >
                            <Flex
                              cursor="pointer"
                              data-toggle="tooltip"
                              title="Delete"
                            >
                              <AiOutlineDelete
                                size="1.3em"
                                color="#dc3545"
                                style={{ marginRight: "10px" }}
                              />{" "}
                              Delete
                            </Flex>
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Box>
                  </>
                ) : (
                  <>
                    <Flex
                      display={["none", "none", "flex", "flex"]}
                      alignItems="center"
                      justifyContent="space-evenly"
                      w="14%"
                    >
                      <AiOutlineEyeInvisible
                        data-toggle="tooltip"
                        title="Unpublish"
                        cursor="pointer"
                        onClick={() => unpublishPost(res)}
                      />
                      <Box cursor="pointer">
                        <Link
                          to={{ pathname: "/edit", query: { res } }}
                          style={{ color: "white" }}
                          data-toggle="tooltip"
                          title="Edit"
                        >
                          <AiOutlineEdit size="1.3em" />
                        </Link>
                      </Box>
                      <Box
                        cursor="pointer"
                        color="#dc3545"
                        onClick={() => deletePost(res.id)}
                        data-toggle="tooltip"
                        title="Delete"
                      >
                        <AiOutlineDelete size="1.3em" />
                      </Box>
                    </Flex>
                    <Box display={["block", "block", "none", "none"]}>
                      <Menu>
                        <MenuButton>
                          <BsThreeDotsVertical />
                        </MenuButton>
                        <MenuList bg="#0D1B2A">
                          <MenuItem
                            _focus={{ backgroundColor: "#152b43" }}
                            display="flex"
                            onClick={() => unpublishPost(res)}
                          >
                            <AiOutlineEyeInvisible
                              style={{ marginRight: "10px" }}
                              data-toggle="tooltip"
                              title="Unpublish"
                              cursor="pointer"
                            />
                            Unpublish
                          </MenuItem>
                          <Box cursor="pointer">
                            <Link
                              to={{ pathname: "/edit", query: { res } }}
                              style={{ color: "white", display: "flex" }}
                              data-toggle="tooltip"
                              title="Edit"
                            >
                              <MenuItem _focus={{ backgroundColor: "#152b43" }}>
                                <AiOutlineEdit
                                  style={{ marginRight: "10px" }}
                                  size="1.3em"
                                />{" "}
                                Edit
                              </MenuItem>
                            </Link>
                          </Box>
                          <MenuItem
                            _focus={{ backgroundColor: "#152b43" }}
                            onClick={() => deletePost(res.id)}
                          >
                            <Box
                              display="flex"
                              cursor="pointer"
                              color="#dc3545"
                              data-toggle="tooltip"
                              title="Delete"
                            >
                              <AiOutlineDelete
                                style={{ marginRight: "10px" }}
                                size="1.3em"
                              />{" "}
                              Delete
                            </Box>
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Box>
                  </>
                )}
              </Flex>
            ))}
          </Box>
        </div>
      </div>
    );
  };

  const ProfileTab = () => {
    return (
      <Flex justifyContent="center">
        <Flex
          color="white"
          h="75vh"
          alignItems="center"
          justifyContent="center"
          w="90%"
        >
          <Flex
            direction={["column", "column", "row", "row"]}
            alignItems="center"
            justifyContent="space-evenly"
            h="100%"
            w="95%"
          >
            <Flex
              h={["30%", "40%", "50%", "100%"]}
              alignItems="center"
              justify="center"
              direction="column"
            >
              <Box>
                <Image
                  mb="10px"
                  borderRadius="full"
                  boxSize={["120px", "140px", "160px", "180px"]}
                  src={
                    profilePic
                      ? profilePic
                      : `https://ui-avatars.com/api/?name=${
                          supabase.auth.user().email
                        }&length=1`
                  }
                  onError={() => setProfilePic("")}
                ></Image>
              </Box>
              <Box>
                <Button
                  onClick={() => inputFile.current.click()}
                  m="4px"
                  p="12px"
                  fontWeight="normal"
                  colorScheme="blackAlpha"
                  rightIcon={<AiOutlineCloudUpload size="20px" />}
                >
                  Upload photo
                </Button>
                {/* <Button onClick={() => deletePhoto()} m="4px" p="12px" fontWeight="normal" colorScheme="blackAlpha" rightIcon={<AiOutlineDelete size="20px" />}>
                                    Delete
                                </Button> */}
              </Box>
              <input
                onChange={handleFileUpload}
                type="file"
                style={{ display: "none" }}
                ref={inputFile}
              ></input>
            </Flex>
            <Flex
              h={["50%", "50%", "50%", "50%"]}
              w={["100%", "100%", "70%", "50%"]}
              alignItems="center"
              justifyContent="space-between"
              direction="column"
            >
              <Popover boundary="scrollParent" placement="top-start">
                <PopoverTrigger>
                  <InputGroup mb={"10px"}>
                    <InputLeftAddon
                      bg="none"
                      children="Email"
                      fontSize={14}
                      color="grey"
                    />
                    <Input
                      variant="outline"
                      value={supabase.auth.user().email}
                      readOnly
                    ></Input>
                  </InputGroup>
                </PopoverTrigger>
                <PopoverContent
                  borderRadius={10}
                  bg="blackAlpha.700"
                  border="none"
                >
                  <PopoverHeader fontWeight="bold">Information!</PopoverHeader>
                  <PopoverBody>
                    Currently changing email is not supported yet :(
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <InputGroup mb={"10px"}>
                <InputLeftAddon
                  bg="none"
                  children="Bio"
                  fontSize={14}
                  color="grey"
                />
                <Input
                  autoFocus
                  variant="outline"
                  placeholder="Bio"
                  defaultValue={profile.bio ? profile.bio : ""}
                  onChange={(e) => updateProfile("bio", e.target.value)}
                ></Input>
                <InputRightElement
                  onClick={() => updateProfile("bio")}
                  display={bio ? null : "none"}
                  children={<CheckIcon />}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftAddon
                  bg="none"
                  children="Username"
                  fontSize={14}
                  color="grey"
                />
                <Input
                  autoFocus
                  textTransform="lowercase"
                  variant="outline"
                  placeholder="Username"
                  defaultValue={profile.nickname ? profile.nickname : ""}
                  onChange={(e) => updateProfile("username", e.target.value)}
                ></Input>
                <InputRightElement
                  onClick={() => updateProfile("username")}
                  display={username ? null : "none"}
                  children={<CheckIcon />}
                />
              </InputGroup>
              <Text fontSize="sm" fontStyle="italic" textAlign="left" w="100%">
                *This username will appear in your blog post, profile page.
                Username must be unique.
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  };

  useEffect(() => {
    document.title = `Profile`;
    setUsername("");
    setBio("");
    setData("");
    setSortState("");
    setProfile("");
    setProfilePic("");
    setNoPost("");
    if (supabase.auth.session() !== null) {
      getData();
      getProfile();
    }
  }, []);

  return { data, noPost, PostTab, ProfileTab };
};
export default useAdmin;
