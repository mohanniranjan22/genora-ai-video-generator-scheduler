const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const { data, error } = await supabase
    .from('video_records')
    .select('captions')
    .limit(1);
  
  if (error) console.log("video_records error:", error.message);
  else console.log("video_records has captions:", !!data[0]?.captions);

  const { data: data2, error: error2 } = await supabase
    .from('video_posts')
    .select('*')
    .limit(1);
  
  if (error2) console.log("video_posts table missing:", error2.message);
  else console.log("video_posts exists!");
}

checkTables();
