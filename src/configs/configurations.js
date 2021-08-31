import { createClient } from '@supabase/supabase-js'
let { v4: uuidv4 } = require('uuid')

const supabase = createClient(process.env.URL_APP, process.env.KEY_APP)

export {
    supabase,
    uuidv4
}