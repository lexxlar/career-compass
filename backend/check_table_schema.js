const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkSchema() {
    try {
        console.log('Querying table information...');
        // We can check columns using standard SQL via supabase.rpc or check the error of a bad insert
        const { data, error } = await supabase
            .from('quiz_results')
            .insert({})
            .select();

        console.log('Result of empty insert:');
        console.log('Data:', data);
        console.log('Error:', error);
    } catch (e) {
        console.error(e);
    }
}

checkSchema();
