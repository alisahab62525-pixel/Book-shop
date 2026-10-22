import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  questionUrdu: string;
  answer: string;
  answerUrdu: string;
}

export const FAQPage: React.FC = () => {
  const { t, language } = useApp();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'Can I order a single customized notebook with my name or photo?',
      questionUrdu: 'کیا میں صرف ایک عدد کسٹمائزڈ نوٹ بک اپنے نام یا تصویر کے ساتھ منگوا سکتا ہوں؟',
      answer: 'Yes! We have zero minimum order requirements for personal notebooks. You can design a single notebook for personal journaling or as a personalized gift.',
      answerUrdu: 'جی ہاں! ذاتی نوٹ بکس کے لیے کوئی کم از کم تعداد کی پابندی نہیں ہے۔ آپ ایک عدد بھی کسٹمائز کر کے آرڈر کر سکتے ہیں۔',
    },
    {
      question: 'What is the delivery time across Pakistan?',
      questionUrdu: 'پاکستان بھر میں ڈلیوری کا کتنا وقت لگتا ہے؟',
      answer: 'Production and personalization takes 1–2 working days. Shipping via TCS, Leopard, or Trax Couriers takes 2–3 days for major cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad) and 3–5 days for other towns.',
      answerUrdu: 'پرنٹنگ اور بائنڈنگ میں 1 سے 2 دن لگتے ہیں۔ بڑے شہروں میں 2 سے 3 دن جبکہ دور دراز علاقوں میں 3 سے 5 دن میں پارسل پہنچ جاتا ہے۔',
    },
    {
      question: 'Do you offer Cash on Delivery (COD)?',
      questionUrdu: 'کیا کیش آن ڈلیوری کی سہولت موجود ہے؟',
      answer: 'Yes, Cash on Delivery is available across all serviceable courier cities in Pakistan. For large bulk orders above 50 units, a 30% advance deposit is required to initiate raw paper cutting.',
      answerUrdu: 'جی ہاں، پاکستان کے تمام بڑے شہروں میں کیش آن ڈلیوری دستیاب ہے۔ 50 کاپیوں سے زائد بلک آرڈرز کے لیے 30 فیصد پیشگی رقم لازمی ہے۔',
    },
    {
      question: 'Does the ink bleed through the pages with fountain pens?',
      questionUrdu: 'کیا فاؤنٹین پین (روشنائی والے قلم) کی سیاہی صفحات کے دوسری طرف پھیلتی ہے؟',
      answer: 'No. Our journals and notebooks use premium 80 GSM to 100 GSM acid-free ivory and bleed-proof paper. It is thoroughly tested and beloved by fountain pen and calligraphy enthusiasts.',
      answerUrdu: 'بالکل نہیں! ہم 80 اور 100 جی ایس ایم کا معیاری پیپر استعمال کرتے ہیں جس پر قلم کی سیاہی نہیں پھیلتی۔',
    },
    {
      question: 'Can schools and academies get custom syllabus and rules printed inside?',
      questionUrdu: 'کیا اسکولز اور ادارے اندرونی صفحات پر اپنا نصاب اور ضوابط پرنٹ کروا سکتے ہیں؟',
      answer: 'Yes, we specialize in complete school exercise copies. We print school monograms, student particulars labels, syllabus guidelines, and watermarks on every page.',
      answerUrdu: 'جی ہاں، ہم اسکولوں کے لیے مکمل کاپیاں تیار کرتے ہیں جن میں مونوگرام، واٹر مارک، اور نصابی ضوابط شامل ہوتے ہیں۔',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-editorial font-bold text-slate-900 dark:text-white">
          {t('Frequently Asked Questions', 'عام طور پر پوچھے جانے والے سوالات')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Everything you need to know about our custom printing, paper grades, and courier delivery.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border border-slate-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#18201b] overflow-hidden"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors"
            >
              <span>{language === 'ur' ? faq.questionUrdu : faq.question}</span>
              {openIdx === idx ? (
                <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>

            {openIdx === idx && (
              <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-neutral-800">
                {language === 'ur' ? faq.answerUrdu : faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
