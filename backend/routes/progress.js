// backend/routes/progress.js
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// ======================
// GET прогресса
// ======================

// Получить только Roadmap (month_number = 0)
router.get('/:userId/roadmap', async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await supabase
            .from('user_tasks_progress')
            .select('tasks')
            .eq('user_id', userId)
            .eq('month_number', 0)
            .maybeSingle();

        if (error) return res.status(500).json({ error: error.message });

        res.json({ 
            status: 'success', 
            progress: data?.tasks || {} 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить только Dashboard (месяцы 1-12)
router.get('/:userId/dashboard', async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await supabase
            .from('user_tasks_progress')
            .select('month_number, tasks')
            .eq('user_id', userId)
            .gte('month_number', 1)
            .lte('month_number', 12);

        if (error) return res.status(500).json({ error: error.message });

        res.json({ 
            status: 'success', 
            progress: data || [] 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ======================
// POST toggle (обновление статуса)
// ======================
router.post('/toggle', async (req, res) => {
    try {
        const { userId, monthNumber, taskId, isCompleted, status } = req.body;

        if (!userId || monthNumber === undefined || !taskId) {
            return res.status(400).json({ error: 'Не все обязательные поля' });
        }

        let valueToStore;
        if (status !== undefined) {
            valueToStore = status;           // для roadmap: 'completed' | 'learning'
        } else {
            valueToStore = isCompleted;      // для dashboard: boolean
        }

        const { data: existing } = await supabase
            .from('user_tasks_progress')
            .select('tasks')
            .eq('user_id', userId)
            .eq('month_number', monthNumber)
            .maybeSingle();

        const currentTasks = existing?.tasks || {};

        if (valueToStore === 'not_started' || valueToStore === false) {
            delete currentTasks[taskId];
        } else {
            currentTasks[taskId] = valueToStore;
        }

        const { error: upsertError } = await supabase
            .from('user_tasks_progress')
            .upsert({
                user_id: userId,
                month_number: monthNumber,
                tasks: currentTasks,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id,month_number' });

        if (upsertError) return res.status(500).json({ error: upsertError.message });

        res.json({ status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при обновлении прогресса' });
    }
});

// ======================
// Сброс dashboard при смене профессии
// ======================
router.delete('/reset/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const { error } = await supabase
            .from('user_tasks_progress')
            .delete()
            .eq('user_id', userId)
            .gte('month_number', 1)
            .lte('month_number', 12);

        if (error) return res.status(500).json({ error: error.message });

        res.json({ status: 'success', message: 'Dashboard прогресс сброшен' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сброса' });
    }
});

module.exports = router;