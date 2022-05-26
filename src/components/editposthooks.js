import { useEffect, useState } from "react";
import { supabase } from "../configs/configurations";
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import { useDebounce } from 'use-debounce';
import moment from 'moment'
import { useToast, useDisclosure } from "@chakra-ui/react";

const useEditPost = (props) => {
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
        setSavedId(props.location.query.res.id)
        getData(props.location.query.res.id)
    }, [])

    useEffect(() => {
        if (valueDebounceBody || valueDebounceTitle) {
            saveDataOnChange()
        }
    }, [valueDebounceBody, valueDebounceTitle])
    //backgroundColor: '#12253a',

    return { title, body, isOpen, onOpen, onClose, tag, saveStatus, postDataFinal, checkTag, removeOneTag, setTitle, setTag, setBody, alltag }
}
export default useEditPost