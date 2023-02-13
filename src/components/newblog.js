import { supabase } from "../configs/configurations";
import { Prompt } from "react-router-dom";
import {
  Box,
  Flex,
  Input,
  Text,
  Tag,
  Button,
  Center,
  Icon,
  TagRightIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
} from "@chakra-ui/react";
import Masonry from "react-masonry-css";
// ES module
import Editor from "react-medium-editor";
import { DeleteIcon, CloseIcon } from "@chakra-ui/icons";
import useNewBlog from "../hooks/newbloghooks";
import { AiOutlineClose } from "react-icons/ai";
require("medium-editor/dist/css/medium-editor.css");
require("medium-editor/dist/css/themes/beagle.css");

const NewBlog = () => {
  let {
    body,
    alltag,
    title,
    saveStatus,
    tag,
    isOpen,
    onClose,
    setBody,
    setTitle,
    removeOneTag,
    checkTag,
    setTag,
    setSelectedImg,
    selectedImg,
    searchImage,
    setImageTitle,
    image,
    postDataFinal,
  } = useNewBlog();

  return supabase.auth.session() == null ? (
    <h1
      style={{
        fontSize: "2rem",
        fontWeight: "500",
        textAlign: "center",
        color: "white",
      }}
    >
      You need to log in first to create new post.
    </h1>
  ) : (
    <Center w="100%">
      <Prompt
        message="Sure want to leave? Changes will not be saved."
        when={title == "" && body == "" && selectedImg == {}}
      />
      <Flex w={["100%", "100%", "90%", "80%"]} h="fit-content" justify="center">
        <Flex
          w={["100%", "100%", "90%", "90%"]}
          h="fit-content"
          direction="column"
          pb="30px"
          align="center"
        >
          <Flex
            w="90%"
            mt="20px"
            mb="10px"
            justify="flex-end"
            alignItems="center"
          >
            <Text color="whiteAlpha.700">{saveStatus}</Text>
            <Button
              colorScheme="messenger"
              type="submit"
              onClick={postDataFinal}
              ml="10px"
              fontWeight="normal"
              borderRadius="5px"
            >
              Publish
            </Button>
          </Flex>
          <Box w="90%" minHeight="65vh">
            <Input
              variant="flushed"
              fontWeight="semibold"
              pb="5px"
              fontSize={["24px", "28px", "28px", "32px"]}
              placeholder="Title"
              mb={"10px"}
              color="white"
              onChange={(e) => setTitle(e.target.value)}
            />
            <Accordion allowToggle color="white" w="100%">
              <AccordionItem borderY="none" width="100%">
                <AccordionButton _focus={{ outline: "none" }}>
                  <Box flex="1" textAlign="left">
                    Add cover image
                  </Box>
                  {/* <AccordionIcon /> */}
                </AccordionButton>
                <AccordionPanel pb={4} w="100%">
                  <form onSubmit={(e) => searchImage(e)}>
                    <Input
                      placeholder="Search image"
                      width="fit-content"
                      onChange={(e) => setImageTitle(e.target.value)}
                    />
                  </form>
                  <Flex
                    w="100%"
                    h="fit-content"
                    marginY="20px"
                    justify="center"
                  >
                    {Object.keys(selectedImg).length == 0 && (
                      <Masonry
                        className="cardcon"
                        breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
                      >
                        {image.map((i) => (
                          <Image
                            key={i.id}
                            src={i.webformatURL}
                            onClick={(e) => setSelectedImg(i)}
                            padding="10px"
                            boxSize="auto"
                            objectFit="cover"
                            transitionDuration=".2s"
                            cursor="pointer"
                            _hover={{ transform: "translateY(-5px)" }}
                          />
                        ))}
                      </Masonry>
                    )}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Flex w="100%" h="fit-content" marginY="20px" justify="center">
              {Object.keys(selectedImg).length > 0 && (
                <Flex
                  pos="relative"
                  w="fit-content"
                  justify="center"
                  marginBottom="15px"
                >
                  <Image key={selectedImg.id} src={selectedImg.webformatURL} />
                  <Icon
                    as={AiOutlineClose}
                    onClick={() => setSelectedImg({})}
                    pos="absolute"
                    top="3"
                    right="3"
                    borderRadius="md"
                    transitionDuration=".2s"
                    w="fit-content"
                    h="fit-content"
                    cursor="pointer"
                    padding="8px"
                    bgColor={"grey"}
                    opacity={0.5}
                    _hover={{ opacity: 1 }}
                  />
                  <Box pos="absolute" bottom="-30px" color="white">
                    By&nbsp;
                    <a
                      href={`http://pixabay.com/users/${selectedImg.user}`}
                      style={{ textDecoration: "underline" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedImg.user}
                    </a>
                    &nbsp;on&nbsp;
                    <a
                      href={selectedImg.pageURL}
                      style={{ textDecoration: "underline" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PixaBay
                    </a>
                  </Box>
                </Flex>
              )}
            </Flex>
            <Editor
              style={{
                width: "100%",
                paddingBottom: "15px",
                paddingTop: "1rem",
                paddingBottom: "1rem",
                color: "#e0e1dd",
                borderRadius: "5px",
                outline: "none",
              }}
              text={body}
              className="editor"
              theme="beagle"
              onChange={(e) => setBody(e)}
            />
          </Box>
          <Flex wrap="wrap" mt="10px" w="90%">
            {alltag &&
              alltag.map((res, index) => (
                <Tag
                  cursor="pointer"
                  key={index}
                  m="5px"
                  variant="subtle"
                  colorScheme="telegram"
                >
                  {res.name}
                  <TagRightIcon
                    onClick={() => removeOneTag(res)}
                    as={CloseIcon}
                    boxSize="10px"
                  />
                </Tag>
              ))}
          </Flex>
          <Flex w="90%" justify="flex-start">
            <Input
              w={["60%", "50%", "40%", "30%"]}
              isDisabled={title || body ? false : true}
              variant="flushed"
              textTransform="lowercase"
              borderColor="whiteAlpha.400"
              color="whiteAlpha.900"
              placeholder="Add tags"
              mt="20px"
              onKeyUp={(e) => e.keyCode == 13 && checkTag(e)}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            ></Input>
          </Flex>
        </Flex>

        <Modal onClose={onClose} size="lg" isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent bg="#152b43">
            <ModalHeader color="whiteAlpha.900">Add tags</ModalHeader>
            <ModalCloseButton color="whiteAlpha.900" />
            <ModalBody>
              <Flex wrap="wrap" mt="10px">
                {alltag == "" ? (
                  <Text color="whiteAlpha.500" fontSize={20}>
                    No tags yet...
                  </Text>
                ) : (
                  alltag.map((res, index) => (
                    <Tag
                      cursor="pointer"
                      key={index}
                      m="5px"
                      variant="subtle"
                      colorScheme="telegram"
                    >
                      {res.name}
                      <TagRightIcon
                        onClick={() => removeOneTag(res)}
                        as={CloseIcon}
                        boxSize="10px"
                      />
                    </Tag>
                  ))
                )}
              </Flex>
              <Input
                variant="flushed"
                textTransform="lowercase"
                color="whiteAlpha.900"
                placeholder="Tags"
                mt="20px"
                onKeyUp={(e) => e.keyCode == 13 && checkTag(e)}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              ></Input>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={postDataFinal}
                variant="solid"
                colorScheme="messenger"
              >
                Publish!
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Center>
  );
};

export default NewBlog;
