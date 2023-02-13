import {
  Modal,
  Center,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Box,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Flex,
  Tag,
  Text,
  TagRightIcon,
  Input,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Icon,
} from "@chakra-ui/react";
import Masonry from "react-masonry-css";
import { AiOutlineClose } from "react-icons/ai";
import Editor from "react-medium-editor";
import { CloseIcon } from "@chakra-ui/icons";
import useEditPost from "../hooks/editposthooks";
require("medium-editor/dist/css/medium-editor.css");
require("medium-editor/dist/css/themes/beagle.css");

const EditPost = (props) => {
  let {
    title,
    body,
    isOpen,
    saveStatus,
    tag,
    alltag,
    onClose,
    setTitle,
    setTag,
    setBody,
    postDataFinal,
    checkTag,
    searchImage,
    image,
    setImageTitle,
    setSelectedImg,
    selectedImg,
    removeOneTag,
  } = useEditPost(props);

  return (
    <Center w="100%">
      <Flex w={["100%", "100%", "90%", "80%"]} h="fit-content" justify="center">
        <Flex
          w={["100%", "100%", "90%", "90%"]}
          h="fit-content"
          pb="20px"
          direction="column"
          align="center"
        >
          <Flex
            w="90%"
            h="5vh"
            justifyContent="flex-end"
            mt="20px"
            mb="10px"
            alignItems="center"
          >
            <Text color="whiteAlpha.700" mr="10px">
              {saveStatus}
            </Text>
            <Button
              colorScheme="messenger"
              onClick={postDataFinal}
              fontWeight="normal"
            >
              {props.location.query.res.isDraft == "true"
                ? "Publish"
                : "Update"}
            </Button>
          </Flex>
          <Box w="90%" className="editor" minHeight="65vh">
            <Input
              variant="flushed"
              fontWeight="semibold"
              fontSize={["24px", "28px", "28px", "32px"]}
              pb="5px"
              placeholder="Title"
              mb={"10px"}
              color="#E0E1DD"
              onChange={(e) => setTitle(e.target.value)}
              defaultValue={title}
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
                borderRadius: "5px",
                paddingBottom: "1rem",
                color: "white",
                outline: "none",
              }}
              text={body}
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
                color="whiteAlpha.900"
                textTransform="lowercase"
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
                {props.location.query.res.isDraft == "true"
                  ? "Publish!"
                  : "Update!"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Center>
  );
};

export default EditPost;
