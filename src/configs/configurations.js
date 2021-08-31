import { createClient } from '@supabase/supabase-js'
let { v4: uuidv4 } = require('uuid')

const supabase = createClient(URL_APP, KEY_APP)

export {
    supabase,
    uuidv4
}