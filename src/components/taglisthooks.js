import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { supabase } from '../configs/configurations';

const useTagList = (second) => {
    const [dataTag, setDataTag] = useState([])
    let toast = useToast()

    const getDataTag = async () => {
        let result = await supabase.from('blog_tags').select('*', { count: 'planned' })
        console.log(result)
        result.error ? toast({ description: 'Failed to get data', status: 'error' }) : setDataTag(result.data)
    }

    useEffect(() => {
        getDataTag()
    }, [])

    return { dataTag }
}

export default useTagList