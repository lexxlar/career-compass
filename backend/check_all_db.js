const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkAll() {
    try {
        console.log('--- USERS ---');
        const { data: users, error: uError } = await supabase
            .from('users')
            .select('*');

        if (uError) {
            console.error('Error fetching users:', uError);
        } else {
            console.log(users);
        }

        console.log('--- QUIZ RESULTS ---');
        const { data: results, error: rError } = await supabase
            .from('quiz_results')
            .select('*');

        if (rError) {
            console.error('Error fetching results:', rError);
        } else {
            console.log(results);
        }
    } catch (e) {
        console.error(e);
    }
}

checkAll();
