import { useEffect, useState } from "react";
import { supabase } from "../configs/configurations";
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import { Modal, ModalOverlay, ModalContent, ModalHeader, Box, ModalFooter, ModalBody, ModalCloseButton, useToast, Flex, Tag, Text, TagRightIcon, Input, Button, useDisclosure } from "@chakra-ui/react"
import Editor from 'react-medium-editor';
import { CloseIcon } from '@chakra-ui/icons'
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

    const postDataFinal = async () => {
        let result = await supabase
            .from('blog')
            .update({
                title: title ? title : props.location.query.res.title,
                body: body ? body : props.location.query.res.body,
                isDraft: 'false'
            })
            .eq('id', savedId)
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
                .eq('name', `#${parsedWord}`)

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

    useEffect(() => {
        document.title = `Edit - ${props.location.query.res.title}`
        console.log(body)
        setBody(props.location.query.res.body)
        setSavedId(props.location.query.res.id)
        // setAllTag(props.location.query.res.blog_tags)
    }, [])

    return (
        <div className="newblogconwrapper">
            <div className="newblogcon">
                <Flex w="90%" h="5vh" justifyContent="flex-end" mt="24px">
                    {
                        props.location.query.res.isDraft == 'true' ?
                            <Button colorScheme="messenger" onClick={() => onOpen()}>Next</Button>
                            :
                            <Button colorScheme="messenger" onClick={() => onOpen()}>Update</Button>
                    }
                </Flex>
                <Box w="90%">
                    {/* <input style={{ backgroundColor: "#0D1B2A" }} placeholder="title" name="title" className="title" onChange={(e) => setTitle(e.target.value)} defaultValue={props.location.query.res.title}></input> */}
                    <Input variant="flushed" placeholder="Title" mb={'10px'} color="white" onChange={(e => setTitle(e.target.value))} defaultValue={props.location.query.res.title} />
                    {/* <textarea style={{ overflow: 'auto' }} rows="10" cols="50" onChange={(e) => setBody(e.target.value)} placeholder="body" name="body" className="body" defaultValue={props.location.query.res.body}></textarea> */}
                    <Editor
                        style={{ width: '100%', paddingTop: '1rem', paddingBottom: '1rem', color: 'white', backgroundColor: '#12253a', outline: 'none' }}
                        text={body}
                        theme="beagle"
                        onChange={e => setBody(e)}
                    />
                </Box>
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
                        <Button onClick={postTag} variant="solid" colorScheme="gray">
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
        </div>
    );
}

export default EditPost;