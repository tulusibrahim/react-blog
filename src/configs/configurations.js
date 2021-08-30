import { createClient } from '@supabase/supabase-js'
let { v4: uuidv4 } = require('uuid')

const supabase = createClient(process.env.URL, process.env.KEY)

export {
    supabase,
    uuidv4
}