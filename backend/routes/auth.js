// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// POST /api/auth/register — регистрация нового пользователя
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Заполните все поля' });
        }

        // 1. Создаём пользователя через Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            return res.status(400).json({ error: authError.message });
        }

        const userId = authData.user.id;

        // 2. Сохраняем профиль в таблицу public.users
        const { error: profileError } = await supabase
            .from('users')
            .insert({ id: userId, name, email });

        if (profileError) {
            return res.status(500).json({ error: profileError.message });
        }

        res.json({
            status: 'success',
            user: { id: userId, name, email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера при регистрации' });
    }
});

// POST /api/auth/login — вход пользователя
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Заполните все поля' });
        }

        // 1. Логинимся через Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const userId = authData.user.id;

        // 2. Достаём профиль из public.users
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('id, name, email, current_profession')
            .eq('id', userId)
            .single();

        if (profileError) {
            return res.status(500).json({ error: profileError.message });
        }

        res.json({
            status: 'success',
            user: profile
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера при входе' });
    }
});

// PATCH /api/auth/profession — сохранить выбранную профессию пользователя
router.patch('/profession', async (req, res) => {
    try {
        const { userId, profession } = req.body;

        if (!userId || !profession) {
            return res.status(400).json({ error: 'userId и profession обязательны' });
        }

        const { error } = await supabase
            .from('users')
            .update({ current_profession: profession })
            .eq('id', userId);

        if (error) return res.status(500).json({ error: error.message });

        res.json({ status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
