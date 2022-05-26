import { Modal, Center, ModalOverlay, ModalContent, ModalHeader, Box, ModalFooter, ModalBody, ModalCloseButton, useToast, Flex, Tag, Text, TagRightIcon, Input, Button, useDisclosure } from "@chakra-ui/react"
import Editor from 'react-medium-editor';
import { CloseIcon } from '@chakra-ui/icons'
import useEditPost from "./editposthooks";
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/beagle.css');

const EditPost = (props) => {
    let { title,
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
        removeOneTag }
        = useEditPost(props)

    return (
        <Center w="100%" >
            <Flex w={["100%", "100%", "90%", "80%"]} h="fit-content" justify="center">
                <Flex w={["100%", "100%", "90%", "90%"]} h="fit-content" pb="20px" direction="column" align="center">
                    <Flex w="90%" h="5vh" justifyContent="flex-end" mt="20px" mb="10px" alignItems="center">
                        <Text color="whiteAlpha.700" mr="10px">{saveStatus}</Text>
                        <Button colorScheme="messenger" onClick={postDataFinal} fontWeight="normal">
                            {
                                props.location.query.res.isDraft == 'true' ?
                                    'Publish'
                                    :
                                    'Update'
                            }
                        </Button>
                    </Flex>
                    <Box w="90%" className="editor" minHeight="65vh">
                        <Input variant="flushed" fontWeight="semibold" fontSize={["24px", "28px", "28px", "32px"]} pb="5px" placeholder="Title" mb={'10px'} color="#E0E1DD" onChange={(e => setTitle(e.target.value))} defaultValue={title} />
                        <Editor
                            style={{ width: '100%', paddingBottom: '15px', paddingTop: '1rem', borderRadius: '5px', paddingBottom: '1rem', color: 'white', outline: 'none' }}
                            text={body}
                            theme="beagle"
                            onChange={e => setBody(e)}
                        />
                    </Box>
                    <Flex wrap="wrap" mt='10px' w="90%">
                        {
                            alltag &&
                            alltag.map((res, index) => <Tag cursor="pointer" key={index} m="5px" variant="subtle" colorScheme="telegram">{res.name}<TagRightIcon onClick={() => removeOneTag(res)} as={CloseIcon} boxSize="10px" /></Tag>)
                        }
                    </Flex>
                    <Flex w="90%" justify="flex-start">
                        <Input w={["60%", "50%", "40%", "30%"]} variant="flushed" textTransform="lowercase" borderColor="whiteAlpha.400" color="whiteAlpha.900" placeholder="Add tags" mt="20px" onKeyUp={(e) => e.keyCode == 13 && checkTag(e)} value={tag} onChange={e => setTag(e.target.value)}></Input>
                    </Flex>
                </Flex>
                <Modal onClose={onClose} size='lg' isOpen={isOpen} >
                    <ModalOverlay />
                    <ModalContent bg="#152b43">
                        <ModalHeader color="whiteAlpha.900">Add tags</ModalHeader>
                        <ModalCloseButton color="whiteAlpha.900" />
                        <ModalBody>
                            <Flex wrap="wrap" mt='10px'>
                                {
                                    alltag == '' ?
                                        <Text color="whiteAlpha.500" fontSize={20} >No tags yet...</Text>
                                        :
                                        alltag.map((res, index) => <Tag cursor="pointer" key={index} m="5px" variant="subtle" colorScheme="telegram">{res.name}<TagRightIcon onClick={() => removeOneTag(res)} as={CloseIcon} boxSize="10px" /></Tag>)
                                }
                            </Flex>
                            <Input variant="flushed" color="whiteAlpha.900" textTransform="lowercase" placeholder="Tags" mt="20px" onKeyUp={(e) => e.keyCode == 13 && checkTag(e)} value={tag} onChange={e => setTag(e.target.value)}></Input>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={postDataFinal} variant="solid" colorScheme="messenger">
                                {
                                    props.location.query.res.isDraft == 'true' ?
                                        'Publish!'
                                        :
                                        'Update!'
                                }
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Flex>
        </Center>
    );
}

export default EditPost;