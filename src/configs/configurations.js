import { createClient } from '@supabase/supabase-js'
let { v4: uuidv4 } = require('uuid')

const supabase = createClient(process.env.REACT_APP_KEY, process.env.REACT_APP_PASSWORD)

export {
    supabase,
    uuidv4
}