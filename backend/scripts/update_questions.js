const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'c:/Users/vmasy/OneDrive/Документы/GitHub/career-compass/backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const optionEData = {
    1: "Проектировать общую концепцию продукта и руководить процессом его создания",
    2: "Координация задач, планирование релизов и общение с командой",
    3: "Управление проектами и процессами (Agile, Scrum, Kanban)",
    4: "Мне важно проектировать пользовательский опыт (UX) целиком, а не только визуальный стиль",
    5: "Когда в команде царит хаос и нет четкого плана задач",
    6: "Инструменты планирования (Jira) и основы командного взаимодействия",
    7: "Мне нравится организовывать совместную работу и помогать команде общаться",
    8: "Успешный релиз полезного продукта в срок при слаженной работе команды",
    9: "Смешанный стиль: переключение между планированием задач, кодом и общением",
    10: "Максимальная универсальность (Fullstack) или управление проектами (Manager)"
};

async function updateQuestions() {
    try {
        console.log('Fetching questions from Supabase...');
        const { data: questions, error: fetchError } = await supabase
            .from('quiz_questions')
            .select('*')
            .order('id', { ascending: true });

        if (fetchError) {
            console.error('Error fetching questions:', fetchError.message);
            process.exit(1);
        }

        console.log(`Found ${questions.length} questions. Updating options...`);

        for (const question of questions) {
            const eText = optionEData[question.id];
            if (!eText) {
                console.warn(`No option E text defined for question ID ${question.id}`);
                continue;
            }

            // Check if option E is already in options
            const options = question.options || [];
            const hasE = options.some(opt => opt.id === 'e');

            if (!hasE) {
                options.push({ id: 'e', text: eText });
                console.log(`Adding option E to question ${question.id}: "${eText.substring(0, 30)}..."`);
                
                const { error: updateError } = await supabase
                    .from('quiz_questions')
                    .update({ options })
                    .eq('id', question.id);

                if (updateError) {
                    console.error(`Error updating question ${question.id}:`, updateError.message);
                } else {
                    console.log(`Question ${question.id} updated successfully.`);
                }
            } else {
                console.log(`Question ${question.id} already has option E. Skipping.`);
            }
        }

        console.log('All questions updated successfully!');
        process.exit(0);
    } catch (e) {
        console.error('Unhandled exception:', e);
        process.exit(1);
    }
}

updateQuestions();
