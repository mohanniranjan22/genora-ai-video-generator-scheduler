import { createClient } from '@supabase/supabase-js';
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkData() {
    try {
        const { count: seriesCount, error: se } = await supabase.from('video_series').select('*', { count: 'exact', head: true });
        const { count: recordCount, error: re } = await supabase.from('video_records').select('*', { count: 'exact', head: true });
        const { count: assetCount, error: ae } = await supabase.from('video_assets').select('*', { count: 'exact', head: true });

        console.log("Counts:", { seriesCount, recordCount, assetCount });
        console.log("Errors if any:", { se, re, ae });
        
        if (recordCount > 0) {
            const { data: latestRecords } = await supabase.from('video_records').select('*, video_series(series_name, user_id)').limit(1);
            console.log("Latest Record Sample:", JSON.stringify(latestRecords, null, 2));
        }
    } catch (err) {
        console.error("DEBUG SCRIPT FAILED:", err.message);
    }
}

checkData();
