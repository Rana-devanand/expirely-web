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
    <section id="faq" className="py-24 bg-[#020617]">
      <FAQClient 
        title={faq.title}
        questions={faq.questions}
      />
    </section>
  );
}
