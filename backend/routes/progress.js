// backend/routes/progress.js
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// 1. GET /api/progress/:userId — Получить весь прогресс пользователя по задачам
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Тянем из базы только те строчки, где is_completed = true
        const { data, error } = await supabase
            .from('user_tasks_progress')
            .select('month_number, task_id, is_completed')
            .eq('user_id', userId);

        if (error) return res.status(500).json({ error: error.message });

        res.json({
            status: "success",
            progress: data // отдаем массив выполненных задач
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера при получении прогресса" });
    }
});

// 2. POST /api/progress/toggle — Клик по чекбоксу (сохранить или удалить галочку)
router.post('/toggle', async (req, res) => {
    try {
        const { userId, monthNumber, taskId, isCompleted } = req.body;

        if (!userId || !monthNumber || !taskId) {
            return res.status(400).json({ error: "Переданы не все обязательные поля" });
        }

        if (isCompleted) {
            // Если галочку ПОСТАВИЛИ — добавляем строку в базу (или обновляем, если она была)
            const { error } = await supabase
                .from('user_tasks_progress')
                .upsert({ 
                    user_id: userId, 
                    month_number: monthNumber, 
                    task_id: taskId, 
                    is_completed: true,
                    updated_at: new Date()
                });

            if (error) return res.status(500).json({ error: error.message });
        } else {
            // Если галочку СНЯЛИ — просто удаляем эту запись из таблицы progress
            const { error } = await supabase
                .from('user_tasks_progress')
                .delete()
                .eq('user_id', userId)
                .eq('task_id', taskId);

            if (error) return res.status(500).json({ error: error.message });
        }

        res.json({ status: "success", message: "Статус задачи обновлен" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера при обновлении чекбокса" });
    }
});

module.exports = router;