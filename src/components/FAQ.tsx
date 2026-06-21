import FAQClient from './FAQClient';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  data: {
    faq: {
      title: string;
      questions: FAQItem[];
    };
  };
}

export default function FAQ({ data }: FAQProps) {
  const { faq } = data;

  return (
    <section id="faq" className="relative py-24" style={{ background: 'linear-gradient(180deg, #080d1e 0%, #050812 100%)' }}>
      <FAQClient title={faq.title} questions={faq.questions} />
    </section>
  );
}
