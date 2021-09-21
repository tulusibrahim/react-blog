import { supabase, uuidv4 } from "../configs/configurations";
import moment from 'moment'
import { useHistory, useLocation, Prompt } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import swal from 'sweetalert';
import {
    Box, Flex, Input, Text, Tag, Button, Center, useToast, TagRightIcon, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure
} from "@chakra-ui/react"
import { WarningIcon } from "@chakra-ui/icons";
import { useDebounce } from 'use-debounce';
// ES module
import Editor from 'react-medium-editor';
import { DeleteIcon, CloseIcon } from "@chakra-ui/icons";
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/beagle.css');


const NewBlog = () => {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [tag, setTag] = useState('')
    const [alltag, setAllTag] = useState([])
    const [upload, setUpload] = useState(false)
    let history = useHistory()
    const idForLater = uuidv4()
    let toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [valueDebounceBody] = useDebounce(body, 1000);
    const [valueDebounceTitle] = useDebounce(title, 1000);
    let location = useLocation()
    const [savedId, setSavedId] = useState('')
    const [saveStatus, setSaveStatus] = useState('')

    useEffect(() => {
        // let parse = JSON.parse(body)
        // setBody(parse._immutable.currentContent)
    }, [body])

    const testDebounce = async () => {
        let result = await supabase
            .from('blog')
            .upsert([
                {
                    id: idForLater,
                    body: valueDebounceBody,
                    title: title,
                    email: supabase.auth.user().email,
                    authorUserId: supabase.auth.user().id,
                    date: moment().format('DD MMMM YYYY')
                }
            ])
        console.log(result)
    }
    useEffect(() => {
        if (valueDebounceBody || valueDebounceTitle) {
            postDataOnChange()
        }
    }, [valueDebounceBody, valueDebounceTitle])

    const postDataOnChange = async (e) => {
        // e.preventDefault()
        setSaveStatus('Saving...')
        const user = supabase.auth.user()
        if (!savedId) {
            const { data, error } = await supabase
                .from('blog')
                .insert([
                    {
                        id: uuidv4(),
                        title: title ? title : 'Untitled',
                        body: body ? body : '',
                        authorUserId: supabase.auth.user().id,
                        email: user.email,
                        date: moment().format('DD MMMM YYYY'),
                        isDraft: true
                    }
                ])
            console.log(data)
            setSavedId(data[0].id)
            setSaveStatus('Saved')
            if (error) {
                console.log(error)
                toast({ description: 'Failed to update, try later', status: 'warning', isClosable: true })
            }
            // onOpen()
            // else {
            //     history.push('/')
            // }
        }
        else {
            // onOpen()/
            console.log('ada saved id')
            setSaveStatus('Saving...')
            const update = await supabase
                .from('blog')
                .upsert(
                    {
                        id: savedId,
                        title: title ? title : 'Untitled',
                        body: body ? body : '',
                        authorUserId: supabase.auth.user().id,
                        email: user.email,
                        date: moment().format('DD MMMM YYYY'),
                        isDraft: true
                    }
                )
            console.log(update)
            setSaveStatus('Saved')
            update.error && toast({ description: 'Failed to update, try later', status: 'warning', isClosable: true })
        }
    }

    const postDataFinal = async () => {
        swal({
            title: "Confirmation",
            text: "Sure want to publish it now?",
            icon: "warning",
            buttons: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    let result = await supabase.from('blog').update({ isDraft: 'false' }).eq('id', savedId)
                    console.log(result)
                    if (result.error) {
                        toast({ description: 'Failed to publish, please try again.', status: 'error' })
                    }
                    else {
                        toast({ description: 'Post published successfully.', status: 'success' })
                        history.push('/')
                    }
                }
            })
    }

    const checkTag = async (data) => {
        let parsedWord = data.target.value.replaceAll(" ", "").toLowerCase()
        console.log(parsedWord)
        if (parsedWord == '') {
            toast({ description: 'Please input tag name', status: 'info', isClosable: true })
        }
        else if (parsedWord) {
            setTag('')
            console.log(parsedWord)
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

    //bug gabisa delete tag pas bikin new blog

    const removeOneTag = async (data) => {
        let getTagId = await supabase.from('blog_tags').select().eq('name', data.name)
        console.log(getTagId)
        let deleteTag = await supabase.from('blog_postTag').delete().match({ post_id: savedId, tag_id: getTagId.data[0].id })
        console.log(deleteTag)
        let result = await supabase.from('blog').select('*,blog_tags(*)').eq('id', savedId)
        console.log(result)
        setAllTag(result.data[0].blog_tags)
    }

    // window.onpopstate = () =>
    //     history.location.pathname == '/new' &&

    useEffect(() => {
        document.title = "New Blog"
        setSavedId('')
        setBody('')
        setTitle('')
        setSaveStatus()
        setUpload(false)
    }, [])
    //backgroundColor: '#112236',
    //editor js candidate replace medium editor

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