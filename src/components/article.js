import { useEffect } from "react";
import { supabase } from "../configs/configurations";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import {
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  Text,
} from "@chakra-ui/react";
import useArticle from "../hooks/articlehooks";

const Article = () => {
  let {
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
  } = useArticle();
  // let image = JSON.parse(coverImg)
  useEffect(() => {
    console.log(coverImg);
    document.title = title;
  }, []);

  return (
    <div className="articleconwrapper">
      <div className="articlecon">
        <div className="likes">
          <div className="icon">
            <i className="far fa-heart" onClick={addLikes}></i>
            <div>
              {data.map((like) => (like.likes == null ? 0 : like.likes))}
            </div>
          </div>
          <div className="icon">
            <i className="far fa-comment-dots"></i>
            <div>{comments ? comments.length : "0"}</div>
          </div>
        </div>
        <div className="contentandcomment">
          <div className="isi">
            {data.map((res, index) => (
              <div key={index}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    fontSize={["24px", "28px", "28px", "32px"]}
                    fontWeight="semibold"
                  >
                    {res.title}
                  </Text>
                  {session && supabase.auth.user().email === res.email ? (
                    <div>
                      <Menu>
                        <MenuButton>
                          <div className="articleoption">
                            <i className="fas fa-ellipsis-v"></i>
                          </div>
                        </MenuButton>
                        <MenuList bg="#0D1B2A" borderColor="GrayText">
                          <Link
                            to={{ pathname: "/edit", query: { res } }}
                            style={{
                              color: "white",
                              textDecoration: "none",
                              fontWeight: "normal",
                            }}
                            data-toggle="tooltip"
                            title="Edit"
                          >
                            <MenuItem _focus={{ bg: "#1c3857" }}>
                              Edit post
                            </MenuItem>
                          </Link>
                        </MenuList>
                      </Menu>
                    </div>
                  ) : // </div>
                  null}
                </div>
                <div className="date">
                  <img
                    src={
                      profilePic
                        ? profilePic
                        : `https://ui-avatars.com/api/?name=${res.email}&length=1`
                    }
                    width="25px"
                    style={{ borderRadius: "50px", marginRight: "10px" }}
                  ></img>
                  {res?.blog_users?.nickname ? (
                    <>
                      <Link
                        to={{
                          pathname: `/${res.blog_users.nickname}`,
                          query: { res },
                        }}
                      >
                        <Text fontSize={["14px", "15px", "15px", "16px"]}>
                          {res.blog_users.nickname}, &nbsp;
                        </Text>
                      </Link>
                      <Text fontSize={["14px", "15px", "15px", "16px"]}>
                        {res.date}
                      </Text>
                    </>
                  ) : (
                    <>
                      {/* <Link to={{ pathname: `/${(res.email).replace('@gmail.com', '').replace('@yahoo.com', '').replace('@hotmail.com', '')}`, query: { res } }}> */}
                      <Text fontSize={["14px", "15px", "15px", "16px"]}>
                        {res.email
                          .replace("@gmail.com", "")
                          .replace("@yahoo.com", "")
                          .replace("@hotmail.com", "")}
                        , &nbsp;
                      </Text>
                      {/* </Link> */}
                      <Text fontSize={["14px", "15px", "15px", "16px"]}>
                        {res.date}
                      </Text>
                    </>
                  )}
                </div>
                {Object.entries(coverImg).length > 0 ? (
                  <Flex justify="center" w="100%" mb="50px" pos="relative">
                    <Image src={coverImg.webformatURL} />
                    <Box
                      display={coverImg ? "block" : "none"}
                      pos={"absolute"}
                      bottom="-30px"
                      color="white"
                    >
                      By&nbsp;
                      <a
                        href={`http://pixabay.com/users/${coverImg.user}`}
                        style={{ textDecoration: "underline" }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {coverImg.user}
                      </a>
                      &nbsp;on&nbsp;
                      <a
                        href={coverImg.pageURL}
                        style={{ textDecoration: "underline" }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        PixaBay
                      </a>
                    </Box>
                  </Flex>
                ) : null}
                <Text
                  className="body"
                  fontSize={["16px", "17px", "17px", "18px"]}
                >
                  {parse(res.body)}
                </Text>
              </div>
            ))}
          </div>
          <div className="likesBottom">
            <div className="icon">
              <i className="far fa-heart" onClick={addLikes}></i>
              <div>
                {data.map((like) => (like.likes == null ? 0 : like.likes))}
              </div>
            </div>
            <div className="icon">
              <i className="far fa-comment-dots"></i>
              <div>{comments ? comments.length : "0"}</div>
            </div>
          </div>
          <Flex w="100%" justify="flex-start" mt="10px" wrap="wrap">
            {tags.map((res) => (
              <Link to={{ pathname: `/topic/${res.name.replace("#", "")}` }}>
                <Tag
                  m="5px"
                  colorScheme="telegram"
                  _hover={{
                    bgColor: "#3c7592",
                    color: "white",
                    transition: ".2s",
                  }}
                >
                  {res.name}
                </Tag>
              </Link>
            ))}
          </Flex>
          <div className="commentscon">
            <h2>Comments</h2>
            {comments == "" ? (
              <div className="commentsection">
                <div>There is no comment here.</div>
              </div>
            ) : (
              <div className="commentsection">
                {comments &&
                  comments.map((komentar, index) => (
                    <div key={index} className="comment">
                      <div style={{ fontSize: 16 }}>
                        {komentar.author
                          .replace("@gmail.com", "")
                          .replace("@yahoo.com", "")
                          .replace("@hotmail.com", "")
                          .replace("@test", "")
                          .replace("@test.com", "")}
                      </div>
                      <div style={{ fontSize: 20 }}>{komentar.comment}</div>
                    </div>
                  ))}
              </div>
            )}
            <div className="addcomment">
              {supabase.auth.session() == null ? (
                "You need to login first to comment"
              ) : (
                <>
                  <div>Add comment</div>
                  <form onSubmit={postComment}>
                    <input
                      name="comment"
                      placeholder=" Your comment..."
                      onChange={(e) => setInputComments(e.target.value)}
                      required
                    ></input>
                    <button>Comment</button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
