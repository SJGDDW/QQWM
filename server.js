// server.js
const express = require('express');
const app = express();
const { exec } = require('child_process');

// تعيين منفذ مختلف للخادم الرئيسي
const port = process.env.SERVER_PORT || 4000; // استخدام منفذ 4000 بدلاً من 3000

// دالة تنظيف الذاكرة
function cleanCache() {
    const date = new Date().toLocaleString();
    console.log(`[${date}] بدء عملية تنظيف الذاكرة التخزينية...`);
    
    exec('rm -rf .cache/* .git/*', {
        cwd: process.cwd()
    }, (error, stdout, stderr) => {
        if (error) {
            console.error('حدث خطأ أثناء التنظيف:', error);
            return;
        }
        console.log(`[${date}] تم تنظيف الذاكرة التخزينية بنجاح`);
    });
}

// تشغيل البوت
const startBot = () => {
    try {
        require('./index.js');
        console.log('تم تشغيل البوت بنجاح');
    } catch (error) {
        console.error('خطأ في تشغيل البوت:', error);
    }
};

// إنشاء مسار بسيط لإبقاء الخادم نشطاً
app.get('/', (req, res) => {
    res.send('الخادم يعمل! 🚀');
});

// إضافة مسار لعرض حالة التنظيف
app.get('/status', (req, res) => {
    res.json({
        status: 'running',
        lastCleanup: new Date().toLocaleString()
    });
});

// بدء تشغيل الخادم
app.listen(port, () => {
    console.log(`الخادم الرئيسي يعمل على المنفذ ${port}`);
    
    // تشغيل البوت
    startBot();
    
    // تنظيف الذاكرة عند بدء التشغيل
    cleanCache();
    
    // جدولة تنظيف الذاكرة كل 5 ساعات
    setInterval(cleanCache, 5 * 60 * 60 * 1000);
});

// معالجة الأخطاء غير المتوقعة
process.on('uncaughtException', (err) => {
    console.error('خطأ غير متوقع:', err);
    // لا نريد إيقاف التطبيق في حالة حدوث خطأ
});

process.on('unhandledRejection', (err) => {
    console.error('رفض وعد غير معالج:', err);
    // لا نريد إيقاف التطبيق في حالة حدوث خطأ
});
