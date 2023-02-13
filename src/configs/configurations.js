import { createClient } from "@supabase/supabase-js";
let { v4: uuidv4 } = require("uuid");

const supabase = createClient(
  process.env.REACT_APP_VERCEL_URL,
  process.env.REACT_APP_VERCEL_KEY
);
export { supabase, uuidv4 };
