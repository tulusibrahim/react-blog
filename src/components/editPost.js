import { useEffect, useState } from "react";
import { supabase } from "../configs/configurations";
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import { Modal, Center, ModalOverlay, ModalContent, ModalHeader, Box, ModalFooter, ModalBody, ModalCloseButton, useToast, Flex, Tag, Text, TagRightIcon, Input, Button, useDisclosure } from "@chakra-ui/react"
import Editor from 'react-medium-editor';
import { CloseIcon } from '@chakra-ui/icons'
import { useDebounce } from 'use-debounce';
import moment from 'moment'
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/beagle.css');

const EditPost = (props) => {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    let history = useHistory()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [tag, setTag] = useState('')
    const [alltag, setAllTag] = useState([])
    const [savedId, setSavedId] = useState('')
    const [valueDebounceBody] = useDebounce(body, 1000);
    const [valueDebounceTitle] = useDebounce(title, 1000);
    const [saveStatus, setSaveStatus] = useState('')
    let toast = useToast()

    const postEdit = async (e) => {
        // e.preventDefault()
        const { data, error } = await supabase
            .from('blog')
            .update({ title: title ? title : props.location.query.res.title, body: body ? body : props.location.query.res.body })
            .match({ id: props.location.query.res.id })
        if (data) {
            history.push('/profile')
        }
        else {
            swal("Failed to update post, please try again", {
                icon: "warning",
            });
        }
    }
    //borderBottom: '1px #E0E1DD solid',

    const getData = async (id) => {
        let result = await supabase.from('blog').select('*,blog_tags(*)').eq('id', id)
        console.log(result)
        setBody(result.data[0].body)
        setTitle(result.data[0].title)
        // let parsedArray = result.data[0].blog_tags.map(res => res.name)
        setAllTag(result.data[0].blog_tags)
    }

    const saveDataOnChange = async () => {
        setSaveStatus('Saving...')
        const update = await supabase
            .from('blog')
            .update({
                title: title ? title : props.location.query.res.title,
                body: body ? body : props.location.query.res.body,
            })
            .eq('id', savedId)
        // console.log(update)
        if (update.error) {
            toast({ description: 'Failed to update, try later', status: 'warning', isClosable: true })
            setSaveStatus('Failed')
        }
        else {
            setSaveStatus('Saved')
        }
    }

    const postDataFinal = async () => {
        let result = await supabase
            .from('blog')
            .update({
                title: title ? title : props.location.query.res.title,
                body: body ? body : props.location.query.res.body,
                isDraft: 'false'
            })
            .eq('id', savedId)
        // console.log(result)
        if (result.error) {
            toast({ description: 'Failed to post, please try again', status: 'error' })
        }
        else {
            toast({ description: 'Post published successfully', status: 'success' })
            history.push('/profile')
        }
    }

    const checkTag = async (data) => {
        let parsedWord = data.target.value.replaceAll(" ", "").toLowerCase()

        if (parsedWord == '') {
            toast({ description: 'Please input tag name', status: 'info', isClosable: true })
        }
        else if (parsedWord) {
            setTag('')
            const result = await supabase.from('blog_tags').select('*').eq('name', `#${parsedWord}`)

            if (result.data.length) {
                // console.log('udh ada tag')
                const insertTag = await supabase.from('blog_postTag').select('*').match({ post_id: savedId, tag_id: result.data[0].id })
                // console.log(insertTag)
                if (insertTag.data.length == 0) {
                    let postTag = await supabase.from('blog_postTag').insert([{ post_id: savedId, tag_id: result.data[0].id }])
                    alltag ? setAllTag(oldTag => [...oldTag, { name: `#${parsedWord}` }]) : setAllTag({ name: `#${parsedWord}` });
                }
                else {
                    toast({ description: 'Tag already exist', status: 'warning', isClosable: true })
                }
            }
            else {
                // console.log('blm ada tag')
                let postTag = await supabase.from('blog_tags').insert({ name: `#${parsedWord}` })
                // console.log(postTag)
                postTag.error && toast({ description: 'Failed to add tag', status: 'error' })

                const insertTag = await supabase.from('blog_postTag').select('*').match({ post_id: savedId, tag_id: postTag.data[0].id })
                // console.log(insertTag)
                if (insertTag.data.length == 0) {
                    let insertTag = await supabase.from('blog_postTag').insert([{ post_id: savedId, tag_id: postTag.data[0].id }])
                    alltag ? setAllTag(oldTag => [...oldTag, { name: `#${parsedWord}` }]) : setAllTag({ name: `#${parsedWord}` });
                }
                else {
                    toast({ description: 'Tag already exist', status: 'warning', isClosable: true })
                }
            }
        }
    }

    const removeOneTag = async (data) => {
        let deleteTag = await supabase.from('blog_postTag').delete().match({ post_id: props.location.query.res.id, tag_id: data.id })
        let result = await supabase.from('blog').select('*,blog_tags(*)').eq('id', props.location.query.res.id)
        setAllTag(result.data[0].blog_tags)
    }

    useEffect(() => {
        document.title = `Edit - ${props.location.query.res.title}`
        console.log(body)
        // setBody(props.location.query.res.body)
        setSavedId('')
        setSavedId(props.location.query.res.id)
        setSaveStatus('')
        getData(props.location.query.res.id)
        // setAllTag(props.location.query.res.blog_tags)
    }, [])

    useEffect(() => {
        if (valueDebounceBody || valueDebounceTitle) {
            saveDataOnChange()
        }
    }, [valueDebounceBody, valueDebounceTitle])
    //backgroundColor: '#12253a',
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
                    <Box w="90%" className="editor">
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