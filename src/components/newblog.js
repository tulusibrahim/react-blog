import { supabase, uuidv4 } from "../configs/configurations";
import moment from 'moment'
import { useHistory, useLocation } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import swal from 'sweetalert';
import {
    Box, Flex, Input, Text, Tag, Button, useToast, TagRightIcon, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure
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
        let result = await supabase.from('blog').update({ isDraft: 'false' }).eq('id', savedId)
        console.log(result)
        if (result.error) {
            toast({ description: 'Failed to post, please try again', status: 'error' })
        }
        else {
            toast({ description: 'Post published successfully', status: 'success' })
            history.push('/')
        }
    }

    const postTag = async () => {
        const getPostId = await supabase.from('blog').select('id').eq('title', title)
        // console.log(getPostId)

        alltag.map(async (res, index) => {
            // console.log(res)
            const getTagId = await supabase.from('blog_tags').select('id').eq('name', res)
            // console.log(getTagId)
            let post = await supabase.from('blog_postTag').insert([{ post_id: savedId, tag_id: getTagId.data[0].id }])
            console.log(post)
            if (index == alltag.length - 1) {
                // onclose
                postDataFinal()
            }
        })
    }

    //usedebounce atau pake settimeout buat update perubahan di body
    //bikin function untuk save data kosong di useeffect/perrtama kali render, baru abistu di update

    const checkTag = async (data) => {
        let parsedWord = data.target.value.replaceAll(" ", "").toLowerCase()
        console.log(parsedWord)
        if (parsedWord == '') {
            toast({ description: 'Please input tag name', status: 'info', isClosable: true })
        }
        else if (parsedWord) {
            console.log(parsedWord)
            const result = await supabase
                .from('blog_tags')
                .select('*')
                .eq('name', parsedWord)

            if (result.data.length == 0) {
                let postTag = await supabase.from('blog_tags').insert({ name: `#${parsedWord}` })

                postTag.error && toast({ description: 'Failed to add tag', status: 'error' })

                alltag ? setAllTag(oldTag => [...oldTag, `#${parsedWord}`]) : setAllTag(`#${parsedWord}`);
                setTag('')
            }
            else {
                alltag ? setAllTag(oldTag => [...oldTag, `#${parsedWord}`]) : setAllTag(`#${parsedWord}`);
                setTag('')
            }
        }
    }

    const removeOneTag = async (data) => {
        let filteredArray = alltag.filter(res => res !== data)
        setAllTag(filteredArray)
    }

    // window.onpopstate = () =>
    //     history.location.pathname == '/new' &&

    useEffect(() => {
        setSavedId('')
        setBody('')
        setTitle('')
        setSaveStatus()
        document.title = "New Blog"
        setUpload(false)
    }, [])


    return (
        supabase.auth.session() == null ?
            <h1 style={{ fontSize: '2rem', fontWeight: '500', textAlign: 'center', color: 'white' }}>You need to log in first to create new post.</h1>
            :
            <div className="newblogconwrapper">
                <div className="newblogcon">
                    <Flex w="90%" mt="20px" justify="flex-end" alignItems="center">
                        <Text color="whiteAlpha.700">{saveStatus}</Text>
                        <Button colorScheme="messenger" type="submit" onClick={() => onOpen()} ml="10px" fontWeight="normal" borderRadius="5px">Next</Button>
                    </Flex>
                    <Box w="90%">
                        <Input variant="flushed" placeholder="Title" mb={'10px'} color="white" onChange={(e => setTitle(e.target.value))} />
                        < Editor
                            style={{ width: '100%', paddingTop: '1rem', paddingBottom: '1rem', color: 'white', backgroundColor: '#12253a', outline: 'none' }}
                            text={body}
                            theme="beagle"
                            onChange={e => setBody(e)}
                        />
                    </Box>
                    {/* <button onClick={onOpen} style={{ color: 'red' }}>hehehe</button>
                    <p style={{ color: 'white' }}>debounce value: {valueDebounceBody}</p> */}
                </div>
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
                                        alltag.map((res, index) => <Tag cursor="pointer" key={index} m="5px" variant="subtle" colorScheme="telegram">{res}<TagRightIcon onClick={() => removeOneTag(res)} as={CloseIcon} boxSize="10px" /></Tag>)
                                }
                            </Flex>
                            <Input variant="flushed" color="whiteAlpha.900" placeholder="Tags" mt="20px" onKeyUp={(e) => e.keyCode == 13 && checkTag(e)} value={tag} onChange={e => setTag(e.target.value)}></Input>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={postTag} variant="solid" colorScheme="gray">Publish!</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
    );
}

export default NewBlog;