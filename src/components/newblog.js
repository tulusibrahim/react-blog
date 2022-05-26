import { supabase } from "../configs/configurations";
import { Prompt } from "react-router-dom";
import { Box, Flex, Input, Text, Tag, Button, Center, TagRightIcon, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react"
// ES module
import Editor from 'react-medium-editor';
import { DeleteIcon, CloseIcon } from "@chakra-ui/icons";
import useNewBlog from "./newbloghooks";
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/beagle.css');


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
        postDataFinal
    } = useNewBlog()

    return (
        supabase.auth.session() == null ?
            <h1 style={{ fontSize: '2rem', fontWeight: '500', textAlign: 'center', color: 'white' }}>You need to log in first to create new post.</h1>
            :
            <Center w="100%" >
                <Prompt message="Sure want to leave? Changes will not be saved." when={title == '' && body == ''} />
                <Flex w={["100%", "100%", "90%", "80%"]} h="fit-content" justify="center">
                    <Flex w={["100%", "100%", "90%", "90%"]} h="fit-content" direction="column" pb="30px" align="center" >
                        <Flex w="90%" mt="20px" mb="10px" justify="flex-end" alignItems="center">
                            <Text color="whiteAlpha.700">{saveStatus}</Text>
                            <Button colorScheme="messenger" type="submit" onClick={postDataFinal} ml="10px" fontWeight="normal" borderRadius="5px">Publish</Button>
                        </Flex>
                        <Box w="90%" minHeight="65vh">
                            <Input variant="flushed" fontWeight="semibold" pb="5px" fontSize={["24px", "28px", "28px", "32px"]} placeholder="Title" mb={'10px'} color="white" onChange={(e => setTitle(e.target.value))} />
                            <Editor
                                style={{ width: '100%', paddingBottom: '15px', paddingTop: '1rem', paddingBottom: '1rem', color: '#e0e1dd', borderRadius: '5px', outline: 'none' }}
                                text={body}
                                className="editor"
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
                            <Input w={["60%", "50%", "40%", "30%"]} isDisabled={title || body ? false : true} variant="flushed" textTransform="lowercase" borderColor="whiteAlpha.400" color="whiteAlpha.900" placeholder="Add tags" mt="20px" onKeyUp={(e) => e.keyCode == 13 && checkTag(e)} value={tag} onChange={e => setTag(e.target.value)}></Input>
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
                                <Input variant="flushed" textTransform="lowercase" color="whiteAlpha.900" placeholder="Tags" mt="20px" onKeyUp={(e) => e.keyCode == 13 && checkTag(e)} value={tag} onChange={e => setTag(e.target.value)}></Input>
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={postDataFinal} variant="solid" colorScheme="messenger">Publish!</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Flex>
            </Center>
    );
}

export default NewBlog;